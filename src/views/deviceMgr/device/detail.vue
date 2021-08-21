<!-- 设备详情页面 -->
<template>
  <div class="device-detail">
    <DetailTemplate :up="'设备'" :title="title" :subhead="subhead" :detail-list="detailList" :tabs="tabs" @changeTabs="changeTabs">
      <template v-slot:main>
        <info v-if="activity === '基础信息'" :info-data="info" />
        <attribute v-else-if="activity === '属性'" />
        <tag v-else-if="activity === '标签'" />
        <div v-else-if="activity === '值映射'" class="zeus-product">
          <mapping />
        </div>
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
import { deviceDetail, getDeviceTag } from '@/api/deviceMgr'
export default {
  name: 'DeviceDetail',
  components: {
    DetailTemplate,
    attribute,
    mapping,
    info,
    tag
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
          label: '事件',
          name: '事件'
        },
        {
          label: '服务',
          name: '服务'
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
          label: '值映射',
          name: '值映射'
        },
        {
          label: '子设备',
          name: '子设备'
        }
      ],
      subhead: '',
      title: '',
      activity: '基础信息',
      info: {}
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getTag(this.$route.query.id)
      this.getDetail(this.$route.query.id)
    }
    if (this.$route.query.tabsName) {
      this.activity = this.$route.query.tabsName
    }
  },
  methods: {
    changeTabs(name) {
      this.activity = name
    },
    getTag(deviceId) {
      getDeviceTag({ deviceId }).then((res) => {

      })
    },
    getDetail(deviceId) {
      deviceDetail({ deviceId }).then((res) => {
        if (res.code == 200) {
          this.info = res.data
          this.detailList = [
            {
              key: '设备ID',
              value: res.data.deviceId
            },
            {
              key: '产品',
              value: res.data.productName
            },
            {
              key: '设备类型',
              value: res.data.typeName
            },
            {
              key: '设备组',
              value: res.data.groupName
            },
            {
              key: '标签',
              value: 'tage'
            },
            {
              key: '创建时间',
              value: res.data.createTime
            },
            {
              key: '最近在线时间',
              value: '-'
            },
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
.device-detail {

}
</style>
