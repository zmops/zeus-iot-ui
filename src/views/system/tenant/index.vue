<template>
  <div class="tenant">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>租户管理</template>
      <template v-slot:subhead>租户可以用来实现不同租户间的数据隔离。</template>
    </ListHeadTemplate>
    <SearchForm :params="formParams" :buttons="buttons" :batch-buttons="batchButtons" :selected="ids.length > 0" :columns="columns" @search="search" @cancel="ids = []" />
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :selection="true"
      :icon="$route.meta.icon24"
      @select="handleSelect"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_add"/>
          创建租户
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <TenantForm ref="tenantForm" />
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="submit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import TenantForm from '@/views/system/tenant/form'
import { createDevice, deleteDevice, getDeviceByPage } from '@/api/deviceMgr'

export default {
  provide() {
    return {
      farther: this
    }
  },
  name: 'tenant',
  components: {
    ListHeadTemplate,
    BusinessTable,
    SearchForm,
    Pagination,
    TenantForm
  },
  data() {
    return {
      form: {
        name: ''
      },
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '租户名称'
        }
      ],
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      batchButtons: [
        {
          type: 'danger',
          label: '删除',
          event: 'del'
        }
      ],
      columns: [
        {
          label: '租户名称',
          prop: 'name',
          show: true
        },
        {
          label: '租户ID',
          prop: 'name',
          show: true
        },
        {
          label: '租户管理员',
          prop: 'name',
          show: true
        },
        {
          label: '联系人',
          prop: 'name',
          show: true
        },
        {
          label: '联系方式',
          prop: 'name',
          show: true
        },
        {
          label: '用户数',
          prop: 'name',
          show: true
        },
        {
          label: '启用状态',
          prop: 'status',
          status: true,
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '创建时间',
          prop: 'time',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          width: 100,
          show: true,
          idName: 'deviceGroupId',
          fixed: 'right',
          buttons: [
            {
              label: '启用',
              event: 'enable',
              icon: 'list-enable'
            },
            {
              label: '禁用',
              event: 'disable',
              icon: 'list-disable'
            },
            {
              label: '重置密码',
              event: 'reset',
              icon: 'list_reset'
            }
          ]
        }
      ],
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      ids: [],
      state: '',
      dialogVisible: false,
    }
  },
  created() {

  },
  methods: {
    search() {
      this.form.page = 1
      this.getList()
    },
    handleSelect(selection) {
      this.ids = selection.map((i) => { return i.deviceGroupId })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    getList() {
      // this.loading = true
      // getDeviceByPage({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
      //   this.loading = false
      //   if (res.code == 200) {
      //     this.tableData = res.data
      //     this.total = res.count
      //   }
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    delete(deviceId) {
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteDevice({ deviceId }).then(async(res) => {
        //   if (res.code == 200) {
        //     this.$message({
        //       message: '删除成功',
        //       type: 'success'
        //     })
        //     // 删除后重新请求数据
        //     await this.getList()
        //   }
        // })
      })
    },
    submit() {
      if (this.$refs.tenantForm.validateForm()) {
        // createDevice(this.dialogForm).then(async(res) => {
        //   if (res.code == 200) {
        //     this.$message({
        //       message: '添加成功',
        //       type: 'success'
        //     })
        //     this.dialogVisible = false
        //     await this.getList()
        //   }
        // })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.index {

}
</style>
