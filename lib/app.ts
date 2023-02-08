/*
 * @Descripttion:
 * @version:
 * @Author: zicheng
 * @Date: 2021-11-01 17:26:58
 * @LastEditors: zicheng
 * @LastEditTime: 2021-11-09 10:17:38
 */
import express from 'express'
import path from 'path'
import { config } from './config/temp'
import { createProxyMiddleware, Options } from 'http-proxy-middleware'
import type * as httpType from 'http'
import fs from 'fs'
import https from 'https'
import logger from 'morgan'
import * as bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import ICEServer from './service/webrtc'

const app = express()

app.all('*', (req, res, next) => {
  let origin = req.headers.origin
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', 'true')
  // res.header('Content-Type', 'text/html;charset=utf-8')
  next()
})

// 去除express标识
app.set('x-powered-by', false)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')
app.use(config.publicPath, express.static(__dirname + `/build`)) // 静态目录

app.use(logger('dev'))

app.use(cookieParser(config.appName))
const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, 'ssl/cert.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl/cert.crt')),
  },
  app
)
// 代理
for (let key in config.proxy) {
  const item = config.proxy[key]

  let options: Options = {
    ...item,
    onProxyReq: function (
      proxyReq: httpType.ClientRequest,
      req: httpType.IncomingMessage,
      res: httpType.ServerResponse,
      target: any
    ) {
      Object.keys(item.pathRewrite).map((rule) => {
        proxyReq.path = proxyReq.path.replace(rule, item.pathRewrite[rule])
        console.log('path-------', proxyReq.path, target, proxyReq)
      })
    },
    onProxyRes: function (
      proxyRes: httpType.IncomingMessage,
      req: httpType.IncomingMessage,
      res: httpType.ServerResponse
    ) {
      // 删除跨域名
      delete proxyRes.headers['access-control-allow-credentials']
      delete proxyRes.headers['access-control-allow-headers']
      delete proxyRes.headers['access-control-allow-methods']
      delete proxyRes.headers['access-control-allow-origin']
      delete proxyRes.headers['access-control-max-age']
    },
    onError: function (err, req, res) {
      console.log(err, req)
      // res.json({ code: '-1', msg: '转发异常', action: req.path, ok: false })
    },
  }

  let rule = config.publicPath + key
  app.use(rule, createProxyMiddleware(options))
}

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

const io = new Server(server, {
  /* options */
  cors: {
    origin: (requestOrigin: string | undefined) => requestOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  allowEIO3: true,
  //   transports: ['websocket'],
})

new ICEServer(io)

server.listen(config.port, () => {
  console.log(`服务启动在${config.port}，${new Date()}`)
})
