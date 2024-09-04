const { query } = require("express");
const jwt = require("jsonwebtoken");
const Product = require("../models/ProductModel");
const {User} = require("../models/UserModel");
const {adminOnly} = require("../middlewares/middlware");

const products = [
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwlzJpjQ5YmajHMDnc0wdCXaRw5D3rDsei4A&s",
        name:"Gojo Satoru",
        description: "The most favortie character of Jujutsu Kaisen Anime"
    },
    {
        img:"https://i.ebayimg.com/images/g/1-oAAOSwjfBiDC~1/s-l1200.webp",
        name:"Uzumaki Naruto",
        description: "The protagonist of Naruto Shippuden"
    },
    {
        img:"https://store.crunchyroll.com/on/demandware.static/-/Sites-crunchyroll-master-catalog/default/dw7db06fae/images/6758184321068-1-ultra-tokyo-connection-pvc-scale-figures-jujutsu-kaisen-maki-zenin-prize-figure-29513066643500.jpg",
        name:"Zenin Maki",
        description: "My favorite character of Jujutsu Kaisen"
    }
]


module.exports.productGet = async function(req,res){

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
        res.render("product",{page_title: "Products",products})  
 
        })
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
         
   
}

module.exports.productPost = async function(req,res){
    let name = req.body.name;
    let price = req.body.price;
    let img = req.body.img;
    let description = req.body.description;
    product = new Product({
        name, price, img, description
    })
    try{
        product = await product.save();
        res.json({
            product
        })
        
    }
    catch(err){
            res.json({
                errors: err.message
            })
        }
}
module.exports.addProduct = function(req,res){
    res.render("addproduct",{page_title: "Add Product"})
}
module.exports.searchProduct = async function(req,res){
    let keyword = req.query.keyword;

    if(keyword === ""){
        res.redirect("/products");
        return;
    }
    let products = await Product.find({"name":{"$regex":keyword,"$options":"i"}});
    res.render("partials/selection-section",{selection:products},(err,html)=>{
        if(err){
            res.status(500).json(
                {
                    "error":"something went wrong"
                }
            )
            return;
            
        }
        res.status(200).json({
                html,products
            })
    })
}

module.exports.viewProduct = async function(req,res){
    const id = req.params.id;
    
    try{
        const p = await Product.findById(id);
        if(!p){
        
        res.status(404).json({
            error:[
                {
                    product: err.message
                }
                
            ]
        })
        return;
    }
    res.render('viewproduct',{product: p,page_title:p.name})
    }
    catch(err){
        res.status(400).json({
            error:[{
                product:err.message
            }]
        })
    }
    
    
}
module.exports.editProduct = async function(req,res){
    const id = req.params.id;
    
    try{
        const p = await Product.findById(id);
        if(!p){
        
        res.status(404).json({
            error:[
                {
                    product: err.message
                }
                
            ]
        })
        return;
    }
    res.render('updateproduct',{product: p,page_title:p.name})
    }
    catch(err){
        res.status(400).json({
            error:[{
                product:err.message
            }]
        })
    }
}
module.exports.UpdateProduct = async function(req,res){
    const id = req.params.id;
    let update_name = req.body.name;
    let update_price = req.body.price;
    let update_img = req.body.img;
    let update_des = req.body.description;
    try{
        const p = await Product.findByIdAndUpdate(id,
            {
                name: update_name,
                price: update_price,
                img: update_img,
                description: update_des
            },
            {
                new:true, useFindAndModify:false
            }
        );
        if(!p){
        
            res.status(404).json({
                error:[
                    {
                        product: err.message
                    }
                    
                ]
            })
            return;
        }
        }
        catch(err){
            res.status(400).json({
                error:[{
                    product:err.message
                }]
            })
        }
}
module.exports.DeleteProduct = async function(req,res){
    const id = req.params.id;
    let delete_name = req.body.name;
    let delete_price = req.body.price;
    let delete_img = req.body.img;
    let delete_des = req.body.description;
    try{
        const p = await Product.findByIdAndDelete(id,
            {
                delete_name,
                delete_price,
                delete_img,
                delete_des
            },
            {
                new:true, useFindAndModify:false
            }
        );
        if(!p){
        
            res.status(404).json({
                error:[
                    {
                        product: err.message
                    }
                    
                ]
            })
            return;
        }
        }
        catch(err){
            res.status(400).json({
                error:[{
                    product:err.message
                }]
            })
        }
}
module.exports.softDeleteProduct = async function(req,res){
    let {id} = req.params;
    try{
        await Product.findByIdAndUpdate(id,{isDeleted:true})
        res.status(200).json({
            data:"Deleted successfully"
        })
    }catch(err){
        res.status(404).json({
            error: err.message
        });
    }
    
}