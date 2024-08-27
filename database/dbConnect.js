const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/expressDB";

function db_connect(){
    return mongoose.connect(url);
}
mongoose.connection.on("connected",()=>{
    console.log("Connected to database");
});
mongoose.connection.on("error",(err)=>{
    console.log("You fucked up, you useless piece of trash");
    console.log(err);
});
module.exports.db_con = db_connect;