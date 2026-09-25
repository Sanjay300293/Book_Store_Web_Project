"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.list = void 0;
const Category_js_1 = require("../models/Category.js");
const Book_js_1 = require("../models/Book.js");
const asyncHandler_js_1 = require("../utils/asyncHandler.js");
const ApiError_js_1 = require("../utils/ApiError.js");
const response_js_1 = require("../utils/response.js");
const slugify_js_1 = require("../utils/slugify.js");
exports.list = (0, asyncHandler_js_1.asyncHandler)(async (_req, res) => {
    const categories = await Category_js_1.CategoryModel.find().sort({ name: 1 }).lean();
    (0, response_js_1.sendSuccess)(res, categories);
});
exports.create = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { name } = req.body;
    const slug = (0, slugify_js_1.slugify)(name);
    if (!slug) {
        throw new ApiError_js_1.ApiError(400, 'A valid category name is required.');
    }
    const existing = await Category_js_1.CategoryModel.findOne({ slug });
    if (existing) {
        throw new ApiError_js_1.ApiError(409, 'A category with this name already exists.');
    }
    const category = await Category_js_1.CategoryModel.create({ name, slug });
    (0, response_js_1.sendSuccess)(res, category, undefined, 201);
});
exports.update = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { name } = req.body;
    const slug = (0, slugify_js_1.slugify)(name);
    if (!slug) {
        throw new ApiError_js_1.ApiError(400, 'A valid category name is required.');
    }
    const duplicate = await Category_js_1.CategoryModel.findOne({ slug, _id: { $ne: req.params.id } });
    if (duplicate) {
        throw new ApiError_js_1.ApiError(409, 'A category with this name already exists.');
    }
    const category = await Category_js_1.CategoryModel.findByIdAndUpdate(req.params.id, { name, slug }, { new: true });
    if (!category) {
        throw new ApiError_js_1.ApiError(404, 'Category not found.');
    }
    (0, response_js_1.sendSuccess)(res, category);
});
exports.remove = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const booksUsing = await Book_js_1.BookModel.countDocuments({ category: req.params.id });
    if (booksUsing > 0) {
        throw new ApiError_js_1.ApiError(409, 'Cannot delete a category that still has books assigned to it.');
    }
    const category = await Category_js_1.CategoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
        throw new ApiError_js_1.ApiError(404, 'Category not found.');
    }
    (0, response_js_1.sendSuccess)(res, { id: req.params.id });
});
//# sourceMappingURL=category.js.map