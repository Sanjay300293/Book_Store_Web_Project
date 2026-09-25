"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
exports.env = {
    nodeEnv: required('NODE_ENV', 'development'),
    port: Number(required('PORT', '5000')),
    clientUrl: required('CLIENT_URL', 'http://localhost:5173'),
    mongoUri: required('MONGODB_URI', '').trim(),
    jwtSecret: required('JWT_SECRET', 'dev-only-change-me'),
    jwtExpiresIn: required('JWT_EXPIRES_IN', '7d'),
};
//# sourceMappingURL=env.js.map