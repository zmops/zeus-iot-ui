<template>
  <div class="tag zeus-relative">
    <div v-for="(item, index) in viewList" :key="index" class="tag-item zeus-inline-block">
      <span class="tag-item-l zeus-inline-block">{{ item.tag }}</span>
      <span class="tag-item-r zeus-inline-block">{{ item.value }}</span>
    </div>
    <el-button size="mini" round class="zeus-right zeus-absolute edit" @click="edit">
      <svg-icon icon-class="dialog_edit" style="margin-right: 5px"/>
      编辑
    </el-button>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'750px'"
      :show-close="false"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_edit" />
          编辑标签
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="tips">
        <i class="el-icon-info"/>
        <span>可设置自定义标签，以方便统计分析。</span>
      </div>
      <div class="dialog-body">
        <Tag v-model="tagList" />
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="handleSubmit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceTag, updateDevTag } from '@/api/deviceMgr'
import { getProdTagList, updateProdTag } from '@/api/porductMgr'
import Tag from '@/components/Detail/Tag'
export default {
  components: {
    Tag
  },
  props: {
    isDev: Boolean
  },
  data() {
    return {
      prodId: '',
      tagList: [],
      viewList: [],
      dialogVisible: false
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
      if (this.isDev) {
        getDeviceTag({ deviceId: this.prodId }).then(res => {
          if (res.code == 200) {
            this.tagList = res.data
            this.viewList = JSON.parse(JSON.stringify(res.data))
          }
        })
      } else {
        getProdTagList({ productId: this.prodId }).then(res => {
          if (res.code == 200) {
            this.tagList = res.data
            this.viewList = JSON.parse(JSON.stringify(res.data))
          }
        })
      }
    },
    // change(list) {
    //   this.tagList = list
    // },
    edit() {
      this.dialogVisible = true
      this.tagList = JSON.parse(JSON.stringify(this.viewList))
    },
    handleSubmit() {
      for (const item of this.tagList) {
        if (item.tag === '' || item.value === '') {
          this.$message({
            message: '请填写完整当前标签的键值',
            type: 'warning'
          })
          return false
        }
      }
      if (this.isDev) {
        updateDevTag({ productId: this.prodId, productTag: this.tagList }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getTagList()
            this.dialogVisible = false
          }
        })
      } else {
        updateProdTag({ productId: this.prodId, productTag: this.tagList }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getTagList()
            this.dialogVisible = false
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tag {
  width: 100%;
  min-height: 70px;
  background-color: #fff;
  padding: 17px 16px 4px 16px;
  box-shadow: 6px 8px 16px #E2EAF2;

  .tag-item{
    font-size: 12px;
    background-color: #E3E9EF;
    border-radius: 2px;
    margin-right: 40px;
    margin-bottom: 12px;

    .tag-item-l{
      background-color: #3C435B;
      color: #fff;
      padding: 4px 8px;
      margin-left: 2px;
      border-radius: 2px;
    }

    .tag-item-r{
      padding: 6px;
      color: #242E42;
    }
  }

  .edit{
    right:18px ;
    top: 30px;
    transform: translateY(-50%);
    padding: 5px 9px;
    border: 1px solid #EFF4F9;
    background: #EFF4F9;
  }

  .tips{
    width: 100%;
    height: 32px;
    line-height: 32px;
    background-color: #CDE5FF;
    color: #36435C;
    font-size: 12px;
    padding-left: 20px;

    i{
      color: #50A1FB;
      margin-right: 6px;
    }
  }
}
</style>
