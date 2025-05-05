"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSON = exports.paginate = void 0;
const paginate_plugin_1 = __importDefault(require("./paginate.plugin"));
exports.paginate = paginate_plugin_1.default;
const toJSON_plugin_1 = __importDefault(require("./toJSON.plugin"));
exports.toJSON = toJSON_plugin_1.default;
