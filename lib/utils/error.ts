import { httpRequestType } from '../interface'
import * as core from 'express-serve-static-core'

export const httpError = (req: core.Request, params = {}) => {
  const defaultProps: httpRequestType<null> = {
    code: -1,
    msg: '请求错误请稍后重试',
    data: null,
    action: req.originalUrl,
    ok: false,
  }
  return Object.assign(defaultProps, params)
}
