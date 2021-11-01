<!-- 设备日志页面 -->
<template>
  <div class="devLog">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>{{$route.meta.title}}</template>
      <template v-slot:subhead></template>
    </ListHeadTemplate>
    <SearchForm :params="formParams" :columns="columns" @search="search"/>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      @detail="detail"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import {getProductList} from '@/api/porductMgr'
import {getDeviceList, getLogByPage} from '@/api/deviceMgr'
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
      formParams: [],
      form: {
        productId: null,
        deviceId: '',
        logType: '',
        time: '',
        content: '',
        bq: {
          key: '',
          value: ''
        }
      },
      tableData: [],
      devList: [],
      productList: [],
      devTemplate: [],
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
  watch: {
    'form.deviceId': {
      handler(val) {
        if (val !== '') {
          this.getList()
        }
      }
    },
    'form.productId': {
      immediate: true,
      async handler(val) {
        this.form.deviceId = ''
        if (val === '') {
          await getDeviceList({}).then((res) => {
            if (res.code == 200) {
              this.devTemplate = res.data
              // if (res.data && res.data.length) {
              //   this.form.deviceId = res.data[0].deviceId
              // }
            }
          })
        } else {
          await getDeviceList({productId: val}).then((res) => {
            if (res.code == 200) {
              this.devTemplate = res.data
              // if (res.data && res.data.length) {
              //   this.form.deviceId = res.data[0].deviceId
              // }
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
            w: 200
          },
          {
            componentName: 'DeviceSelectTemplate',
            keyName: 'deviceId',
            label: '设备',
            optionId: 'deviceId',
            optionName: 'name',
            options: this.devTemplate,
            w: 200
          },
          // {
          //   componentName: 'SelectTemplate',
          //   keyName: 'logType',
          //   label: '日志类型',
          //   options: ['事件日志', '服务日志', '告警日志'],
          //   w: 200
          // },
          {
            componentName: 'DateTimePickerTemplate',
            keyName: 'time',
            label: '触发时间'
          },
          {
            componentName: 'InputTemplate',
            keyName: 'content',
            label: '内容'
          },
          // {
          //   componentName: 'KeyValueTemplate',
          //   keyName: 'bq',
          //   label: '标签',
          //   w: 100
          // }
        ]
      }
    }
  },
  async created() {
    if (this.$route.meta.title === '告警日志') {
      this.columns = [
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
          label: '设备名称',
          prop: 'deviceName',
          event: 'detail',
          show: true
        },
        {
          label: '告警级别',
          prop: 'severityName',
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
        }
      ]
    }
    await this.searchInit()
    await this.getList()
  },
  methods: {
    async searchInit() {
      // 获取产品列表
      await getProductList({}).then((res) => {
        if (res.code == 200) {
          this.productList = res.data
          if (res.data && res.data.length) {
            // this.form.productId = res.data[0].productId
            this.form.productId = ''
          }
        }
      })
      await getDeviceList({}).then((res) => {
        if (res.code == 200) {
          this.devTemplate = res.data
          // if (res.data && res.data.length) {
          //   this.form.deviceId = res.data[0].deviceId
          // }
        }
      })

    },
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
      this.form.logType = this.$route.meta.title
      getLogByPage({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
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

    },
    detail(item) {
      this.$router.push({
        path: '/deviceMgr/device/detail',
        query: {
          id: item.deviceId
        }
      })
    }
  }
}
</script>
