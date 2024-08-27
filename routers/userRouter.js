const express = require("express");
const{userGet, userPost,getUserById} = require("../controllers/userControllers");
const userRouter = express.Router();
userRouter.post("/users",userPost);
userRouter.get("/users",userGet);
userRouter.get("/users/:id",getUserById);
module.exports = userRouter;