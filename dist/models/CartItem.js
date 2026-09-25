"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemModel = void 0;
const mongoose_1 = require("mongoose");
const cartItemSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
}, { timestamps: true });
cartItemSchema.index({ user: 1, book: 1 }, { unique: true });
exports.CartItemModel = mongoose_1.models.CartItem ?? (0, mongoose_1.model)('CartItem', cartItemSchema);
//# sourceMappingURL=CartItem.js.map