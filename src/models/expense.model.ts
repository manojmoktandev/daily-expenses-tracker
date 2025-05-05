import { model, Schema, Types } from "mongoose";
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
    receipt:[
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
    ]

},{timestamps:true})

const Expense =  model('expense',expenseSchema)
export default Expense
