const { User } = require("../models/UserModel");

const {createToken,handler} = require("../Helpers/helpers");
module.exports.userPost = async function (req, res) {
    console.log("Heree")
    let newUser = User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    newUser.save()
        .then(
            () => {
                let token = createToken(newUser.id);
                res.cookie("_token", token, { maxAge: 1000 * 60 * 60 * 24 });
                res.status(201).json(newUser)
            }
        )
        .catch(
            err => {
                console.log(err);
                let errors = handler(err)
                res.status(400).json({
                    errors
                });
            }
        )
}
module.exports.userGet = async function (req, res) {
    try {
        let users = await User.find();
        res.status(200).json({ data: users });
    }
    catch (err) {
        res.status(500).json({
            message: "Something went wrong."
        })
    }
}
module.exports.getUserById = async function(req,res){
    User.findById(req.params.id)
    .then(document=>{
        res.status(200).json(document)
    })
    .catch(err=>{
        res.status(404).json({
            message: "Not found"
        })
    })
}