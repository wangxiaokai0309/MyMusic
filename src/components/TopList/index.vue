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
  import { createSong } from 'common/js/song'
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
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach(item => {
          let { data } = item
          if (data.songid && data.albummid) {
            ret.push(createSong(data))
            // createSong(data).then(res => {
            // ret.push(res)
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
