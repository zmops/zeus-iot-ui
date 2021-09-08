<!-- 告警记录页面 -->
<template>
  <div class="alarmList">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>告警记录</template>
      <template v-slot:subhead>告警记录包含所有已发出的满足告警规则的告警信息。</template>
    </ListHeadTemplate>
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
import {getProductList, getServiceByPage} from '@/api/porductMgr'
import {getDeviceList} from '@/api/deviceMgr'
import {getDictListByCode} from '@/api/system'
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'

export default {
  name: 'alarmList',
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
      formParams: [],
      form: {
        deviceId: '',
        name: '',
        mark: '',
        level: '',
        bq: {
          key: '',
          value: ''
        }
      },
      tableData: [],
      devList: [],
      productList: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      columns: [
        {
          label: '触发时间',
          prop: 'mark',
          show: true
        },
        {
          label: '解决时间',
          prop: 'mark',
          show: true
        },
        {
          label: '告警级别',
          prop: 'mark',
          show: true
        },
        {
          label: '设备',
          prop: 'name',
          event: true,
          show: true
        },
        {
          label: '内容',
          prop: 'asyncName',
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
    this.searchInit()
    this.getList()
  },
  methods: {
    async searchInit() {
      await getDeviceList({}).then((res) => {
        if (res.code == 200) {
          this.devList = res.data
        }
      })
      this.formParams = [
        {
          componentName: 'SelectTemplate',
          keyName: 'name',
          label: '告警状态',
          options: ['未解决', '已解决'],
          w: 120
        },
        {
          componentName: 'SelectTemplate',
          keyName: 'level',
          label: '告警级别',
          options: ['紧急', '高级', '中级', '低级', '信息'],
          w: 120
        },
        {
          componentName: 'SelectTemplate',
          keyName: 'deviceId',
          label: '设备',
          optionId: 'deviceId',
          optionName: 'name',
          options: this.devList,
          w: 115
        },
        {
          componentName: 'DateTimePickerTemplate',
          keyName: 'mark',
          label: '触发时间'
        },
        {
          componentName: 'KeyValueTemplate',
          keyName: 'bq',
          label: '标签',
          w: 100
        }
      ]
    },
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      // this.loading = true
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
.alarmList {

}
</style>
