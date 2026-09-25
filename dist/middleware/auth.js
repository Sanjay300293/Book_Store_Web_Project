"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = protect;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = require("../models/User.js");
const jwt_js_1 = require("../utils/jwt.js");
const ApiError_js_1 = require("../utils/ApiError.js");
async function protect(req, _res, next) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            throw new ApiError_js_1.ApiError(401, 'Authentication required. Please log in.');
        }
        const token = header.slice(7).trim();
        if (!token) {
            throw new ApiError_js_1.ApiError(401, 'Authentication required. Please log in.');
        }
        const payload = (0, jwt_js_1.verifyToken)(token);
        const user = await User_js_1.UserModel.findById(payload.sub).lean();
        if (!user) {
            throw new ApiError_js_1.ApiError(401, 'User no longer exists.');
        }
        req.user = { id: user._id.toString(), role: user.role, email: user.email };
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError || err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new ApiError_js_1.ApiError(401, 'Your session is invalid or has expired. Please log in again.'));
            return;
        }
        next(err);
    }
}
//# sourceMappingURL=auth.js.map