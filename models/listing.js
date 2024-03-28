const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review.js")
const  listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        filename:{
            type:String
        },url:{
            type:String,
            // default:"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            // set:(v)=> //we are setting the default image url if lister dont send the nay pic then any any default image will be there
            //     v===""?"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
            //     :v,
        }
        // here v is the image value comming from the user if send by the user then it will display that image or the default image will be displayed
    },
    price:Number,
    location: {
        type: [String], // Array of strings
        required: true
    },
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:
        {
            type:Schema.Types.ObjectId,
            ref:"User" // collection name
        },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post('findOneAndDelete', async function (doc, next) {
    // Accessing the reviews field of the document being deleted
    try {
        if (doc && doc.reviews.length > 0) {
            let deletedReviews = await Review.deleteMany({ _id: { $in: doc.reviews } });
            console.log(deletedReviews);
            // console.log("hi");
            next();
        }
    }catch(err){
        console.log(err);
        next();
    }
});


let Listing = new mongoose.model("listing", listingSchema);

module.exports = Listing;
