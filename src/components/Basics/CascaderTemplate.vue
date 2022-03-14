<!-- 列表页面搜索联机选择器组件 -->
<template>
  <div class="SelectTemplate">
    <el-cascader
      v-model="farther.form[keyName]"
      size="mini"
      clearable
      :placeholder="placeholder ? placeholder : '请选择'+label"
      :style="{width:w +'px'}"
      :props="{ checkStrictly: true, value:optionId, label:optionName, children:childrenName}"
      :show-all-levels="false"
      :options="options"></el-cascader>
  </div>
</template>

<script>
export default {
  name: 'SelectTemplate',
  inject: ['farther'],
  props: {
    /* 绑定的字段名 */
    keyName: {
      type: String,
      default() {
        return ''
      }
    },
    /* 下拉框内的数据 */
    options: {
      type: Array,
      default() {
        return []
      }
    },
    /* 下拉框占位符文字 */
    label: {
      type: String,
      default: ''
    },
    /* 下拉框宽度 */
    w: {
      type: Number,
      default: 200
    },
    /* 下拉框框选项value对应的字段名 */
    optionId: {
      type: String,
      default: null
    },
    /* 下拉框框选项label对应的字段名 */
    optionName: {
      type: String,
      default: null
    },
    /* 子节点字段名 */
    childrenName: {
      type: String,
      default: null
    },
    /* 占位符 */
    placeholder: {
      type: String,
      default: null
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.SelectTemplate {
  ::v-deep.el-input__inner{
    background: #ffffff;
    border: 1px solid #ABB4BE;
    font-weight: 400;
  }
  ::v-deep.el-input__inner::placeholder{
    color: #5F708A;
  }
  ::v-deep.el-input__inner:focus{
    background: #FFFFFF;
    //border: 1px solid #1A84F9 !important;
    //box-shadow: 0 0 4px 0 #BADDFF;
  }
  ::v-deep.el-input__inner:hover{
    border: 1px solid #79879C;
  }
}
</style>
