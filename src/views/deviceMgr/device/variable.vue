<!-- 设备详情-变量页面 -->
<template>
  <div class="variable zeus-relative">
    <div v-for="(item, index) in viewList" :key="index" class="variable-item zeus-inline-block">
      <span class="variable-item-l zeus-inline-block">{{ item.remark }}</span>
      <span class="variable-item-c zeus-inline-block">{{ item.tag }}</span>
      <span class="variable-item-r zeus-inline-block">{{ item.value }}</span>
    </div>
    <el-button size="mini" round class="zeus-right zeus-absolute edit" @click="edit">
      <svg-icon icon-class="dialog_edit" style="margin-right: 5px"/>
      编辑
    </el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_edit" />
          编辑变量
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="dialog-body">
        <VariableTemplate :variable-list="variableList" @change="change" />
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="handleSubmit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import VariableTemplate from '@/components/Detail/Variable'
export default {
  name: 'Variable',
  components: {
    VariableTemplate
  },
  data() {
    return {
      viewList: [
        {
          tag: '标签1',
          value: 'dfsf',
          remark: '描述信息'
        },
        {
          tag: '标签2',
          value: 'rrrr',
          remark: '描f述信息'
        }
      ],
      variableList: [],
      dialogVisible: false
    }
  },
  created() {

  },
  methods: {
    edit() {
      this.dialogVisible = true
      this.variableList = JSON.parse(JSON.stringify(this.viewList))
    },
    handleSubmit() {

    },
    change(list) {
      this.variableList = list
    },
  }
}
</script>

<style lang="scss" scoped>
.variable {
  width: 100%;
  min-height: 70px;
  background-color: #fff;
  padding: 17px 16px 4px 16px;
  box-shadow: 6px 8px 16px #E2EAF2;

  .variable-item{
    font-size: 12px;
    background-color: #E3E9EF;
    border-radius: 2px;
    margin-right: 40px;
    margin-bottom: 12px;

    .variable-item-l{
      background-color: #B6C2CD;
      padding: 4px 6px;
      margin-right: 2px;
      border-radius: 2px;
    }

    .variable-item-c{
      background-color: #3C435B;
      color: #fff;
      padding: 4px 8px;
      margin-left: 2px;
      border-radius: 2px;
    }

    .variable-item-r{
      padding: 6px;
      color: #242E42;
    }
  }

  .edit{
    right:18px ;
    top: 50%;
    transform: translateY(-50%);
    padding: 5px 9px;
    border: 1px solid #EFF4F9;
    background: #EFF4F9;
  }
}
</style>
