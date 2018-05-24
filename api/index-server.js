import axios from 'axios'
import qs from 'qs'
import md5 from 'md5'
import config from './config-server'
import { parseCookie } from '../utils'

export const api = cookies => {
    return {
        cookies: cookies || {},
        api: axios.create({
            baseURL: config.api,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                cookie: parseCookie(cookies)
            },
            timeout: config.timeout
        }),
        post(url, data = {}) {
            console.log('from server')
            const username = this.cookies.username || ''
            const key = md5(url + JSON.stringify(data) + username)
            if (config.cached && data.cache && config.cached.has(key)) {
                const data = config.cached.get(key)
                console.log('url: ' + url + ' 命中缓存')
                return Promise.resolve(data && data.data)
            }
            return this.api({
                method: 'post',
                url,
                data: qs.stringify(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(res => {
                if (config.cached && data.cache) config.cached.set(key, res)
                console.log('url: ' + url + ' 直接读取')
                return res && res.data
            })
        },
        async get(url, params = {}) {
            console.log('from server')
            const username = this.cookies.username || ''
            const key = md5(url + JSON.stringify(params) + username)
            if (config.cached && params.cache && config.cached.has(key)) {
                const data = config.cached.get(key)
                console.log('url: ' + url + ' 命中缓存')
                return Promise.resolve(data && data.data)
            }
            return this.api({
                method: 'get',
                url,
                params
            }).then(res => {
                if (config.cached && params.cache) config.cached.set(key, res)
                console.log('url: ' + url + ' 直接读取')
                return res && res.data
            })
        }
    }
}
