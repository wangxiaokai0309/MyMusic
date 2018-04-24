<template>
  <Scroll :data="result" class="suggest-wrap" ref="scrollWrap" :pullUp="pullUp" @scrollToEnd="searchMoreData" :beforeScroll="beforeScroll" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result" :key="item.id">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <!-- <li class="result" v-show="!result.length">无结果</li> -->
      <Loading :show="loadMore" :title="`加载更多`" />
    </ul>
  </Scroll>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { search } from 'api/search'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'
  import Singer from 'common/js/singer'
  import Scroll from 'containers/Scroll'
  import { playlistMixin } from 'common/js/mixin'
  import Loading from 'containers/Loading'
  import { getvkey } from "../../api/song"
  const TYPE_SINGER = 'singer'

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        page: 1,
        perpage: 20,
        result: [],
        pullUp: true,
        loadMore: true,
        loadEnd: true,
        beforeScroll: true,
        songs: []
      }
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      query (val) {
        this.resetQuery()
        !val ? '' : this.search()
      }
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions(['insertSong']),
      search () {
        search(this.query, this.page, this.showSinger, this.perpage).then(res => {
          if (res.code === ERR_OK) {
            if (!this.sloveResult(res.data).length) {
            }
            this.sloveResult(res.data)
          }
        })
      },
      searchMoreData () {
        this.search()
      },
      resetQuery () {
        this.result = []
        this.page = 1
      },
      sloveResult (data) {
        if (data.zhida && data.zhida.singerid) {
          this.songs.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
        }
        if (data.song) {
          this._normalizeSongs(data.song.list)
        }
      },
      _normalizeSongs (list) {
        // console.log(list)
        let songmidlist = []
        let songtypelist = []
        let ret = []
        list.forEach(item => {
          songmidlist.push(item.songmid)
          songtypelist.push(0)
        })
        getvkey(songmidlist,songtypelist).then((res)=>{
          // console.log(res.url_mid.data.midurlinfo[0].vkey)
          const vkeylist = res.url_mid.data.midurlinfo
          let songlist = [...list]
          songlist.map((item,index)=>{
            item.purl = vkeylist[index].purl
            return item
          })
          songlist.forEach(item =>{
            const { purl } = item
            if (item.songid && item.albummid) {
              ret.push(createSong(item,purl))
            }
          })
          // console.log(ret)
          this.songs = this.songs.concat(ret)
          this.result = [...this.result, ...this.songs]
          this.page++
        })
      },
      getIconCls (item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName (item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      selectItem (item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.setSinger(singer)
          this.$router.push({
            path: `/search/${singer.id}`
          })
        } else {
          this.insertSong(item)
        }
        this.$emit('select', item)
      },
      handlePlayList (playList) {
        const dom = document.getElementsByClassName('mini-player')[0]
        const height = getComputedStyle(dom)['height']
        const bottom = playList.length > 0 ? height : ''
        this.$refs.scrollWrap.$el.style.bottom = bottom
        this.$refs.scrollWrap.refresh()
      },
      listScroll () {
        this.$emit('listScroll')
      }
    },
    computed: {},
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/common/less/const.less';
  @import '~@/common/less/mymixin.less';
  .suggest-wrap {
    position: fixed;
    overflow: hidden;
    top: @marin-top-size;
    margin-top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    .suggest-list {
      overflow: hidden;
      padding: 0 20px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding: 20px 0;
      }
      .icon {
        width: 50px;
        line-height: 1.5;
        font-size: @font-size-medium;
        [class^='icon-'] {
          color: @color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;
      }
      .result {
        text-align: center;
        padding: 20px;
      }
      .loading-wrap {
        height: 50px;
        margin-bottom: 20px;
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
