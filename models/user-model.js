const mongoose=require ("mongoose");

const Schema= mongoose.Schema;

const userSchema= new Schema({
    firstName: {
      type:String,
      minlength:1
    },
    lastName: {
      type:String,
      minlength:1
    },
    email: {
      type:String,
      required: [true, "What's your email?"]
    },
    encryptedPassword: {
      type:String,
      required:[true, "We need a password"]

    }
  },
  {
  //automatically add "createdAt" and "updatedA" Date fields
  timestamps: true
  }
);

const UserModel=mongoose.model("User",userSchema);

module.exports=UserModel;
