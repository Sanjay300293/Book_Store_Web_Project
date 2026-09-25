"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_js_1.env.jwtSecret, {
        expiresIn: env_js_1.env.jwtExpiresIn,
    });
}
function verifyToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, env_js_1.env.jwtSecret);
    if (typeof decoded.sub !== 'string' || typeof decoded.role !== 'string') {
        throw new jsonwebtoken_1.default.JsonWebTokenError('Invalid token payload');
    }
    return { sub: decoded.sub, role: decoded.role };
}
//# sourceMappingURL=jwt.js.map