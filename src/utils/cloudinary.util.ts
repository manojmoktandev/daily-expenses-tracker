import { v2 as cloudinary } from 'cloudinary';
import { config } from './../config/config';

//configuation 
cloudinary.config({ 
    cloud_name: config.cloudinary.name, 
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret 
});

export const deleteFiles =  async(files:string[])=>{
    files.map(async(public_id)=>{
        await cloudinary.uploader.destroy(public_id)
    })
}

export  default cloudinary
