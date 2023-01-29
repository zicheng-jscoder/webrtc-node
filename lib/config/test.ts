/*
 * @Descripttion:
 * @version:
 * @Author: zicheng
 * @Date: 2021-11-01 17:42:59
 * @LastEditors: zicheng
 * @LastEditTime: 2021-11-05 09:55:40
 */

import { Config, ENV } from '../interface'
const publicPath = '/salary'
const config: Config = {
  appName: 'web-site',
  publicPath,
  port: 3088,
  proxy: {
    '/api': {
      target: 'http://192.168.1.26:8080',
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        [`${publicPath}/api`]: '/salary',
      },
    },
    '/humres': {
      target: 'http://whr-test.intra.wangxiaobao.com',
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        [`${publicPath}/humres`]: '/humres',
      },
    },
  },
}

module.exports = config
