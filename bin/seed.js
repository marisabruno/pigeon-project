require ("../config/mongoose-setup");

//import the product model to do our product queries
const ArchiveModel = require ("../models/archive-model");

const archiveInfo= [
  {
    title:"I learned to code today!",
    description:"Currently taking our coding bootcamp... and it's awesome!",
    imageUrl: "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
    dateAdded: new Date()
  },
  {
    title:"I'm going home for thanksgiving<3!",
    description:"I land on Wednesday night, and leave Sunday",
    imageUrl: "https://media.giphy.com/media/3OIef7pgio7Is/giphy.gif",
    dateAdded: new Date()
  },
  {
    title:"I got a puppy!",
    description:"Her name is Laura and she's a boxer, just like Rosie!",
    imageUrl: "https://media.giphy.com/media/8NUdqxGnMn6Lu/giphy.gif",
    dateAdded: new Date()
  }
];


//db.products.insertMany(productInfo);
ArchiveModel.create(archiveInfo)
  .then((archiveResults)=>{
    console.log(`Inserted ${archiveResults.length} archives`);
    console.log("SUCCESS!");
  })
  .catch((err)=>{
    console.log("archive insert error!");
    next(err);
  });//GET products
