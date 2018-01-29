<template>
  <transition name="list-fade">
    <div class="play-list" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="scrollRef" :data="sequenceList" class="list-content" :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li :key="item.id" class="item" ref="listRef" v-for="(item, index) in sequenceList" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{ item.name }}</span>
              <span @click.stop="toggleFavoriteCls(item)" class="like">
                <i :class="getFavoriteCls(item)"></i>
              </span>
              <span @click.stop="deleteOne(item)" class="delete">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <!-- <div class="list-operate">
          <div @click="showAddSong" class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div> -->
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirmRef" @confirm="confirm" @cancel="cancel"></confirm>
    </div>
  </transition>
</template>
<script>
  import { playMode } from 'common/js/config'
  import Scroll from 'containers/Scroll'
  import Confirm from 'containers/Confirm'
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { shuffle } from 'common/js/util'
  export default {
    data () {
      return {
        showFlag: false,
        refreshDelay: 100
      }
    },
    methods: {
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayingState: 'SET_PLAYING_STATE',
        setMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAY_LIST'
      }),
      ...mapActions(['deleteSong', 'deleteSongList']),
      toggleFavoriteCls (song) {
        return
      },
      getFavoriteCls (song) {
        return
      },
      _isFavorite (song) {
        let index = this.favoriteList.findIndex(item => {
          return song.id === item.id
        })

        return index > -1
      },
      show () {
        this.showFlag = true
        this.$nextTick(() => {
          this.$refs.scrollRef.refresh()
          this.scrollToCurrent(this.currentSong)
        })
      },
      hide () {
        this.showFlag = false
      },
      getCurrentIcon (item) {
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        }
        return ''
      },
      selectItem (item, index) {
        if (this.mode === 2) {
          index = this.playList.findIndex(song => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
      scrollToCurrent (current) {
        let index = this.sequenceList.findIndex(song => {
          return song.id === current.id
        })
        this.$nextTick(() => {
          this.$refs.scrollRef.scrollToElement(this.$refs.listRef[index], 300)
        })
      },
      deleteOne (item) {
        this.deleteSong(item)
        if (!this.playList.length) {
          this.showFlag = false
        }
      },
      showConfirm () {
        this.$refs.confirmRef.show()
      },
      confirm () {
        this.deleteSongList()
        this.showFlag = false
      },
      cancel () {
        return
      },
      changeMode () {
        let mode = (this.mode + 1) % 3
        this.setMode(mode)
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
        // let newList = null
        // if (mode === 2) {
        //   newList = shuffle(this.sequenceList)
        // } else {
        //   newList = this.sequenceList
        // }
        // let index = newList.findIndex((item) => {
        //   return item.id === this.currentSong.id
        // })
        // this.setCurrentIndex(index)
        // this.setPlayList(newList)
      },
      resetCurrentIndex (list) {
        let index = list.findIndex(item => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      showAddSong () {
        this.$refs.addSongRef.show()
      }
    },
    computed: {
      ...mapGetters([
        'sequenceList',
        'currentSong',
        'mode',
        'playList',
        'currentIndex',
        'favoriteList'
      ]),
      iconMode () {
        let cls = ''
        if (this.mode === 0) {
          cls = 'icon-sequence'
        } else if (this.mode === 1) {
          cls = 'icon-loop'
        } else if (this.mode === 2) {
          cls = 'icon-random'
        } else {
          cls = ''
        }
        return cls
      },
      modeText () {
        let mode = ''
        if (this.mode === 0) {
          mode = '顺序播放'
        } else if (this.mode === 1) {
          mode = '单曲循环'
        } else if (this.mode === 2) {
          mode = '随机播放'
        } else {
          mode = ''
        }
        return mode
      }
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return
        }
        this.scrollToCurrent(newSong)
      }
    },
    components: {
      Scroll,
      Confirm
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/common/less/const.less';
  @import '~@/common/less/mymixin.less';

  .play-list {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
    background-color: @color-background-d;
    &.list-fade-enter-active,
    &.list-fade-leave-active {
      transition: opacity 0.3s;
      .list-wrapper {
        transition: all 0.3s;
      }
    }
    &.list-fade-enter,
    &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: #fff;
      .list-header {
        position: relative;
        padding: 20px 30px 20px 10px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 20px;
            font-size: 40px;
            color: #31c27c;
          }
          .text {
            flex: 1;
            font-size: 30px;
            color: #000;
          }
          .clear {
            font-size: 0;
            .icon-clear {
              font-size: 30px;
              color: #000;
            }
          }
        }
      }
      .list-content {
        max-height: 500px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 70px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          &.list-enter-active,
          &.list-leave-active {
            transition: all 0.1s;
          }
          &.list-enter,
          &.list-leave-to {
            height: 0;
          }
          .current {
            flex: 0 0 40px;
            width: 40px;
            font-size: 30px;
            color: #31c27c;
          }
          .text {
            flex: 1;
            font-size: @font-size-medium;
            color: @color-text-d;
          }
          .like {
            margin-right: 15px;
            font-size: @font-size-small;
            color: @color-theme;
            .icon-favorite {
              color: @color-sub-theme;
            }
          }
          .delete {
            font-size: 30px;
            color: #31c27c;
          }
        }
      }
      .list-operate {
        .add {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px 16px;
          border: 1px solid @color-text-l;
          border-radius: 100px;
          color: #000;
          .icon-add {
            margin-right: 15px;
            font-size: 30px;
          }
          .text {
            font-size: 30px;
          }
        }
      }
      .list-close {
        text-align: center;
        line-height: 3;
        background: @color-background;
        font-size: 30px;
        color: @color-text-l;
      }
    }
  }
</style>
