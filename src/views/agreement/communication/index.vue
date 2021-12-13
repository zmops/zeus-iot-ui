<!--通信服务页面-->
<template>
  <div class="communication">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>通信服务</template>
      <template v-slot:subhead>通信服务对本平台各类通信服务进行统一管理。</template>
    </ListHeadTemplate>
    <SearchForm v-if="!dialogVisible" :params="formParams" :buttons="buttons" :batch-buttons="batchButtons" :columns="columns" @search="search"/>
    <BusinessTable
      v-if="!dialogVisible"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      @detail="detail"
    />
    <Pagination v-if="!dialogVisible" :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    <div v-if="dialogVisible">
      <FormTemplate :up="'通信服务列表'" :state="state + '通信服务'" :but-loading="butLoading" @submit="submit" @cancel="close">
        <template v-slot:main>
          <moduleForm ref="moduleForm" v-model="dialogForm"/>
        </template>
      </FormTemplate>
    </div>
  </div>
</template>
<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import moduleForm from '@/views/agreement/communication/form'
import FormTemplate from '@/components/Slots/FormTemplate'
import BusinessTable from '@/components/Basics/BusinessTable'
import {
  createService,
  updateService,
  getProtocolServiceByPage,
  deleteService
} from '@/api/agreement'

export default {
  name: 'communication',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    ListHeadTemplate,
    SearchForm,
    Pagination,
    moduleForm,
    FormTemplate,
    BusinessTable
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'SelectTemplate',
          keyName: 'protocolType',
          label: '通信服务类型',
          optionId: 'code',
          optionName: 'name',
          options: [
            { name: 'MQTT 客户端', code: '1' },
          ]
        },
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '通信服务名称'
        }
      ],
      columns: [
        {
          label: '通信服务名称',
          prop: 'name',
          event: 'detail',
          show: true
        },
        {
          label: '通信服务类型',
          prop: 'protocolTypeName',
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '创建人',
          prop: 'createUserName',
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
          show: true,
          width: 270,
          idName: 'protocolServiceId',
          buttons: [
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
      butLoading: false,
      total: 0,
      size: 10,
      page: 1,
      form: {
        protocolType: '',
        name: ''
      },
      devList: [],
      ids: [],
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
          event: 'delete'
        }
      ],
      dialogVisible: false,
      state: '',
      dialogForm: {
        name: '',
        effectProxy: '',
        protocolType: '',
        remark: '',
        clientId: '',
        ip: '',
        port: '',
        msgLength: ''
      }
    }
  },
  async created() {
    if (this.$route.query.name) {
      this.form.name = this.$route.query.name
    }
    await this.getList()
  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    getList() {
      this.loading = true
      getProtocolServiceByPage({ ...this.form, maxRow: this.size, page: this.page}).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleSelect(selection) {
      this.ids = selection.map((i) => {
        return i.id
      })
    },
    detail(item) {
      this.dialogForm = JSON.parse(JSON.stringify(item))
      this.state = '编辑'
      this.dialogVisible = true
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    delete(id) {
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteService({ protocolServiceIds: [id] }).then(async(res) => {
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
    submit() {
      if (this.$refs.moduleForm.validateForm()) {
        this.butLoading = true
        if (this.state === '创建') {
          createService(this.dialogForm).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.close()
              this.getList()
            }
            this.butLoading = false
          }).catch(() => {
            this.butLoading = false
          })
        } else {
          updateService(this.dialogForm).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.close()
              this.getList()
            }
            this.butLoading = false
          }).catch(() => {
            this.butLoading = false
          })
        }
      }
    },
    close() {
      this.dialogVisible = false
      this.dialogForm = {
        name: '',
        effectProxy: '',
        protocolType: '',
        remark: '',
        clientId: '',
        ip: '',
        port: '',
        msgLength: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.communication {
  height: 100%;
}

.setting-buttons .setting-button {
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
}

.setting-buttons ::v-deep.el-button.is-round:hover {
  background: #eff4f9;
  border: 1px solid #ccd3db;
}

.event {
  color: #409eff;
  cursor: pointer;
}

.table {
  font-size: 12px;
}
</style>
