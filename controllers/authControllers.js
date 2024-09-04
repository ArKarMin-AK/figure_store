const {User} = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const Product = require("../models/ProductModel");

const bcrypt = require("bcrypt");
const {createToken} = require("../Helpers/helpers");
const dotenv = require("dotenv");
module.exports.registerGet = function (req,res){
    res.render("register",{page_title:"Register"});
}
module.exports.LoginGet = function(req,res){
    console.log("starting login...")
    res.render("login",{page_title:"Sign_in"});
}
module.exports.HomeGet = function(req,res){
    try {
        let token = req.cookies._token;
    if(!token){
        res.redirect("/login");
        return;
    }
        jwt.verify(token, process.env.JWT_SECRET, async(err,token)=>{
        // Assuming you have the user ID in req.cookies._token;
       
        // Fetch the user from the database
        let user = await User.findById(token.id);
 
        
 
        // Check the user's role
        const query = user.role === "admin" ? {} : { isDeleted: false };
 
        // Fetch products based on the user's role
        const products = await Product.find(query);
 
        // Render the product page with the fetched products
        res.render("home",{page_title:"Home",products})  
 
        })
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
    
}


module.exports.LoginPost = async function(req,res){
    let email = req.body.email;
    let password = req.body.password;
    let user = await User.findOne({email});
    if(!user){
        res.status(404).json({
            "errors":{
                "email":"email not found"
            }
        });
        return;
    }
    let check_password = await bcrypt.compare(password,user.password);
    if(!check_password){
       res.status(400).json({
            errors:{
                "password":"wrong password"
            }
        });
        return ;

    }
    let token = createToken(user.id);
    res. cookie("_token",token,{maxAge: 1000*60*60*24});
    res.status(200).json({
        "data":"ok"
    })
}
module.exports.logout = function (req,res){
    res.clearCookie("_token");
    res.redirect("/");
}