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
      @detail="detail"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import { getDeviceList } from '@/api/deviceMgr'
import { getAlarmByPage, resolve, acknowledgement } from '@/api/alarm'
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
        statusName: '',
        severity: '',
        time: []
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
          prop: 'clock',
          show: true
        },
        {
          label: '解决时间',
          prop: 'rClock',
          show: true
        },
        {
          label: '告警级别',
          prop: 'severityName',
          show: true
        },
        {
          label: '设备',
          prop: 'deviceName',
          event: true,
          show: true
        },
        {
          label: '内容',
          prop: 'name',
          show: true
        },
        {
          label: '解决状态',
          prop: 'statusName',
          show: true
        },
        {
          label: '确认状态',
          prop: 'acknowledged',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 160,
          idName: 'eventid',
          fixed: 'right',
          buttons: [
            {
              label: '确认',
              event: 'affirm',
              icon: 'list_affirm'
            },
            {
              label: '解决',
              event: 'solve',
              icon: 'list_solve'
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
          keyName: 'statusName',
          label: '告警状态',
          options: ['未解决', '已解决'],
          w: 200
        },
        {
          componentName: 'SelectTemplate',
          keyName: 'severity',
          label: '告警级别',
          optionId: 'value',
          optionName: 'label',
          options: [
            { label: '信息', value: '1' },
            { label: '低级', value: '2' },
            { label: '中级', value: '3' },
            { label: '高级', value: '4' },
            { label: '紧急', value: '5' }
          ],
          w: 200
        },
        {
          componentName: 'SelectTemplate',
          keyName: 'deviceId',
          label: '设备',
          optionId: 'deviceId',
          optionName: 'name',
          options: this.devList,
          w: 200
        },
        {
          componentName: 'DateTimePickerTemplate',
          keyName: 'time',
          label: '触发时间'
        }
      ]
    },
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      if (this.form.time && this.form.time.length) {
        this.form.timeFrom = this.form.time[0] / 1000
        this.form.timeTill = this.form.time[1] / 1000
      }
      getAlarmByPage({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          res.data.map((i) => {
            if (i.rClock == '0') {
              i.rClock = '-'
            }
            if (i.status) {
              i.statusName = i.status
              this.$delete(i, 'status')
            }
            return i
          })
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
    /* 解决 */
    solve(eventId) {
      const i = this.tableData.find((item) => {
        return item.eventid === eventId
      })
      if (i.statusName === '已解决') {
        this.$message({
          message: '当前记录已解决,不可重复操作',
          type: 'warning'
        })
        return false
      }
      resolve({ eventId }).then((res) => {
        if (res.code == '200') {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    /* 确认 */
    affirm(eventId) {
      const i = this.tableData.find((item) => {
        return item.eventid === eventId
      })
      if (i.acknowledged === '已确认') {
        this.$message({
          message: '当前记录已确认,不可重复操作',
          type: 'warning'
        })
        return false
      }
      acknowledgement({ eventId }).then((res) => {
        if (res.code == '200') {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        }
      })
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
