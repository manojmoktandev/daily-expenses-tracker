import { model, Schema, Types } from "mongoose";
import { paginate,toJSON } from "./plugins";

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
        ref:'user',
        required:[true,'user is required']
    }
},{
    timestamps:true
})

// add plugin that converts mongoose to json
CategorySchema.plugin(toJSON);
CategorySchema.plugin(paginate);

const Category =  model('category',CategorySchema)
export default Category;
