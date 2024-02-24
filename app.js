const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const { count } = require("console");
const ejsMate = require("ejs-mate");


app.use(express.urlencoded({extended:true}));
app.set("views engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))


main().then(() => {
    console.log("connected to the DB");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/", (req, res) => {
    res.send("working");
})

//INDEX ROUTE
app.get("/listings", async (req, res) => {
    try {
        const alllistings = await Listing.find({});
        // console.log(alllistings);
        // res.send(listings); // Sending the listings retrieved from the database
        res.render("listings/index.ejs",{alllistings});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching data"); // Sending an error response if there's an issue
    }
})
 
//NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("listings/newform.ejs");
})

// SHOW ROUTE 
app.get("/listings/:id",async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // res.send("showing");
    res.render("listings/show.ejs",{listing})
    // console.log(listing);
});

app.post("/listings",async(req,res)=>{
    // let {title,description,image,price,location,country} = req.body;
    // let newListing = new Listing({
    //     title:title,
    //     description:description,
    //     image:image,
    //     price:price,
    //     location:location,
    //     country:country,
    // });

    // this was the first way to store the data and i am simply using the second tay that is more ssimpler

    //second way is that take all the data rom the req.body and save that in variable and pass with the variable to model 
   
    // let listing = req.body;
    // newlisting = await new Listing(listing)
    // newListing.save()
    
    let newListing = new Listing(req.body.listing);//req.body se humne jb data liya and console p kra to listings key m data aaraha hai to humne kiya ki listings ko .opertor se uss key ki value ko acccess kiay

    await newListing.save();
    console.log(newListing);
    res.redirect("/listings")
})


//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // console.log(listing);
    res.render("listings/edit.ejs",{listing});

})

//update route
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    console.log(req.body);
    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect("/listings");
})
//delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let deletedlistings = await Listing.findByIdAndDelete(id);
    console.log(deletedlistings);
    res.redirect("/listings");
})
app.listen(8080, () => {
    console.log("listening on port 8080");
})
