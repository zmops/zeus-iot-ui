<!-- 列表页面搜索栏设备搜索组件 -->
<template>
  <div class="SelectTemplate">
    <el-select
      v-model="farther.form[keyName]"
      size="mini"
      :placeholder="'请选择'+label"
      :style="{width:w +'px'}"
      :multiple="multiple"
      :popper-class="'xlk'"
      @focus="dialogVisible = true"
      clearable
      filterable
    >
      <el-option
        v-for="(item,index) in options"
        :key="index"
        :label="optionName?item[optionName]:item"
        :value="optionId?item[optionId]:item"
      />
    </el-select>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'1234px'"
      :show-close="false"
      class="device_select_dialog"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="select"/>
          设备选择
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <DeviceSelect @closeDialog="dialogVisible = false" @checked="checked"></DeviceSelect>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DeviceSelect from '@/components/Basics/DeviceSelect'
export default {
  name: 'SelectTemplate',
  inject: ['farther'],
  components:{
    DeviceSelect
  },
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
    /* 是否多选 */
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    checked(ids) {
      if (ids.length === 1) {
        this.farther.form[this.keyName] = ids[0]
      } else {
        this.farther.form[this.keyName] = ids
      }
    }
  }
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
