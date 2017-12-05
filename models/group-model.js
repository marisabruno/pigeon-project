const mongoose=require ("mongoose");

const Schema= mongoose.Schema;

const groupSchema= new Schema({
    name: {
      type:String,
      minlength:1
    },
    users: [{
      type:Schema.Types.ObjectId
    }],
    archives: [{
      type:Schema.Types.ObjectId
    }],
    admin:[{
      type:Schema.Types.ObjectId
    }],
    groupImage:{}
  },
  {
  //automatically add "createdAt" and "updatedA" Date fields
  timestamps: true
  }
);

const GroupModel=mongoose.model("Group",groupSchema);

module.exports=GroupModel;
