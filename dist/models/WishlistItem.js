"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistItemModel = void 0;
const mongoose_1 = require("mongoose");
const wishlistItemSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Book', required: true },
}, { timestamps: true });
wishlistItemSchema.index({ user: 1, book: 1 }, { unique: true });
exports.WishlistItemModel = mongoose_1.models.WishlistItem ??
    (0, mongoose_1.model)('WishlistItem', wishlistItemSchema);
//# sourceMappingURL=WishlistItem.js.map