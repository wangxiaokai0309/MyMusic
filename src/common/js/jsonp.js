import _jsonp from 'jsonp'
export default function jsonp(url, data, opts) {
  url = url.indexOf('?') !== -1 ? url : url + '?' + param(data)
  return new Promise((resolve, reject) => {
    _jsonp(url, opts, (error, data) => {
      if (!error) {
        resolve(data)
      } else {
        reject(error)
      }
    })
  })
}
function param(data) {
  if (!data) return ''
  let url = ''
  for (let k in data) {
    url += `&${k}=${data[k]}`
  }
  return url.substring(1)
}
