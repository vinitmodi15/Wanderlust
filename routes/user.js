const express = require("express");
const router = express.Router({mergeParams:true})
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    // res.send("form");
    res.render("users/signup.ejs");
})
router.post("/signup",  wrapAsync( async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let new_user = new User({email,username});
        let registeredUser = await User.register(new_user,password);
        console.log(registeredUser);
        req.flash("success","Welcome To Wanderlust");
        res.redirect("/listings");
        //if our username is already registered and with the name so we can do that it stays on the signup page and floshes the message so thats why we use try and catch here
    } catch(e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",passport.authenticate("local",{failureRedirect: '/login',failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    // res.redirect("/listings");
    // res.send("hey")
})
module.exports = router;