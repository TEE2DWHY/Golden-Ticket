import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Product from '../models/Product';
import { hasStock } from '../utils/inventory';
import { createResponse } from '../utils/response';

// const inventory = {
//     name: "sneaker-footware",
//     quantity: 100,
//     price: 50
// }

export const purchase = async (req: Request, res: Response) => {
	const { productId, quantity } = req.body;
	console.log(req.body);
	if (!productId || !quantity) {
		return createResponse(res, {
			data: { message: 'Please provide all needed data' },
			status: StatusCodes.BAD_REQUEST,
		});
	}
	if (!Number.isInteger(quantity) || quantity < 1) {
		return createResponse(res, {
			data: { message: 'Quantity must be at least 1.' },
			status: StatusCodes.BAD_REQUEST,
		});
	}
	try {
		const product = await Product.findOne({ _id: productId });
		if (!product) {
			return createResponse(res, {
				data: { message: 'Product Not Found.' },
				status: StatusCodes.NOT_FOUND,
			});
		}
		if (!hasStock(product.quantity, quantity)) {
			return createResponse(res, {
				data: { message: 'Sold Out.' },
				status: StatusCodes.CONFLICT,
			});
		}
		const updated = await Product.findOneAndUpdate(
			{ _id: productId, quantity: { $gte: quantity } },
			{ $inc: { quantity: -quantity } },
			{ new: true },
		);
		if (!updated) {
			return createResponse(res, {
				data: { message: 'Sold Out.' },
				status: StatusCodes.CONFLICT,
			});
		}
		createResponse(res, {
			data: {
				message: 'Purchase is Successful',
				productName: updated.name,
				quantity: quantity,
				price: updated.price,
				total: updated.price * quantity,
				remainingQuantity: updated.quantity,
			},
			status: StatusCodes.OK,
		});
	} catch (error) {
		console.log(error);
		createResponse(res, {
			data: error,
			status: StatusCodes.INTERNAL_SERVER_ERROR,
		});
	}
};

export const getInventory = async (req: Request, res: Response) => {
	const products = await Product.find();
	if (products.length === 0) {
		return createResponse(res, {
			data: { message: 'No Inventory Found.' },
			status: StatusCodes.OK,
		});
	}
	createResponse(res, {
		data: {
			message: 'Inventory Returned Successfully',
			products: products,
		},
		status: StatusCodes.OK,
	});
};

export const getProduct = async (req: Request, res: Response) => {
	const { productId } = req.params;
	console.log(productId);
	const product = await Product.findOne({ _id: productId });
	console.log(product);
	if (!product) {
		return createResponse(res, {
			data: { message: 'Product Not Found.' },
			status: StatusCodes.NOT_FOUND,
		});
	}
	createResponse(res, {
		data: { productName: product.name, remainingQuantity: product.quantity },
		status: StatusCodes.OK,
	});
};
