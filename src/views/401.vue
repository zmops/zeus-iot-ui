<template>
  <div class="errPage-container">
    <div>
      <svg-icon icon-class="no_data" class="icon"></svg-icon>
      <div class="text zeus-inline-block">
        <div class="">未获得本页面的授权。</div>
        <div class="">若需要访问本页面，请联系管理员。</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page401',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.errPage-container{
  position: absolute;
  top: calc(50% - 90px);
  left: calc(50% - 240px);
  .icon{
    font-size: 180px;
  }
  .text{
    vertical-align: top;
    margin-left: 50px;
    margin-top: 30px;
    font-size: 16px;
    color: #242E42;
    line-height: 60px;
  }
}
</style>
