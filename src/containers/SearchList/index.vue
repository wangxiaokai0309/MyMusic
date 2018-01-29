<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li :key="item" class="search-item" @click="selectItem(item)" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
  export default {
    name: 'search-list',
    data () {
      return {}
    },
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    watch: {},
    methods: {
      selectItem (item) {
        this.$emit('select', item)
      },
      deleteOne (item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/common/less/const.less';
  @import '~@/common/less/mymixin.less';
  .search-list {
    .search-item {
      display: flex;
      align-items: center;
      margin: 10px 0;
      height: 50px;
      overflow: hidden;
      &.list-enter-active,
      &.list-leave-active {
        transition: all 0.1s;
      }
      &.list-enter,
      &.list-leave-to {
        height: 0;
      }
      .text {
        flex: 1;
        color: #000;
        font-size: @font-size-medium;
      }
      .icon {
        font-size: @font-size-medium;
        .icon-delete {
          color: @color-text-d;
        }
      }
    }
  }
</style>
