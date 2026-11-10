import { Response } from "express"
import { StatusCodes } from "http-status-codes"

type CreateResponse = {
    message: unknown,
    status: StatusCodes
}

export const createResponse = (res: Response,{message, status}: CreateResponse) =>{
  return res.status(status).json({message:message})
}
