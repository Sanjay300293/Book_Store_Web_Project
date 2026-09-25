"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderFromCart = createOrderFromCart;
exports.listUserOrders = listUserOrders;
exports.getUserOrder = getUserOrder;
exports.listAllOrders = listAllOrders;
exports.updateOrderStatus = updateOrderStatus;
const Order_js_1 = require("../models/Order.js");
const Book_js_1 = require("../models/Book.js");
const CartItem_js_1 = require("../models/CartItem.js");
const ApiError_js_1 = require("../utils/ApiError.js");
async function nextOrderNumber() {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dayPrefix = `${y}${m}${d}`;
    const count = await Order_js_1.OrderModel.countDocuments();
    return `OBS-${dayPrefix}-${String(count + 1).padStart(4, '0')}`;
}
async function createOrderFromCart(userId, shippingInfo) {
    const cartItems = await CartItem_js_1.CartItemModel.find({ user: userId })
        .populate('book')
        .lean();
    if (cartItems.length === 0) {
        throw new ApiError_js_1.ApiError(400, 'Your cart is empty.');
    }
    const booksToUpdate = new Map();
    const items = [];
    for (const item of cartItems) {
        const book = item.book;
        if (book.stock < item.quantity) {
            throw new ApiError_js_1.ApiError(409, `"${book.title}" only has ${book.stock} in stock. Please adjust your cart.`);
        }
        booksToUpdate.set(book._id.toString(), book);
        items.push({
            book: book._id,
            title: book.title,
            author: book.author,
            price: book.price,
            quantity: item.quantity,
            coverImage: book.coverImage,
        });
    }
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const roundedTotal = Math.round(total * 100) / 100;
    const orderNumber = await nextOrderNumber();
    const order = await Order_js_1.OrderModel.create({
        orderNumber,
        user: userId,
        items,
        total: roundedTotal,
        status: 'pending',
        shippingInfo,
    });
    for (const bookId of booksToUpdate.keys()) {
        const purchasedQty = cartItems.find((item) => item.book._id.toString() === bookId)?.quantity ?? 0;
        await Book_js_1.BookModel.updateOne({ _id: bookId }, { $inc: { stock: -purchasedQty } });
    }
    return order.toObject();
}
async function listUserOrders(userId, page = 1, limit = 10) {
    const total = await Order_js_1.OrderModel.countDocuments({ user: userId });
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const orders = await Order_js_1.OrderModel.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    return { orders, page, limit, total, totalPages };
}
async function getUserOrder(userId, orderId) {
    const order = await Order_js_1.OrderModel.findOne({ _id: orderId, user: userId }).lean();
    if (!order) {
        throw new ApiError_js_1.ApiError(404, 'Order not found.');
    }
    return order;
}
async function listAllOrders(query) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 20));
    const filter = {};
    if (query.status)
        filter.status = query.status;
    if (query.search && query.search.trim()) {
        filter.orderNumber = { $regex: query.search.trim(), $options: 'i' };
    }
    const total = await Order_js_1.OrderModel.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const orders = await Order_js_1.OrderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', 'name email')
        .lean();
    return { orders, page, limit, total, totalPages };
}
async function updateOrderStatus(orderId, status) {
    const order = await Order_js_1.OrderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        .populate('user', 'name email')
        .lean();
    if (!order) {
        throw new ApiError_js_1.ApiError(404, 'Order not found.');
    }
    return order;
}
//# sourceMappingURL=orderService.js.map