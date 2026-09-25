"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, unique: true, maxlength: 80 },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
}, { timestamps: true });
exports.CategoryModel = mongoose_1.models.Category ?? (0, mongoose_1.model)('Category', categorySchema);
//# sourceMappingURL=Category.js.map