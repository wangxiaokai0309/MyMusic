<template>
  <div class="loading" v-show="show">
    <div class="loading-wrap">
      <img src="./img/loading.gif">
      <div class="info">{{title}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'loading',
    props: {
      show: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: `玩命加载中...`
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@/common/less/const.less';
  .loading {
    position: relative;
    z-index: 121212;
    margin: 10px;
    .loading-wrap {
      width: 100%;
      text-align: center;
      img {
        width: 50px;
        height: 50px;
      }
      .info {
        font-size: @font-size-medium;
      }
    }
  }
</style>
