<!-- 设备日志页面 -->
<template>
  <div class="devLog">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>设备日志</template>
      <template v-slot:subhead></template>
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
  name: 'devLog',
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
        productId: null,
        deviceId: '',
        name: '',
        mark: '',
        nr: '',
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
  watch: {
    'form.productId': {
      immediate: true,
      async handler(val) {
        this.form.deviceId = []
        let devTemplate = []
        if (val !== '') {
          await getDeviceList({productId: val}).then((res) => {
            if (res.code == 200) {
              devTemplate = res.data
            }
          })
        }
        this.formParams = [
          {
            componentName: 'SelectTemplate',
            keyName: 'productId',
            label: '产品',
            optionId: 'productId',
            optionName: 'name',
            options: this.productList,
            w: 115
          },
          {
            componentName: 'SelectTemplate',
            keyName: 'deviceId',
            label: '设备',
            optionId: 'deviceId',
            optionName: 'name',
            options: devTemplate,
            w: 115
          },
          {
            componentName: 'SelectTemplate',
            keyName: 'name',
            label: '日志类型',
            options: ['事件日志', '服务日志', '告警日志'],
            w: 120
          },
          {
            componentName: 'DateTimePickerTemplate',
            keyName: 'mark',
            label: '触发时间'
          },
          {
            componentName: 'InputTemplate',
            keyName: 'nr',
            label: '内容',
            w: 130
          },
          {
            componentName: 'KeyValueTemplate',
            keyName: 'bq',
            label: '标签',
            w: 100
          }
        ]
      }
    }
  },
  created() {
    this.searchInit()
  },
  methods: {
    searchInit() {
      // 获取产品列表
      getProductList({}).then((res) => {
        if (res.code == 200) {
          this.productList = res.data
          this.form.productId = ''
        }
      })
    },
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
.devLog {

}
</style>
