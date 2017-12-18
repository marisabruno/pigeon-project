const express=require("express");
const router=express.Router();

const GroupModel=require("../models/group-model");
const UserModel=require("../models/user-model");
const ArchiveModel=require("../models/archive-model");

const ObjectId = require('mongodb').ObjectID;

function loginRequired (req,res,next){
  if (req.user===undefined){
    res.redirect("/login");
    return;
  }
  next();
}


// ROUTE****************

//Go To Manage Groups Page---------------------------------------------------------------------
//-------------------------------------------------------------------------------------
router.get("/my-groups", loginRequired, (req,res,next)=>{
  GroupModel.find({users:req.user._id}).exec()
  //return all groups that have this user id^
    .then((allGroups)=>{
      console.log(allGroups);
      console.log("search successful!");
      res.locals.myGroups=allGroups;
      res.render('group-views/my-groups.ejs');
    })
    .catch((err)=>{
      console.log("ERROR!");
      next(err);
    });
});

//Go To Add Groups Page---------------------------------------------------------------------
//-------------------------------------------------------------------------------------e
router.get("/add-group", loginRequired, (req,res,next)=>{
  res.render('group-views/add-group.ejs');
});


//Post groups---------------------------------------------------------------------
//-------------------------------------------------------------------------------------e
router.post("/add-group", loginRequired, (req,res,next)=>{
  const theGroup=new GroupModel({
    name: req.body.groupName,
    description: req.body.groupDescription,
    groupImage: req.body.groupAvatar,
    // //when the product was added to the system
    users: [req.user._id],
    admin: [req.user._id]
    });
  theGroup.save()
    .then(()=> {
      req.user.groups.push(theGroup._id);
      return req.user.save();

    })
    .then(()=>{
        console.log("Successful Save!");
        res.redirect("/my-groups");
    })
    .catch((err)=>{
      next(err);
    });
});


//Go To Group Details Page of ONE group---------------------------------------------------------------------
//-------------------------------------------------------------------------------------
router.get("/my-groups/:groupId",loginRequired,(req,res,next)=>{
  GroupModel.findById(req.params.groupId)
    .then((groupFromDb)=>{
      res.locals.theGroup=groupFromDb;
      const userIdArray=groupFromDb.users;
      return UserModel.find({_id:userIdArray}).exec();
    })
    .then((allUsers)=>{
      res.locals.usersInGroup=allUsers;
      return ArchiveModel.find({groups:req.params.groupId}).exec();
    })
    .then((archives)=>{
      res.locals.allArchives=archives;
      res.render("group-views/group-details");
    })
    .catch((err)=>{
      next(err);
    });
});

//Delete a Group---------------------------------------------------------------------
//-------------------------------------------------------------------------------------

router.get("/my-groups/:groupId/delete",loginRequired, (req,res,next)=>{
  GroupModel.findByIdAndRemove(req.params.groupId)
    .then((groupFromDb)=>{
      res.redirect(`/my-groups`);
    })
    .catch((err)=>{
      next(err);
    });
});
module.exports=router;


//Search for Users---------------------------------------------------------------------
//-----------------------------------------------------------------------------------
router.get("/my-groups/:groupId/search", loginRequired,(req,res,next)=>{
    //RegExp is the construction function for a regular expression
    //this allows us to do partial matching
    const searchRegex=new RegExp(req.query.searchTerm,"i");

    GroupModel.findById(req.params.groupId).exec()
    .then((thisGroup)=>{

      res.locals.myGroup=thisGroup;
      return UserModel
      .find({username:searchRegex})
      .limit(10)
      .exec();
    })
    .then((listOfResults)=>{
      res.locals.searchTerm=req.query.searchTerm;
      res.locals.searchResults=listOfResults;
      res.render("group-views/search-page");
    })
    .catch((err)=>{
    next(err);
    });
});


//Add User to a Group---------------------------------------------------------------------
//-----------------------------------------------------------------------------------
router.post("/add-user/:groupId/:userId",loginRequired,(req,res,send)=>{
        const idGroup=req.params.groupId;
  GroupModel.update(
    { _id: new ObjectId(req.params.groupId) },
    { $push: { users: req.params.userId } }).exec()
    .then(()=>{
      res.locals.groupAddedTo=req.params.groupId;
      res.locals.userAdded=req.params.userId;
      res.redirect("/my-groups");
    })
    .catch((err)=>{
      next(err);
      });

});//end post request

//View an archive within a group---------------------------------------------------------------------
//-----------------------------------------------------------------------------------

router.get("/my-groups/view-archive/:archiveId",loginRequired,(req,res,send)=>{
ArchiveModel.findById(req.params.archiveId).exec()
  .then((archive)=>{
      res.locals.archiveDetails=archive;
      res.render("archive-views/in-group-archive");
  })
  .catch((err)=>{
    res.send("error!");
    console.log(err);
  });
});
