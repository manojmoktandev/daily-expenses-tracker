"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const plugins_1 = require("./plugins");
const date = new Date().toISOString().split('T')[0];
const expenseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    date: {
        type: Date,
        default: date
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'User is Required'],
        ref: 'user',
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Category is required'],
        ref: 'category'
    },
    receipt: [
        {
            path: {
                type: String
            },
            public_id: {
                type: String
            },
            original_name: {
                type: String
            }
        }
    ]
}, { timestamps: true });
// add plugin that converts mongoose to json
expenseSchema.plugin(plugins_1.toJSON);
expenseSchema.plugin(plugins_1.paginate);
const Expense = (0, mongoose_1.model)('expense', expenseSchema);
exports.default = Expense;
