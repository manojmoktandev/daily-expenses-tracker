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
exports.Authentication = void 0;
const enums_1 = require("../types/enums");
const error_handler_middleware_1 = __importDefault(require("./error-handler.middleware"));
const http_status_1 = require("http-status");
const jwt_util_1 = require("../utils/jwt.util");
const user_model_1 = __importDefault(require("../models/user.model"));
const Authentication = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // get authorization header
            const auth_header = req.headers['authorization'];
            if (!auth_header) {
                throw new error_handler_middleware_1.default('Authorization header is missing', http_status_1.status.UNAUTHORIZED);
            }
            if (!auth_header.startsWith('Bearer')) {
                console.log('dadadda');
                throw new error_handler_middleware_1.default('Unauthorized access denied', http_status_1.status.UNAUTHORIZED);
            }
            const token = auth_header.split(" ")[1];
            if (!token) {
                throw new error_handler_middleware_1.default('Unauthorized access denied', http_status_1.status.UNAUTHORIZED);
            }
            const payload = (0, jwt_util_1.verifyJwtToken)(token);
            //expiry of token
            if ((payload === null || payload === void 0 ? void 0 : payload.exp) && payload.exp * 1000 < Date.now()) {
                throw new error_handler_middleware_1.default('Access token is expired', http_status_1.status.BAD_REQUEST);
            }
            // search user from payload
            const user = yield user_model_1.default.findById(payload._id);
            if (!user) {
                console.log('ass');
                throw new error_handler_middleware_1.default('Unauthorized, access denied', http_status_1.status.UNAUTHORIZED);
            }
            if (roles && !roles.includes(enums_1.Roles['Admin'])) {
                if (roles && !roles.includes(user.role)) {
                    throw new error_handler_middleware_1.default('Forbidden, access denied', http_status_1.status.FORBIDDEN);
                }
            }
            const { _id, email, fullname, username, role } = payload;
            req.user = { _id, email, fullname, username, role };
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.Authentication = Authentication;
exports.default = exports.Authentication;
