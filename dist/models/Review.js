"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Book', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000, default: '' },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });
reviewSchema.index({ book: 1, status: 1 });
reviewSchema.index({ user: 1, book: 1 }, { unique: true });
exports.ReviewModel = mongoose_1.models.Review ?? (0, mongoose_1.model)('Review', reviewSchema);
//# sourceMappingURL=Review.js.map