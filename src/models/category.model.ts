import { model, Schema, Types } from "mongoose";

const CategorySchema = new Schema({
    name:{
        type:String,
        required:[true,'category name is required']
    },
    description:{
        type:String
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:[true,'user is required']
    }
},{
    timestamps:true
})

const Category =  model('category',CategorySchema)
export default Category;
