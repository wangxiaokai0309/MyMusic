<template>
  <transition name="slide">
    <music-list :bgImage="bgImage" :title="title" :songs="songs" :rank="rank" />
  </transition>
</template>
<script>
  import MusicList from 'components/MusicList'
  import { mapGetters } from 'vuex'
  import { getMusicList } from 'api/rank'
  import { ERR_OK } from 'api/config'
  import { getvkey } from "../../api/song"
  import { createSong} from 'common/js/song'
  export default {
    name: 'TopList',
    data () {
      return {
        songs: [],
        rank: true
      }
    },
    created () {
      this._getMusicList()
    },
    computed: {
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return this.topList.picUrl
      },
      ...mapGetters(['topList'])
    },
    methods: {
      _getMusicList () {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then(res => {
          if (res.code === ERR_OK) {
            this._normalizeSongs(res.songlist)
            // console.log(this.songs)
          }
        })
      },
      _normalizeSongs (list) {
        let songmidlist = []
        let songtypelist = []
        let ret = []
        list.forEach(item => {
          let { data } = item
          songmidlist.push(data.songmid)
          songtypelist.push(0)
        })
        getvkey(songmidlist,songtypelist).then((res)=>{
          // console.log(res.url_mid.data.midurlinfo[0].vkey)
          const vkeylist = res.url_mid.data.midurlinfo
          let songlist = [...list]
          songlist.map((item,index)=>{
            item.purl = vkeylist[index].purl
            return item
          })
          songlist.forEach(item =>{
            const { data,purl } = item
            if (data.songid && data.albummid) {
              ret.push(createSong(data,purl))
            }
          })
          // console.log(ret)
          this.songs = ret
        })
      }
    },
    watch: {},
    components: {
      MusicList
    }
  }
</script>
<style lang="less" scoped>
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.5s;
  }
  &.slide-enter,
  &.slide-leave-to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
</style>
