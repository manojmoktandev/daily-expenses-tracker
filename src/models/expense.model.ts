import { model, Schema, Types } from "mongoose";
import { paginate,toJSON } from "./plugins";

const date =  new Date().toISOString().split('T')[0]
const expenseSchema =  new Schema({
    title:{
        type:String,
        required:[true,'Title is required']
    },
    amount:{
        type:Number,
        required:[true,'Amount is required']
    },
    date:{
        type:Date,
        default:date
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        required:[true,'User is Required'],
        ref:'user',
    },
    category:{
        type:Schema.Types.ObjectId,
        required:[true,'Category is required'],
        ref:'category'
    },
    receipts:[
        {
            path:{
                type:String
            },
            public_id:{
                type:String
            },
            original_name:{
                type:String
            }
        }
    ],
    description:{
        type:String
    }

},{timestamps:true})

// add plugin that converts mongoose to json
expenseSchema.plugin(toJSON);
expenseSchema.plugin(paginate);

const Expense =  model('expense',expenseSchema)
export default Expense
