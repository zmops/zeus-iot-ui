<template>
  <div v-if="!item.hidden && item.show">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item
            :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
            :title="onlyOneChild.meta.title"
            :path="onlyOneChild.path || item.path"
            :routepath="$route.path"
            :active="onlyOneChild.meta.active_icon || (item.meta && item.meta.active_icon)"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" :path="item.path" :routepath="$route.path" :active="item.meta && item.meta.active_icon" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss">
.el-menu-item,
.el-submenu__title {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: bold;
  color: #0D0D0D !important;
  i{
    color: #0D0D0D !important;
  }

  .svg-icon{
    font-size: 16px!important;
  }
}

.el-submenu__title span{
  vertical-align: top!important;
}

.el-submenu {
  .el-menu-item {
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    padding: 0!important;
    span{
      display: inline-block;
      width: 100%;
      padding-left: 52px;
      font-weight: 400;
    }

    i {
      span {
        height: 32px;
        line-height: 32px;
      }
    }
  }
  .is-active span{
    background-color: #E2EBFF !important;
    color: #316CE6 !important;
    font-weight: 600;
  }
}
.el-menu--inline{
  margin: 11px 0;
}
</style>
