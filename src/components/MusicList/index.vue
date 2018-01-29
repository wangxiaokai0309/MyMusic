<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h2 class="title">{{title}}</h2>
    <div ref="bgImage" class="bg-image" :class="{'active': topFixed}" :style="bgStyle">
      <div ref="playRef" v-show="!topFixed" class="play-wrapper">
        <div class="play" @click.stop="playSongs">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <loading :show="showLoading" />
    <div class="bg-layer" ref="bgLayer">
    </div>
    <Scroll class="scroll-wrap" ref="Scroll" :listen-scroll="true" :probe-type="3" @scroll="scroll">
      <song-list :songs="songs" :rank="rank" @select="selectItem" />
    </Scroll>
  </div>
</template>
<script>
  import Scroll from 'containers/Scroll'
  import Loading from 'containers/Loading'
  import SongList from 'containers/SongList'
  import { prefixStyle } from 'common/js/dom'
  import { mapActions } from 'vuex'
  import { playlistMixin } from 'common/js/mixin'
  let transform = prefixStyle('transform')
  export default {
    name: 'MusicList',
    mixins: [playlistMixin],
    props: {
      songs: {
        type: Array,
        default () {
          return []
        }
      },
      bgImage: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        scrollY: 0,
        showLoading: true,
        topFixed: false
      }
    },
    computed: {
      bgStyle () {
        return `background-image:url(${this.bgImage})`
      }
    },
    methods: {
      goBack () {
        this.$router.back()
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      playSongs () {
        this.randomPlay({
          list: this.songs
        })
      },
      selectItem (item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      ...mapActions(['selectPlay', 'randomPlay']),
      handlePlayList (playList) {
        const dom = document.getElementsByClassName('mini-player')[0]
        const height = getComputedStyle(dom)['height']
        const bottom = playList.length > 0 ? height : ''
        this.$refs.Scroll.$el.style.bottom = bottom
        this.$refs.Scroll.refresh()
      }
    },
    watch: {
      songs (val) {
        if (val.length) {
          this.$nextTick(() => {
            this.$refs.Scroll.refresh()
            this.showLoading = false
          })
        }
      },
      scrollY (newY) {
        if (newY > 0) {
          this.$refs.bgImage.style[transform] = `scale(${(newY +
            this.imageHeight) /
            this.imageHeight})`
          this.$refs.bgImage.style.zIndex = 101
        } else if (`${(newY + this.imageHeight) / this.imageHeight}` <= 1) {
          this.$refs.bgImage.style.zIndex = 0
        }
        let translateHeight = -newY
        if (translateHeight > this.height) {
          translateHeight = this.height
          this.$refs.bgImage.style.zIndex = 111
          this.topFixed = true
        } else {
          this.topFixed = false
        }

        this.$refs.bgLayer.style[
          transform
        ] = `translate3d(0, ${-translateHeight}px, 0)`
      }
    },
    mounted () {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.height = this.imageHeight * 0.9
      this.$refs.Scroll.$el.style.top = `${this.imageHeight}px`
    },
    components: {
      SongList,
      Scroll,
      Loading
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/const.less';
  .music-list {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f4f4f4;
    .scroll-wrap {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: #f4f4f4;
    }
    .back {
      position: absolute;
      top: 15px;
      left: 6px;
      z-index: 121;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: 40px;
        color: #31c27c;
      }
    }
    .title {
      position: absolute;
      top: 25px;
      left: 10%;
      z-index: 121;
      width: 80%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: center;
      line-height: 40px;
      font-size: @font-size-medium;
      color: #fff;
    }
    .bg-image {
      position: relative;
      height: 0;
      width: 100%;
      padding-top: 70%;
      background-size: cover;
      .play-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;
        .play {
          box-sizing: border-box;
          width: 250px;
          padding: 15px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid #31c27c;
          color: #31c27c;
          border-radius: 100px;
          font-size: 0;
          .icon-play {
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
            font-size: @font-size-medium-x;
          }
          .text {
            display: inline-block;
            vertical-align: middle;
            font-size: @font-size-medium;
          }
        }
      }
      &.active {
        padding-top: 10%;
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    .bg-layer {
      position: relative;
      height: 100%;
      background: #f4f4f4;
    }
  }
</style>
