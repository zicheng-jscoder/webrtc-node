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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Descripttion:
 * @version:
 * @Author: zicheng
 * @Date: 2021-11-01 17:26:58
 * @LastEditors: zicheng
 * @LastEditTime: 2021-11-09 10:17:38
 */
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const temp_1 = require("./config/temp");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const morgan_1 = __importDefault(require("morgan"));
const bodyParser = __importStar(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const webrtc_1 = __importDefault(require("./service/webrtc"));
const app = (0, express_1.default)();
app.all('*', (req, res, next) => {
    let origin = req.headers.origin;
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    // res.header('Content-Type', 'text/html;charset=utf-8')
    next();
});
// 去除express标识
app.set('x-powered-by', false);
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(temp_1.config.publicPath, express_1.default.static(__dirname + `/build`)); // 静态目录
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)(temp_1.config.appName));
const server = https_1.default.createServer({
    key: fs_1.default.readFileSync(path_1.default.join(__dirname, 'ssl/cert.key')),
    cert: fs_1.default.readFileSync(path_1.default.join(__dirname, 'ssl/cert.crt')),
}, app);
// 代理
for (let key in temp_1.config.proxy) {
    const item = temp_1.config.proxy[key];
    let options = Object.assign(Object.assign({}, item), { onProxyReq: function (proxyReq, req, res, target) {
            Object.keys(item.pathRewrite).map((rule) => {
                proxyReq.path = proxyReq.path.replace(rule, item.pathRewrite[rule]);
                console.log('path-------', proxyReq.path, target, proxyReq);
            });
        }, onProxyRes: function (proxyRes, req, res) {
            // 删除跨域名
            delete proxyRes.headers['access-control-allow-credentials'];
            delete proxyRes.headers['access-control-allow-headers'];
            delete proxyRes.headers['access-control-allow-methods'];
            delete proxyRes.headers['access-control-allow-origin'];
            delete proxyRes.headers['access-control-max-age'];
        }, onError: function (err, req, res) {
            console.log(err, req);
            // res.json({ code: '-1', msg: '转发异常', action: req.path, ok: false })
        } });
    let rule = temp_1.config.publicPath + key;
    app.use(rule, (0, http_proxy_middleware_1.createProxyMiddleware)(options));
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const io = new socket_io_1.Server(server, {
    /* options */
    cors: {
        origin: (requestOrigin) => requestOrigin,
        methods: ['GET', 'POST'],
        credentials: true,
    },
    allowEIO3: true,
    //   transports: ['websocket'],
});
new webrtc_1.default(io);
server.listen(temp_1.config.port, () => {
    console.log(`服务启动在${temp_1.config.port}，${new Date()}`);
});
