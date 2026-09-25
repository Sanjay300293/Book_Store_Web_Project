"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
function sendSuccess(res, data, meta, statusCode = 200) {
    res.status(statusCode).json({
        success: true,
        data,
        ...(meta ? { meta } : {}),
    });
}
//# sourceMappingURL=response.js.map