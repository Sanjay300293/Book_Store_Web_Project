"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
const Order_js_1 = require("../models/Order.js");
const Book_js_1 = require("../models/Book.js");
const User_js_1 = require("../models/User.js");
const Review_js_1 = require("../models/Review.js");
async function getDashboardStats() {
    const [revenueResult, orders, books, customers, lowStock, pendingReviews, topBooks] = await Promise.all([
        Order_js_1.OrderModel.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        Order_js_1.OrderModel.countDocuments(),
        Book_js_1.BookModel.countDocuments(),
        User_js_1.UserModel.countDocuments({ role: 'customer' }),
        Book_js_1.BookModel.countDocuments({ stock: { $lte: 5 } }),
        Review_js_1.ReviewModel.countDocuments({ status: 'pending' }),
        Order_js_1.OrderModel.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.book',
                    title: { $first: '$items.title' },
                    coverImage: { $first: '$items.coverImage' },
                    quantity: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                },
            },
            { $sort: { quantity: -1 } },
            { $limit: 5 },
        ]),
    ]);
    const revenue = Math.round((revenueResult[0]?.total ?? 0) * 100) / 100;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    const monthAgg = await Order_js_1.OrderModel.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'cancelled' } } },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                revenue: { $sum: '$total' },
                orders: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    const monthMap = new Map();
    for (const row of monthAgg) {
        const key = `${row._id.year}-${row._id.month}`;
        monthMap.set(key, {
            revenue: Math.round(row.revenue * 100) / 100,
            orders: row.orders,
        });
    }
    const monthly = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        const data = monthMap.get(key) ?? { revenue: 0, orders: 0 };
        return {
            month: d.toLocaleString('en-US', { month: 'short' }),
            revenue: data.revenue,
            orders: data.orders,
        };
    });
    const recentOrders = await Order_js_1.OrderModel.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('user', 'name email')
        .lean();
    return {
        revenue,
        orders,
        books,
        customers,
        lowStock,
        pendingReviews,
        monthly,
        recentOrders,
        topBooks,
    };
}
//# sourceMappingURL=statsService.js.map