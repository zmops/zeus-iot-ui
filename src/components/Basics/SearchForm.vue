<template>
  <div v-if="selected" class="setting-form setting-form-dark">
    <div class="condition">
      <el-button
        v-for="(btn, index) in batchButtons"
        :key="index"
        round
        size="mini"
        :type="btn.type"
        @click="handleClick(btn.event)"
      >
        <span>
          {{ btn.label }}
        </span>
      </el-button>
    </div>
    <el-button round size="mini" type="primary" @click="cancel">取消选择</el-button>
  </div>
  <div v-else class="setting-form setting-form-light">
    <div class="condition zeus-flex-between">
      <el-form :inline="true" :model="farther.form">
        <el-form-item v-for="(item, index) in params" :key="index" size="mini" class="zeus-mt-10">
          <component :is="item.componentName" v-bind="item" />
        </el-form-item>
        <el-form-item size="mini" class="zeus-mt-10">
          <el-button v-if="params && params.length" size="mini" class="setting-button" round @click.prevent="search"><svg-icon icon-class="list_refresh" /></el-button>
        </el-form-item>
      </el-form>
      <div class="line-button-wrapper setting-buttons">
        <el-dropdown v-if="columns.length > 1" :placement="'bottom'" @command="columnsChange">
          <el-button size="mini" class="setting-button" round><svg-icon icon-class="list_edit" /></el-button>
          <el-dropdown-menu slot="dropdown">
            <div class="zeus-text-align-c dropdown-title">列表定制</div>
            <el-dropdown-item v-for="(item, index) in newColumns" :key="index" :command="index">
              <svg-icon v-if="index !== 0" :icon-class="item.show ? 'eye-open' : 'eye'" />
              <span v-if="index !== 0"> {{ item.label }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div v-if="buttons" class="btns">
      <el-button
        v-for="(btn, index) in buttons"
        :key="index"
        round
        size="mini"
        :type="btn.type"
        @click="handleClick(btn.event)"
      >
        <span>
          {{ btn.label }}
        </span>
      </el-button>
    </div>
  </div>
</template>

<script>
import SelectTemplate from '@/components/Basics/SelectTemplate'
import InputTemplate from '@/components/Basics/InputTemplate'
import DateTimePickerTemplate from '@/components/Basics/DateTimePickerTemplate'
import KeyValueTemplate from '@/components/Basics/KeyValueTemplate'
import EventBus from '@/utils/event-bus'
export default {
  inject: ['farther'],
  components: {
    SelectTemplate,
    InputTemplate,
    DateTimePickerTemplate,
    KeyValueTemplate
  },
  props: {
    /* 搜索栏左侧表单 */
    params: {
      type: Array,
      default() {
        return []
      }
    },
    /* 搜索栏右侧按钮组 */
    buttons: {
      type: Array,
      default() {
        return []
      }
    },
    /* 选中状态下左侧按钮组 */
    batchButtons: {
      type: Array,
      default() {
        return []
      }
    },
    /* 是否是选中状态 */
    selected: {
      type: Boolean,
      default: false
    },
    /* 列表字段 */
    columns: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    /* 过滤列表字段 */
    newColumns() {
      const arr = this.columns
      return arr.filter(item => item.label)
    }
  },
  methods: {
    /* 搜索按钮 */
    search() {
      this.$emit('search')
    },
    /* 表格变化 */
    columnsChange(index) {
      this.newColumns[index].show = !this.newColumns[index].show
    },
    /* 取消选中按钮 */
    cancel() {
      EventBus.$emit('clearSelection', 'app')
      this.$emit('cancel')
    },
    handleClick(eventName) {
      this.farther[eventName]()
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-form{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  box-shadow: 0 1px 0 0 #eff4f9;

  .condition{
    flex: 1;
    margin-right: 20px;
  }

  ::v-deep.el-form-item{
    margin-bottom: 0!important;
  }
}
.setting-form-light{
  background-color: #f9fbfd;
}
.setting-form-dark{
  background-color: #242E42;
}
.dropdown-title{
  color: #242E42;
  font-size: 12px;
  line-height: 20px;
  padding: 8px 12px;
}
.line-button-wrapper .is-round{
  padding: 5px 24px;
  margin-left: 5px;
  border: none;
  background: #f9fbfd;
}
.line-button-wrapper .is-round:hover{
  background: #E3E9EF !important;
  border: none !important;
}
.setting-buttons{
  width: 80px;
}
</style>
