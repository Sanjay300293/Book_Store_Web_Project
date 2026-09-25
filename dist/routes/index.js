"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_js_1 = __importDefault(require("./auth.js"));
const books_js_1 = __importDefault(require("./books.js"));
const categories_js_1 = __importDefault(require("./categories.js"));
const cart_js_1 = __importDefault(require("./cart.js"));
const wishlist_js_1 = __importDefault(require("./wishlist.js"));
const reviews_js_1 = __importDefault(require("./reviews.js"));
const orders_js_1 = __importDefault(require("./orders.js"));
const admin_js_1 = __importDefault(require("./admin.js"));
const router = (0, express_1.Router)();
router.use('/auth', auth_js_1.default);
router.use('/books', books_js_1.default);
router.use('/categories', categories_js_1.default);
router.use('/cart', cart_js_1.default);
router.use('/wishlist', wishlist_js_1.default);
router.use('/reviews', reviews_js_1.default);
router.use('/orders', orders_js_1.default);
router.use('/admin', admin_js_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map