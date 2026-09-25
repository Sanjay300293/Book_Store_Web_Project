"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItem = exports.addItem = exports.getWishlist = void 0;
const WishlistItem_js_1 = require("../models/WishlistItem.js");
const Book_js_1 = require("../models/Book.js");
const asyncHandler_js_1 = require("../utils/asyncHandler.js");
const ApiError_js_1 = require("../utils/ApiError.js");
const response_js_1 = require("../utils/response.js");
exports.getWishlist = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const items = await WishlistItem_js_1.WishlistItemModel.find({ user: req.user.id })
        .populate('book', 'title author price coverImage stock ratingAvg ratingCount')
        .sort({ createdAt: -1 })
        .lean();
    (0, response_js_1.sendSuccess)(res, items);
});
exports.addItem = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { bookId } = req.body;
    const book = await Book_js_1.BookModel.exists({ _id: bookId });
    if (!book) {
        throw new ApiError_js_1.ApiError(404, 'Book not found.');
    }
    const existing = await WishlistItem_js_1.WishlistItemModel.findOne({ user: req.user.id, book: bookId });
    if (existing) {
        (0, response_js_1.sendSuccess)(res, existing);
        return;
    }
    const item = await WishlistItem_js_1.WishlistItemModel.create({ user: req.user.id, book: bookId });
    (0, response_js_1.sendSuccess)(res, item, undefined, 201);
});
exports.removeItem = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const item = await WishlistItem_js_1.WishlistItemModel.findOneAndDelete({
        user: req.user.id,
        book: req.params.bookId,
    });
    if (!item) {
        throw new ApiError_js_1.ApiError(404, 'Wishlist item not found.');
    }
    (0, response_js_1.sendSuccess)(res, { id: req.params.bookId });
});
//# sourceMappingURL=wishlist.js.map