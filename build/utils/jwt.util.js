"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const jwtSecret = (_a = config_1.config.jwt.secret) !== null && _a !== void 0 ? _a : '';
const jwtExpires = config_1.config.jwt.accessExpirationMinutes;
const generateJwtToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: jwtExpires });
};
exports.generateJwtToken = generateJwtToken;
const verifyJwtToken = (token) => {
    return jsonwebtoken_1.default.verify(token, jwtSecret);
};
exports.verifyJwtToken = verifyJwtToken;
