<template>
  <div class="recommend">
    <scroll ref="scrollWrap" class="scroll-wrapper" :data="songList">
      <div>
        <div class="slider-wrap">
          <slider v-if="picData.length">
            <div class="pic-list" v-for="i in picData" :key="i.id">
              <a :href="i.linkUrl">
                <img @load="loadImage" :src="i.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <div class="list-wrap">
            <h1 class="title">热门歌单推荐</h1>
            <ul class="content" ref="content">
              <li @click="selectItem(i)" class="content-item" v-for="i in songList" :key="i.id">
                <div class="list-pic">
                  <img v-lazy="i.imgurl" alt="">
                </div>
                <div class="list-content">
                  <h2 class="name">{{i.creator.name}}</h2>
                  <p class="dissname">{{i.dissname}}</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="content-loading-wrap">
            <loading :show="!songList.length" />
          </div>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
  import { getRecommend, getMusicList } from 'api/recommend'
  import * as config from 'api/config'
  import Slider from 'containers/Slider'
  import Loading from 'containers/Loading'
  import Scroll from 'containers/Scroll'
  import { playlistMixin } from 'common/js/mixin'
  import { mapMutations } from 'vuex'

  export default {
    name: 'recommend',
    mixins: [playlistMixin],
    data () {
      return {
        picData: [],
        songList: []
      }
    },
    created () {
      this.getRecommendPic()
      this.getRecommendMusicList()
    },
    methods: {
      handlePlayList (playList) {
        const dom = document.getElementsByClassName('mini-player')[0]
        const height = getComputedStyle(dom)['height']
        const bottom = playList.length > 0 ? height : ''
        this.$refs.scrollWrap.$el.style.bottom = bottom
        this.$refs.scrollWrap.refresh()
      },
      getRecommendPic () {
        getRecommend(
          config.recommendUrl,
          config.commonParam,
          config.recommendCptions
        ).then(res => {
          if (res.code === config.ERR_OK) {
            this.picData = res.data.slider
          }
        })
      },
      getRecommendMusicList () {
        getMusicList(config.musicListUrl, config.musicListParam)
          .then(res => {
            if (res.data.code === config.ERR_OK) {
              this.songList = res.data.data.list
            }
          })
          .catch(() => {
            console.log('代理失败，请求假数据')
            setTimeout(() => {
              this.songList = require('../../../static/recommand.json').data.list
            }, 2000)
          })
      },
      loadImage () {
        if (!this.checkLoad) {
          this.checkLoad = true
        } else {
          return
        }
        this.$refs.scrollWrap.refresh()
      },
      selectItem (item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Slider,
      Loading,
      Scroll
    }
  }
</script>
<style lang="less" scoped>
  @import '~@/common/less/const.less';
  .recommend {
    .scroll-wrapper {
      background: #fff;
      position: fixed;
      overflow: hidden;
      top: @marin-top-size;
      left: 0;
      right: 0;
      bottom: 0;
      .recommend-list {
        .list-wrap {
          .title {
            height: 65px;
            line-height: 65px;
            text-align: center;
            font-size: @font-size-medium;
            color: #31c27c;
          }
          .content {
            padding: 0 20px;
            .content-item {
              padding: 0 20px 20px 20px;
              display: flex;
              .list-pic {
                width: 120px;
                padding-right: 50px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              .list-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .name {
                  // line-height: 20px;
                  font-size: 30px;
                  margin-bottom: 30px;
                  color: #000;
                }
                .dissname {
                  // line-height: 20px;
                  font-size: 25px;
                  color: #000;
                }
              }
            }
          }
        }
      }
      .content-loading-wrap {
        margin-top: 20px;
      }
    }
  }
</style>
