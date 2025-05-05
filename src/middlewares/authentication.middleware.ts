import { NextFunction, Request, Response } from "express";
import { Roles } from "../types/enums";
import ApiError from "./error-handler.middleware";
import { status as HttpStatus } from "http-status";
import { verifyJwtToken } from "../utils/jwt.util";
import User from "../models/user.model";

export const Authentication = (roles?:Roles[])=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        try{
            
            // get authorization header
                const auth_header =  req.headers['authorization']
                if(!auth_header){
                    throw new ApiError('Authorization header is missing',HttpStatus.UNAUTHORIZED)
                }
                if(!auth_header.startsWith('Bearer')){
                    throw new ApiError('Unauthorized access denied',HttpStatus.UNAUTHORIZED)
                }
                const token  = auth_header.split(" ")[1];

                if(!token){
                    throw new ApiError('Unauthorized access denied',HttpStatus.UNAUTHORIZED)
                }
                const payload =  verifyJwtToken(token)
                
                //expiry of token

                if(payload?.exp && payload.exp  * 1000 < Date.now()){
                    throw new ApiError('Access token is expired',HttpStatus.BAD_REQUEST)
                }

                // search user from payload
                const user = await User.findById(payload._id);
                
                if(!user){
                    throw new ApiError('Unauthorized, access denied',HttpStatus.UNAUTHORIZED)
                }
                if(roles && !roles.includes(Roles['Admin'])){
                    if(roles && !roles.includes(user.role)){
                        throw new ApiError('Forbidden, access denied',HttpStatus.FORBIDDEN)
                    }
                }
                

                const {_id,email,fullname,username,role} = payload;
                req.user = {_id,email,fullname,username,role}
                next()
        }
        catch(error){
            next(error)
        }
    }
}

export default Authentication;

