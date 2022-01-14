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
    <div class="setting-form setting-form-light">
      <div class="condition zeus-flex-between">
        <div class="form">
          <DateTimePickerTemplate class="zeus-mr-5" :key-name="'time'" :label="'触发时间'" />
          <SelectTemplate v-if="$route.meta.title === '联动日志'" class="zeus-mr-5" :key-name="'eventRuleId'" :label="'场景联动'" :option-id="'eventRuleId'" :option-name="'eventRuleName'" :options="sceneList" />
          <SelectTemplate v-if="$route.meta.title === '联动日志'" class="zeus-mr-5" :key-name="'triggerType'" :label="'触发类型'" :options="['手动', '自动']" />
          <SelectTemplate v-if="$route.meta.title === '服务日志'" class="zeus-mr-5" :key-name="'triggerType'" :label="'触发类型'" :options="['场景联动', '手动']" />
          <SelectTemplate v-if="form.triggerType === '场景联动'" class="zeus-mr-5" :key-name="'eventRuleId'" :label="'触发主体'" :option-id="'eventRuleId'" :option-name="'eventRuleName'" :options="triggerList" />
          <SelectTemplate v-if="form.triggerType === '手动'" class="zeus-mr-5" :key-name="'triggerUser'" :label="'触发主体'" :option-id="'userId'" :option-name="'name'" :options="triggerList" />
          <DeviceSelectTemplate v-if="$route.meta.title === '联动日志'" class="zeus-mr-5" :key-name="'triggerDeviceId'" :label="'触发设备'" :option-id="'deviceId'" :option-name="'name'" :options="devTemplate" />
          <DeviceSelectTemplate class="zeus-mr-5" :key-name="'deviceId'" :label="$route.meta.title === '联动日志'?'执行设备':'设备名称'" :option-id="'deviceId'" :option-name="'name'" :options="devTemplate" />
          <SelectTemplate v-if="$route.meta.title === '服务日志'" class="zeus-mr-5" :key-name="'content'" :label="'服务名称'" :option-id="'name'" :option-name="'name'" :options="serviceList" />
          <SelectTemplate v-if="$route.meta.title === '事件日志'" class="zeus-mr-5" :key-name="'content'" :label="'事件名称'" :option-id="'attrName'" :option-name="'attrName'" :options="eventList" />
          <el-button size="mini" class="setting-button" round @click.prevent="search"><svg-icon icon-class="list_search" /></el-button>
        </div>
      </div>
    </div>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      @rule="rule"
      @detail="detail"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import Pagination from '@/components/Basics/Pagination'
