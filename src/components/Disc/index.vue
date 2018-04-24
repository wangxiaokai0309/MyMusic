<template>
  <transition name="slide">
    <music-list :bgImage="bgImage" :title="title" :songs="songs" />
  </transition>
</template>
<script>
  import MusicList from 'components/MusicList'
  import { mapGetters } from 'vuex'
  import { getSongList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import { getvkey } from "../../api/song"
  import { createSong } from 'common/js/song'
  export default {
    data () {
      return {
        songs: []
      }
    },
    created () {
      this._getSongList()
    },
    computed: {
      title () {
        return this.disc.dissname
      },
      bgImage () {
        return this.disc.imgurl
      },
      ...mapGetters(['disc'])
    },
    methods: {
      _getSongList () {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList('api/getDisc', this.disc.dissid, {}).then(res => {
          if (res.data.code === ERR_OK) {
            this._normalizeSongs(res.data.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs (list) {
        let songmidlist = []
        let songtypelist = []
        let ret = []
        list.forEach(item => {
          let data = item
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
            const { purl } = item
            if (item.songid && item.albummid) {
              ret.push(createSong(item,purl))
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
