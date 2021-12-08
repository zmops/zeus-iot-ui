<!-- 租户信息页面 -->
<template>
  <div class="info">
    <div v-if="!dialogVisible" class="zeus-product basics">
      <div class="left">
        <svg-icon icon-class="big-tenant" style="font-size: 46px"/>
      </div>
      <div class="content">
        <el-row :gutter="18" class="row">
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ infoData.name || '-' }}</div>
              <div class="tit">租户名称</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ infoData.account || '-' }}</div>
              <div class="tit">租户管理员账号</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ infoData.contact || '-' }}</div>
              <div class="tit">联系人</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info">
              <div class="con">
                {{ infoData.phone || '-' }}
              </div>
              <div class="tit">联系方式</div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="18" class="row">
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ infoData.remark || '-' }}</div>
              <div class="tit">描述信息</div>
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
    <div v-if="dialogVisible">
      <FormTemplate :up="'基本信息'" :state="'编辑基本信息'" :but-loading="butLoading" @submit="submit" @cancel="close">
        <template v-slot:main>
          <tenantForm ref="tenantForm" v-model="dialogForm" is-edit />
        </template>
      </FormTemplate>
    </div>
  </div>
</template>

<script>
import tenantForm from '@/views/system/tenant/form'
import FormTemplate from "@/components/Slots/FormTemplate";
import { updateTenant } from '@/api/system'

export default {
  name: 'DeviceInfo',
  components: {
    tenantForm,
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
      butLoading: false,
      dialogForm: {},
    }
  },
  created() {},
  methods: {
    submit() {
      if (this.$refs.tenantForm.validateForm()) {
        this.butLoading = true
        updateTenant(this.dialogForm).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.$emit('updata')
          }
          this.butLoading = false
        }).catch(() => {
          this.butLoading = false
        })
      }
    },
    close() {
      this.dialogVisible = false
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

        .info {
          padding: 0 9px;

          .con {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
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
