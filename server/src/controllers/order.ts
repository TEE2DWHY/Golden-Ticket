import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import Product from "../models/Product"
import { hasStock } from "../utils/inventory"
import { createResponse } from "../utils/response"


// const inventory = {
//     name: "sneaker-footware",
//     quantity: 100,
//     price: 50
// }

export const purchase = async(req: Request, res: Response) =>{
    const {productId , quantity}  = req.body
    if(!productId || !quantity){
        return createResponse(res, {message: "Please provide all needed data", status: StatusCodes.BAD_REQUEST})
    }
    try{
        const product = await Product.findOne({_id: productId})
        if(!product){
            return createResponse(res, {message: "Product Not Found.", status: StatusCodes.NOT_FOUND})
        }
        if(!hasStock(product.quantity, quantity)){
            return createResponse(res, {message: "Insufficient Quantity.", status: StatusCodes.OK})
        }
        product.quantity -=quantity
        await product.save()
        createResponse(res, {message: "Purchase is Successful", status: StatusCodes.OK})
    }
    catch(error){
        console.log(error)
        createResponse(res, {message: error, status: StatusCodes.INTERNAL_SERVER_ERROR})
    }

}

export const listInventory = async(req: Request, res: Response) =>{
    const {productId} = req.params
    console.log(productId)
    const product = await Product.findOne({_id: productId})
    console.log(product)
    if(!product){
            return createResponse(res, {message: "Product Not Found.", status: StatusCodes.NOT_FOUND})
        }
     createResponse(res, {message: {productName: product.name, remainingQuantity: product.quantity}, status: StatusCodes.OK})
}