"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mine = exports.byBook = exports.create = void 0;
const reviewService_js_1 = require("../services/reviewService.js");
const asyncHandler_js_1 = require("../utils/asyncHandler.js");
const response_js_1 = require("../utils/response.js");
exports.create = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const review = await (0, reviewService_js_1.createReview)(req.user.id, req.params.bookId, {
        rating: req.body.rating,
        comment: req.body.comment,
    });
    (0, response_js_1.sendSuccess)(res, review, undefined, 201);
});
exports.byBook = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const reviews = await (0, reviewService_js_1.listApprovedByBook)(req.params.bookId);
    (0, response_js_1.sendSuccess)(res, reviews);
});
exports.mine = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const reviews = await (0, reviewService_js_1.listMine)(req.user.id);
    (0, response_js_1.sendSuccess)(res, reviews);
});
//# sourceMappingURL=review.js.map