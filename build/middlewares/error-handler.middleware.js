"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_1 = require("http-status");
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= http_status_1.status.BAD_REQUEST && statusCode < http_status_1.status.INTERNAL_SERVER_ERROR ? 'fail' : 'error';
        this.success = false;
        this.isOperation = true;
        Error.captureStackTrace(this, ApiError);
    }
}
const errorHandler = (err, req, res, next) => {
    var _a;
    const success = err.success || false;
    const statusCode = err.statusCode || http_status_1.status.INTERNAL_SERVER_ERROR;
    const status = err.status || 'error';
    let message = (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : 'something went wrong';
    let error = Object.assign({}, err);
    if (err.name === "ValidationError") {
        message = Object.values(err.errors).map((value) => value.message);
    }
    res.status(statusCode).json({
        success,
        status,
        message
    });
};
exports.errorHandler = errorHandler;
exports.default = ApiError;
