"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_js_1 = require("./config/env.js");
const index_js_1 = __importDefault(require("./routes/index.js"));
const error_js_1 = require("./middleware/error.js");
const upload_js_1 = require("./middleware/upload.js");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: env_js_1.env.clientUrl,
    credentials: true,
}));
exports.app.use(express_1.default.json({ limit: '1mb' }));
exports.app.use('/uploads', express_1.default.static(upload_js_1.uploadsDir, { maxAge: '7d', immutable: false }));
exports.app.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok', service: 'online-book-store-api' } });
});
exports.app.use('/api/v1', index_js_1.default);
exports.app.use(error_js_1.notFound);
exports.app.use(error_js_1.errorHandler);
//# sourceMappingURL=app.js.map