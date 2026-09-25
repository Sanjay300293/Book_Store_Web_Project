"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newArrivals = exports.featured = exports.detail = exports.list = void 0;
const asyncHandler_js_1 = require("../utils/asyncHandler.js");
const response_js_1 = require("../utils/response.js");
const bookService_js_1 = require("../services/bookService.js");
const reviewService_js_1 = require("../services/reviewService.js");
exports.list = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { search, category, sort, page, limit } = req.query;
    const result = await (0, bookService_js_1.listBooks)({
        search: typeof search === 'string' ? search : undefined,
        category: typeof category === 'string' ? category : undefined,
        sort: (typeof sort === 'string' ? sort : undefined),
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
    });
    (0, response_js_1.sendSuccess)(res, result.books, { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages });
});
exports.detail = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const book = await (0, bookService_js_1.getBookById)(req.params.id);
    const reviews = await (0, reviewService_js_1.listApprovedByBook)(req.params.id);
    (0, response_js_1.sendSuccess)(res, { book, reviews });
});
exports.featured = (0, asyncHandler_js_1.asyncHandler)(async (_req, res) => {
    const books = await (0, bookService_js_1.getFeaturedBooks)(8);
    (0, response_js_1.sendSuccess)(res, books);
});
exports.newArrivals = (0, asyncHandler_js_1.asyncHandler)(async (_req, res) => {
    const books = await (0, bookService_js_1.getNewArrivals)(8);
    (0, response_js_1.sendSuccess)(res, books);
});
//# sourceMappingURL=book.js.map