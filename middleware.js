const isLoggedIn = (req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl);  
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl = req.originalUrl;
        console.log(req.originalUrl)
        req.flash("error","please be logged in first to create new listing");
        // res.redirect("/listings");
        res.redirect("/login");
    } 
    next();
}

const saveRedirectUrl = (req,res,next)=>{
    console.log(req.session.redirectUrl);
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports = {isLoggedIn,saveRedirectUrl};