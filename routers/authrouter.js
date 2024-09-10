const express = require("express");
const { registerGet, LoginGet, LoginPost, HomeGet } = require("../controllers/authControllers");
const {homeproduct}= require("../controllers/productControllers")

const authRouter = express.Router();
authRouter.get("/register",registerGet);
authRouter.get("/login",LoginGet);
authRouter.post("/login",LoginPost);
authRouter.get("/home",HomeGet);
module.exports = authRouter;