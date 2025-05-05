"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'category name is required']
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'user is required']
    }
}, {
    timestamps: true
});
const Category = (0, mongoose_1.model)('category', CategorySchema);
exports.default = Category;
