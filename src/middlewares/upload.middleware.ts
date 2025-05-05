import multer from "multer"
import fs from "fs"
import  cloudinary  from "../utils/cloudinary.util"
import { Request, Response } from "express";
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const uploader = (folderName?:string)=>{
    const destination  =  `./uploads/${folderName}`
    if(!fs.existsSync(destination)){
        fs.mkdirSync(`./uploads/${folderName}`)
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, destination)
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null, file.fieldname + '_' + uniqueSuffix +'_'+ file.originalname)
        }
    })
    return multer({storage})
}

export const cloudinaryUploader = ()=>{
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async(req:Request, file:Response)=>{
      return {
        folder:'expenses/receipts',
        allowed_formats:['png','jpg','webp','pdf']
      }
    }
  });

  return multer({storage})

}

