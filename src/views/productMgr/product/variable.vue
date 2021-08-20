<template>
  <div>
    <el-form ref="metadataForm" label-width="80px" label-position="top" class="dialog-form">
      <el-form-item label="变量">
        <div v-for="(item,index) in variableList" :key="index" class="zeus-list-conten zeus-flex-between">
          <div class="left zeus-flex-default">
            <div class="zeus-list-item">
              <el-input size="mini">
                <template slot="prepend">描述</template>
              </el-input>
            </div>
            <div class="zeus-list-item">
              <span class="zeus-left-tips tips">{$</span>
              <span class="zeus-right-tips tips">}</span>
              <el-input size="mini">
                <template slot="prepend">键</template>
              </el-input>
            </div>
            <div class="zeus-list-item">
              <el-input size="mini">
                <template slot="prepend">值</template>
              </el-input>
            </div>
          </div>
          <i class="el-icon-delete zeus-icon" @click="delItem(index)" />
        </div>
        <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="variableAdd">增加变量</el-button>
        <div class="el-form-item-tips">
          <i class="el-icon-info" />可在产品上增加自定义变量，以方便取用。
        </div>
      </el-form-item>
    </el-form>
    <div class="zeus-form-btns zeus-flex-center">
      <el-button type="primary" size="mini" round @click="handleSubmit">确 定</el-button>
      <el-button size="mini" round @click="handleCancle">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { } from '@/api/porductMgr'
export default {
  data() {
    return {
      prodId: '',
      variableList: [{
        tag: '',
        value: ''
      }]
    }
  },
  async created() {
    if (this.$route.query.id) {
      this.prodId = this.$route.query.id
      await this.getVariableList()
    }
  },
  methods: {
    getVariableList() {

    },
    variableAdd() {
      const obj = {
        tag: '',
        value: ''
      }
      if (this.variableList.length > 0) {
        let rule = true
        for (const item of this.variableList) {
          if (item.tag === '') {
            rule = false
          }
        }
        if (rule) {
          this.variableList.push(obj)
        } else {
          this.$message({
            message: '请填写完整当前变量的键值',
            type: 'warning'
          })
        }
      } else {
        this.variableList.push(obj)
      }
    },
    delItem(i) {
      this.variableList.splice(i, 1)
    },
    async handleCancle() {
      await this.getVariableList()
    },
    handleSubmit() {
      if (this.variableList.length == 1 && this.variableList[0].tag == '' && this.variableList[0].value == '') {
        this.variableList = []
      }
      if (this.variableList.length > 0) {
        let rule = true
        for (const item of this.variableList) {
          if (item.tag === '') {
            rule = false
          }
        }
        if (rule) {
          this.variableUpdate()
        } else {
          this.$message({
            message: '请填写完整当前标签的键值',
            type: 'warning'
          })
        }
      } else {
        this.variableUpdate()
      }
    },
    variableUpdate() {

    }
  }
}
</script>
