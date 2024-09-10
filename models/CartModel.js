const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const CartSchema = new Schema({
    product_id:{
        type: String,
        required: true,
        default:""
    },
    product_name:{
        type: String,
        required: true
    },
    product_quantity:{
        type: Number,
        required: true
    },
    product_price:{
        type:mongoose.Types.Decimal128,
        required:true,
    },
    product_img:{
        type:String,
        required:true
    }
})
const Cart = mongoose.model("carts",CartSchema);
module.exports = Cart;