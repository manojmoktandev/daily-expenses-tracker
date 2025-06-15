import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/async-handler.util";
import ApiError, { errorHandler } from "../middlewares/error-handler.middleware";
import {status as  HttpStatus } from "http-status";
import User from "../models/user.model"
import Category from "../models/category.model";


export const create =  asyncHandler(async(req:Request, res:Response)=>{
    const {name,description} =  req.body
    const userId =  req.user._id
    if(!name){
        throw new ApiError('Category name is required',HttpStatus.BAD_REQUEST)
    }
    if(!userId){
        throw new ApiError('User  id is required',HttpStatus.BAD_REQUEST)
    }
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError('User Not found',HttpStatus.BAD_REQUEST)
    }

    const category =  await Category.create({name,description,user:user._id})
    if(category){
        res.status(HttpStatus.CREATED).json({
            message:'Category created',
            data:category,
            success:true,
            status:'success'
        })
    }
    else{
        throw new ApiError('Category Failed to create',HttpStatus.BAD_REQUEST)
    }
})

export const update = asyncHandler(async(req:Request, res:Response)=>{
    const {name} =  req.body
    const {id} =  req.params
    const user =  req.user
    if(!id){
        throw new ApiError('Category ID is required',HttpStatus.BAD_REQUEST)
    }
    if(!name){
        throw new ApiError('Category Name is required',HttpStatus.BAD_REQUEST)
    }
    const categoryRec =  await Category.findById(id)
    if(categoryRec){
        categoryRec.name = name;
        await categoryRec.save();
        res.status(HttpStatus.ACCEPTED).json({
            message:'Category updated',
            data:categoryRec,
            success:true,
            status:'success'
        })
    }
    else{
        throw new ApiError('Category is not Found',HttpStatus.BAD_REQUEST)
    }
   
})

export const getAllCategories = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  const category =   await Category.find()
  res.status(HttpStatus.OK).json({
    message:'Category List',
    data:category,
    success:true,
    status:'success'
  })
})

export const getAllUserWise =  asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const userId =  req.user._id
    const category =  await Category.find({user:userId})
    res.status(HttpStatus.OK).json({
        message:'Category List',
        data:category,
        success:true,
        status:'success'
      })

})

export const getById =  asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const userId =  req.user._id
    const {id} =  req.params
    if(!id){
        throw  new ApiError('Category id is required',HttpStatus.BAD_REQUEST)
    }
    const category =  await Category.findOne({_id:id, user:userId}).populate('user')
    if(!category){
        throw  new ApiError('Category List not Found',HttpStatus.BAD_REQUEST)
    }
    res.status(HttpStatus.OK).json({
        message:'Category List',
        data:category,
        success:true,
        status:'success'
    })
})

export const remove =  asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {id}  =   req.params
    const userId =  req.user._id
    const category =  await Category.findOneAndDelete({_id:id,user:userId});
    if(!category){
        throw new ApiError('Category Delete Failed',HttpStatus.BAD_REQUEST)
    }
    res.status(HttpStatus.OK).json({
        message:'Category Deleted successfully',
        data:{},
        success:true,
        status:'success'
    })
})