import { status as httpStatus } from "http-status";
import { NextFunction, Request,Response } from "express";
class ApiError  extends Error {
    statusCode:number
    status:'error' | 'fail'
    success:Boolean
    isOperation:Boolean
    constructor(message: string,statusCode: number){
        super(message)
        this.statusCode =  statusCode
        this.status = statusCode >= httpStatus.BAD_REQUEST && statusCode < httpStatus.INTERNAL_SERVER_ERROR ? 'fail' : 'error' 
        this.success = false
        this.isOperation =  true
        Error.captureStackTrace(this,ApiError)
    }
}
export const  errorHandler  =  (err:any,req:Request,res:Response,next:NextFunction)=>{
    const success = err.success || false;
    const statusCode =  err.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    const status =  err.status || 'error'
    let message =  err?.message ?? 'something went wrong'
    let error = { ...err};
    if(err.name==="ValidationError"){
        message =  Object.values(err.errors).map((value:any)=>value.message)
    }

    res.status(statusCode).json({
        success,
        status,
        message
    })
}

export default ApiError