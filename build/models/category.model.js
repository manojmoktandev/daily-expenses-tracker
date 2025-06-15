"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const plugins_1 = require("./plugins");
const CategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'category name is required']
    },
    description: {
        type: String
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'user is required']
    }
}, {
    timestamps: true
});
// add plugin that converts mongoose to json
CategorySchema.plugin(plugins_1.toJSON);
CategorySchema.plugin(plugins_1.paginate);
const Category = (0, mongoose_1.model)('category', CategorySchema);
exports.default = Category;
