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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.removeUser = exports.getAllUsers = exports.profile = exports.adminLogin = exports.login = exports.register = void 0;
const http_status_1 = require("http-status");
const user_model_1 = __importDefault(require("../models/user.model"));
const async_handler_util_1 = __importDefault(require("../utils/async-handler.util"));
const bcrypt_util_1 = require("../utils/bcrypt.util");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const jwt_util_1 = require("../utils/jwt.util");
const enums_1 = require("../types/enums");
const cloudinary_util_1 = require("../utils/cloudinary.util");
const email_service_1 = require("../services/email.service");
const smtp_config_1 = require("../config/smtp.config");
exports.register = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { role } = _a, data = __rest(_a, ["role"]);
    const profileImage = req.file;
    if (!profileImage) {
        delete data['profile'];
    }
    if (!data.password) {
        throw new error_handler_middleware_1.default('Password is required', http_status_1.status.BAD_REQUEST);
    }
    //const hashPassword =  await hash(password)
    const user = new user_model_1.default(Object.assign(Object.assign({}, data), { role: enums_1.Roles['User'] }));
    if (profileImage) {
        user.profile.push({ 'path': profileImage.path, 'public_id': profileImage.filename, 'original_name': profileImage.originalname });
    }
    const usersave = yield user.save();
    if (!usersave) {
        throw new error_handler_middleware_1.default("User register failed", http_status_1.status.BAD_REQUEST);
    }
    else {
        const emailService = new email_service_1.EmailService(smtp_config_1.smtpConfig);
        const name = user.fullname;
        yield emailService.sendEmail({
            to: user.email,
            subject: 'User Registration Information',
            template: 'welcome',
            context: { name },
        });
    }
    res.status(http_status_1.status.CREATED).json({
        message: 'User register succesfully',
        status: 'success',
        success: true,
        data: user
    });
}));
exports.login = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new error_handler_middleware_1.default('Field is required', http_status_1.status.BAD_REQUEST);
    }
    const user = yield user_model_1.default.findOne({ email });
    if (user) {
        const verifyPassword = yield user.comparePassword(password);
        //const verifyPassword =  await compare(user.password,password)
        if (verifyPassword) {
            const payload = {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                username: user.username,
                role: user.role,
                profile: user.profile.map(p => ({
                    path: p.path,
                    public_id: p.public_id,
                    original_name: p.original_name
                }))
            };
            const token = (0, jwt_util_1.generateJwtToken)(payload);
            res.status(http_status_1.status.ACCEPTED).json({
                message: 'User login succesfully',
                status: 'success',
                success: true,
                data: user,
                token
            });
        }
        else {
            throw new error_handler_middleware_1.default('Invalid credentials', http_status_1.status.BAD_REQUEST);
        }
    }
    else {
        throw new error_handler_middleware_1.default('Incorrect User Email or password', http_status_1.status.UNAUTHORIZED);
    }
}));
exports.adminLogin = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new error_handler_middleware_1.default('Field is required', http_status_1.status.BAD_REQUEST);
    }
    const user = yield user_model_1.default.findOne({ email });
    if (!user || user.role != enums_1.Roles['Admin']) {
        throw new error_handler_middleware_1.default('User Not Authorized', http_status_1.status.UNAUTHORIZED);
    }
    if (user) {
        // const verifyPassword =  await compare(user.password,password)
        const verifyPassword = yield user.comparePassword(password);
        if (verifyPassword) {
            const payload = {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                username: user.username,
                role: user.role,
                profile: user.profile.map(p => ({
                    path: p.path,
                    public_id: p.public_id,
                    original_name: p.original_name
                }))
            };
            const token = (0, jwt_util_1.generateJwtToken)(payload);
            return res.status(http_status_1.status.ACCEPTED).json({
                message: 'User login succesfully',
                status: 'success',
                success: true,
                data: user,
                token
            });
        }
        else {
            throw new error_handler_middleware_1.default('User Password is not Match', http_status_1.status.BAD_REQUEST);
        }
    }
    else {
        throw new error_handler_middleware_1.default('Incorrect User Email or password', http_status_1.status.UNAUTHORIZED);
    }
}));
exports.profile = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user;
    const profile = yield user_model_1.default.findById(id).select('-password');
    if (!profile) {
        throw new error_handler_middleware_1.default('Profile Not Found', http_status_1.status.NOT_FOUND);
    }
    res.status(http_status_1.status.OK).json({
        success: true,
        message: 'User Profile Fetched Succesfully',
        data: profile,
        status: 'success'
    });
}));
exports.getAllUsers = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payloadUser = req.user;
    if (payloadUser.role && enums_1.Roles['Admin'] !== payloadUser.role) {
        throw new error_handler_middleware_1.default('User is not Authorized', http_status_1.status.UNAUTHORIZED);
    }
    const userAll = yield user_model_1.default.find({});
    res.status(http_status_1.status.OK).json({
        success: true,
        message: 'Fetch All users',
        data: userAll,
        status: 'success'
    });
}));
exports.removeUser = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payloadUser = req.user;
    const { id } = req.params;
    if (payloadUser.role && enums_1.Roles['Admin'] !== payloadUser.role) {
        throw new error_handler_middleware_1.default('User is not Authorized', http_status_1.status.UNAUTHORIZED);
    }
    const user = yield user_model_1.default.findOne({ _id: id });
    if (!user) {
        throw new error_handler_middleware_1.default('User is not found', http_status_1.status.BAD_REQUEST);
    }
    if (user.profile && user.profile.length > 0) {
        const fileToDelete = user.profile.map(profile => String(profile.public_id));
        yield (0, cloudinary_util_1.deleteFiles)(fileToDelete);
    }
    const deleteRec = yield user_model_1.default.deleteOne({ _id: id });
    if (deleteRec.deletedCount > 0) {
        res.status(http_status_1.status.OK).json({
            success: true,
            message: 'User Removed Successfully',
            data: {},
            status: 'success'
        });
    }
    else {
        throw new error_handler_middleware_1.default('User  Removed failed', http_status_1.status.BAD_REQUEST);
    }
}));
exports.updateProfile = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _a = req.body, { password, email } = _a, data = __rest(_a, ["password", "email"]);
    const profileImage = req.file;
    const deleteProfileImg = (data === null || data === void 0 ? void 0 : data.deleteProfileImg) || '';
    if (!id) {
        throw new error_handler_middleware_1.default('user id found', http_status_1.status.UNAUTHORIZED);
    }
    const user = yield user_model_1.default.findById(id);
    if (!user) {
        throw new error_handler_middleware_1.default('User not found', http_status_1.status.BAD_REQUEST);
    }
    user.email = email;
    if (email && (yield user_model_1.default.isEmailTaken(email, id))) {
        throw new error_handler_middleware_1.default('Email already taken', http_status_1.status.BAD_REQUEST);
    }
    if (password) {
        const hashPassword = yield (0, bcrypt_util_1.hash)(password);
        user.password = hashPassword;
    }
    if (profileImage) {
        user.profile.push({ 'path': profileImage.path, 'public_id': profileImage.filename, 'original_name': profileImage.originalname });
    }
    if (deleteProfileImg && deleteProfileImg.length > 0) {
        const fileToDelete = JSON.parse(deleteProfileImg);
        const filterFile = user.profile.filter(file => !fileToDelete.includes(String(file.public_id)));
        user.set('profile', filterFile);
        yield (0, cloudinary_util_1.deleteFiles)(fileToDelete);
    }
    user.username = (data === null || data === void 0 ? void 0 : data.username) ? data.username : user.username;
    const saveuser = yield user.save();
    if (!saveuser) {
        throw new error_handler_middleware_1.default('User not successfully ', http_status_1.status.BAD_REQUEST);
    }
    res.status(http_status_1.status.OK).json({
        success: true,
        message: 'User Profile update Succesfully',
        data: user,
        status: 'success'
    });
}));
