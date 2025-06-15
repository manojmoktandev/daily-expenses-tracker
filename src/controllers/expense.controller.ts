import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler.util";
import Expense from "../models/expense.model";
import Category from "../models/category.model";
import ApiError from "../middlewares/error-handler.middleware";
import {status as HttpStatus} from "http-status";
import { deleteFiles } from "../utils/cloudinary.util";

export const create =  asyncHandler(async(req:Request,res:Response)=>{
    const userId =  req.user._id
    const {category,...data} =  req.body  
    if(!category){
        throw new ApiError('Category is required',HttpStatus.BAD_REQUEST)
    }
    const receiptFile =  req.files as Express.Multer.File[]
    const categoryData = await Category.findById(category)
    if(!categoryData){
        throw new ApiError('Category Not Found',HttpStatus.BAD_REQUEST)
    }
    const expenseModel =  new Expense(data)
    expenseModel.createdBy =  userId
    expenseModel.category = categoryData._id
    if(receiptFile && receiptFile.length>0 ){
        receiptFile.forEach(file => {
            expenseModel.receipts.push(
                    {
                        'path':file.path,
                        'public_id':file.filename,
                        'original_name':file.originalname
                    }
                )
        });
    }
    await expenseModel.save()

    res.status(HttpStatus.OK).json({
        message:'Expense Record Create Successfully',
        data:expenseModel,
        success:true,
        status:'success'
    })

})

export const update = asyncHandler(async(req:Request, res:Response)=>{
    const {title,amount,date,category,deletedReceipts,...data} =  req.body
    const {id} = req.params
    const receiptFile =  req.files as Express.Multer.File[]
    const expenseRec =  await Expense.findById(id)
    if(!expenseRec){
        throw new ApiError('Expense Record Not Found',HttpStatus.BAD_REQUEST)
    }
    if(expenseRec){
        const categoryRec =  await Category.findById(category)
        if(!categoryRec){
            throw new ApiError('Expense Category Record Not Found',HttpStatus.BAD_REQUEST)
        }
        expenseRec.title = title
        expenseRec.amount = amount
        expenseRec.date =  date
        expenseRec.category =  category
        if(receiptFile && receiptFile.length>0 ){
            receiptFile.forEach(file => {
                    expenseRec.receipts.push({
                        'path':file.path,
                        'public_id':file.filename,
                        'original_name':file.originalname
                })
            })
        }
      
        if(deletedReceipts && deletedReceipts.length>0){
            const fileToDelete:string[] = JSON.parse(deletedReceipts)
            const receiptsToRemove = expenseRec.receipts.filter(
                receipts => !fileToDelete.includes(String(receipts.public_id))
            );
            expenseRec.set('receipts',receiptsToRemove)

            // const receiptsToRemove = expenseRec.receipt.filter(
            //     receipt => fileToDelete.includes(String(receipt.public_id))
            // );
            // receiptsToRemove.forEach(receipt=>{
            //     expenseRec.receipt.pull(receipt)
            // })
            await deleteFiles(fileToDelete)
        }
        const recSave =  await expenseRec.save()
        if(!recSave){
            throw new ApiError('Expense Record Failed to save',HttpStatus.BAD_REQUEST)
        }
        res.status(HttpStatus.OK).json({
            message:'Expense Record Update Successfully',
            data:recSave,
            success:true,
            status:'success'
        })
    }
})

export const remove =  asyncHandler(async(req:Request,res:Response)=>{
    const {id}  =   req.params
    const userId =  req.user._id
    const expenseRec =  await Expense.findOne({_id:id,createdBy:userId});

    if(!expenseRec){
         throw new ApiError('Failed to delete Expense Record',HttpStatus.BAD_REQUEST)
    }
    if(expenseRec.receipts && expenseRec.receipts.length>0){
        const fileToDelete:string[] = expenseRec.receipts.map(receipts=>String(receipts.public_id)) 
        await deleteFiles(fileToDelete)
    }
    const deleteRec = await Expense.findByIdAndDelete(id);
    if(!deleteRec){
        throw new ApiError('Expense Record Delete Failed',HttpStatus.BAD_REQUEST)
    }
    res.status(HttpStatus.OK).json({
        message:'Expense Record Deleted successfully',
        data:{},
        success:true,
        status:'success'
    })
})

export const getById =  asyncHandler(async(req:Request,res:Response)=>{
    const userId =  req.user._id
    const {id} =  req.params
    if(!id){
        throw  new ApiError('Expenses Id is required',HttpStatus.BAD_REQUEST)
    }
    const expenseRec =  await Expense.findOne({_id:id, createdBy:userId})
    if(!expenseRec){
        throw new ApiError('Expense List Not Found',HttpStatus.BAD_REQUEST)
    }
    res.status(HttpStatus.OK).json({
        message:'expense List',
        data:expenseRec,
        success:true,
        status:'success'
    })
})

export const getAllUserWise =  asyncHandler(async(req:Request,res:Response)=>{
    const userId =  req.user._id
    const expense =  await Expense.find({createdBy:userId}).populate('category').sort({"createdAt":-1})
    res.status(HttpStatus.OK).json({
        message:'Logged in user wise List',
        data:expense,
        success:true,
        status:'success'
      })
})

export const getAllExpenses = asyncHandler(async(req:Request,res:Response)=>{
  const expenseRec =  await Expense.find()
  res.status(HttpStatus.OK).json({
    message:'All Expenses List',
    data:expenseRec,
    success:true,
    status:'success'
  })
})


