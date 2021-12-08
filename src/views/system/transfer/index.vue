<!-- transfer采集器页面 -->
<template>
  <div class="transfer">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>Transfer 采集器</template>
      <template v-slot:subhead>平台通过 Transfer 采集器来获取 Zabbix 的时序数据，以便后续将其写入涛思数据库中。采集器的数量应该与 Zabbix 的 StartDBSyncers 相同。
      </template>
    </ListHeadTemplate>
    <SearchForm :columns="columns" :buttons="buttons" :batch-buttons="batchButtons" :selected="ids.length > 0"
                @cancel="ids = []"/>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :selection="true"
      :icon="$route.meta.icon24"
      @select="handleSelect"
      @switchChange="switchChange"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import {createTransfer, deleteTransfer, getTransfer, runTransfer} from '@/api/system'

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
          prop: 'runningStatus',
          status: true,
          show: true
        },
        {
          label: '修改时间',
          prop: 'createtime',
          show: true
        },
        {
          label: '读取总条数',
          prop: 'readDataCount',
          show: true
        },
        {
          label: '读取/发送频率(条/s)',
          prop: 'sendspeed',
          show: true
        },
        {
          label: '读取速率(kb/s)',
          prop: 'readspeedKb',
          show: true
        },
        {
          label: '成功/总解析条数',
          prop: 'parseTotal',
          show: true
        },
        {
          label: '成功/总发送条数',
          prop: 'sendSuccess',
          show: true
        },
        {
          label: '路径',
          prop: 'logpath',
          show: true
        },
        {
          label: '待读取数据量',
          prop: 'lagSize',
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
      ids: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getTransfer().then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    handleSelect(selection) {
      this.ids = selection.map((i) => {
        return i.name
      })
    },
    add() {
      createTransfer().then(async (res) => {
        if (res.code == 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          await this.getList()
        }
      })
    },
    switchChange(val) {
      const run = val.status === 'ENABLE'
      this.loading = true
      runTransfer({run, names: [val.name]}).then(async (res) => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          await this.getList()
        }
      })
    },
    delete() {
      this.$confirm('是否确认删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTransfer({names: this.ids}).then(async (res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.ids = []
            // 删除后重新请求数据
            await this.getList()
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer {

}
</style>
