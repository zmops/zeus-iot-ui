<!-- 业务日志页面 -->
<template>
  <div class="business-log">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>业务日志</template>
      <template v-slot:subhead></template>
    </ListHeadTemplate>
    <SearchForm :params="formParams" :columns="columns" @search="search" />
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
    />
    <Pagination :total="total" :size="form.maxRow" :current-page="form.page" @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import SearchForm from '@/components/Basics/SearchForm'
import BusinessTable from '@/components/Basics/BusinessTable'
import Pagination from '@/components/Basics/Pagination'
import { getLogList } from '@/api/log'

export default {
  provide() {
    return {
      farther: this
    }
  },
  name: 'BusinessLog',
  components: {
    ListHeadTemplate,
    SearchForm,
    BusinessTable,
    Pagination
  },
  data() {
    return {
      form: {
        logName: '',
        logType: '',
        beginTime: '',
        endTime: '',
        time: [],
        maxRow: 20,
        page: 1
      },
      tableData: [],
      loading: false,
      total: 0,
      columns: [
        {
          label: '创建时间',
          prop: 'createTime',
          show: true
        },
        {
          label: '类型',
          prop: 'logType',
          show: true
        },
        {
          label: '日志名称',
          prop: 'logName',
          show: true
        },
        {
          label: '状态',
          prop: 'succeed',
          show: true
        },
        {
          label: '备注信息',
          prop: 'message',
          show: true
        }
      ],
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'logName	',
          label: '日志名称'
        },
        {
          componentName: 'DateTimePickerTemplate',
          keyName: 'time'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.form.page = 1
      if (this.form.time && this.form.time.length) {
        this.form.beginTime = this.form.time[0]
        this.form.endTime = this.form.time[1]
      }
      this.getList()
    },
    getList() {
      this.loading = true
      getLogList(this.form).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = Number(res.count)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.getList()
    }
  }
}
</script>
