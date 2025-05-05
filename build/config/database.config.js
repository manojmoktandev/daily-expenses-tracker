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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const database_uri = process.env.DB_URI || '';
        yield mongoose_1.default.connect(database_uri, {
            // authSource:'admin',
            dbName: process.env.DB_NAME
            //serverSelectionTimeoutMS: 5000 // Fail fast if no connection
        });
    }
    catch (err) {
        console.error('Database connection failed. Retrying in 5 seconds...', err);
        // setTimeout(connectDB, 5000); // Retry after 5 seconds
    }
});
exports.connectDB = connectDB;
