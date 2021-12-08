<template>
<div class="grafana zeus-relative">
  <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" class="zeus-absolute fullscreen" />
  <iframe frameborder="0" src="https://zeusdemo.zmops.cn:3000/d/C_ZzOhNnk/zeus-iot-demo?orgId=1&refresh=5s&from=1632478787244&to=1632482387244&theme=dark&kiosk" width="100%" height="100%"></iframe>
</div>
</template>
<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: '当前浏览器不支持全屏',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle(this.$el)
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.grafana{
  height: calc(100vh - 100px);

  .fullscreen{
    top: 10px;
    right: 10px;
  }
}
</style>
