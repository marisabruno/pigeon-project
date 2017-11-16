const mongoose=require ("mongoose");

const Schema= mongoose.Schema;

const archiveSchema= new Schema({
    title: {
      type:String,
      minlength:1
    },
    description: {type:String},
    imageUrl:{type:String},
    // //when the product was added to the system
    dateAdded: {type:Date}
});

//the moel has the methods to make database queries
const ArchiveModel=mongoose.model("Archive",archiveSchema);
//
//collection name is "archives"

// mongoose.model creates a constructor function with the archiveschema and ...
//methods inherent to the mongoose model
module.exports=ArchiveModel;
//a ArchiveModel is an object, which has methods. but it's also a constructor...
//... function that can be used to create other objects!
