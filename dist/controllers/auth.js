"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.me = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_js_1 = require("../models/User.js");
const jwt_js_1 = require("../utils/jwt.js");
const asyncHandler_js_1 = require("../utils/asyncHandler.js");
const ApiError_js_1 = require("../utils/ApiError.js");
const response_js_1 = require("../utils/response.js");
function toPublicUser(user) {
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
}
exports.register = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await User_js_1.UserModel.findOne({ email });
    if (existing) {
        throw new ApiError_js_1.ApiError(409, 'An account with this email already exists.');
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const user = await User_js_1.UserModel.create({ name, email, passwordHash });
    const token = (0, jwt_js_1.signToken)({ sub: user._id.toString(), role: user.role });
    (0, response_js_1.sendSuccess)(res, { token, user: toPublicUser(user) }, undefined, 201);
});
exports.login = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await User_js_1.UserModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError_js_1.ApiError(401, 'Invalid email or password.');
    }
    const token = (0, jwt_js_1.signToken)({ sub: user._id.toString(), role: user.role });
    (0, response_js_1.sendSuccess)(res, { token, user: toPublicUser(user) });
});
exports.me = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const user = await User_js_1.UserModel.findById(req.user.id);
    if (!user) {
        throw new ApiError_js_1.ApiError(404, 'User not found.');
    }
    (0, response_js_1.sendSuccess)(res, { user: toPublicUser(user) });
});
exports.updateProfile = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { name } = req.body;
    const user = await User_js_1.UserModel.findById(req.user.id);
    if (!user) {
        throw new ApiError_js_1.ApiError(404, 'User not found.');
    }
    if (typeof name === 'string' && name.trim()) {
        user.name = name.trim();
    }
    await user.save();
    (0, response_js_1.sendSuccess)(res, { user: toPublicUser(user) });
});
//# sourceMappingURL=auth.js.map