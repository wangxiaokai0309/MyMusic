<template>
  <div class="not-found-page">
    <p class="text">404</p>
  </div>
</template>
<script>
  export default {
    name: 'NotFound'
  }
</script>
<style lang="less" scoped>
  .not-found-page {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: #f4f4f4;
    text-align: center;
    .text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
  }
</style>
