const express = require("express");
const { productGet,productPost, addProduct, searchProduct, viewProduct, UpdateProduct, editProduct, DeleteProduct, softDeleteProduct } = require("../controllers/productControllers");
const { authenticated ,adminOnly} = require("../middlewares/middlware");
const { logout } = require("../controllers/authControllers");
const productRouter = express.Router();
productRouter.use(authenticated);
productRouter.get("/products",productGet);

productRouter.post("/products",productPost);
productRouter.get("/addproduct",adminOnly,addProduct);
productRouter.get("/find-products",adminOnly,searchProduct);
productRouter.get("/viewProduct/:id",viewProduct);
productRouter.get("/logout",logout);
productRouter.post("/updateproduct/:id",UpdateProduct);
productRouter.get("/editproduct/:id",adminOnly,editProduct);
productRouter.delete("/productdelete/:id",softDeleteProduct);
productRouter.post("/deleteproduct/:id",DeleteProduct);
module.exports = productRouter;
