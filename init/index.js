const initData = require("./data.js")
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
main().then(()=>{
    console.log("connected to the DB");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async()=>{
    //agar koi data phle se ho to usko delete krdo
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
     //data:samplelisting jo hum export kr rhe hai and idhr hum initData m hum require kr rhe hai and uski hum key(data ) se initialize krna chahte hai humare collection ko.
    console.log("saved");
}
initDB();
