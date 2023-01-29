import { httpRequestType } from '../interface'
import * as core from 'express-serve-static-core'

export const httpSuccess = (req: core.Request, params = {}) => {
  const defaultProps: httpRequestType<null> = {
    code: 1,
    msg: 'success',
    data: null,
    action: req.originalUrl,
    ok: true,
  }
  return Object.assign(defaultProps, params)
}
