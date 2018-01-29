<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="bgImg" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <p class="title" v-html="currentSong.name"></p>
          <p class="subtitle" v-html="currentSong.singer"></p>
        </div>
        <div class="middle" @touchstart.prevent="touchStart" @touchmove.prevent="touchMove" @touchend.prevent="touchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div ref="cdWrapPlay" class="cd">
                <img ref="imageWrap" class="image" :src="bgImg">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                <p>{{playLyric}}</p>
              </div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}" v-for="(line, index) in currentLyric.lines" :key="line.id">
                  {{line.txt}}
                </p>
              </div>
              <div v-else>
                <p class="text">暂无歌词</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formate(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <process :percent="percent" @percentChange="percentChange"></process>
            </div>
            <span class="time time-r">{{formate(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" @click="prev">
              <i class="icon-prev"></i>
            </div>
            <div @click="togglePlay" class="icon i-center">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="next">
              <i class="icon-next"></i>
            </div>
            <!-- <div class="icon i-right">
							<i class="icon icon-not-favorite"></i>
						</div> -->
          </div>
        </div>
      </div>
    </transition>
    <transition name="min">
      <div @click="open" v-show="!fullScreen" class="mini-player">
        <div class="background">
          <!-- <img :src="bgImg" alt=""> -->
        </div>
        <div class="icon">
          <img :src="bgImg">
        </div>
        <div class="text">
          <p class="name" v-html="currentSong.name"></p>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :percent="percent" :radius="radius">
            <i ref="playMin" @click.stop="togglePlay" :class="playing ? 'icon-pause-mini' : 'icon-play-mini'" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" @timeupdate="updatetime" @error="error" @canplay="ready" @ended="end" :src="url"></audio>
    <play-list ref="playList"></play-list>
  </div>

</template>
<script>
  import { playMode } from 'common/js/config'
  import { mapGetters, mapMutations } from 'vuex'
  import Scroll from 'containers/Scroll'
  import Process from 'containers/Process'
  import ProgressCircle from 'containers/ProgressCircle'
  import animations from 'create-keyframe-animation'
  import { prefixStyle } from 'common/js/dom'
  import { shuffle } from 'common/js/util'
  import Lyric from 'lyric-parser'
  import PlayList from 'components/PlayList'
  let transform = prefixStyle('transform')
  let transitionDuration = prefixStyle('transitionDuration')
  export default {
    name: 'player',
    data () {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playLyric: '暂无歌词',
        radius: 30
      }
    },
    created () {
      this.touch = {}
    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ]),
      bgImg () {
        if (!this.currentSong) {
          return
        }
        return this.currentSong.image
      },
      bgStyle () {
        return `background-image: url(${this.bgImg})`
      },
      url () {
        return this.currentSong.url
      },
      playIcon () {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      percent () {
        if (!this.currentSong) {
          return
        }
        return this.currentTime / this.currentSong.duration
      },
      iconMode () {
        return this.mode === playMode.sequence
          ? 'icon-sequence'
          : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      }
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAY_LIST'
      }),
      showPlayList () {
        this.$refs.playList.show()
      },
      changeMode () {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else if (mode === playMode.sequence) {
          list = this.sequenceList
        } else {
          list = [this.sequenceList[this.currentIndex]]
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },

      back () {
        this.setFullScreen(false)
      },
      open () {
        this.setFullScreen(true)
      },
      togglePlay () {
        this.setPlayState(!this.playing)
        const cTransform = getComputedStyle(this.$refs.cdWrapPlay).transform
        const iTransform = getComputedStyle(this.$refs.imageWrap).transform
        if (!this.playing) {
          this.$refs.cdWrapPlay.style.transform =
            cTransform === 'none'
              ? iTransform
              : iTransform.concat(' ', cTransform)
          this.$refs.imageWrap.classList.remove('play')
        }
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      prev () {
        if (!this.songReady) {
          return
        }
        if (this.mode === playMode.loop) {
          this.loop()
        }
        if (this.playList.length === 1) {
          this.loop()
        }
        let playListLength = this.playList.length
        this.setPlayState(false)
        let index = this.currentIndex - 1
        if (index < 0) {
          index = playListLength - 1
        }
        this.setCurrentIndex(index)
        this.setPlayState(true)
        this.songReady = false
      },
      next () {
        if (!this.songReady) {
          return
        }
        if (this.mode === playMode.loop) {
          this.loop()
        }
        if (this.playList.length === 1) {
          this.loop()
        }
        let playListLength = this.playList.length
        this.setPlayState(false)
        let index = this.currentIndex + 1
        if (index >= playListLength) {
          index = 0
        }
        this.setCurrentIndex(index)
        this.setPlayState(true)
        this.songReady = false
      },
      ready () {
        this.songReady = true
      },
      error () {
        this.songReady = true
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.next()
        }, 1000)
      },
      updatetime (e) {
        this.currentTime = e.target.currentTime
      },
      formate (duration) {
        // 向下取整
        duration = duration | 0
        const minute = this._pad((duration / 60) | 0)
        const second = this._pad(duration % 60)
        return `${minute}:${second}`
      },
      _pad (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      enter (el, done) {
        const { x, y, scale } = this._getPosAndScale()
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter () {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave (el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const { x, y, scale } = this._getPosAndScale()
        this.$refs.cdWrapper.style[
          transform
        ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave () {
        this.$refs.cdWrapper.style[transform] = ''
        this.$refs.cdWrapper.style.transition = ''
      },
      _getPosAndScale () {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      },
      percentChange (percent) {
        this.$refs.audio.currentTime = this.currentSong.duration * percent
        if (this.currentLyric) {
          this.currentLyric.seek(this.currentSong.duration * percent * 1000)
        }
      },
      end () {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      getLyric () {
        this.currentSong
          .getLyric()
          .then(lyric => {
            if (this.currentSong.lyric !== lyric) {
              return
            }
            this.currentLyric = new Lyric(lyric, this.handleLylic)
            if (this.playing) {
              this.currentLyric.play()
            }
          })
          .catch(() => {
            this.currentLyric = null
            this.playingLyric = ''
            this.currentLineNum = 0
          })
      },
      handleLylic ({ lineNum, txt }) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playLyric = txt
      },
      touchStart (e) {
        this.touch.init = true
        this.touch.startX = e.touches[0].pageX
        this.touch.startY = e.touches[0].pageY
      },
      touchMove (e) {
        if (!this.touch.init) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const deltaY = e.touches[0].pageY - this.touch.startY
        if (Math.abs(deltaX) < Math.abs(deltaY)) {
          return
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(
          0,
          Math.max(-window.innerWidth, left + deltaX)
        )
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[
          transform
        ] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `0ms`
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = `0`
      },
      touchEnd () {
        this.touch.init = false
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            this.currentShow = 'lyric'
            opacity = 0
          } else {
            offsetWidth = 0
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[
          transform
        ] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
      }
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
          this.currentTime = 0
          this.playingLyric = ''
          this.currentLineNum = 0
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
      playing (newPlay) {
        this.$nextTick(() => {
          let audio = this.$refs.audio
          newPlay ? audio.play() : audio.pause()
        })
        newPlay ? this.$refs.imageWrap.classList.add('play') : ''
      }
    },
    components: {
      Scroll,
      Process,
      ProgressCircle,
      PlayList
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/const.less';
  .player {
    .normal-player {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 100;
      background: #222;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }
      .top {
        position: relative;
        top: 20px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back {
            display: block;
            padding: 10px;
            font-size: 40px;
            color: #31c27c;
            -webkit-transform: rotate(-90deg);
            transform: rotate(-90deg);
          }
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          -ms-text-overflow: ellipsis;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: @font-size-medium;
          color: #fff;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: @font-size-medium;
          color: #fff;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: @marin-top-size + 40;
        bottom: 350px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          top: 50%;
          transform: translateY(-50%);
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              .play {
                animation: rotate 20s linear infinite;
              }
              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 10px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              line-height: 2.5;
              font-size: @font-size-medium;
              color: @color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 2;
              color: @color-text-l;
              font-size: @font-size-medium;
              &.current {
                color: #31c27c;
              }
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 30px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: @color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: @color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 40px 0;
          .time {
            color: @color-text;
            font-size: @font-size-medium-x;
            flex: 0 0 30px;
            line-height: 30px;
            width: 70px;
            &.time-l {
              text-align: left;
              margin-right: 15px;
            }
            &.time-r {
              text-align: right;
              margin-left: 15px;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          font-size: @font-size-large;
          .icon {
            flex: 1;
            color: #31c27c;
            &.disable {
              color: #31c27c;
            }
            i {
              font-size: @font-size-large;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: @font-size-large;
            }
          }
          .i-right {
            text-align: left;
          }
          .icon-favorite {
            color: @color-sub-theme;
          }
        }
      }
      &.normal-enter-active,
      &.normal-leave-active {
        transition: all 0.4s;
        .top,
        .background,
        .bottom {
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }
      &.normal-enter,
      &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0);
        }
        .background {
          opacity: 0;
        }
      }
    }
    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 50px; /*no*/
      background: #fff;
      background-repeat: no-repeat;
      background-size: cover;
      // .background {
      // 	z-index: -1;
      // 	position: absolute;
      // 	width: 100%;
      // 	height: 60px;
      // 	filter: blur(20px);
      // 	img {
      // 		width: 100%;
      // 	}
      // }
      &.mini-enter-active,
      &.mini-leave-active {
        transition: all 0.4s;
      }
      &.mini-enter,
      &.mini-leave-to {
        opacity: 0;
      }
      .icon {
        width: 30px; /*no*/
        padding: 0 10px 0 20px;
        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
        &.play {
          animation: rotate 10s linear infinite;
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        .name {
          margin-bottom: 2px;
          font-size: 15px; /*no*/
          color: #000;
        }
        .desc {
          font-size: 10px; /*no*/
          color: grey;
        }
      }
      .control {
        width: 30px; /*no*/
        padding: 0 10px;
        position: relative;
        .icon-play-mini,
        .icon-pause-mini,
        .icon-playlist {
          font-size: 30px; /*no*/
          color: #31c27c;
        }
        .icon-mini {
          width: 30px; /*no*/
          height: 30px; /*no*/
          font-size: 30px; /*no*/
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    @keyframes rotate {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
</style>
