<template>
  <div class="zeus-tree-select">
    <div class="el-select">
      <el-input v-model="selectName" :disabled="!disabled" size="mini" suffix-icon="el-select__caret el-icon-arrow-up" @focus.stop="selectShow = true" @blur="changeTree" />
    </div>
    <div v-if="selectShow" class="el-select-dropdown zeus-tree-option">
      <div class="el-scrollbar">
        <el-tree ref="selectTree" :data="data" node-key="id" :props="defaultProps" default-expand-all :check-strictly="true" @node-click="handleCheckChange" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    defaultProps: {
      type: Object
    },
    data: {
      type: Array
    },
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    basicChange: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectId: '',
      selectName: '',
      selectShow: false,
      disabled: false
    }
  },
  watch: {
    name: {
      immediate: true,
      deep: true,
      handler(val) {
        this.selectName = val
        this.selectId = this.id
      }
    },
    basicChange: {
      immediate: true,
      deep: true,
      handler(val) {
        this.disabled = val
      }
    }
  },
  methods: {
    handleCheckChange(data) {
      this.selectId = data.id
      this.selectName = data.name
      this.$emit('changeGroupId', this.selectId)
      this.selectShow = false
    },
    changeTree() {
      setTimeout(() => {
        this.selectShow = false
      }, 200)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select{
  width: 100%
}
.zeus-tree-select{
  position: relative;
  .zeus-tree-option{
    width: 100%;
    padding: 6px;
    max-height: 274px;
    overflow-y: auto;
  }
}
</style>
