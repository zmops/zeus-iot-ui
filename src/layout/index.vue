<template>
  <div :class="classObj" class="app-wrapper">
    <Head />
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar v-if="!hiddenMenu" class="sidebar-container" />
    <div class="main-container" :style="{marginLeft:hiddenMenu?'0':'200px'}">
      <!--      <div :class="{'fixed-header':fixedHeader}">-->
      <!--        <navbar />-->
      <!--      </div>-->
      <app-main />
    </div>
<!--    <el-button class="float-but" type="primary" icon="el-icon-toilet-paper" circle />-->
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, Head } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Head
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    hiddenMenu() {
      return this.$route.meta.hiddenMenu
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    background-color: #EFF2F9;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }

    .float-but{
      position: fixed;
      right: -16px;
      bottom: 64px;
      z-index: 1999;

      &:hover{
        right: 6px;
      }
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