import { getServiceList } from '@/api/porductMgr'
import { getDeviceList, getLogByPage, getEventList } from '@/api/deviceMgr'
import { getSceneList } from '@/api/scene'
import { getUserList2 } from '@/api/system'
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import DateTimePickerTemplate from '@/components/Basics/DateTimePickerTemplate'
import SelectTemplate from '@/components/Basics/SelectTemplate'
import DeviceSelectTemplate from '@/components/Basics/DeviceSelectTemplate'

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
    Pagination,
    DateTimePickerTemplate,
    SelectTemplate,
    DeviceSelectTemplate
  },
  data() {
    return {
      form: {
        eventRuleId: '',
        triggerType: '',
        triggerUser: '',
        triggerDeviceId: '',
        deviceId: '',
        logType: '',
        time: '',
        content: ''
      },
      tableData: [],
      devTemplate: [],
      loading: false,
      total: 0,
      size: 20,
      page: 1,
      columns: [],
      sceneList: [],
      triggerList: [],
      userList: [],
      serviceList: [],
      eventList: []
    }
  },
  watch: {
    'form.triggerType': {
      handler(val) {
        if (val === '手动') {
          this.triggerList = this.userList
          if (this.$route.meta.title === '服务日志') {
            this.form.eventRuleId = ''
          }
        } else if (val === '自动' || val === '') {
          this.triggerList = []
        } else if (val === '场景联动') {
          this.triggerList = this.sceneList
          this.form.triggerUser = ''
        } else {
          this.form.triggerUser = ''
        }
      }
    },
    'form.deviceId': {
      handler(prodId) {
        this.form.content = ''
        if (prodId) {
          if (this.$route.meta.title === '服务日志') {
            getServiceList({ prodId }).then((res) => {
              if (res.code == '200') {
                this.serviceList = res.data
              }
            })
          } else if (this.$route.meta.title === '事件日志') {
            getEventList({ prodId }).then((res) => {
              if (res.code == '200') {
                this.eventList = res.data
              }
            })
          }
        } else {
          this.serviceList = []
          this.eventList = []
        }
      }
    }
  },
  async created() {
    await this.searchInit()
    await this.getList()
    if (this.$route.meta.title === '联动日志') {
      this.columns = [
        {
          label: '触发时间',
          prop: 'triggerTime',
          show: true
        },
        {
          label: '场景联动名称',
          prop: 'content',
          show: true
        },
        {
          label: '触发类型',
          prop: 'triggerType',
          show: true
        },
        {
          label: '触发主体',
          prop: 'triggerBody',
          show: true
        },
        {
          label: '触发设备',
          prop: 'triggerDevice',
          device: true,
          show: true
        },
        {
          label: '执行设备',
          prop: 'executeDevice',
          device: true,
          show: true
        },
        {
          label: '联动服务',
          prop: 'buttons',
          width: 120,
          show: true,
          idName: 'eventRuleId',
          buttons: [
            {
              label: '查看',
              event: 'examine',
              icon: 'list_eye'
            }
          ]
        }
      ]
    } else if (this.$route.meta.title === '服务日志') {
      this.columns = [
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
          label: '服务名称',
          prop: 'content',
          show: true
        },
        {
          label: '触发类型',
          prop: 'triggerType',
          show: true
        },
        {
          label: '触发主体',
          prop: 'triggerBody',
          event: 'rule',
          show: true
        },
        {
          label: '输入参数',
          prop: 'param',
          width: 400,
          show: true
        }
      ]
    } else if (this.$route.meta.title === '事件日志') {
      this.columns = [
        {
          label: '事件时间',
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
          label: '事件名称',
          prop: 'content',
          show: true
        },
        {
          label: '事件标识符',
          prop: 'key',
          show: true
        },
        {
          label: '数据',
          prop: 'param',
          width: 400,
          show: true
        }
      ]
    }
  },
  methods: {
    async searchInit() {
      // 获取设备列表
      await getDeviceList({}).then((res) => {
        if (res.code == 200) {
          this.devTemplate = res.data
        }
      })
      // 获取场景联动list
      await getSceneList({}).then((res) => {
        if (res.code == 200) {
          this.sceneList = res.data
          if (this.$route.query.id) {
            if (this.$route.meta.title === '服务日志') {
              this.form.triggerType = '场景联动'
              // this.form.triggerUser = this.$route.query.id
              this.form.eventRuleId = this.$route.query.id
              this.triggerList = this.sceneList
            } else if (this.$route.meta.title === '联动日志') {
              this.form.eventRuleId = this.$route.query.id
            }
          }
        }
      })
      // 获取用户list
      await getUserList2({}).then((res) => {
        if (res.code == 200) {
          this.userList = res.data
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
        this.form.timeTill = this.form.time[1]
      } else {
        this.form.timeFrom = ''
        this.form.timeTill = ''
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
    detail(item) {
      const url = this.$router.resolve({
        path: '/deviceMgr/device/detail',
        query: { id: item.deviceId }
      })
      window.open(url.href, '_blank')
    },
    rule(item) {
      if (item.triggerType === '手动') {
        return false
      }
      const url = this.$router.resolve({
        path: '/platformLog/linkage',
        query: { id: item.eventRuleId }
      })
      window.open(url.href, '_blank')
    },
    examine(id) {
      const url = this.$router.resolve({
        path: '/platformLog/service',
        query: { id }
      })
      window.open(url.href, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
.devLog{
  height: 100%;
  ::v-deep.el-table__body-wrapper{
    height: calc(100% - 50px) !important
  }
  ::v-deep.el-table__empty-block{
    width: 100% !important
  }
  .setting-form{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    box-shadow: 0 1px 0 0 #eff4f9;

    .condition{
      flex: 1;
      margin-right: 20px;
    }

    ::v-deep.el-form-item{
      margin-bottom: 0!important;
    }
  }
  .setting-form-light{
    background-color: #f9fbfd;
    width: 100%;

    .form{
      display: flex;
      width: calc(100% - 80px);

      .is-round{
        padding: 5px 24px;
        margin-left: 5px;
        border: none;
        background: #f9fbfd;
      }
      .is-round:hover{
        background: #E3E9EF !important;
        border: none !important;
      }
    }
  }
}
</style>
