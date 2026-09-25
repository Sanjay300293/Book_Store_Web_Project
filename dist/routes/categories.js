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
const categoryController = __importStar(require("../controllers/category.js"));
const auth_js_1 = require("../middleware/auth.js");
const requireAdmin_js_1 = require("../middleware/requireAdmin.js");
const validate_js_1 = require("../middleware/validate.js");
const router = (0, express_1.Router)();
router.get('/', categoryController.list);
router.post('/', auth_js_1.protect, requireAdmin_js_1.requireAdmin, (0, validate_js_1.validateBody)([{ field: 'name', required: true, type: 'string', max: 80 }]), categoryController.create);
router.put('/:id', auth_js_1.protect, requireAdmin_js_1.requireAdmin, (0, validate_js_1.validateBody)([{ field: 'name', required: true, type: 'string', max: 80 }]), categoryController.update);
router.delete('/:id', auth_js_1.protect, requireAdmin_js_1.requireAdmin, categoryController.remove);
exports.default = router;
//# sourceMappingURL=categories.js.map