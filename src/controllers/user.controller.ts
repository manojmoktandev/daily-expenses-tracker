import {Request,Response,NextFunction} from "express"
import { status as httpStatus } from "http-status";
import User from "../models/user.model"
import asyncHandler from "../utils/async-handler.util";
import { compare, hash } from "../utils/bcrypt.util";
import ApiError, { errorHandler } from "../middlewares/error-handler.middleware";
import { generateJwtToken } from "../utils/jwt.util";
import { Roles } from "../types/enums";
import { deleteFiles } from "../utils/cloudinary.util";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { Types } from "mongoose";
import { EmailService } from "../services/email.service";
import { smtpConfig } from '../config/smtp.config';
import Expense from "../models/expense.model";
import { UserWithExpense } from "../interfaces/user.interface";


export const register = asyncHandler(async(req: Request, res: Response)=>{
    const {role,...data} =  req.body
    const profileImage =  req.file as Express.Multer.File
    if(!profileImage){
        delete data['profile']
    }
    if(!data.password){
        throw new ApiError('Password is required',httpStatus.BAD_REQUEST)
    }
    //const hashPassword =  await hash(password)
    const user  =  new  User({...data,role:Roles['User']})
    if(profileImage){
        user.profile.push({'path':profileImage.path,'public_id':profileImage.filename,'original_name':profileImage.originalname})
    }
    const usersave = await user.save()
    if(!usersave){
        throw new ApiError("User register failed",httpStatus.BAD_REQUEST)
    }
    else{
        const emailService =  new EmailService(smtpConfig)
        const name =  user.fullname;
        await emailService.sendEmail({
            to:user.email,
            subject:'User Registration Information',
            template:'welcome',
            context:{name},
          });
    }
    res.status(httpStatus.CREATED).json({
        message:'User register succesfully',
        status:'success',
        success:true,
        data:user
    })
})

export const login = asyncHandler(async(req: Request, res: Response)=>{
    const {email, password}  =  req.body
    if(!email || !password){
        throw new ApiError('Field is required',httpStatus.BAD_REQUEST)
    }
    const user = await User.findOne({ email })
   
    if(user){
        const userExpenses = await Expense.aggregate([
                {  $match: { createdBy: user._id } },
                {  $group: {  _id: null, totalAmount: { $sum: "$amount" } } }
                ]);
        const verifyPassword =  await user.comparePassword(password)
        //const verifyPassword =  await compare(user.password,password)
        if(verifyPassword){
            const payload: IJwtPayload = {
                _id:user._id as Types.ObjectId,
                email:user.email,
                fullname:user.fullname,
                username:user.username,
                role:user.role,
                profile: user.profile.map(p => ({
                    path: p.path,
                    public_id: p.public_id,
                    original_name: p.original_name
                })),
                expense:userExpenses[0]?.['totalAmount']
            }
            const token = generateJwtToken(payload);
            res.status(httpStatus.ACCEPTED).json({
                message:'User login succesfully',
                status:'success',
                success:true,
                data:user,
                token
            })
        }
        else{
            throw new ApiError('Invalid credentials',httpStatus.BAD_REQUEST);
        }
    }
    else{
        throw new ApiError('Incorrect User Email or password',httpStatus.UNAUTHORIZED)
    }
})

export const adminLogin = asyncHandler(async(req: Request, res: Response)=>{
    const {email, password}  =  req.body
    if(!email || !password){
        throw new ApiError('Field is required',httpStatus.BAD_REQUEST)
    }
    const user =  await User.findOne({email})

    if(!user || user.role!=Roles['Admin']){
        throw new ApiError('User Not Authorized',httpStatus.UNAUTHORIZED)
    }
  
    if(user){
        // const verifyPassword =  await compare(user.password,password)
        const verifyPassword = await  user.comparePassword(password)
        if(verifyPassword){
            const payload:IJwtPayload = {
                _id:user!._id as Types.ObjectId,
                email:user!.email,
                fullname:user!.fullname,
                username:user!.username,
                role:user!.role,
                profile: user!.profile.map(p => ({
                    path: p.path,
                    public_id: p.public_id,
                    original_name: p.original_name
                  }))
                
            }
            const token = generateJwtToken(payload)
            return res.status(httpStatus.ACCEPTED).json({
                message:'User login succesfully',
                status:'success',
                success:true,
                data:user,
                token
            })
        }
        else{
            throw new ApiError('User Password is not Match',httpStatus.BAD_REQUEST);
        }
    }
    else{
        throw new ApiError('Incorrect User Email or password',httpStatus.UNAUTHORIZED)
    }
})

