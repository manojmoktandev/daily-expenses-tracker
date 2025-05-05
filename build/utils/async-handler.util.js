"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (fn) => {
    //return (req:Request,res:Response,next:NextFunction) => Promise.resolve(fn(req,res,next)).catch((err)=>next(err))
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            //console.error(Object.values(err.errors).map(val => val.message))
            next(err);
        });
    };
};
exports.default = asyncHandler;
