const express = require("express");
const router = express.Router({mergeParams:true})
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {isLoggedIn,saveRedirectUrl} = require("../middleware.js");

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
        req.login(registeredUser,(err)=>{
            if(err){
                req.flash("error","you have been facing an error");
                res.redirect("/listings")
                return next(err)
            }
                req.flash("success","You are loggedin");
                res.redirect("/listings");
        })
        // req.flash("success","Welcome To Wanderlust");
        // res.redirect("/listings");
       
       
        //if our username is already registered and with the name so we can do that it stays on the signup page and floshes the message so thats why we use try and catch here
    } catch(e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    // console.log("hi");
    // console.log(req.body);
    res.redirect(res.locals.redirectUrl || "/listings"); //yeh idhr isliye kyoki jab login krta hai button se login 
    // res.send("welcome to the wanderlust");
});
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        } else {
            req.flash("success","You are logged out");
            res.redirect("/listings");
        }
    })
})

module.exports = router;
module.exports.isLoggedIn = isLoggedIn;
module.exports.saveRedirectUrl = saveRedirectUrl;