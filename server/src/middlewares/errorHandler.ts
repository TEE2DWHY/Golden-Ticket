import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createResponse } from '../utils/response';

type AppError = Error & {
	type?: string;
	path?: string;
};

const getStatusCode = (err: AppError) => {
	if (err.name === 'CastError' || err.name === 'ValidationError') {
		return StatusCodes.BAD_REQUEST;
	}
	if (err.type === 'entity.parse.failed') {
		return StatusCodes.BAD_REQUEST;
	}
	return StatusCodes.INTERNAL_SERVER_ERROR;
};

const getMessage = (err: AppError) => {
	if (err.name === 'CastError') {
		return `Invalid ${err.path}.`;
	}
	if (err.name === 'ValidationError') {
		return err.message;
	}
	if (err.type === 'entity.parse.failed') {
		return 'Invalid JSON in request body.';
	}
	console.log(err);
	return 'Something went wrong, please try again.';
};

const errorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	createResponse(res, {
		data: { message: getMessage(err) },
		status: getStatusCode(err),
	});
};

export default errorHandler;
