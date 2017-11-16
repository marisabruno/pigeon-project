const express=require("express");
const router=express.Router();

//in order to use the Product Model, you have to require the productmodel...
//which you can use because it's been exported

const ArchiveModel=require("../models/archive-model");

//SHOW MY ARCHIVES---------------------------------------------------------------------
//---------------------------------------------------------------------------------------
router.get("/my-archives", (req,res,next)=>{
  ArchiveModel.find().sort({dateAdded:-1}).exec()
    .then((archiveResults)=>{
      res.locals.myArchives=archiveResults;
      console.log(archiveResults);
      console.log("search successful!");
      res.render("archives");
    })
    .catch((err)=>{
      console.log("ERROR!");
      next(err);
    });
});

//Submit New Archive---------------------------------------------------------------------
//-------------------------------------------------------------------------------------
router.post("/my-archives",(req,res,next)=>{
  const theArchive=new ArchiveModel({
    title: req.body.archiveTitle,
    description: req.body.archiveDescription,
    imageUrl:req.body.archiveImage,
    // //when the product was added to the system
    dateAdded: new Date ()
    });

  theArchive.save()
    .then(()=>{
        console.log("Successful Save!");
        res.redirect("my-archives");
    })
    .catch((err)=>{
      next(err);
    });

});


//See Details of One Archive---------------------------------------------------------------------
//-------------------------------------------------------------------------------------

router.get("/my-archives/:archiveId",(req,res,next)=>{
  ArchiveModel.findById(req.params.archiveId)
    .then((archiveFromDb)=>{
      res.locals.archiveDetails=archiveFromDb;
      res.render("archive-details");
    })
    .catch((err)=>{
      next(err);
    });
});

//EDIT One Archive---------------------------------------------------------------------
//-------------------------------------------------------------------------------------

router.get("/my-archives/:archiveId/edit",(req,res,next)=>{
  ArchiveModel.findById(req.params.archiveId)
  .then((archiveFromDb)=>{
      res.locals.archiveDetails=archiveFromDb;
      res.render("archive-edit");
  })
  .catch();
});

//SAVE and POST Archive Edits---------------------------------------------------------------------
//-------------------------------------------------------------------------------------

router.post("/my-archives/:archiveId",(req,res,next)=>{
    ArchiveModel.findById(req.params.archiveId)
    .then((archiveFromDb)=>{
      archiveFromDb.set({
          title:req.body.archiveTitle,
          description:req.body.archiveDescription,
          imageUrl:req.body.archiveImage
      });
      return archiveFromDb.save();
    })
    .then(()=>{
        res.redirect(`/my-archives/${req.params.archiveId}`);
    })
    .catch((err)=>{
      next(err);
    });

});

// ProductModel.findById(req.params.prodId)
//       .then((productFromDb)=>{
//           productFromDb.set({
//             name: req.body.productName,
//             price: req.body.productPrice,
//             imageUrl: req.body.productImage,
//             description: req.body.productDescription
//           });
//           //return the promise of the next database operation
//           return productFromDb.save();
//       })
//       .then(()=>{
//         //STEP #3: redirect after a successful save
//         //redirect to the product details page
//         res.redirect(`/products/${req.params.prodId}`);
//             //you CAN'T redirect to an EJS file
//             //you can only redirec to a URL
//       })

module.exports=router;
