"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDetail = exports.myOrders = exports.checkout = void 0;
const CartItem_js_1 = require("../models/CartItem.js");
const orderService_js_1 = require("../services/orderService.js");
const asyncHandler_js_1 = require("../utils/asyncHandler.js");
const response_js_1 = require("../utils/response.js");
exports.checkout = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const shippingInfo = {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        postalCode: req.body.postalCode,
        phone: req.body.phone ?? '',
    };
    const order = await (0, orderService_js_1.createOrderFromCart)(req.user.id, shippingInfo);
    await CartItem_js_1.CartItemModel.deleteMany({ user: req.user.id });
    (0, response_js_1.sendSuccess)(res, order, undefined, 201);
});
exports.myOrders = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
    const result = await (0, orderService_js_1.listUserOrders)(req.user.id, page, limit);
    (0, response_js_1.sendSuccess)(res, result.orders, { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages });
});
exports.orderDetail = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const order = await (0, orderService_js_1.getUserOrder)(req.user.id, req.params.id);
    (0, response_js_1.sendSuccess)(res, order);
});
//# sourceMappingURL=order.js.map