const User = require("../models/user");
const Booking = require("../models/booking")
module.exports.renderSignupForm = (req,res)=>{
    // res.send("form");
    res.render("users/signup.ejs");
}


module.exports.signup = async(req,res)=>{
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
    
}

module.exports.renderLoginForm =  (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    // console.log("hi");
    // console.log(req.body);
    res.redirect(res.locals.redirectUrl || "/listings"); //yeh idhr isliye kyoki jab login krta hai button se login 
    // res.send("welcome to the wanderlust");
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        } else {
            req.flash("success","You are logged out");
            res.redirect("/listings");
        }
    })
}
module.exports.success = (req,res,next)=>{
    // res.send("hello world");
    res.redirect("/listings")
}
module.exports.failure = (req,res,next)=>{
    res.send("failure");
}
// module.exports.mybookings= async (req,res)=>{
//     res.send("yr bookings");
// }
// const Booking = require('../models/booking.js'); // Adjust the path as needed

module.exports.bookings = async (req, res) => {
    try {
        let userBookings = await Booking.find({ userId: req.user._id });
        console.log(userBookings);
        res.render('users/booking.ejs', { userBookings });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
