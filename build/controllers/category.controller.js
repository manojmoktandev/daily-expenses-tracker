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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.getById = exports.getAllUserWise = exports.getAllCategories = exports.update = exports.create = void 0;
const async_handler_util_1 = __importDefault(require("../utils/async-handler.util"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const http_status_1 = require("http-status");
const user_model_1 = __importDefault(require("../models/user.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
exports.create = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const userId = req.user._id;
    if (!name) {
        throw new error_handler_middleware_1.default('Category name is required', http_status_1.status.BAD_REQUEST);
    }
    if (!userId) {
        throw new error_handler_middleware_1.default('User  id is required', http_status_1.status.BAD_REQUEST);
    }
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.default('User Not found', http_status_1.status.BAD_REQUEST);
    }
    const category = yield category_model_1.default.create({ name, description, user: user._id });
    if (category) {
        res.status(http_status_1.status.CREATED).json({
            message: 'Category created',
            data: category,
            success: true,
            status: 'success'
        });
    }
    else {
        throw new error_handler_middleware_1.default('Category Failed to create', http_status_1.status.BAD_REQUEST);
    }
}));
exports.update = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const { id } = req.params;
    const user = req.user;
    if (!id) {
        throw new error_handler_middleware_1.default('Category ID is required', http_status_1.status.BAD_REQUEST);
    }
    if (!name) {
        throw new error_handler_middleware_1.default('Category Name is required', http_status_1.status.BAD_REQUEST);
    }
    const categoryRec = yield category_model_1.default.findById(id);
    if (categoryRec) {
        categoryRec.name = name;
        yield categoryRec.save();
        res.status(http_status_1.status.ACCEPTED).json({
            message: 'Category updated',
            data: categoryRec,
            success: true,
            status: 'success'
        });
    }
    else {
        throw new error_handler_middleware_1.default('Category is not Found', http_status_1.status.BAD_REQUEST);
    }
}));
exports.getAllCategories = (0, async_handler_util_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.find();
    res.status(http_status_1.status.OK).json({
        message: 'Category List',
        data: category,
        success: true,
        status: 'success'
    });
}));
exports.getAllUserWise = (0, async_handler_util_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const category = yield category_model_1.default.find({ user: userId });
    res.status(http_status_1.status.OK).json({
        message: 'Category List',
        data: category,
        success: true,
        status: 'success'
    });
}));
exports.getById = (0, async_handler_util_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { id } = req.params;
    if (!id) {
        throw new error_handler_middleware_1.default('Category id is required', http_status_1.status.BAD_REQUEST);
    }
    const category = yield category_model_1.default.findOne({ _id: id, user: userId }).populate('user');
    if (!category) {
        throw new error_handler_middleware_1.default('Category List not Found', http_status_1.status.BAD_REQUEST);
    }
    res.status(http_status_1.status.OK).json({
        message: 'Category List',
        data: category,
        success: true,
        status: 'success'
    });
}));
exports.remove = (0, async_handler_util_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user._id;
    const category = yield category_model_1.default.findOneAndDelete({ _id: id, user: userId });
    if (!category) {
        throw new error_handler_middleware_1.default('Category Delete Failed', http_status_1.status.BAD_REQUEST);
    }
    res.status(http_status_1.status.OK).json({
        message: 'Category Deleted successfully',
        data: {},
        success: true,
        status: 'success'
    });
}));
