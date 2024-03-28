const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./JoiSchema.js");
const Review = require("./models/Review.js");

const isLoggedIn = (req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl);  
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl = req.originalUrl;
        // console.log(req.originalUrl)
        req.flash("error","please be logged in first to create new listing");
        // res.redirect("/listings");
        res.redirect("/login");
    } 
    next();
}

const saveRedirectUrl = (req,res,next)=>{
    // console.log(req.session.redirectUrl);
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
const isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        if (!listing.owner._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not a owner of the listing");
            return res.redirect(`/listings/${id}`);
        }
        // User is authorized, pass control to the next middleware
        next();
    } catch (error) {
        // Handle any potential errors
        console.error("Error in isOwner middleware:", error);
        req.flash("error", "An error occurred");
        res.redirect("/listings");
    }
};

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else {
        next();
    }
}

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else {
        next();
    }
}


const isReviewAuthor = async (req, res, next) => {
    try {
        let { id,reviewId } = req.params;
        let review = await Review.findById(reviewId);
        if (!review) {
            req.flash("error", "review not found");
            return res.redirect("/listings");
        }
        if (!review.author._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You did not create this review");
            return res.redirect(`/listings/${id}`);
        }
        // User is authorized, pass control to the next middleware
        next();
    } catch (error) {
        // Handle any potential errors
        console.error("Error in isReviewAuthor middleware:", error);
        req.flash("error", "An error occurred");
        res.redirect("/listings");
    }
};

module.exports = {isLoggedIn,saveRedirectUrl,isOwner,validateListing,validateReview,isReviewAuthor};