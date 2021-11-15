<!-- 产品基础信息页面 -->
<template>
  <div class="info">
    <div v-if="!dialogVisible" class="zeus-product basics">
      <div class="left">
        <img v-if="infoData.icon" :src="infoData.icon" alt="" width="46px">
        <svg-icon v-else icon-class="bigproduct" style="font-size: 46px"/>
      </div>
      <div class="content">
        <el-row :gutter="18" class="row">
          <el-col :span="6">
            <div class="info_i">
              <div class="con">{{ infoData.prodCode || '-' }}</div>
              <div class="tit">产品ID</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info_i">
              <div class="con">{{ infoData.prodName || '-' }}</div>
              <div class="tit">产品名称</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info_i">
              <div class="con">{{ infoData.groupIdName || '-' }}</div>
              <div class="tit">产品分类</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info_i">
              <div class="con">{{ infoData.prodTypeName || '-' }}</div>
              <div class="tit">设备类型</div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="18" class="row">
          <el-col :span="6">
            <div class="info_i">
              <div class="con">{{ infoData.manufacturer || '-' }}</div>
              <div class="tit">厂商</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info_i">
              <div class="con">{{ infoData.model || '-' }}</div>
              <div class="tit">型号</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info_i">
              <div class="con">{{ infoData.remark || '-' }}</div>
              <div class="tit">描述</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="right">
        <el-button size="mini" round @click="dialogVisible = true">
          <svg-icon icon-class="dialog_edit" style="margin-right: 5px"/>
          编辑
        </el-button>
      </div>
    </div>
    <div v-else class="basics">
      <FormTemplate :up="'基本信息'" :state="'编辑基本信息'" :but-loading="butLoading" @submit="submit" @cancel="dialogVisible = false">
        <template v-slot:main>
          <addForm ref="ProductForm" :prod-id="prodId" v-model="dialogForm" />
        </template>
      </FormTemplate>
    </div>
  </div>
</template>

<script>
import addForm from '@/views/productMgr/product/addForm'
import FormTemplate from '@/components/Slots/FormTemplate'
import { createProduct, UpdateProduct } from '@/api/porductMgr'

export default {
  name: 'DeviceInfo',
  components: {
    addForm,
    FormTemplate
  },
  props: {
    infoData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    infoData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.dialogForm = JSON.parse(JSON.stringify(val))
        }
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      prodId: '',
      butLoading: false,
    }
  },
  created() {
    this.prodId = this.$route.query.id
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false
      this.$emit('updata')
    },
    submit() {
      if (this.$refs.ProductForm.validateForm()) {
        this.butLoading = true
        if (this.prodId) {
          UpdateProduct(this.dialogForm).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.closeDialog()
            }
            this.butLoading = false
          }).catch(() => {
            this.butLoading = false
          })
        } else {
          createProduct(this.dialogForm).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.closeDialog()
            }
            this.butLoading = false
          }).catch(() => {
            this.butLoading = false
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  .bm-view2 {
    width: 100%;
    height: 500px;
  }

  .basics {
    display: flex;
    align-items: stretch;
    justify-content: space-between;

    .left {
      flex: 0 0 84px;
      background: #F9FBFD;
      border-radius: 4px;
      padding: 15px 19px;
    }

    .content {
      flex: 1;
      margin: 0 14px;

      .row {
        height: 64px;
        border-radius: 4px;
        background: #F9FBFD;
        border: 1px solid #EFF4F9;
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        margin-left: 0px !important;
        margin-right: 0px !important;

        .info_i {
          padding: 0 9px;
          width: 100%;

          .con {
            width: 100%;
            word-wrap:break-word;
            //text-overflow: ellipsis;
            //white-space: nowrap;
            //overflow: hidden;
            font-size: 13px;
            color: #242E42;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .group-item {
            display: inline-block;
            background-color: #E3E9EF;
            padding: 4px 5px;
            margin-right: 5px;
          }

          .show-map {
            color: #1A84F9;
          }

          .tit {
            font-size: 12px;
            color: #79879C;
          }
        }
      }
    }

    .right {
      flex: 0 0 62px;

      .el-button {
        padding: 5px 9px;
        border: 1px solid #EFF4F9;
        background: #EFF4F9;
      }

      .el-button:hover {
        border: 1px solid #CCD3DB;
        background: #E3E9EF;
      }
    }
  }
}
</style>
