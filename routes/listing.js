const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const flash = require("connect-flash");
const {isLoggedIn,saveRedirectUrl,isOwner,validateListing,validateReview}= require("../middleware.js");
const listingController = require("../controller/listing.js")


router.get("/", wrapAsync(listingController.index))
 
//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm)

// SHOW ROUTE 
router.get("/:id",wrapAsync(listingController.showListings));


//UPDATE ROUTE
router.post("/",isLoggedIn, wrapAsync(listingController.createListings));


//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

//UPDATE ROUTE
//UPDATE ROUTE
router.put("/:id",isLoggedIn,validateListing,wrapAsync(listingController.updateListing))


//DELETE ROUTE
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

module.exports = router; 