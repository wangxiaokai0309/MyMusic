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
            this.songs = this._normalizeSongs(res.data.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach(musicData => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
            // createSong(musicData).then(res => {
            //   ret.push(res)
            // })
          }
        })
        return ret
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
