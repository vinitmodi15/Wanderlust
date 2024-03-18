module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl);  
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl = req.OriginalUrl;
        req.flash("error","please be logged in first to create new listing");
        // res.redirect("/listings");
        res.redirect("/login");
    } 
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    console.log(req.originalUrl);
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}