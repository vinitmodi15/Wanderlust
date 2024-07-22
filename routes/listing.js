const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const flash = require("connect-flash");
const {isLoggedIn,saveRedirectUrl,isOwner,validateListing,validateReview}= require("../middleware.js");
const listingController = require("../controller/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudinaryConfig.js")//storage ko hum bich m require krenge taake jo hum niche defin define kr rhe hai ki ki multer kha p save kraye to vo required honi chaiye na "storage" baad m krenge to error aajayega
const upload = multer({storage})


router.get("/category", wrapAsync(listingController.filterListings));

 //all listings and new one
router.route("/")
    .get( wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListings));
   
   
    // .post(isLoggedIn,),(req,res)=>{
    //     res.send(req.file);

//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm)


router.route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
router.get('/:id/booknow',isLoggedIn,wrapAsync(listingController.booknow));
router.post("/submitbooking",isLoggedIn,wrapAsync(listingController.submitlisting));
module.exports = router; 
