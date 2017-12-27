require("dotenv").config();

const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const session      = require("express-session");
const passport     = require ("passport");

const app = express();
const mongoose=require ("mongoose");
mongoose.Promise=Promise;


//configs

// require ("./config/mongoose-setup");

require ("./config/passport-setup");

mongoose.connect(process.env.MONGODB_URI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(
  session({
    resave:true,
    saveUninitialized:true,
    secret:"this string is to avoid errors"
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Create a custom middleware to define "currentUser" in all our views
app.use((req,res,next)=>{
  //passport defines "req.user" if the User is logged in
  //("req.user" is the result of the deserialize)
  res.locals.currentUser=req.user;
  //call "next()" to thell Express that we've finished
  //otherwie your browser will hang
  next();
});


//ROUTES**********************
//*********************

const myArchiveRouter=require ("./routes/archive-router");
app.use(myArchiveRouter);

const myUserRouter=require ("./routes/user-router");
app.use(myUserRouter);

const myGroupRouter=require ("./routes/group-router");
app.use(myGroupRouter);

//END ROUTES**********************
//*********************

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
