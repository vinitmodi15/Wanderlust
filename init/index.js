const initData = require("./data.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("Connected to the DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    // const listings = initData.data.map((item) => ({
    //   ...item,
    //   image: item.image.url, // Assuming the image URL is stored within the 'url' property of the 'image' object
    // }));
    initData.data=initData.data.map((obj)=>({...obj,owner:"65f959a729b1c3df4eb19352"})); //map function ek nya array bnata hai to humne usse vha store krdaiya and har ek listing ke andr usko spread krke ek nya owner naam ki chij daal rhi rhe hai jiski id vo hai jo di hai
    await Listing.insertMany(initData.data);
    console.log("Data saved successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

initDB();
