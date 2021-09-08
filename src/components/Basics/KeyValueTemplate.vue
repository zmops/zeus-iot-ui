<!--搜索栏标签组件-->
<template>
  <div class="KeyValueTemplate">
    <el-input v-model.trim="farther.form[keyName].key" class="" size="mini" :placeholder="label + 'key'" clearable :style="{width:w +'px'}"></el-input>
    :
    <el-input v-model.trim="farther.form[keyName].value" class="" size="mini" :placeholder="label + 'value'" clearable :style="{width:w +'px'}"></el-input>
  </div>
</template>
<script>
export default {
  name: 'KeyValueTemplate',
  inject: ['farther'],
  props: {
    keyName: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: '标签'
    },
    w: {
      type: Number,
      default: 100
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
.KeyValueTemplate {
  background-color: #E6EDF4;
  padding: 0 20px;
  border-radius: 25px;
  border: 1px transparent solid;
  &:hover{
    border-color: #242E42;
  }

  ::v-deep.el-input__inner{
    border-color: transparent;
    background-color: #E6EDF4!important;
    //color: #5F708A!important;
  }
  ::v-deep.el-input__inner::placeholder {
    color: #5F708A;
  }
}
</style>
