"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadsDir = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const multer_1 = __importDefault(require("multer"));
const ApiError_js_1 = require("../utils/ApiError.js");
exports.uploadsDir = node_path_1.default.resolve(__dirname, '../../uploads');
node_fs_1.default.mkdirSync(exports.uploadsDir, { recursive: true });
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, exports.uploadsDir),
    filename: (_req, file, cb) => {
        const ext = node_path_1.default.extname(file.originalname).toLowerCase() || '.jpg';
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!ALLOWED.has(file.mimetype)) {
            cb(new ApiError_js_1.ApiError(400, 'Only JPEG, PNG, WebP, or GIF images are allowed.'));
            return;
        }
        cb(null, true);
    },
});
//# sourceMappingURL=upload.js.map