<template>
  <div class="list-view">
    <scroll ref="scrollWrap" class="scoroll-wrapper" :data="data" :listenScroll="true" :probeType="3" @scroll="scroll">
      <ul class="singer-wrap">
        <ul v-show="i.items.length>0" class="item" v-for="i in data" :key="i.id" ref="scrollItem">
          <h2 class="title">{{i.title}}</h2>
          <li @click="selectItem(j)" class="item-wrap" v-for="j in i.items" :key="j.id">
            <img class="avatar" v-lazy="j.avatar" alt="" />
            <p class="name">{{j.name}}</p>
          </li>
        </ul>
      </ul>
    </scroll>
    <div class="list">
      <ul class="list-wrap">
        <li v-show="i.items.length>0" class="item" :class="{'active': current === index}" @touchmove.stop.prevent="touchMove($event, index)" @touchstart="select($event, index)" v-for="(i, index) in data" :key="i.id">{{i.title.substr(0, 1)}}</li>
      </ul>
    </div>
    <div v-show="scrollNegative" class="current">
      <p class="current-text">{{listArr[current]}}</p>
    </div>
  </div>
</template>
<script>
  import Scroll from 'containers/Scroll'
  const ANCHOOR_HEIGHT = 18
  export default {
    name: 'listView',
    data () {
      return {
        current: 0,
        listArr: [],
        scrollNegative: false
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    created () {
      this.touch = {}
    },
    methods: {
      refresh () {
        this.$refs.scrollWrap.refresh()
      },
      select (e, index) {
        this.current = index
        this.touch.y = e.touches[0].pageY
        this.touch.index = index
        this.$refs.scrollWrap.scrollToElement(this.$refs.scrollItem[index], 0)
      },
      selectItem (item) {
        this.$emit('selectItem', item)
      },
      touchMove (e, index) {
        // 偏移数
        let num = ((e.touches[0].pageY - this.touch.y) / ANCHOOR_HEIGHT) | 0
        let currentIndex = this.touch.index + num
        this.$refs.scrollWrap.scrollToElement(
          this.$refs.scrollItem[currentIndex],
          10
        )
        this.current = currentIndex
      },
      scroll (pos) {
        if (!this.heightArr.length) {
          return
        }
        this.scrollY = -pos.y
        if (this.scrollY < 0) {
          this.scrollNegative = false
        } else {
          this.scrollNegative = true
        }
        this.heightArr.filter((el, index, arr) => {
          if (el <= this.scrollY && this.scrollY <= arr[index + 1]) {
            this.current = index
            return
          }
        })
      },
      calculateHeight () {
        this.heightArr = [0]
        void [].forEach.call(this.$refs.scrollItem, (el, index, arr) => {
          this.heightArr.push(el.clientHeight + this.heightArr[index])
        })
      },
      calculateListArr () {
        this.data.forEach((el, index) => {
          this.listArr.push(el.title)
        })
      }
    },
    components: {
      Scroll
    },
    watch: {
      data () {
        this.$nextTick(() => {
          this.calculateListArr()
          this.$refs.scrollWrap.refresh()
          this.calculateHeight()
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@/common/less/const.less';
  .list-view {
    position: absolute;
    top: 0;
    bottom: 0px;
    right: 0;
    left: 0;
    overflow: hidden;
    .scoroll-wrapper {
      height: 100%;
      .singer-wrap {
        .item {
          padding-bottom: 15px;
          .title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: @font-size-medium;
            background: rgba(255, 255, 255, 0.5);
            color: #333;
          }
          .item-wrap {
            display: flex;
            padding: 20px 0 0 30px;
            align-items: center;
            .avatar {
              width: 100px;
              height: 100px;
              border-radius: 50%;
            }
            .name {
              margin-left: 20px;
              color: #000;
              font-size: @font-size-medium;
            }
          }
        }
      }
    }
    .list {
      position: absolute;
      // z-index: 30;
      top: 50%;
      right: 10px;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      font-family: Helvetica;
      .item {
        width: 100%;
        padding-right: 10px;
        line-height: 1;
        color: #000;
        font-size: @font-size-medium;
        &.active {
          color: #31c27c;
        }
      }
    }
    .current {
      position: absolute;
      top: -1px;
      width: 100%;
      .current-text {
        z-index: 2;
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-medium;
        background: rgba(255, 255, 255, 0.5);
        color: #333;
      }
    }
  }
</style>
