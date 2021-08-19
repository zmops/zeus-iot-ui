<!-- 设备详情页面 -->
<template>
  <div class="device-detail">
    <DetailTemplate :up="'设备'" :title="title" :subhead="subhead" :detail-list="detailList" :tabs="tabs" @changeTabs="changeTabs">
      <template v-slot:main>
        <attribute v-if="activity === '属性'"></attribute>
      </template>
    </DetailTemplate>
  </div>
</template>
<script>
import DetailTemplate from '@/components/Slots/DetailTemplate.vue'
import attribute from '@/views/deviceMgr/device/attribute'
import { deviceDetail, getDeviceTag } from '@/api/deviceMgr'
export default {
  name: 'DeviceDetail',
  components: {
    DetailTemplate,
    attribute
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
          label: '元数据',
          name: '元数据'
        },
        {
          label: '属性',
          name: '属性'
        },
        {
          label: '记录',
          name: '记录'
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
          label: '值映射方案',
          name: '值映射方案'
        },
        {
          label: '子设备',
          name: '子设备'
        }
      ],
      subhead: '',
      title: '',
      activity: '基础信息'
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
