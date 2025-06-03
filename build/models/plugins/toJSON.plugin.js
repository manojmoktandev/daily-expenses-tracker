"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deleteAtPath = (obj, path, index) => {
    if (index === path.length - 1) {
        delete obj[path[index]];
        return;
    }
    if (obj[path[index]]) {
        deleteAtPath(obj[path[index]], path, index + 1);
    }
};
const toJSON = (schema) => {
    var _a;
    // Type assertion for the schema options we need
    const schemaWithOptions = schema;
    let transform;
    if ((_a = schemaWithOptions.options.toJSON) === null || _a === void 0 ? void 0 : _a.transform) {
        transform = schemaWithOptions.options.toJSON.transform;
    }
    schemaWithOptions.options.toJSON = Object.assign(schemaWithOptions.options.toJSON || {}, {
        transform(doc, ret, options) {
            var _a;
            Object.keys(schemaWithOptions.paths).forEach((path) => {
                var _a;
                if ((_a = schemaWithOptions.paths[path].options) === null || _a === void 0 ? void 0 : _a.private) {
                    deleteAtPath(ret, path.split('.'), 0);
                }
            });
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            // delete ret.createdAt;
            //delete ret.updatedAt;
            return (_a = transform === null || transform === void 0 ? void 0 : transform(doc, ret, options)) !== null && _a !== void 0 ? _a : ret;
        },
    });
};
exports.default = toJSON;
