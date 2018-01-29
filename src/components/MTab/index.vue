<template>
  <div class="my-tab">
    <router-link tag="div" class="tab-item" :to="{ name: 'recommend' }">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" :to="{ name: 'singer' }">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" :to="{ name: 'rank' }">
      <span class="tab-link">排行
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" :to="{ name: 'search' }">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'MTab'
  }
</script>

<style lang="less" scoped>
  @import '~@/common/less/const.less';
  .my-tab {
    position: fixed;
    display: flex;
    width: 100%;
    height: @marin-top-size;
    line-height: @marin-top-size;
    font-size: @font-size-medium;
    justify-content: space-between;
    .tab-item {
      flex: 1;
      text-align: center;
      .tab-link {
        padding-bottom: 5px;
        color: black;
      }
      &.router-link-active {
        .tab-link {
          color: #31c27c;
          border-bottom: 2px solid #31c27c;
        }
      }
    }
  }
</style>
