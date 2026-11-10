import mongoose, { Schema } from "mongoose";


const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity:{
        type: String,
        required: true,
        default: 100,
    },
    price: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model("Product", ProductSchema)

export default Product