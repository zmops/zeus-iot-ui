<!-- 列表页面搜索框内的时间日期选择框 -->
<template>
  <div class="DateTimePickerTemplate">
    <el-date-picker
      v-model="farther.form[keyName]"
      :type="type"
      clearable
      size="mini"
      prefix-icon="el-icon-date"
      value-format="timestamp"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    />
  </div>
</template>
<script>
export default {
  name: 'DateTimePickerTemplate',
  inject: ['farther'],
  props: {
    /* 绑定的字段名 */
    keyName: {
      type: String,
      default: 'text'
    },
    /* 时间组件类型,同官方的type */
    type: {
      type: String,
      default: 'datetimerange'
    },
    /* 组件宽度 */
    w: {
      type: Number,
      default: 410
    }
  },
  data() {
    return {}
  },
  created() {

  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.DateTimePickerTemplate {
  ::v-deep.el-input__inner{
    border-radius: 20px!important;
    height: 32px!important;
    background: #E6EDF4;
    border: 1px solid #E6EDF4;
    .el-range-input{
      background: #E6EDF4;
    }
    .el-range-input::placeholder{
      color: #5F708A;
    }
  }
  ::v-deep.el-input__inner:hover{
    border: 1px solid #79879C;
  }
}
</style>
