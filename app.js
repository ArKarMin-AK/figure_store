const express = require("express");
const bodyParser = require("body-parser")
const {db_con}= require("./database/dbConnect");

const everyMinute = require("./service/cronservie");

const cookie = require("cookie-parser");
const {User}= require("./models/UserModel");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
const {injectUser,authenticated} = require("./middlewares/middlware");

const userRouter = require("./routers/userRouter");
const authRouter = require("./routers/authrouter");
const productRouter = require("./routers/productRouter");
app.use(cookieParser());
dotenv.config();
const secret = "This is secret";
const errHandler = function (err){
    if(err.message.includes("validation failed.")){
        Object.values(err).forEach(element =>
        {
            let prop = element.properties;
            errors[element.path]=prop.message;
        }
        );
    }console.log(error);
}



app.use("*",injectUser);

app.set("port",3000);
app.set("view engine","ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use("/static",express.static(`${__dirname}/public`));
// app.get("/",(req,res)=>{
//     res.send("Hello");
// });

app.post("/hash-pw",async(req,res)=>{
    pw = req.body.password;
    let salt = await bcrypt.genSalt();
    let hashedPw = await bcrypt.hash(pw,salt);
    let result = await bcrypt.compare(checkPw,hashedPw);
})
app.use("/", userRouter);
app.use("/",authRouter);
app.use("/",productRouter);
app.get("/set-cookies",(req,res)=>{
    res.cookie("test-cookies","test cookie values",{maxAge: 1000 *60*60*24,httpOnly:true});
    res.send("You've got the cookies");
})
app.get("/get-cookies",(req,res)=>{
    let cookies = req.cookies;
    res.json({cookies})
})
app.get("/get-token",(req,res)=>{
    let payload = {
        id:123
    }
    let token = jwt.sign(payload,process.env.JWT_SECRET);
    res.send({token});
})

app.post("/test-token",(req,res)=>{
    let test_token = req.body.token;
    jwt.verify(test_token,process.env.JWT_SECRET,(err,payload)=>{
        if(err){
            res.send({
                message:"you suck"
            });
        }
        res.send({payload});
    })
})


db_con().then(
    ()=>{
        app.listen(app.get("port"),()=>{
            console.log(`Server is running on localhost:${app.get("port")}`);
        }
        );
    }
).catch(
    err=>{
        console.log("Can't connect to db.Can't start the server");
    }
)
