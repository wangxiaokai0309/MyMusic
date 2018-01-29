import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

export function createSong(musicData) {
  // const vKey = res.data.items[0].vkey
  // const t = new Date().getUTCMilliseconds()
  // const guid = (Math.round(2147483647 * Math.random()) * t) % 1e10
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
      musicData.albummid
    }.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    // url: `http://dl.stream.qqmusic.qq.com/${fileName}?vkey=${vKey}&guid=${guid}&uin=0&fromtag=66`,
    // url: `http://dl.stream.qqmusic.qq.com/C400${
    //   musicData.songmid
    // }.m4a?guid=9035189320&vkey=F45CF08E99A296E05513E32A93FB60D08AB5BFC9141579AEE02158FA73B176DB7775B506740ED3940F48B51C15FB40FBB1C20F6DBADE946D&uin=&fromtag=999`
    url: `http://isure.stream.qqmusic.qq.com/C100${
      musicData.songmid
    }.m4a?fromtag=32`
  })
}

export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}
