"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = createReview;
exports.listApprovedByBook = listApprovedByBook;
exports.listMine = listMine;
exports.listAll = listAll;
exports.setReviewStatus = setReviewStatus;
exports.deleteReview = deleteReview;
exports.recomputeBookRating = recomputeBookRating;
const Review_js_1 = require("../models/Review.js");
const Book_js_1 = require("../models/Book.js");
const ApiError_js_1 = require("../utils/ApiError.js");
async function createReview(userId, bookId, input) {
    const book = await Book_js_1.BookModel.findById(bookId);
    if (!book) {
        throw new ApiError_js_1.ApiError(404, 'Book not found.');
    }
    const existing = await Review_js_1.ReviewModel.findOne({ user: userId, book: bookId });
    if (existing) {
        throw new ApiError_js_1.ApiError(409, 'You have already reviewed this book.');
    }
    const review = await Review_js_1.ReviewModel.create({
        user: userId,
        book: bookId,
        rating: input.rating,
        comment: input.comment?.trim() ?? '',
        status: 'pending',
    });
    return review.toObject();
}
async function listApprovedByBook(bookId) {
    return Review_js_1.ReviewModel.find({ book: bookId, status: 'approved' })
        .sort({ createdAt: -1 })
        .populate('user', 'name')
        .lean();
}
async function listMine(userId) {
    return Review_js_1.ReviewModel.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('book', 'title coverImage author')
        .lean();
}
async function listAll(status) {
    const filter = status ? { status } : {};
    return Review_js_1.ReviewModel.find(filter)
        .sort({ createdAt: -1 })
        .populate('user', 'name email')
        .populate('book', 'title coverImage author')
        .lean();
}
async function setReviewStatus(reviewId, status) {
    const review = await Review_js_1.ReviewModel.findByIdAndUpdate(reviewId, { status }, { new: true });
    if (!review) {
        throw new ApiError_js_1.ApiError(404, 'Review not found.');
    }
    await recomputeBookRating(review.book.toString());
}
async function deleteReview(reviewId) {
    const review = await Review_js_1.ReviewModel.findByIdAndDelete(reviewId);
    if (!review) {
        throw new ApiError_js_1.ApiError(404, 'Review not found.');
    }
    await recomputeBookRating(review.book.toString());
}
async function recomputeBookRating(bookId) {
    const [result] = await Review_js_1.ReviewModel.aggregate([
        { $match: { book: bookId, status: 'approved' } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const avg = result ? Math.round(result.avg * 10) / 10 : 0;
    const count = result ? result.count : 0;
    await Book_js_1.BookModel.updateOne({ _id: bookId }, { $set: { ratingAvg: avg, ratingCount: count } });
}
//# sourceMappingURL=reviewService.js.map