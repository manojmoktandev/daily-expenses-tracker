"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const category_controller_1 = require("../controllers/category.controller");
const enums_1 = require("../types/enums");
const authentication_middleware_1 = __importDefault(require("../middlewares/authentication.middleware"));
router.get('/getall', (0, authentication_middleware_1.default)([enums_1.Roles.Admin]), category_controller_1.getAllCategories);
router.get('/getall/user', (0, authentication_middleware_1.default)([enums_1.Roles.User]), category_controller_1.getAllUserWise);
router.post('/create', (0, authentication_middleware_1.default)([enums_1.Roles.User]), category_controller_1.create);
router.put('/update/:id', (0, authentication_middleware_1.default)([enums_1.Roles.User]), category_controller_1.update);
router.get('/:id', (0, authentication_middleware_1.default)([enums_1.Roles.User]), category_controller_1.getById);
router.delete('/:id', (0, authentication_middleware_1.default)([enums_1.Roles.User]), category_controller_1.remove);
exports.default = router;
