const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const {isEmail}=require("validator");
const UserSchema = new Schema({
    username:{
        type:String,
        required: true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: [isEmail,"Invalid Email"]
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Password mush be at least 8 characters long"]
    },
    CreatedAt:{
        type:Date,
        default:Date.now
    },
    role:{
        type: String,
        enum: ["user","admin"],
        default: "user"
    }
});
UserSchema.pre("save",async function(next){
    let salt = await bcrypt.genSalt();
    let hashedPw = await bcrypt.hash(this.password,salt);
    this.password = hashedPw;
    next();
});
const User = mongoose.model("users",UserSchema);
module.exports.User = User;
