const passport = require ("passport");
const UserModel= require ("../models/user-model");

//SERIALIZE USERS (what user information do we save to the session?)
//----------------------------------------------------------------
//gets called when a user logs in (on our POST/process-login)
passport.serializeUser((userFromDb,callback)=>{
    //null is for saying "no errors occurred during the serialize process"
    callback(null,userFromDb._id);
    //
    //save only the "_id" of the user
});

//DESERIALIZE(how do we retrieve the user details from the session?)
//----------------------------------------------------------------
//gets called every time you visit any page on the site while you are logged in
//that's so we can potentially personalize all pages
passport.deserializeUser((idFromSession,callback)=>{
    UserModel.findById(idFromSession)
    .then((userFromDb)=>{
      //null is for saying "no errors occurred during the deserialize process
      callback(null,userFromDb);
      //
      //send Passport the logged in user's info

    })
    .catch((err)=>{
      callback(err);
    });
});

//STRATEGIES (npm packges that enable other methods of logging in)
