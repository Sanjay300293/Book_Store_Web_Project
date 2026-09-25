"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = notFound;
exports.errorHandler = errorHandler;
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const ApiError_js_1 = require("../utils/ApiError.js");
const env_js_1 = require("../config/env.js");
function notFound(_req, _res, next) {
    next(new ApiError_js_1.ApiError(404, 'Route not found.'));
}
function errorHandler(err, _req, res, _next) {
    if (err instanceof ApiError_js_1.ApiError) {
        res.status(err.statusCode).json({ success: false, message: err.message });
        return;
    }
    if (err instanceof multer_1.default.MulterError) {
        const message = err.code === 'LIMIT_FILE_SIZE'
            ? 'Image must be smaller than 5 MB.'
            : 'Upload failed. Please try a different image.';
        res.status(400).json({ success: false, message });
        return;
    }
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        const message = Object.values(err.errors)
            .map((e) => e.message)
            .join(' ');
        res.status(400).json({ success: false, message });
        return;
    }
    if (err instanceof mongoose_1.default.mongo.MongoServerError) {
        if (err.code === 11000) {
            res.status(409).json({ success: false, message: 'This record already exists.' });
            return;
        }
    }
    if (err instanceof mongoose_1.default.Error.CastError) {
        res.status(400).json({ success: false, message: 'Invalid identifier provided.' });
        return;
    }
    console.error('[unhandled error]', err);
    const message = env_js_1.env.nodeEnv === 'production'
        ? 'Something went wrong. Please try again.'
        : err instanceof Error
            ? err.message
            : 'Something went wrong.';
    res.status(500).json({ success: false, message });
}
//# sourceMappingURL=error.js.map