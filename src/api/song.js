import axios from 'axios'
import jsonp from 'common/js/jsonp'
export function getLyric(mid) {
  const url = '/api/lyric'
  const data = {
    pcachetime: +new Date(),
    songmid: mid,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  }
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}

export function getKey(mid, filename) {
  const t = new Date().getUTCMilliseconds()
  const guid = (Math.round(2147483647 * Math.random()) * t) % 1e10
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = {
    g_tk: 5381,
    loginUin: 0,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'json',
    cid: 205361747,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    uin: 0,
    songmid: mid,
    filename: filename,
    guid: guid,
    param: 'jsonpCallback'
  }
  return jsonp(url, data)
}
