"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBooks = listBooks;
exports.getBookById = getBookById;
exports.getFeaturedBooks = getFeaturedBooks;
exports.getNewArrivals = getNewArrivals;
const Book_js_1 = require("../models/Book.js");
const ApiError_js_1 = require("../utils/ApiError.js");
async function listBooks(query) {
    const { search, category, sort = 'newest' } = query;
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(60, Math.max(1, query.limit ?? 12));
    const filter = {};
    if (category) {
        filter.category = category;
    }
    if (search && search.trim()) {
        const term = search.trim();
        filter.$or = [
            { title: { $regex: term, $options: 'i' } },
            { author: { $regex: term, $options: 'i' } },
            { isbn: { $regex: term, $options: 'i' } },
        ];
    }
    const sortMap = {
        newest: { createdAt: -1 },
        'price-asc': { price: 1 },
        'price-desc': { price: -1 },
        rating: { ratingAvg: -1, ratingCount: -1 },
    };
    const total = await Book_js_1.BookModel.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const books = await Book_js_1.BookModel.find(filter)
        .sort(sortMap[sort])
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('category', 'name slug')
        .lean();
    return { books, page, limit, total, totalPages };
}
async function getBookById(id) {
    const book = await Book_js_1.BookModel.findById(id).populate('category', 'name slug').lean();
    if (!book) {
        throw new ApiError_js_1.ApiError(404, 'Book not found.');
    }
    return book;
}
async function getFeaturedBooks(limit = 8) {
    return Book_js_1.BookModel.find()
        .sort({ ratingAvg: -1, ratingCount: -1 })
        .limit(limit)
        .populate('category', 'name slug')
        .lean();
}
async function getNewArrivals(limit = 8) {
    return Book_js_1.BookModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('category', 'name slug')
        .lean();
}
//# sourceMappingURL=bookService.js.map