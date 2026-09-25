"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
const ApiError_js_1 = require("../utils/ApiError.js");
function coerce(value, type) {
    if (type === 'number') {
        if (typeof value === 'string' && value.trim() !== '')
            return Number(value);
        return value;
    }
    if (type === 'boolean') {
        if (typeof value === 'string')
            return value === 'true';
        return value;
    }
    return value;
}
function validateBody(rules) {
    return (req, _res, next) => {
        for (const rule of rules) {
            let value = (req.body ?? {})[rule.field];
            const missing = value === undefined || value === null || value === '';
            if (missing) {
                if (rule.required) {
                    next(new ApiError_js_1.ApiError(400, rule.message ?? `${rule.field} is required.`));
                    return;
                }
                continue;
            }
            value = coerce(value, rule.type ?? 'string');
            if (rule.type === 'number') {
                if (typeof value !== 'number' || Number.isNaN(value)) {
                    next(new ApiError_js_1.ApiError(400, rule.message ?? `${rule.field} must be a number.`));
                    return;
                }
                if (rule.min !== undefined && value < rule.min) {
                    next(new ApiError_js_1.ApiError(400, rule.message ?? `${rule.field} must be at least ${rule.min}.`));
                    return;
                }
                if (rule.max !== undefined && value > rule.max) {
                    next(new ApiError_js_1.ApiError(400, rule.message ?? `${rule.field} must be at most ${rule.max}.`));
                    return;
                }
            }
            else if (typeof value !== 'string') {
                next(new ApiError_js_1.ApiError(400, rule.message ?? `${rule.field} must be a string.`));
                return;
            }
            else {
                if (rule.min !== undefined && value.length < rule.min) {
                    next(new ApiError_js_1.ApiError(400, rule.message ?? `${rule.field} must be at least ${rule.min} characters.`));
                    return;
                }
                if (rule.max !== undefined && value.length > rule.max) {
                    next(new ApiError_js_1.ApiError(400, rule.message ?? `${rule.field} must be at most ${rule.max} characters.`));
                    return;
                }
            }
        }
        next();
    };
}
//# sourceMappingURL=validate.js.map