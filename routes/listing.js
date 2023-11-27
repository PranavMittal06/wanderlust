const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Review=require("../models/review.js");
const {isLoggedIn, isOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage});



const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  }
router.get("/",wrapAsync(listingController.index));


//New Route
router.get("/new",isLoggedIn,listingController.newForm );


  router.get("/:id",wrapAsync(listingController.showListings));
//Create Route
router.post("/",isLoggedIn, validateListing,upload.single("listing[image]"),wrapAsync (listingController.createListing)
);

  //Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.editListing));
  
  //Update Route
  router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync( listingController.updateListing));

  //Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));
  module.exports=router;