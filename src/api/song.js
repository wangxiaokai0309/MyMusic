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
export function getvkey(songmidlist,songtypelist) {
  const url = '/cgi-bin/musicu.fcg?_=' + (new Date()).getTime()
  const data = {
    comm:{
      g_tk:5381,
      uin:0,
      format:"json",
      inCharset:"utf-8",
      outCharset:"utf-8",
      notice:0,
      platform:"h5",
      needNewCode:1
    },
    url_mid:{
      module:"vkey.GetVkeyServer",
      method:"CgiGetVkey",
      param:{
        guid:"9363756000",
        songmid: songmidlist,
        songtype:songtypelist,
        uin:"0",
        loginflag:0,
        platform:"23"
      }
    }
  }
  return axios.post(url, JSON.stringify(data))
    .then(res => {
      return Promise.resolve(res.data)
    })
}

