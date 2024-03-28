const express = require("express");
const app =express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.set("views engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(flash());

app.get("/register",(req,res)=>{
    let {name = anonymous} = req.query;
    req.session.name = name;
    console.log(req.session.name);
    if(nmae==="anonymous"){
        req.flash("error","error occured");
    } else{
        req.flash("success","successfully completed");
    }
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
    res.render("hello.ejs",{name:req.session.name});
})