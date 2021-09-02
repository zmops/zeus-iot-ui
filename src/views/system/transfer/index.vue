<!-- transfer采集器页面 -->
<template>
  <div class="transfer">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>Transfer 采集器</template>
      <template v-slot:subhead>平台通过 Transfer 采集器来获取 Zabbix 的时序数据，以便后续将其写入涛思数据库中。采集器的数量应该与 Zabbix 的 StartDBSyncers 相同。</template>
    </ListHeadTemplate>
    <SearchForm :params="formParams" :columns="columns" :buttons="buttons" :batch-buttons="batchButtons" :selected="ids.length > 0" @search="search" @cancel="ids = []"/>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :selection="true"
      :icon="$route.meta.icon24"
      @select="handleSelect"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import {createProxy, deleteProxy, getProxyByPage, updateProxy} from '@/api/system'

export default {
  name: 'Transfer',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    ListHeadTemplate,
    BusinessTable,
    SearchForm,
    Pagination
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '采集器名称'
        }
      ],
      tableData: [],
      loading: false,
      dialogVisible: false,
      state: '',
      total: 0,
      size: 10,
      page: 1,
      dialogForm: {
        name: ''
      },
      buttons: [
        {
          type: 'primary',
          label: '一键启动',
          event: 'add'
        }
      ],
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ]
      },
      columns: [
        {
          label: '采集器名称',
          prop: 'name',
          show: true
        },
        {
          label: '运行状态',
          prop: 'status',
          status: true,
          show: true
        },
        {
          label: '修改时间',
          prop: 'updateTime',
          show: true
        },
        {
          label: '读取总条数',
          prop: 'updateTime',
          show: true
        },
        {
          label: '读取/发送频率(条/s)',
          prop: 'modeName',
          show: true
        },
        {
          label: '读取速率(kb/s)',
          prop: 'updateTime',
          show: true
        },
        {
          label: '成功/总解析条数',
          prop: 'updateTime',
          show: true
        },
        {
          label: '成功/总发送条数',
          prop: 'updateTime',
          show: true
        },
        {
          label: '路径',
          prop: 'updateTime',
          show: true
        },
        {
          label: '待读取数据量',
          prop: 'updateTime',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 100,
          idName: 'id',
          fixed: 'right',
          buttons: [
            {
              label: '错误日志',
              event: 'log'
            }
          ]
        }
      ],
      batchButtons: [
        {
          type: 'danger',
          label: '删除',
          event: 'delete'
        }
      ],
      deviceList: [],
      attrList: [],
      attributeList: [],
      form: {
        name: ''
      },
      ids: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      // this.loading = true
      // getProxyByPage({...this.form, maxRow: this.size, page: this.page}).then((res) => {
      //   this.loading = false
      //   if (res.code == 200) {
      //     this.tableData = res.data
      //     this.total = res.count
      //   }
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    handleSelect(selection) {
      this.ids = selection.map((i) => {
        return i.id
      })
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    delete() {
      this.$confirm('是否确认删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProxy({ids: this.ids}).then(async (res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.ids = []
            // 删除后重新请求数据
            await this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    edit(id) {
      const i = this.tableData.find((item) => {
        return item.id === id
      })
      this.dialogForm = JSON.parse(JSON.stringify(i))
      this.state = '编辑'
      this.dialogVisible = true
    },
    submit() {
      return
      this.$refs.dialogForm.validate(async (valid, errorFields) => {
        if (valid) {
          if (this.dialogForm.id) {
            updateProxy({name: this.dialogForm.name, id: this.dialogForm.id}).then(async (res) => {
              if (res.code == 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.dialogVisible = false
                await this.getList()
              }
            })
          } else {
            createProxy({name: this.dialogForm.name}).then(async (res) => {
              if (res.code == 200) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.dialogVisible = false
                await this.getList()
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer {

}
</style>
