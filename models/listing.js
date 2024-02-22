const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const  listingSchema = new Schema({
    title:{
        type:String,
        rewuired:true,
    },
    description:String,
    image:{
        type:String,
        default:"default image url",
        set:(v)=> //we are setting the default image url if lister dont send the nay pic then any any default image will be there
            v===""?"default image url":v, // here v is the image value comming from the user if send by the user then it will display that image or the default image will be displayed
    },
    price:Number,
    location:String,
    country:String,
});

let Listing = new mongoose.model("listing",listingSchema);
module.exports = Listing;
