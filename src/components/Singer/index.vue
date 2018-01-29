<template>
  <div class="singer">
    <list-view :data="singerList" @selectItem="currentClick" ref="listView" />
    <loading :show="!singerList.length" />
    <router-view></router-view>
  </div>
</template>
<script>
  import { getSingerList } from 'api/singer'
  import * as config from 'api/config'
  import ListView from 'containers/ListView'
  import Loading from 'containers/Loading'
  import { mapMutations } from 'vuex'
  import { playlistMixin } from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_LENGTH = 10
  export default {
    name: 'singer',
    mixins: [playlistMixin],
    data () {
      return {
        singerList: [],
        current: '热门'
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      _getSingerList () {
        getSingerList(
          config.singerListUrl,
          config.singerListParam,
          config.singetListOpts
        ).then(res => {
          if (res.code === config.ERR_OK) {
            this.singerList = this._normalizeSingerData(res.data.list)
          }
        })
      },
      _normalizeSingerData (data) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        data.map((el, index) => {
          if (index < HOT_LENGTH) {
            let singerInfo = {
              id: el.Fsinger_mid,
              name: el.Fsinger_name,
              avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${el.Fsinger_mid}.jpg?max_age=2592000`
            }
            map.hot.items.push(singerInfo)
          }
          let key = el.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          } else {
            let singerInfo = {
              id: el.Fsinger_mid,
              name: el.Fsinger_name,
              avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${el.Fsinger_mid}.jpg?max_age=2592000`
            }
            map[key].items.push(singerInfo)
          }
        })
        let hot = []
        let ret = []
        for (let key in map) {
          if (map[key].title === HOT_NAME) {
            hot.push(map[key])
          } else {
            ret.push(map[key])
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      currentClick (singer) {
        this.setSinger(singer)
        this.$router.push({
          path: `/singer/${singer.id}`
        })
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      handlePlayList (playList) {
        const dom = document.getElementsByClassName('mini-player')[0]
        const height = getComputedStyle(dom)['height']
        const bottom = playList.length > 0 ? height : ''
        this.$refs.listView.$el.style.bottom = bottom
        this.$refs.listView.refresh()
      }
    },
    components: {
      Loading,
      ListView
    }
  }
</script>
<style lang="less" scoped>
  @import '~@/common/less/const.less';
  .singer {
    position: fixed;
    top: @marin-top-size;
    bottom: 0px;
    right: 0;
    left: 0;
  }
</style>
