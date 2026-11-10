import { Response } from "express"
import { StatusCodes } from "http-status-codes"

type CreateResponse = {
    data: unknown,
    status: StatusCodes
}

export const createResponse = (res: Response,{data, status}: CreateResponse) =>{
  return res.status(status).json({data:data})
}
