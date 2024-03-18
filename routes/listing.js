const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../JoiSchema.js");
const flash = require("connect-flash");
const {isLoggedIn}= require("../middleware.js");

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else {
        next();
    }
}

router.get("/", wrapAsync(async (req, res) => {
    try {
        const alllistings = await Listing.find({});
        // console.log(alllistings);
        // res.send(listings); // Sending the listings retrieved from the database
        // console.log(req.user);
        res.render("listings/index.ejs",{alllistings});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching data"); // Sending an error response if there's an issue
    }
}))
 
//NEW ROUTE
router.get("/new",isLoggedIn,(req,res)=>{
        res.render("listings/newform.ejs");
    
})

// SHOW ROUTE 
router.get("/:id",wrapAsync(async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you looking for does not exist");  //yeh apn jab kr rhe hai agr user n listing ko delete krdi and usne 
        // agar url copy kiya va ho and delete krne k baad  m agar vo daale search krne k liye to bada error na aaye isliye yeh flash hojaaye
        res.redirect("/listings")
    }
    // res.send("showing");
    res.render("listings/show.ejs",{listing})
    // console.log(listing);
}));

router.post("/",isLoggedIn, wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log(newListing);
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}));


//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you looking for does not exist");  //yeh apn jab kr rhe hai agr user n listing ko delete krdi and usne 
        // agar url copy kiya va ho and delete krne k baad  m agar vo daale search krne k liye to bada error na aaye isliye yeh flash hojaaye
        res.redirect("/listings")
    }
    // console.log(listing);
    res.render("listings/edit.ejs",{listing});

}))

//update route
//update route
router.put("/:id",isLoggedIn,validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
     let url = req.body.listing.image;
     let filename = "random";
    req.body.listing.image = {url,filename};
     let listing = req.body.listing;
    await Listing.findByIdAndUpdate(id,listing);
    req.flash("success","Listing Edited Successfully");
    res.redirect("/listings");
}))

router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedlistings = await Listing.findByIdAndDelete(id);
    console.log(deletedlistings);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}))

module.exports = router; 