import jsonp from 'common/js/jsonp'
import axios from 'axios'
import { commonParams } from './config'
export function getRecommend(url, data, opts) {
  return jsonp(url, data, opts)
}
export function getMusicList(url, data, opts) {
  return axios.get(url, {
    params: data
  })
}
export function getSongList(url, disstid, opt) {
  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    format: 'jsonp'
  })
  return axios.get(url, {
    params: data
  })
}
