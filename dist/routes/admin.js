"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController = __importStar(require("../controllers/admin.js"));
const auth_js_1 = require("../middleware/auth.js");
const requireAdmin_js_1 = require("../middleware/requireAdmin.js");
const validate_js_1 = require("../middleware/validate.js");
const upload_js_1 = require("../middleware/upload.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.protect, requireAdmin_js_1.requireAdmin);
router.get('/stats', adminController.dashboard);
router.post('/uploads', upload_js_1.upload.single('file'), adminController.uploadImage);
router.get('/books', adminController.listBooks);
router.get('/books/:id', adminController.getBook);
router.post('/books', (0, validate_js_1.validateBody)([
    { field: 'title', required: true, type: 'string', min: 1, max: 200 },
    { field: 'author', required: true, type: 'string', min: 1, max: 120 },
    { field: 'category', required: true, type: 'string' },
    { field: 'price', required: true, type: 'number', min: 0 },
    { field: 'stock', type: 'number', min: 0 },
    { field: 'isbn', type: 'string', max: 40 },
    { field: 'description', type: 'string', max: 3000 },
    { field: 'coverImage', type: 'string', max: 500 },
]), adminController.createBook);
router.put('/books/:id', (0, validate_js_1.validateBody)([
    { field: 'title', type: 'string', min: 1, max: 200 },
    { field: 'author', type: 'string', min: 1, max: 120 },
    { field: 'category', type: 'string' },
    { field: 'price', type: 'number', min: 0 },
    { field: 'stock', type: 'number', min: 0 },
    { field: 'isbn', type: 'string', max: 40 },
    { field: 'description', type: 'string', max: 3000 },
    { field: 'coverImage', type: 'string', max: 500 },
]), adminController.updateBook);
router.patch('/books/:id/stock', (0, validate_js_1.validateBody)([{ field: 'stock', required: true, type: 'number', min: 0 }]), adminController.updateStock);
router.delete('/books/:id', adminController.deleteBook);
router.get('/orders', adminController.orders);
router.patch('/orders/:id/status', (0, validate_js_1.validateBody)([{ field: 'status', required: true, type: 'string' }]), adminController.setOrderStatus);
router.get('/customers', adminController.customers);
router.get('/reviews', adminController.reviews);
router.patch('/reviews/:id', (0, validate_js_1.validateBody)([{ field: 'status', required: true, type: 'string' }]), adminController.moderateReview);
router.delete('/reviews/:id', adminController.badReviews);
exports.default = router;
//# sourceMappingURL=admin.js.map