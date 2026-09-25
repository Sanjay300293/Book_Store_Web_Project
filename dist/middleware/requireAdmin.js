"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
const ApiError_js_1 = require("../utils/ApiError.js");
function requireAdmin(req, _res, next) {
    if (!req.user || req.user.role !== 'admin') {
        next(new ApiError_js_1.ApiError(403, 'Admin access required.'));
        return;
    }
    next();
}
//# sourceMappingURL=requireAdmin.js.map