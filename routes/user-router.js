const express = require('express');
const bcrypt=require("bcrypt");
const router  = express.Router();

const UserModel=require("../models/user-model");


function loginRequired (req,res,next){
  if (req.user===undefined){
    res.redirect("/login");
    return;
  }
  next();
}

//SHOW LANDING PAGE---------------------------------------------------------------------
//-------------------------------------------------------------------------------------
router.get('/', (req, res, next) => {
  res.render('user-views/landing-page.ejs');
});




//SHOW HOME PAGE---------------------------------------------------------------------
//-------------------------------------------------------------------------------------

router.get('/homepage', loginRequired, (req, res, next) => {
  res.render('homepage');
});




//GET and RENDER SIGNUP PAGE---------------------------------------------------------------------
//-------------------------------------------------------------------------------------
router.get('/signup', (req, res, next) => {
  res.render('user-views/signup-page');
});



//POST SIGNUP and CREATE USER---------------------------------------------------------------------
//-------------------------------------------------------------------------------------
router.post("/signup",(req,res,next)=>{
  if(req.body.signupPassword===""||
     req.body.signupPassword.length<5 ||
     req.body.signupPassword.match(/[^a-z0-9]/i)===null
                      //if no special characters
   )
     {
       res.locals.errorMessage="Password is invalid";
       res.render("user-views/signup-page");

       return;
     }
  UserModel.findOne({username:req.body.signupUsername})
  .then((userFromDb)=>{
    //userFromDb will be null if the email is NOT taken
    //display the form again if the email is taken
    // if (userFromDb !== null){
    //   res.locals.errorMessage="Email is Taken";
    //   res.render("user-views/signup-page");
    //   return;
    // }
    if (userFromDb !== null){
      res.locals.errorMessage="Username is Taken";
      res.render("user-views/signup-page");
      return;
    }
    const salt=bcrypt.genSaltSync(10);
    const scrambledPassword=bcrypt.hashSync(req.body.signupPassword, salt);

    const theUser=new UserModel({
      firstName: req.body.signupFirstName,
      lastName: req.body.signupLastName,
      username: req.body.signupUsername,
      email: req.body.signupEmail,
      encryptedPassword: scrambledPassword
    });
    return theUser.save();
  })

  .then(()=>{
    //redirect to the homepage after a successful signup
    res.redirect("/homepage");
  })
  .catch((err)=>{
      next(err);
  });

});




//Get and Render LOGIN PAGE---------------------------------------------------------------------
//-------------------------------------------------------------------------------------
router.get('/login', (req, res, next) => {
  if (req.user){
  res.redirect("/");
  return;
}
res.render("user-views/login-page");
});




//Post and Submit LOGIN DETAILS---------------------------------------------------------------------
//-------------------------------------------------------------------------------------

router.post("/login",(req,res,next)=>{
  UserModel.findOne({email:req.body.loginEmail})
  .then((userFromDb)=>{
      if (userFromDb===null){
        res.locals.errorMessage="EMAIL INCORRECT";
        res.render("user-views/login-page");
        return;
      }
      const isPasswordGood=
      bcrypt.compareSync(req.body.loginPassword, userFromDb.encryptedPassword);

      if(isPasswordGood===false){
        res.locals.errorMessage = "Password incorrect.";
        res.render("user-views/login-page");
        return;
      }
      //CREDENTIALS AR GOOD! We need to log the users in.
      //
      //Passport defines the "req.login()"
      //for us to specfify when to log in a user into the session
      req.login(userFromDb,(err)=>{
        if (err) {
          next (err);
        }
        else{
        //redirect to homepage on successful login
        res.redirect("/homepage");
      }
    });//req.login()
    //^you can call this method in the signup to log them in automatically
  })//then()
  .catch((err)=>{
    next(err);
  });
});


//Process to LOG OUT--------------------------------------------------
//------------------------------------------------------------------------

router.get("/logout",loginRequired,(req,res,next)=>{
  req.logout();
  res.redirect("/");
});



//💥 💥 💥  DON'T MOVE THIS!!!💥 💥 💥 💥 ---------------------------------------------------------------------
//-------------------------------------------------------------------------------------
module.exports = router;
