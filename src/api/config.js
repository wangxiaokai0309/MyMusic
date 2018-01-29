export const recommendUrl =
  'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
export const commonParam = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}
export const recommendCptions = {
  param: 'jsonpCallback'
}

export const musicListUrl = '/api/getMusicList'
export const musicListParam = {
  rnd: Math.random(),
  g_tk: 1928093487,
  format: 'json',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  hostUin: 0,
  platform: 'yqq',
  needNewCode: 0,
  categoryId: 10000000,
  sortId: 5,
  sin: 0,
  ein: 30
}

export const singerListUrl = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
export const singerListParam = {
  channel: 'singer',
  page: 'list',
  key: 'all_all_all',
  pagesize: 100,
  pagenum: 1,
  g_tk: 5381,
  jsonpCallback: '',
  loginUin: 0,
  hostUin: 0,
  format: 'jsonp',
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  platform: 'yqq',
  needNewCode: 0
}
export const singetListOpts = {
  param: 'jsonpCallback',
  prefix: 'GetSingerListCallback'
}

export const singerDetailUrl =
  'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
export const singerDetailParam = {
  g_tk: 5381,
  loginUin: 0,
  hostUin: 0,
  format: 'jsonp',
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  platform: 'yqq',
  needNewCode: 0,
  order: 'listen',
  begin: 0,
  num: 30,
  songstatus: 1
}

export const singetDetailOpts = {
  param: 'jsonpCallback',
  prefix: 'MusicJsonCallbacksinger_track'
}

export const commonParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}
export const options = {
  param: 'jsonpCallback'
}
export const ERR_OK = 0
