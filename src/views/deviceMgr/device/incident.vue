<!--设备详情-事件页面 -->
<template>
  <div class="incident">
    <SearchForm :params="formParams" :buttons="buttons" :columns="columns" @search="search"/>
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
import { getDeviceByPage } from '@/api/deviceMgr'

export default {
  name: 'Incident',
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
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '事件名称'
        },
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '标识符'
        }
      ],
      form: {
        name: ''
      },
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      columns: [
        {
          label: '事件名称',
          prop: 'name',
          show: true
        },
        {
          label: '标识符',
          prop: 'deviceId',
          show: true
        },
        {
          label: '事件级别',
          prop: 'productName',
          show: true
        },
        {
          label: '数据类型',
          prop: 'typeName',
          show: true
        },
        {
          label: '取数间隔',
          prop: 'status',
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '修改时间',
          prop: 'createTime',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 160,
          idName: 'deviceId',
          fixed: 'right',
          buttons: [
            {
              label: '编辑',
              event: 'detail'
            },
            {
              label: '删除',
              event: 'delete'
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
      getDeviceByPage({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    detail(item) {
      this.$router.push({
        path: '/deviceMgr/device/detail',
        query: {
          id: item.deviceId
        }
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.incident {

}
</style>
