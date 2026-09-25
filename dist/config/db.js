"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_js_1 = require("./env.js");
if (!env_js_1.env.mongoUri) {
    throw new Error('MONGODB_URI is not set. Copy server/.env.example to server/.env and set your MongoDB Atlas connection string.');
}
async function connectDB() {
    mongoose_1.default.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });
    await mongoose_1.default.connect(env_js_1.env.mongoUri);
    console.log('MongoDB connected');
}
async function disconnectDB() {
    await mongoose_1.default.disconnect();
    console.log('MongoDB disconnected');
}
//# sourceMappingURL=db.js.map