"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpSuccess = void 0;
const httpSuccess = (req, params = {}) => {
    const defaultProps = {
        code: 1,
        msg: 'success',
        data: null,
        action: req.originalUrl,
        ok: true,
    };
    return Object.assign(defaultProps, params);
};
exports.httpSuccess = httpSuccess;
