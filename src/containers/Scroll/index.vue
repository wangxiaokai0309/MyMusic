<template>
  <div class="scroll-wrap" ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  export default {
    name: 'Scroll',
    props: {
      click: {
        click: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      probeType: {
        type: Number,
        default: 2
      },
      pullUp: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.$nextTick(() => {
        this._initScroll()
      })
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          click: this.click,
          probeType: this.probeType
        })
        if (this.listenScroll) {
          this.scroll.on('scroll', pos => {
            this.$emit('scroll', pos)
          })
        }
        if (this.pullUp) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= this.scroll.maxScrollY + 50) {
              this.$emit('scrollToEnd')
            }
          })
        }
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data (val) {
        this.$nextTick(() => {
          this.refresh()
        })
        // setTimeout(() => {
        //   this.refresh()
        // }, 1000)
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
