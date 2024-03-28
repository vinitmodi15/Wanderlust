const express = require("express");
const router = express.Router({mergeParams:true})
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {isLoggedIn,saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/user.js")

router.route("/signup")
    .get(userController.renderSignupForm)
    .post( wrapAsync(userController.signup))

//get login form and authenticating or post req of login form
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),userController.login);

//logout
router.get("/logout",userController.logout)



module.exports = router;
module.exports.isLoggedIn = isLoggedIn;
module.exports.saveRedirectUrl = saveRedirectUrl;