export const profile =  asyncHandler(async(req:Request,res:Response)=>{
    const id = req.user
    const profile =  await User.findById(id).select('-password')
    if(!profile){
        throw new ApiError('Profile Not Found',httpStatus.NOT_FOUND)
    }
    res.status(httpStatus.OK).json({
        success:true,
        message:'User Profile Fetched Succesfully',
        data:profile,
        status:'success'
    })

})

export const getAllUsers = asyncHandler(async(req:Request,res:Response)=>{
    const payloadUser =  req.user
    if(payloadUser.role &&  Roles['Admin']!== payloadUser.role){
        throw new ApiError('User is not Authorized',httpStatus.UNAUTHORIZED)
    }
    const userAll =  await User.find({})
    res.status(httpStatus.OK).json({
        success:true,
        message:'Fetch All users',
        data:userAll,
        status:'success'
    })
})

export const removeUser = asyncHandler(async(req:Request,res:Response)=>{
    const payloadUser =  req.user
    const {id} =  req.params
    if(payloadUser.role &&  Roles['Admin']!== payloadUser.role){
        throw new ApiError('User is not Authorized',httpStatus.UNAUTHORIZED)
    }
    const user =  await User.findOne({_id:id})
    if(!user){
        throw new ApiError('User is not found',httpStatus.BAD_REQUEST)
    }
    if(user.profile && user.profile.length>0){
        const fileToDelete:string[] = user.profile.map(profile=>String(profile.public_id)) 
        await deleteFiles(fileToDelete)
    }
    const deleteRec =  await User.deleteOne({_id:id})
    if(deleteRec.deletedCount>0){
        res.status(httpStatus.OK).json({
        success:true,
        message:'User Removed Successfully',
        data:{},
        status:'success'
        })
    }
    else{
        throw new ApiError('User  Removed failed',httpStatus.BAD_REQUEST)
    }
   
})

export const updateProfile =  asyncHandler(async(req:Request,res:Response)=>{
    const {id} = req.params
    const {password,email,...data} =  req.body
    const profileImage =  req.file as Express.Multer.File
    const deleteProfileImg = data?.deleteProfileImg || ''
    if(!id){
        throw new ApiError('user id found',httpStatus.UNAUTHORIZED);
    }
    const user =  await User.findById(id)
    if(!user){
        throw new ApiError('User not found',httpStatus.BAD_REQUEST)
    }
    user.email =  email
    if (email && (await User.isEmailTaken(email, id))) {
        throw new ApiError('Email already taken',httpStatus.BAD_REQUEST);
    }
    
    if(password){
        const hashPassword =  await hash(password)
        user.password = hashPassword
    }
    if(profileImage){
        user.profile.push({'path':profileImage.path,'public_id':profileImage.filename,'original_name':profileImage.originalname})
    }
          
    if(deleteProfileImg && deleteProfileImg.length>0){
        const fileToDelete:string[] = JSON.parse(deleteProfileImg)
        const filterFile = user.profile.filter(
            file => !fileToDelete.includes(String(file.public_id))
        );
        user.set('profile', filterFile)
        await deleteFiles(fileToDelete)
    }
    user.username =  data?.username ? data.username : user.username
    const saveuser =  await user.save()
    if(!saveuser){
        throw new ApiError('User not successfully ',httpStatus.BAD_REQUEST)
    }
    res.status(httpStatus.OK).json({
        success:true,
        message:'User Profile update Succesfully',
        data:user,
        status:'success'
    })
})


