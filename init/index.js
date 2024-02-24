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
    await Listing.insertMany(initData.data);
    console.log("Data saved successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

initDB();
