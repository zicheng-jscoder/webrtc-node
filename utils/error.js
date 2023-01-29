"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpError = void 0;
const httpError = (req, params = {}) => {
    const defaultProps = {
        code: -1,
        msg: '请求错误请稍后重试',
        data: null,
        action: req.originalUrl,
        ok: false,
    };
    return Object.assign(defaultProps, params);
};
exports.httpError = httpError;
