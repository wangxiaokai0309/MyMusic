<template>
  <div class="slider" ref="slider">
    <div class="slider-group clearfix" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dots-item" v-for="(i, index) in dots" :key="i" :class="{'active': currentIndex === index}">
      </span>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import { addClass } from 'common/js/dom'
  const COMPONENT_NAME = 'slide'
  export default {
    name: COMPONENT_NAME,
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 1000
      },
      showDot: {
        type: Boolean,
        default: true
      },
      click: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        dots: [],
        currentIndex: 0
      }
    },
    mounted () {
      this.update()
      window.addEventListener('resize', () => {
        if (!this.slide || !this.slide.enabled) {
          return
        }
        clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(() => {
          if (this.slide.isInTransition) {
            this._onScrollEnd()
          } else {
            if (this.autoPlay) {
              this._play()
            }
          }
          this.refresh()
        }, 60)
      })
    },
    activated () {
      if (!this.slide) {
        return
      }
      this.slide.enable()
      let pageIndex = this.slide.getCurrentPage().pageX
      this.slide.goToPage(pageIndex, 0, 0)
      this.currentIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated () {
      this.slide.disable()
      clearTimeout(this.timer)
    },
    beforeDestroy () {
      this.slide.disable()
      clearTimeout(this.timer)
    },
    methods: {
      update () {
        if (this.slide) {
          this.slide.destroy()
        }
        this.$nextTick(() => {
          this.init()
        })
      },
      refresh () {
        this._setSlideWidth(true)
        this.slide.refresh()
      },
      next () {
        this.slide.next()
      },
      init () {
        clearTimeout(this.timer)
        this.currentIndex = 0
        this._setSlideWidth()
        if (this.showDot) {
          this._initDots()
        }
        this._initSlide()
        if (this.autoPlay) {
          this._play()
        }
      },
      _setSlideWidth (isResize) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let slideWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slide-item')
          child.style.width = slideWidth + 'px'
          width += slideWidth
        }
        if (this.loop && !isResize) {
          width += 2 * slideWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlide () {
        this.slide = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
          bounce: false,
          click: this.click
        })
        this.slide.on('scrollEnd', this._onScrollEnd)
        this.slide.on('touchend', () => {
          if (this.autoPlay) {
            this._play()
          }
        })
        this.slide.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      _onScrollEnd () {
        let pageIndex = this.slide.getCurrentPage().pageX
        this.currentIndex = pageIndex
        if (this.autoPlay) {
          this._play()
        }
      },
      _initDots () {
        this.dots = new Array(this.children.length)
      },
      _play () {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slide.next()
        }, this.interval)
      }
    }
  }
</script>
<style lang="less" scoped>
  .slider {
    overflow: hidden;
    position: relative;
    .slider-group {
      .pic-list {
        float: left;
        img {
          width: 100%;
        }
      }
    }
    .dots {
      position: absolute;
      bottom: 8px;
      left: 0;
      right: 0;
      text-align: center;
      .dots-item {
        display: inline-block;
        margin: 0 5px;
        border-radius: 4px;
        width: 8px;
        height: 8px;
        background-color: hsla(0, 0%, 100%, 0.5);
        &.active {
          width: 20px;
          background-color: hsla(0, 0%, 100%, 0.8);
        }
      }
    }
  }
</style>
