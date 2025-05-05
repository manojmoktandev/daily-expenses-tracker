"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../types/enums");
const bcrypt_util_1 = require("../utils/bcrypt.util");
const plugins_1 = require("./plugins");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'Email is required'],
        unique: [true, 'Users already exists with provided email'],
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    fullname: {
        type: String,
        required: [true, 'FullName is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minlength: 8,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
        },
        private: true, // used by the toJSON plugin
    },
    username: {
        type: String,
        required: [true, 'username is required']
    },
    role: {
        type: String,
        enum: Object.values(enums_1.Roles),
        required: true,
        default: enums_1.Roles.User
    },
    profile: {
        type: [
            {
                path: { type: String },
                public_id: { type: String },
                original_name: { type: String }
            }
        ],
        default: []
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });
// add plugin that converts mongoose to json
userSchema.plugin(plugins_1.toJSON);
userSchema.plugin(plugins_1.paginate);
// Add instance methods
userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, bcrypt_util_1.compare)(this.password, password);
    });
};
/// Add static methods
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = function (email, excludeUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email, _id: { $ne: excludeUserId } });
        return !!user;
    });
};
// Add middleware
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            this.password = yield (0, bcrypt_util_1.hash)(this.password);
        }
        next();
    });
});
//  Add virtuals
//   userSchema.virtual('profile.fullName').get(function() {
//     return `${this.name.first} ${this.name.last}`;
//   });
const User = (0, mongoose_1.model)('user', userSchema);
exports.default = User;
