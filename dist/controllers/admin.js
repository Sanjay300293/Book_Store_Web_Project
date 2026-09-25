"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badReviews = exports.moderateReview = exports.reviews = exports.customers = exports.setOrderStatus = exports.orders = exports.uploadImage = exports.deleteBook = exports.updateStock = exports.updateBook = exports.createBook = exports.getBook = exports.listBooks = exports.dashboard = void 0;
const Book_js_1 = require("../models/Book.js");
const User_js_1 = require("../models/User.js");
const Order_js_1 = require("../models/Order.js");
const ApiError_js_1 = require("../utils/ApiError.js");
const asyncHandler_js_1 = require("../utils/asyncHandler.js");
const response_js_1 = require("../utils/response.js");
const statsService_js_1 = require("../services/statsService.js");
const reviewService_js_1 = require("../services/reviewService.js");
const orderService_js_1 = require("../services/orderService.js");
exports.dashboard = (0, asyncHandler_js_1.asyncHandler)(async (_req, res) => {
    const stats = await (0, statsService_js_1.getDashboardStats)();
    (0, response_js_1.sendSuccess)(res, stats);
});
/* ------------------------------- Books ------------------------------- */
exports.listBooks = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { search, category, lowStock, page, limit } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
    const filter = {};
    if (typeof category === 'string' && category)
        filter.category = category;
    if (lowStock === 'true')
        filter.stock = { $lte: 5 };
    if (typeof search === 'string' && search.trim()) {
        filter.$or = [
            { title: { $regex: search.trim(), $options: 'i' } },
            { author: { $regex: search.trim(), $options: 'i' } },
            { isbn: { $regex: search.trim(), $options: 'i' } },
        ];
    }
    const total = await Book_js_1.BookModel.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limitNum));
    const books = await Book_js_1.BookModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('category', 'name slug')
        .lean();
    (0, response_js_1.sendSuccess)(res, books, { page: pageNum, limit: limitNum, total, totalPages });
});
exports.getBook = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const book = await Book_js_1.BookModel.findById(req.params.id).populate('category', 'name slug').lean();
    if (!book) {
        throw new ApiError_js_1.ApiError(404, 'Book not found.');
    }
    (0, response_js_1.sendSuccess)(res, book);
});
exports.createBook = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const book = await Book_js_1.BookModel.create({
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn ?? '',
        description: req.body.description ?? '',
        price: req.body.price,
        coverImage: req.body.coverImage ?? '',
        stock: req.body.stock ?? 0,
        category: req.body.category,
    });
    (0, response_js_1.sendSuccess)(res, book, undefined, 201);
});
exports.updateBook = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const book = await Book_js_1.BookModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!book) {
        throw new ApiError_js_1.ApiError(404, 'Book not found.');
    }
    (0, response_js_1.sendSuccess)(res, book);
});
exports.updateStock = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const book = await Book_js_1.BookModel.findByIdAndUpdate(req.params.id, { stock: req.body.stock }, { new: true, runValidators: true });
    if (!book) {
        throw new ApiError_js_1.ApiError(404, 'Book not found.');
    }
    (0, response_js_1.sendSuccess)(res, book);
});
exports.deleteBook = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const book = await Book_js_1.BookModel.findByIdAndDelete(req.params.id);
    if (!book) {
        throw new ApiError_js_1.ApiError(404, 'Book not found.');
    }
    (0, response_js_1.sendSuccess)(res, { id: req.params.id });
});
exports.uploadImage = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const file = req.file;
    if (!file) {
        throw new ApiError_js_1.ApiError(400, 'No image file provided.');
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    (0, response_js_1.sendSuccess)(res, { url: `${baseUrl}/uploads/${file.filename}` }, undefined, 201);
});
/* ------------------------------- Orders ------------------------------ */
exports.orders = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { status, search, page, limit } = req.query;
    const result = await (0, orderService_js_1.listAllOrders)({
        status: (typeof status === 'string' ? status : undefined),
        search: typeof search === 'string' ? search : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
    });
    (0, response_js_1.sendSuccess)(res, result.orders, { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages });
});
exports.setOrderStatus = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const order = await (0, orderService_js_1.updateOrderStatus)(req.params.id, req.body.status);
    (0, response_js_1.sendSuccess)(res, order);
});
/* ------------------------------ Customers ---------------------------- */
exports.customers = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { search, page, limit } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
    const filter = { role: 'customer' };
    if (typeof search === 'string' && search.trim()) {
        const term = search.trim();
        filter.$or = [
            { name: { $regex: term, $options: 'i' } },
            { email: { $regex: term, $options: 'i' } },
        ];
    }
    const total = await User_js_1.UserModel.countDocuments(filter);
    const users = await User_js_1.UserModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .select('-passwordHash')
        .lean();
    const stats = await Order_js_1.OrderModel.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        {
            $group: {
                _id: { $toString: '$user' },
                orders: { $sum: 1 },
                spent: { $sum: '$total' },
            },
        },
    ]);
    const statsMap = new Map(stats.map((s) => [s._id, s]));
    const data = users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        orders: statsMap.get(u._id.toString())?.orders ?? 0,
        spent: statsMap.get(u._id.toString())?.spent ?? 0,
    }));
    (0, response_js_1.sendSuccess)(res, data, {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
    });
});
/* ------------------------------- Reviews ----------------------------- */
exports.reviews = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { status } = req.query;
    const reviews = await (0, reviewService_js_1.listAll)((typeof status === 'string' && ['pending', 'approved', 'rejected'].includes(status)
        ? status
        : undefined));
    (0, response_js_1.sendSuccess)(res, reviews);
});
exports.moderateReview = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
        throw new ApiError_js_1.ApiError(400, 'Invalid review status.');
    }
    await (0, reviewService_js_1.setReviewStatus)(req.params.id, status);
    (0, response_js_1.sendSuccess)(res, { id: req.params.id, status });
});
exports.badReviews = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    await (0, reviewService_js_1.deleteReview)(req.params.id);
    (0, response_js_1.sendSuccess)(res, { id: req.params.id });
});
//# sourceMappingURL=admin.js.map