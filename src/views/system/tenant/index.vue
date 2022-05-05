<template>
  <div class="tenant">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>租户管理</template>
      <template v-slot:subhead>租户可以用来实现不同租户间的数据隔离。</template>
    </ListHeadTemplate>
    <SearchForm v-if="!dialogVisible" :params="formParams" :buttons="buttons" :selected="ids.length > 0" :columns="columns" @search="search" @cancel="ids = []" />
    <BusinessTable
      v-if="!dialogVisible"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :selection="true"
      :icon="$route.meta.icon24"
      @detail="detail"
    />
    <Pagination v-if="!dialogVisible" :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    <div v-if="dialogVisible">
      <FormTemplate :up="'租户列表'" :state="state + '租户'" :but-loading="butLoading" @submit="submit" @cancel="close">
        <template v-slot:main>
          <TenantForm ref="tenantForm" v-model="dialogForm" />
        </template>
      </FormTemplate>
    </div>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import TenantForm from '@/views/system/tenant/form'
import FormTemplate from "@/components/Slots/FormTemplate";
import { createTenant, deleteTenant, getTenantByPage, resetTenantPass, statusTenant } from '@/api/system'

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
    TenantForm,
    FormTemplate
  },
  data() {
    return {
      butLoading: false,
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
      dialogForm:{},
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      columns: [
        {
          label: '租户名称',
          prop: 'name',
          event: 'detail',
          show: true
        },
        {
          label: '租户ID',
          prop: 'tenantId',
          show: true
        },
        {
          label: '租户管理员',
          prop: 'account',
          show: true
        },
        {
          label: '联系人',
          prop: 'contact',
          show: true
        },
        {
          label: '联系方式',
          prop: 'phone',
          show: true
        },
        {
          label: '用户数',
          prop: 'userNum',
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
          prop: 'createTime',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          width: 280,
          show: true,
          idName: 'tenantId',
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
            },
            {
              label: '删除',
              event: 'delete',
              icon: 'list-del'
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
      state: '创建',
      dialogVisible: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.form.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    getList() {
      this.loading = true
      getTenantByPage({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    detail(item) {
      this.$router.push({
        path: '/system/tenant/detail',
        query: {
          id: item.tenantId
        }
      })
    },
    disable(id) {
      this.modifyStatus(id, 'DISABLE')
    },
    enable(id) {
      this.modifyStatus(id, 'ENABLE')
    },
    modifyStatus(tenantId, status) {
      statusTenant({ tenantId, status }).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    delete(tenantId) {
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTenant({ tenantId }).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            // 删除后重新请求数据
            await this.getList()
          }
        })
      })
    },
    reset(id) {
      this.$confirm('是否确认重置该租户的密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const i = this.tableData.find((item) => {
          return item.tenantId === id
        })
        resetTenantPass({ account: i.account }).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '密码重置成功',
              type: 'success'
            })
            this.getList()
          }
        })
      })
    },
    submit() {
      if (this.$refs.tenantForm.validateForm()) {
        this.butLoading = true
        const { pass } = this.dialogForm
        createTenant({ ...this.dialogForm, password: this.$stringToHex(pass) }).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.close()
            await this.getList()
          }
          this.butLoading = false
        }).catch(() => {
          this.butLoading = false
        })
      }
    },
    close() {
      this.dialogVisible = false
      this.dialogForm = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.tenant{
  height: 100%;
}
</style>
