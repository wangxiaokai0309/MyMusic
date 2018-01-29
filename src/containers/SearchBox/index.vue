<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" class="box" v-model="query" ref="queryRef" :placeholder="placeholder">
    <i class="icon-dismiss" @click="clear" v-show="query"></i>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    components: {},
    data () {
      return {
        query: ''
      }
    },
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    methods: {
      clear () {
        this.query = ''
      },
      setQuery (query) {
        this.query = query
      },
      blur () {
        this.$refs.queryRef.blur()
      }
    },
    computed: {},
    created () {
      this.$watch(
        'query',
        _.debounce(function (newQuery) {
          this.$emit('query', newQuery)
        }, 500)
      )
    },
    mounted () { },
    destroyed () { }
  }
</script>

<style lang="less" scoped>
  @import '~@/common/less/const.less';
  @import '~@/common/less/mymixin.less';

  .search-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 20px;
    height: 60px;
    background: white;
    border-radius: 6px;
    .icon-search {
      font-size: 40px;
      color: @color-background;
    }
    .box {
      flex: 1;
      margin: 0 5px;
      border: 0;
      outline: none;
      background: #f4f4f4;
      line-height: 1;
      color: #000;
      font-size: 30px;
      &::placeholder {
        color: grey;
      }
    }
    .icon-dismiss {
      font-size: 30px;
      color: @color-background;
    }
  }
</style>
