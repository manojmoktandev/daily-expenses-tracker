"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const expense_route_1 = __importDefault(require("./routes/expense.route"));
const database_config_1 = require("./config/database.config");
const error_handler_middleware_1 = __importStar(require("./middlewares/error-handler.middleware"));
const config_1 = require("./config/config");
const http_status_1 = require("http-status");
const app = (0, express_1.default)();
// Update your middleware section to this exact order:
app.use((0, helmet_1.default)());
// CORS configuration
const corsOptions = { origin: '*' };
app.use((0, cors_1.default)(corsOptions));
// Body parsers - CRITICAL ORDER
app.use(express_1.default.json()); // Handle JSON data
app.use(express_1.default.urlencoded({ extended: true })); // Handle form data
// routes
app.get('/', (req, res) => {
    res.send('Server is up and running');
});
app.use('/api/user', user_route_1.default);
app.use('/api/category', category_route_1.default);
app.use('/api/expense', expense_route_1.default);
app.all('/*spalt', (req, res, next) => {
    const message = ` can not ${req.method} on ${req.url}`;
    const error = new error_handler_middleware_1.default(message, http_status_1.status.NOT_FOUND);
    next(error);
});
const PORT = config_1.config.port || 3000;
(0, database_config_1.connectDB)();
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
app.use(error_handler_middleware_1.errorHandler);
