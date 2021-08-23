<template>
  <div>
    <el-form ref="metadataForm" label-width="80px" label-position="top" class="dialog-form">
      <el-form-item label="标签">
        <div v-for="(item,index) in tagList" :key="'tag'+index" class="zeus-list-conten zeus-flex-between">
          <div class="left zeus-flex-default">
            <div class="zeus-list-item">
              <el-input v-model="item.tag" size="mini">
                <template slot="prepend">键</template>
              </el-input>
            </div>
            <div class="zeus-list-item">
              <el-input v-model="item.value" size="mini">
                <template slot="prepend">值</template>
              </el-input>
            </div>
          </div>
          <i class="el-icon-delete zeus-icon" @click="delItem(index)" />
        </div>
        <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="tagAdd">增加标签</el-button>
        <div class="el-form-item-tips">
          <i class="el-icon-info" />可在产品上增加自定义标签，以方便统计分析。
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
import { getProdTagList, updateTag } from '@/api/porductMgr'
export default {
  data() {
    return {
      prodId: '',
      tagList: [{
        tag: '',
        value: ''
      }]
    }
  },
  async created() {
    if (this.$route.query.id) {
      this.prodId = this.$route.query.id
      await this.getTagList()
    }
  },
  methods: {
    getTagList() {
      getProdTagList({ productId: this.prodId }).then(res => {
        if (res.code == 200) {
          this.tagList = res.data
        }
      })
    },
    tagAdd() {
      const obj = {
        tag: '',
        value: ''
      }
      if (this.tagList.length > 0) {
        let rule = true
        for (const item of this.tagList) {
          if (item.tag === '') {
            rule = false
          }
        }
        if (rule) {
          this.tagList.push(obj)
        } else {
          this.$message({
            message: '请填写完整当前标签的键值',
            type: 'warning'
          })
        }
      } else {
        this.tagList.push(obj)
      }
    },
    delItem(type, i) {
      this.tagList.splice(i, 1)
    },
    async handleCancle() {
      await this.getTagList()
    },
    handleSubmit() {
      if (this.tagList.length == 1 && this.tagList[0].tag == '' && this.tagList[0].value == '') {
        this.tagList = []
      }
      if (this.tagList.length > 0) {
        let rule = true
        for (const item of this.tagList) {
          if (item.tag === '') {
            rule = false
          }
        }
        if (rule) {
          this.tagUpdate()
        } else {
          this.$message({
            message: '请填写完整当前标签的键值',
            type: 'warning'
          })
        }
      } else {
        this.tagUpdate()
      }
    },
    tagUpdate() {
      const data = {
        productId: this.prodId,
        productTag: this.tagList
      }
      updateTag(data).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getTagList()
        }
      })
    }
  }
}
</script>
