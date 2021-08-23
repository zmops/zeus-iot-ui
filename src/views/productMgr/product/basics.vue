<template>
  <div>
    <div class="zeus-product-tit">基本信息</div>
    <div class="zeus-product basics">
      <div class="left">
        <svg-icon icon-class="bigproduct" style="font-size: 46px" />
      </div>
      <div class="content">
        <el-row :gutter="18" class="row">
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ form.prodCode || '-' }}</div>
              <div class="tit">产品ID</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ form.prodName || '-' }}</div>
              <div class="tit">产品名称</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ form.groupIdName || '-' }}</div>
              <div class="tit">产品分类</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ form.prodTypeName || '-' }}</div>
              <div class="tit">设备类型</div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="18" class="row">
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ form.manufacturer || '-' }}</div>
              <div class="tit">厂商</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ form.model || '-' }}</div>
              <div class="tit">型号</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info">
              <div class="con">{{ form.remark || '-' }}</div>
              <div class="tit">描述</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="right">
        <el-button size="mini" round @click="eidt"><svg-icon icon-class="dialog_edit" style="margin-right: 5px" />编辑</el-button>
      </div>
    </div>
    <el-dialog
      v-if="dialogVisible"
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
          编辑产品
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div>
        <ProductForm :prod-id="prodId" @close="dialogVisible = false" @closeDialog="closeDialog" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { productDetail } from '@/api/porductMgr'
import ProductForm from './addForm.vue'
export default {
  components: {
    ProductForm
  },
  data() {
    return {
      form: {},
      prodId: '',
      dialogVisible: false
    }
  },
  async created() {
    if (this.$route.query.id) {
      await this.getDetail(this.$route.query.id)
    }
  },
  methods: {
    async getDetail(id) {
      this.prodId = id
      await productDetail({ productId: id }).then(res => {
        if (res.code == 200) {
          this.form = res.data
        }
      })
    },
    eidt() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.getDetail(this.prodId)
      this.$emit('edit')
    }
  }

}
</script>

<style lang="scss" scoped>
.basics{
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  .left{
    flex: 0 0 84px;
    background: #F9FBFD;
    border-radius: 4px;
    padding: 15px 19px;
  }
  .content{
    flex: 1;
    margin: 0 14px;
    .row{
      height: 64px;
      border-radius: 4px;
      background: #F9FBFD;
      border: 1px solid #EFF4F9;
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      margin-left: 0px !important;
      margin-right: 0px !important;
      .info{
        padding: 0 9px;
        .con{
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 13px;
          color: #242E42;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .tit{
          font-size: 12px;
          color: #79879C;
        }
      }
    }
  }
  .right{
    flex: 0 0 62px;
    .el-button{
      padding: 5px 9px;
      border: 1px solid #EFF4F9;
      background: #EFF4F9;
    }
    .el-button:hover{
      border: 1px solid #CCD3DB;
      background: #E3E9EF;
    }
  }
}
</style>
