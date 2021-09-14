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
import { getServiceByPage } from '@/api/porductMgr'

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
          keyName: 'name',
          label: '日志类型',
          options: ['事件日志', '服务日志', '告警日志']
        },
        {
          componentName: 'DateTimePickerTemplate',
          keyName: 'mark',
          label: '触发时间'
        }
      ],
      form: {
        name: '',
        mark: ''
      },
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      columns: [
        {
          label: '日志类型',
          prop: 'name',
          show: true
        },
        {
          label: '触发时间',
          prop: 'mark',
          show: true
        },
        {
          label: '内容',
          prop: 'asyncName',
          show: true
        },
        {
          label: '输入参数',
          prop: 'remark',
          show: true
        },
        {
          label: '状态',
          prop: 'remark',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 160,
          idName: 'id',
          fixed: 'right',
          buttons: [
            {
              label: '解决',
              event: 'solve'
            }
          ]
        }
      ]
    }
  },
  created() {

  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      // getServiceByPage({ ...this.form, maxRow: this.size, page: this.page, prodId: this.prodId }).then((res) => {
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
    solve(id) {

    }
  }
}
</script>

<style lang="scss" scoped>
.record {

}
</style>
