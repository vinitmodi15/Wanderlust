let Listing = require("../models/listing")

module.exports.index = async (req, res) => {
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
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/newform.ejs");

}

module.exports.showListings =async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you looking for does not exist");  //yeh apn jab kr rhe hai agr user n listing ko delete krdi and usne 
        // agar url copy kiya va ho and delete krne k baad  m agar vo daale search krne k liye to bada error na aaye isliye yeh flash hojaaye
        res.redirect("/listings")
    }
    console.log(listing);
    // res.send("showing");
    res.render("listings/show.ejs",{listing})
    // console.log(listing);
}

module.exports.createListings = async (req, res) => {
    let newListing = new Listing(req.body.listing);

    //id of the current user logged in
    newListing.owner = req.user._id;
    await newListing.save();
    console.log(newListing);
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you looking for does not exist");  //yeh apn jab kr rhe hai agr user n listing ko delete krdi and usne 
        // agar url copy kiya va ho and delete krne k baad  m agar vo daale search krne k liye to bada error na aaye isliye yeh flash hojaaye
        res.redirect("/listings")
    }
    // console.log(listing);
    res.render("listings/edit.ejs",{listing});

}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    // let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error","You are not a authorized person to edit");
    //     return res.redirect("/listings");
    // }   in middleware file i declared for the convenience     
     let url = req.body.listing.image;
     let filename = "random";
    req.body.listing.image = {url,filename};
     let listing1 = req.body.listing;
    await Listing.findByIdAndUpdate(id,listing1);
    req.flash("success","Listing Edited Successfully");
    res.redirect(`/listings/${id}`);    
}

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedlistings = await Listing.findByIdAndDelete(id);
    console.log(deletedlistings);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}