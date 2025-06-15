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
exports.getAllExpenses = exports.getAllUserWise = exports.getById = exports.remove = exports.update = exports.create = void 0;
const async_handler_util_1 = __importDefault(require("../utils/async-handler.util"));
const expense_model_1 = __importDefault(require("../models/expense.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const http_status_1 = require("http-status");
const cloudinary_util_1 = require("../utils/cloudinary.util");
exports.create = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const _a = req.body, { category } = _a, data = __rest(_a, ["category"]);
    if (!category) {
        throw new error_handler_middleware_1.default('Category is required', http_status_1.status.BAD_REQUEST);
    }
    const receiptFile = req.files;
    const categoryData = yield category_model_1.default.findById(category);
    if (!categoryData) {
        throw new error_handler_middleware_1.default('Category Not Found', http_status_1.status.BAD_REQUEST);
    }
    const expenseModel = new expense_model_1.default(data);
    expenseModel.createdBy = userId;
    expenseModel.category = categoryData._id;
    if (receiptFile && receiptFile.length > 0) {
        receiptFile.forEach(file => {
            expenseModel.receipt.push({
                'path': file.path,
                'public_id': file.filename,
                'original_name': file.originalname
            });
        });
    }
    yield expenseModel.save();
    res.status(http_status_1.status.OK).json({
        message: 'Expense Record Create Successfully',
        data: expenseModel,
        success: true,
        status: 'success'
    });
}));
exports.update = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { title, amount, date, category, deletedReceipts } = _a, data = __rest(_a, ["title", "amount", "date", "category", "deletedReceipts"]);
    const { id } = req.params;
    const receiptFile = req.files;
    const expenseRec = yield expense_model_1.default.findById(id);
    if (!expenseRec) {
        throw new error_handler_middleware_1.default('Expense Record Not Found', http_status_1.status.BAD_REQUEST);
    }
    if (expenseRec) {
        const categoryRec = yield category_model_1.default.findById(category);
        if (!categoryRec) {
            throw new error_handler_middleware_1.default('Expense Category Record Not Found', http_status_1.status.BAD_REQUEST);
        }
        expenseRec.title = title;
        expenseRec.amount = amount;
        expenseRec.date = date;
        expenseRec.category = category;
        if (receiptFile && receiptFile.length > 0) {
            receiptFile.forEach(file => {
                expenseRec.receipt.push({
                    'path': file.path,
                    'public_id': file.filename,
                    'original_name': file.originalname
                });
            });
        }
        if (deletedReceipts && deletedReceipts.length > 0) {
            const fileToDelete = JSON.parse(deletedReceipts);
            const receiptsToRemove = expenseRec.receipt.filter(receipt => !fileToDelete.includes(String(receipt.public_id)));
            expenseRec.set('receipt', receiptsToRemove);
            // const receiptsToRemove = expenseRec.receipt.filter(
            //     receipt => fileToDelete.includes(String(receipt.public_id))
            // );
            // receiptsToRemove.forEach(receipt=>{
            //     expenseRec.receipt.pull(receipt)
            // })
            yield (0, cloudinary_util_1.deleteFiles)(fileToDelete);
        }
        const recSave = yield expenseRec.save();
        if (!recSave) {
            throw new error_handler_middleware_1.default('Expense Record Failed to save', http_status_1.status.BAD_REQUEST);
        }
        res.status(http_status_1.status.OK).json({
            message: 'Expense Record Update Successfully',
            data: recSave,
            success: true,
            status: 'success'
        });
    }
}));
exports.remove = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user._id;
    const expenseRec = yield expense_model_1.default.findOne({ _id: id, createdBy: userId });
    if (!expenseRec) {
        throw new error_handler_middleware_1.default('Failed to delete Expense Record', http_status_1.status.BAD_REQUEST);
    }
    if (expenseRec.receipt && expenseRec.receipt.length > 0) {
        const fileToDelete = expenseRec.receipt.map(receipt => String(receipt.public_id));
        yield (0, cloudinary_util_1.deleteFiles)(fileToDelete);
    }
    const deleteRec = yield expense_model_1.default.findByIdAndDelete(id);
    if (!deleteRec) {
        throw new error_handler_middleware_1.default('Expense Record Delete Failed', http_status_1.status.BAD_REQUEST);
    }
    res.status(http_status_1.status.OK).json({
        message: 'Expense Record Deleted successfully',
        data: {},
        success: true,
        status: 'success'
    });
}));
exports.getById = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { id } = req.params;
    if (!id) {
        throw new error_handler_middleware_1.default('Expenses Id is required', http_status_1.status.BAD_REQUEST);
    }
    const expenseRec = yield expense_model_1.default.findOne({ _id: id, createdBy: userId });
    if (!expenseRec) {
        throw new error_handler_middleware_1.default('Expense List Not Found', http_status_1.status.BAD_REQUEST);
    }
    res.status(http_status_1.status.OK).json({
        message: 'expense List',
        data: expenseRec,
        success: true,
        status: 'success'
    });
}));
exports.getAllUserWise = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const expense = yield expense_model_1.default.find({ createdBy: userId }).populate('category').sort({ "createdBy": -1 });
    res.status(http_status_1.status.OK).json({
        message: 'Logged in user wise List',
        data: expense,
        success: true,
        status: 'success'
    });
}));
exports.getAllExpenses = (0, async_handler_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const expenseRec = yield expense_model_1.default.find();
    res.status(http_status_1.status.OK).json({
        message: 'All Expenses List',
        data: expenseRec,
        success: true,
        status: 'success'
    });
}));
