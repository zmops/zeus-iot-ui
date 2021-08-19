<!-- 搜索栏输入框组件 -->
<template>
  <div class="InputTemplate">
    <el-input v-model.trim="farther.form[keyName]" class="" size="mini" :placeholder="'请输入' + label" clearable :style="{width:w +'px'}">
      <svg-icon slot="prefix" icon-class="search" />
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'InputTemplate',
  inject: ['farther'],
  props: {
    keyName: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: '内容'
    },
    w: {
      type: Number,
      default: 200
    }
  }
}
</script>

<style lang="scss" scoped>
.InputTemplate {
  ::v-deep.el-input__inner{
    border-radius: 20px!important;
    padding: 6px 30px;
    background: #E6EDF4;
    border: 1px solid #E6EDF4;
    font-weight: 400;
  }
  ::v-deep.el-input__inner::placeholder{
    color: #5F708A;
  }
  ::v-deep.el-input__prefix{
    left: 12px;
    top: 2px;
  }
  ::v-deep.el-input__inner:focus{
    background: #FFFFFF;
    border: 1px solid #79879C !important;
  }
  ::v-deep.el-input__inner:hover{
    border: 1px solid #79879C;
  }
}
</style>
