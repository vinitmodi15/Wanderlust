const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const mongoose = require("mongoose");

main().then(()=>{
    console.log("connected to the DB");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.get("/",(req,res)=>{
    res.send("working");
})

// app.get("/testlisting",async (req,res)=>{
//     let samplelisting = new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"jodhpur",
//         country:"india,"
//     })
//     await samplelisting.save();
//     console.log("data saved succesfuuly");
//     res.send("succesfully testing ")
// })
app.listen(8080,()=>{
    console.log("listneing to the port")
})