const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware");
const userController = require("../controller/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;


router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  })
);

router.get("/success", userController.success);
router.get("/failure", userController.failure);

router.route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

router.route("/login")
  .get(userController.renderLoginForm)
  .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login);

router.get("/logout", userController.logout);
router.get("/bookings",isLoggedIn,userController.bookings);
module.exports = router;
module.exports.isLoggedIn = isLoggedIn;
module.exports.saveRedirectUrl = saveRedirectUrl;
































// const express = require("express");
// const router = express.Router({mergeParams:true})
// const User = require("../models/user");
// const wrapAsync = require("../utils/wrapAsync");
// const passport = require("passport");
// const {isLoggedIn,saveRedirectUrl} = require("../middleware.js");
// const userController = require("../controller/user.js")
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.CLIENTID,
//         clientSecret: process.env.CLIENTSECRET,
//         callbackURL: "http://localhost:8080/auth/google/callback",
//       },
//       function (accessToken, refreshToken, profile, done) {
//         userProfile = profile;
//         return done(null, userProfile);
//       }
//     )
//   );
  
//   router.get(
//     "/auth/google",
//     passport.authenticate("google", { scope: ["profile", "email"] })
//   );
  
//   router.get(
//     "/auth/google/callback",
//     passport.authenticate("google", { successRedirect: '/success',failureRedirect: "/error" }),      
//     // (req, res)=> {
//     //   // Successful authentication, redirect success.
//     //   res.redirect("/success");
//     // }
//   );
//   router.get("/success",userController.success)
//   router.get("/failure",userController.failure)
  


// router.route("/signup")
//     .get(userController.renderSignupForm)
//     .post( wrapAsync(userController.signup))

// //get login form and authenticating or post req of login form
// router.route("/login")
//     .get(userController.renderLoginForm)
//     .post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),userController.login);

// //logout
// router.get("/logout",userController.logout)




// module.exports = router;
// module.exports.isLoggedIn = isLoggedIn;
// module.exports.saveRedirectUrl = saveRedirectUrl;