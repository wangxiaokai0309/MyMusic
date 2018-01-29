<template>
  <div class="song-list">
    <ul class="songs-wrap">
      <!-- <li v-show="!songs.length && " class="item" style="text-align: center; color: #000;">空空如也</li> -->
      <li @click="selectItem(i, index)" v-for="(i, index) in songs" :key="i.id" class="item" :class="{'rank-wrap': rank}">
        <div class="rank" :class="getRank(index)" v-show="rank">
          <span class="icon" v-show="index>=3">{{index + 1}}</span>
        </div>
        <div class="content">
          <p class="name">{{i.name}}</p>
          <p class="desc">{{i.singer}} - {{i.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import Loading from 'containers/Loading'
  export default {
    name: 'SongList',
    props: {
      songs: {
        type: Array,
        default: function () {
          return []
        }
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      selectItem (i, index) {
        this.$emit('select', i, index)
      },
      getRank (index) {
        switch (+index) {
          case 0:
            return `rank-1`
            break
          case 1:
            return `rank-2`
            break
          case 2:
            return `rank-3`
            break
          default:
            return ``
        }
      }
    },
    components: {
      Loading
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/mymixin.less';
  @import '~@/common/less/const.less';
  .song-list {
    padding: 20px 60px;
    .item {
      font-size: @font-size-medium;
      margin: 20px 0;
      &.rank-wrap {
        display: flex;
        align-items: center;
        .content {
          flex: 1;
        }
        .rank {
          text-align: center;
          width: 80px;
          height: 80px;
          color: #ff400b;
          font-size: 30px;
          line-height: 80px;
          margin-right: 50px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center center;
          &.rank-1 {
            .bg-image('./first');
            color: #ffcd32;
          }
          &.rank-2 {
            .bg-image('./second');
            color: #ffcd32;
          }
          &.rank-3 {
            .bg-image('./third');
            color: #ffcd32;
          }
        }
      }
      .content {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        .name {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          color: #000;
          font-size: @font-size-medium;
        }
        .desc {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          margin: 20px 0;
          font-size: @font-size-small;
          color: grey;
        }
      }
    }
  }
</style>
