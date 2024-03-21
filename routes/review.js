const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/Review.js");
const {isLoggedIn,saveRedirectUrl,isOwner,validateListing,validateReview, isReviewAuthor}= require("../middleware.js");


router.post("/",isLoggedIn,validateReview,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log("hi")
  
   
    let newReview = new Review(req.body.review); // Assuming the request body contains review data directly
    newReview.author = req.user._id;
    console.log(newReview);
    // console.log(req.body.review.comment);
    // console.log("hi")

    await newReview.save();
    // console.log(newReview);
    listing.reviews.push(newReview);
    await listing.save();
    // console.log("Review saved");
    // res.send("Review sent");
    req.flash("success","New Review Created");
    res.redirect(`/listings/${id}`) // or   res.redirect(`/listings/${listings.id}`)
}));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;

