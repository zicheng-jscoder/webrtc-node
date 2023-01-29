import { Config } from '../interface'
/*
 * @Descripttion:
 * @version:
 * @Author: zicheng
 * @Date: 2021-11-01 17:44:44
 * @LastEditors: zicheng
 * @LastEditTime: 2021-11-02 11:47:12
 */
// process.env.node_env_type ||
const env = process.env.NODE_ENV || 'local'
console.log()

export const config: Config = require(`../config/${env}`)
