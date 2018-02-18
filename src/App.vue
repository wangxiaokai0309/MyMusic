<template>
  <div id="app">
    <m-tab></m-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import MTab from 'components/MTab'
  import Player from 'components/Player'
  export default {
    name: 'app',
    components: {
      MTab,
      Player
    }
  }
</script>

<style lang="less">
  #app {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }
</style>
