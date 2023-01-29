/*
 * @Descripttion:
 * @version:
 * @Author: zicheng
 * @Date: 2021-11-01 18:02:01
 * @LastEditors: zicheng
 * @LastEditTime: 2021-11-08 16:07:42
 */

export enum ENV {
  test = 'test',
  local = 'local',
  prod = 'prod',
}

export interface Config {
  port: Number
  proxy: httpProxy
  publicPath: string
  appName: string
}

interface Proxy {
  target: string
  changeOrigin?: boolean
  ws?: boolean
  pathRewrite: {
    [key: string]: string
  }
}

export type httpProxy = {
  [key: string]: Proxy
}

export interface httpRequestType<T> {
  action: string
  code: number
  data: T
  msg: string
  ok: boolean
}
