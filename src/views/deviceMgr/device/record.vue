<!-- 日志页面 -->
<template>
  <div class="record">
    <SearchForm :params="formParams" :columns="columns" @search="search"/>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import { deviceLogList } from '@/api/deviceMgr'

export default {
  name: 'Record',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    SearchForm,
    Pagination
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'SelectTemplate',
          keyName: 'logType',
          label: '日志类型',
          options: ['事件日志', '服务日志', '告警日志']
        },
        {
          componentName: 'DateTimePickerTemplate',
          keyName: 'time',
          label: '触发时间'
        }
      ],
      form: {
        logType: '',
        time: []
      },
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      columns: [
        {
          label: '日志类型',
          prop: 'logType',
          show: true
        },
        {
          label: '触发时间',
          prop: 'triggerTime',
          show: true
        },
        {
          label: '内容',
          prop: 'content',
          show: true
        },
        {
          label: '输入参数',
          prop: 'param',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          show: true
        },
        // {
        //   label: '',
        //   prop: 'buttons',
        //   show: true,
        //   width: 160,
        //   idName: 'id',
        //   fixed: 'right',
        //   buttons: [
        //     {
        //       label: '解决',
        //       event: 'solve'
        //     }
        //   ]
        // }
      ]
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
      this.loading = true
      if (this.form.time && this.form.time.length) {
        this.form.timeFrom = this.form.time[0]
        this.form.timeTill = this.form.time[0]
      }
      deviceLogList({ ...this.form, maxRow: this.size, page: this.page, deviceId: this.$route.query.id }).then((res) => {
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
    solve(id) {

    }
  }
}
</script>

<style lang="scss" scoped>
.record {

}
</style>
