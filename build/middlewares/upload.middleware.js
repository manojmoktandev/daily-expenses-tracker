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
exports.cloudinaryUploader = exports.uploader = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_util_1 = __importDefault(require("../utils/cloudinary.util"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const uploader = (folderName) => {
    const destination = `./uploads/${folderName}`;
    if (!fs_1.default.existsSync(destination)) {
        fs_1.default.mkdirSync(`./uploads/${folderName}`);
    }
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destination);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '_' + uniqueSuffix + '_' + file.originalname);
        }
    });
    return (0, multer_1.default)({ storage });
};
exports.uploader = uploader;
const cloudinaryUploader = () => {
    const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_util_1.default,
        params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
            return {
                folder: 'expenses/receipts',
                allowed_formats: ['png', 'jpg', 'webp', 'pdf']
            };
        })
    });
    return (0, multer_1.default)({ storage });
};
exports.cloudinaryUploader = cloudinaryUploader;
