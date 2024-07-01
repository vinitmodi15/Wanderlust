if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
// console.log(process.env.SECRET);
const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const { count } = require("console");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./JoiSchema.js");
const Review = require("./models/Review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const {OAuth2Client} = require('google-auth-library');

const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

let dbUrl = process.env.ATLASDB_URL; //mongoatlas ko iss variable m leke aaye hai
main()
  .then(() => {
    console.log("connected to the DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  // await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  await mongoose.connect(dbUrl);
}

app.use(express.urlencoded({ extended: true }));
app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = new MongoStore({
  mongoUrl: dbUrl, // or mongooseConnection: mongoose.connection
  secret: process.env.SECRET,
  touchAfter: 24 * 3600, // Optional: Session touch interval in seconds
});

const sessionOption = {
  store: store,
  secret: process.env.SECRET, //we cant directly type our secret code here when we are going to deply it so fo that reason we will secure this information
  resave: false,
  saveUninitialized: true,
  cookies: {
    expires: Date.now() + 7 * 24 * 60 * 60,
    maxAge: 7 * 24 * 60 * 60,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //The first line (passport.use(new LocalStrategy(User.authenticate()))) is used to set up Passport to use the LocalStrategy for authentication.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;



app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  //jo bhi user hai ya nhi vo check krne k liye in the navbar and in show.ejs m use kiya hai
  res.locals.currUser = req.user;
  next();
});

//router object one
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// auth route

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  (req, res)=> {
    // Successful authentication, redirect success.
    res.redirect("/success");
  }
);
app.get("/success",(req,res)=>{
    res.send("hello world");
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"vinitjodhpur2@gmail.com",
//         username:"delta_student",
//     })
//     let registeredUser = await User.register(fakeUser,"password");
//     res.send(registeredUser);
// })
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
  // throw new ExpressError(404,"Page not found")  //both will work bcoz this is not async process
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).send(message);
  // res.send("something went wrong")
  // console.log(err);
  res.status(statusCode).render("listings/error.ejs", { err });
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});

// app.post("/listings",valida  teListing ,wrapAsync(async(req,res)=>{
//     // let {title,description,image,price,location,country} = req.body;
//     // let newListing = new Listing({
//     //     title:title,
//     //     description:description,
//     //     image:image,
//     //     price:price,
//     //     location:location,
//     //     country:country,
//     // });

//     // this was the first way to store the data and i am simply using the second tay that is more ssimpler

//     //second way is that take all the data rom the req.body and save that in variable and pass with the variable to model

//     // let listing = req.body;
//     // newlisting = await new Listing(listing)
//     // newListing.save()
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"PLease send valid data");
//     // }
// let result = listingSchema.validate(req.body);
//     // console.log(result);
//     // if(result.error){
//     //     throw new ExpressError(400,result.error);
//     // }
//     let newListing = new Listing(req.body.listing);//req.body se humne jb data liya and console p kra to listings key m data aaraha hai to humne kiya ki listings ko .opertor se uss key ki value ko acccess kiay

//     await newListing.save();
//     console.log(newListing);
//     res.redirect("/listings")
// }))

// app.put("/listings/:id",validateListing ,wrapAsync(async (req,res)=>{
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"PLease send valid data");
//     // }
//     let {id} = req.params;
//     console.log(req.body);
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect("/listings");
// }))
//delete route
