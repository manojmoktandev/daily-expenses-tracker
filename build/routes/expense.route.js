"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const enums_1 = require("../types/enums");
const authentication_middleware_1 = __importDefault(require("../middlewares/authentication.middleware"));
const expense_controller_1 = require("../controllers/expense.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const cloudUpload = (0, upload_middleware_1.cloudinaryUploader)();
router.get('/getall', (0, authentication_middleware_1.default)([enums_1.Roles.Admin]), expense_controller_1.getAllExpenses);
router.get('/getall/user', (0, authentication_middleware_1.default)([enums_1.Roles.User]), expense_controller_1.getAllUserWise);
router.put('/update/:id', (0, authentication_middleware_1.default)([enums_1.Roles.User]), cloudUpload.array('receipt', 3), expense_controller_1.update);
router.get('/:id', (0, authentication_middleware_1.default)([enums_1.Roles.User]), expense_controller_1.getById);
router.delete('/:id', (0, authentication_middleware_1.default)([enums_1.Roles.User]), expense_controller_1.remove);
router.post('/create', (0, authentication_middleware_1.default)([enums_1.Roles.User]), cloudUpload.array('receipt', 3), expense_controller_1.create);
exports.default = router;
