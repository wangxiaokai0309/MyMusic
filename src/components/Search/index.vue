<template>
  <div>
    <div class="search">
      <div class="search-box-wrap">
        <search-box ref="search" @query="query"></search-box>
      </div>
      <div class="suggest-wrap" v-show="queryData">
        <Suggest :query="queryData" @listScroll="blurInput" />
      </div>
      <scroll :data="scrollData" ref="scrollRef" class="scroll-box">
        <div class="hot-search-wrap" v-show="!queryData">
          <p class="title">热门搜索</p>
          <ul class="hot-key">
            <li @click.stop="addQuery(i.k)" class="item" v-for="i in hotkey" :key="i.id">{{i.k}}</li>
          </ul>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="search-history-title">
              <span class="text">搜索历史</span>
              <span class="clear">
                <i class="icon-clear" @click="showConfirm"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteItem"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <confirm ref="confirmRef" @confirm="confirm" @cancel="cancel"></confirm>
    <router-view></router-view>
  </div>
</template>
<script>
  import SearchBox from 'containers/SearchBox'
  import SearchList from 'containers/SearchList'
  import Confirm from 'containers/Confirm'
  import Suggest from 'containers/Suggest'
  import { getHotKey } from 'api/search'
  import { ERR_OK } from 'api/config'
  import { mapActions, mapGetters } from 'vuex'
  import Scroll from 'containers/Scroll'
  import { playlistMixin } from 'common/js/mixin'

  export default {
    name: 'search',
    mixins: [playlistMixin],
    data () {
      return {
        hotkey: [],
        queryData: ''
      }
    },
    created () {
      this._getHotKey()
    },
    computed: {
      ...mapGetters(['searchHistory']),
      scrollData () {
        return [...this.hotkey, ...this.searchHistory]
      }
    },
    methods: {
      ...mapActions({
        setSearchHistory: 'saveSearchHistory',
        deleteSearchHistory: 'deleteSearchHistory',
        clearSearchHistory: 'clearSearchHistory'
      }),
      _getHotKey () {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotkey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      addQuery (query) {
        this.$refs.search.setQuery(query)
      },
      query (query) {
        this.queryData = query
        this.saveSearch(query.trim())
        this.$nextTick(() => {
          this.$refs.scrollRef.refresh()
        })
      },
      blurInput () {
        this.$refs.search.blur()
      },
      saveSearch (query) {
        if (!query) {
          return
        }
        this.setSearchHistory(query)
      },
      deleteItem (item) {
        this.deleteSearchHistory(item)
      },
      clearAll () {
        this.clearSearchHistory()
      },
      showConfirm () {
        this.$refs.confirmRef.show()
      },
      confirm () {
        this.clearAll()
      },
      cancel () {
        this.$refs.confirmRef.hide()
      },
      handlePlayList (playList) {
        //  const dom = document.getElementsByClassName('mini-player')[0]
        // const height = getComputedStyle(dom)['height']
        const height = '50px'
        const bottom = playList.length > 0 ? height : ''
        this.$refs.scrollRef.$el.style.bottom = bottom
        this.$refs.scrollRef.refresh()
      }
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/const.less';
  .search {
    overflow: hidden;
    top: @marin-top-size;
    left: 0;
    bottom: 0;
    right: 0;
    position: fixed;
    .scroll-box {
      overflow: hidden;
      position: fixed;
      top: @marin-top-size + 60;
      bottom: 0;
    }
    .hot-search-wrap {
      margin: 0px 10px;
      .title {
        margin: 20px 10px;
        color: rgba(0, 0, 0, 0.6);
        font-size: @font-size-medium;
      }
      .hot-key {
        display: flex;
        flex-wrap: wrap;
        .item {
          font-size: @font-size-medium;
          padding: 10px;
          margin: 10px;
          background: white;
          border-radius: 5px;
        }
      }
    }
    .search-history {
      position: relative;
      margin: 20px;
      .search-history-title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: @font-size-medium;
        color: #000;
        .text {
          flex: 1;
        }
        .clear {
          .icon-clear {
            font-size: @font-size-medium;
            color: @color-text-d;
          }
        }
      }
    }
  }
</style>
