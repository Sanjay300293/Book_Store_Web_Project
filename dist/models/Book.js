"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookModel = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    author: { type: String, required: true, trim: true, maxlength: 120 },
    isbn: { type: String, trim: true, maxlength: 40 },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    coverImage: { type: String, default: '' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ category: 1 });
exports.BookModel = mongoose_1.models.Book ?? (0, mongoose_1.model)('Book', bookSchema);
//# sourceMappingURL=Book.js.map