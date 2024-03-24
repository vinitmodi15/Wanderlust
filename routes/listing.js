const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const flash = require("connect-flash");
const {isLoggedIn,saveRedirectUrl,isOwner,validateListing,validateReview}= require("../middleware.js");
const listingController = require("../controller/listing.js")



 //all listings and new one
router.route("/")
    .get( wrapAsync(listingController.index))
    .post(isLoggedIn, wrapAsync(listingController.createListings));

//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm)


router.route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(isLoggedIn,validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


module.exports = router; 