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
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%;padding: 0 12px 12px 12px;"
      :height="'calc(100% - 242px)'"
      class="table">
      <el-table-column width="48">
        <template>
          <svg-icon :icon-class="$route.meta.icon24" style="font-size: 24px" />
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in columns" :key="index" :label="item.label">
        <template slot-scope="scope">
          <span v-if="item.prop === 'buttons'" class="setting-buttons">
            <el-button
              v-if="scope.row.acknowledged === '未确认' && scope.row.statusName !== '已解决'"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="affirm(scope.row.eventId)"
            >
              <svg-icon icon-class="list_affirm" />
              确认
            </el-button>
            <el-button
              v-if="scope.row.statusName === '未解决'"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="solve(scope.row.eventId)"
            >
              <svg-icon icon-class="list_affirm" />
              解决
            </el-button>
          </span>
          <span v-else-if="item.prop === 'deviceName'" class="event" @click="detail(scope.row.deviceId)">
            {{ scope.row[item.prop] ? scope.row[item.prop] : '-' }}
          </span>
          <span v-else>
            {{ scope.row[item.prop] ? scope.row[item.prop] : '-' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
  </div>
</template>

<script>
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
          event: 'detail',
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
          width: 160
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
          componentName: 'DeviceSelectTemplate',
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
      } else {
        this.form.timeFrom = ''
        this.form.timeTill = ''
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
        return item.eventId === eventId
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
        return item.eventId === eventId
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
    detail(id) {
      this.$router.push({
        path: '/deviceMgr/device/detail',
        query: { id }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.alarmList{
  height: 100%;
}
.setting-buttons .setting-button {
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
}

.setting-buttons ::v-deep.el-button.is-round:hover {
  background: #eff4f9;
  border: 1px solid #ccd3db;
}
.event {
  color: #409eff;
  cursor: pointer;
}
.table{
  font-size: 12px;
}
</style>
