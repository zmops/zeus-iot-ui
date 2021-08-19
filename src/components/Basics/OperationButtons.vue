<!--列表页面表格组件内的按钮组件-->
<template>
  <div class="setting-buttons">
    <el-button
      v-for="(item, but_index) in buttons"
      :key="but_index"
      slot="reference"
      type="text"
      class="setting-button"
      round
      size="mini"
      @click="handleClick(item.event)"
    >{{ item.label }}
    </el-button>
  </div>
</template>

<script>
export default {
  inject: ['farther'],
  name: 'OperationButtons',
  props: {
    buttons: {
      type: Array,
      default() {
        return []
      }
    },
    dataId: {
      type: [Number, String],
      default() {
        return null
      }
    },
    index: {
      type: Number,
      default() {
        return null
      }
    },
    problemId: {
      type: Number,
      default() {
        return null
      }
    }
  },
  created() {

  },
  methods: {
    handleClick(eventName) {
      this.farther[eventName](this.dataId)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

