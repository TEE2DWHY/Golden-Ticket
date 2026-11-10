import dotenv from "dotenv"
import mongoose from "mongoose"
import connect from "../db/connect"
import Product from "../models/Product"
dotenv.config()


const ticket = {
    name: "golden-ticket-101",
    quantity: 100,
    price: 50
}

const populateDB = async()=>{
    try{
        await connect(process.env.MONGODB_URL as string)
        console.log("database is connected successfully")
        await Product.deleteMany()
        console.log("clearing existing products")
        await Product.create(ticket)
        console.log("database population is successful.")
    }
    catch(error){
        console.log(error)
    }
    finally{
        await mongoose.disconnect();
    }
}


populateDB()