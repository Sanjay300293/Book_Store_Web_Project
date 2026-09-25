"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeItem = exports.updateQuantity = exports.addItem = exports.getCart = void 0;
const CartItem_js_1 = require("../models/CartItem.js");
const Book_js_1 = require("../models/Book.js");
const asyncHandler_js_1 = require("../utils/asyncHandler.js");
const ApiError_js_1 = require("../utils/ApiError.js");
const response_js_1 = require("../utils/response.js");
exports.getCart = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const items = await CartItem_js_1.CartItemModel.find({ user: req.user.id })
        .populate('book', 'title author price coverImage stock ratingAvg ratingCount')
        .sort({ createdAt: -1 })
        .lean();
    const total = items.reduce((sum, item) => sum + item.quantity * item.book.price, 0);
    (0, response_js_1.sendSuccess)(res, { items, total: Math.round(total * 100) / 100 });
});
exports.addItem = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { bookId, quantity = 1 } = req.body;
    const book = await Book_js_1.BookModel.findById(bookId);
    if (!book) {
        throw new ApiError_js_1.ApiError(404, 'Book not found.');
    }
    const qty = Math.max(1, Number(quantity));
    const existing = await CartItem_js_1.CartItemModel.findOne({ user: req.user.id, book: bookId });
    let item;
    if (existing) {
        const newQty = existing.quantity + qty;
        if (newQty > book.stock) {
            throw new ApiError_js_1.ApiError(409, `Only ${book.stock} copies of "${book.title}" are available.`);
        }
        item = await CartItem_js_1.CartItemModel.findByIdAndUpdate(existing._id, { quantity: newQty }, { new: true });
    }
    else {
        if (qty > book.stock && book.stock !== 0) {
            throw new ApiError_js_1.ApiError(409, `Only ${book.stock} copies of "${book.title}" are available.`);
        }
        item = await CartItem_js_1.CartItemModel.create({ user: req.user.id, book: bookId, quantity: qty });
    }
    (0, response_js_1.sendSuccess)(res, item, undefined, 201);
});
exports.updateQuantity = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { quantity } = req.body;
    const qty = Number(quantity);
    const item = await CartItem_js_1.CartItemModel.findOne({ _id: req.params.id, user: req.user.id })
        .populate('book', 'title stock');
    if (!item) {
        throw new ApiError_js_1.ApiError(404, 'Cart item not found.');
    }
    if (qty > item.book.stock && item.book.stock !== 0) {
        throw new ApiError_js_1.ApiError(409, `Only ${item.book.stock} copies of "${item.book.title}" are available.`);
    }
    item.quantity = qty;
    await item.save();
    (0, response_js_1.sendSuccess)(res, item);
});
exports.removeItem = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const item = await CartItem_js_1.CartItemModel.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
    });
    if (!item) {
        throw new ApiError_js_1.ApiError(404, 'Cart item not found.');
    }
    (0, response_js_1.sendSuccess)(res, { id: req.params.id });
});
exports.clearCart = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    await CartItem_js_1.CartItemModel.deleteMany({ user: req.user.id });
    (0, response_js_1.sendSuccess)(res, { cleared: true });
});
//# sourceMappingURL=cart.js.map