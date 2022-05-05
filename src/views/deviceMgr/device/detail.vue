<!-- 设备详情页面 -->
<template>
  <div class="device-detail">
    <DetailTemplate :up="'设备'" :title="title" :subhead="subhead" :detail-list="detailList" :tabs="tabs" @changeTabs="changeTabs">
      <template v-slot:main>
        <info v-if="activity === '基础信息'" :info-data="info" @updata="getDetail" />
        <attribute v-else-if="activity === '属性'" />
        <record v-else-if="activity === '日志'" />
        <attributeMgr v-else-if="activity === '属性管理'" :pro-id="proId" />
        <incident v-else-if="activity ==='事件管理'" is-dev />
        <serve v-else-if="activity === '服务管理'" is-dev />
        <offLineRule v-else-if="activity === '上下线规则'" is-dev />
        <alarm v-else-if="activity === '告警规则'" is-dev />
        <tag v-else-if="activity === '标签'" is-dev @updata="getDetail" />
        <variable v-else-if="activity === '变量'" is-dev />
        <mapping v-else-if="activity === '值映射方案'" is-dev />
        <subset v-else-if="activity === '子设备'" />
      </template>
    </DetailTemplate>
  </div>
</template>
<script>
import DetailTemplate from '@/components/Slots/DetailTemplate.vue'
import attribute from '@/views/deviceMgr/device/attribute'
import mapping from '@/views/deviceMgr/device/mapping'
import tag from '@/views/deviceMgr/device/tag'
import info from '@/views/deviceMgr/device/info'
import incident from '@/views/deviceMgr/device/incident'
import serve from '@/views/deviceMgr/device/serve'
import alarm from '@/views/deviceMgr/device/alarm'
import subset from '@/views/deviceMgr/device/subset'
import variable from '@/views/deviceMgr/device/variable'
import record from '@/views/deviceMgr/device/record'
import attributeMgr from '@/views/deviceMgr/device/attributeMgr'
import offLineRule from '@/views/deviceMgr/device/offLineRule'
import { deviceDetail, getDeviceTag } from '@/api/deviceMgr'
export default {
  name: 'DeviceDetail',
  components: {
    DetailTemplate,
    attribute,
    mapping,
    info,
    tag,
    incident,
    serve,
    subset,
    alarm,
    variable,
    record,
    attributeMgr,
    offLineRule
  },
  data() {
    return {
      detailList: [],
      tabs: [
        {
          label: '基础信息',
          name: '基础信息'
        },
        {
          label: '属性',
          name: '属性'
        },
        {
          label: '日志',
          name: '日志'
        },
        {
          label: '属性管理',
          name: '属性管理'
        },
        {
          label: '事件管理',
          name: '事件管理'
        },
        {
          label: '服务管理',
          name: '服务管理'
        },
        {
          label: '上下线规则',
          name: '上下线规则'
        },
        {
          label: '告警规则',
          name: '告警规则'
        },
        {
          label: '标签',
          name: '标签'
        },
        {
          label: '变量',
          name: '变量'
        },
        {
          label: '值映射方案',
          name: '值映射方案'
        }
      ],
      subhead: '',
      title: '',
      activity: '基础信息',
      info: {},
      tagList: [],
      deviceId: '',
      proId: ''
    }
  },
  async created() {
    if (this.$route.query.id) {
      this.deviceId = this.$route.query.id
      await this.getDetail()
    }
    if (this.$route.query.tabsName) {
      this.activity = this.$route.query.tabsName
    }
  },
  methods: {
    changeTabs(name) {
      this.activity = name
    },
    async getDetail() {
      await getDeviceTag({ deviceId: this.deviceId }).then((res) => {
        if (res.code == 200) {
          this.tagList = res.data
        }
      })
      await deviceDetail({ deviceId: this.deviceId }).then((res) => {
        if (res.code == 200) {
          this.info = res.data
          this.proId = res.data.productId
          if (this.info.type == '3') {
            this.tabs.push({
              label: '子设备',
              name: '子设备'
            })
          }
          this.detailList = [
            {
              key: '设备ID',
              value: res.data.deviceId
            },
            {
              key: '产品',
              link: { path: '/productMgr/product/detail', query: { id: res.data.productId }},
              value: res.data.productName
            },
            {
              key: '设备类型',
              value: res.data.typeName
            },
            {
              key: '设备组',
              value: res.data.groupName.split(',')
            },
            {
              key: '标签',
              tag: this.tagList,
              value: 'tage'
            },
            {
              key: '创建时间',
              value: res.data.createTime
            },
            // {
            //   key: '最近在线时间',
            //   value: res.data.latestOnline
            // },
            {
              key: '创建人',
              value: res.data.createUserName
            }
          ]
          this.subhead = res.data.remark
          this.title = res.data.name
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.device-detail{
  height: 100%;
}
</style>
