<!-- 详情页面 -->
<template>
  <div class="tenant-detail">
    <DetailTemplate :up="'租户管理'" :icon="'tenant24'" :title="title" :subhead="subhead" :detail-list="detailList" :tabs="tabs" @changeTabs="changeTabs">
      <template v-slot:main>
        <info v-if="activity === '基础信息'" :info-data="info" @updata="getDetail" />
      </template>
    </DetailTemplate>
  </div>
</template>
<script>
import DetailTemplate from '@/components/Slots/DetailTemplate.vue'
import info from '@/views/system/tenant/info'
import { detailTenant } from '@/api/system'
export default {
  name: 'TenantDetail',
  components: {
    DetailTemplate,
    info
  },
  data() {
    return {
      detailList: [],
      tabs: [
        {
          label: '基础信息',
          name: '基础信息'
        }
      ],
      subhead: '',
      title: '',
      activity: '基础信息',
      info: {},
      tagList: [],
      tenantId: ''
    }
  },
  async created() {
    if (this.$route.query.id) {
      this.tenantId = this.$route.query.id
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
    getDetail() {
      detailTenant({ tenantId: this.tenantId }).then((res) => {
        if (res.code == 200) {
          this.info = res.data
          this.detailList = [
            {
              key: '租户ID',
              value: res.data.tenantId
            },
            {
              key: '租户名称',
              value: res.data.name
            },
            {
              key: '租户管理员',
              value: res.data.account
            },
            {
              key: '联系人',
              value: res.data.contact
            },
            {
              key: '联系方式',
              value: res.data.phone
            },
            {
              key: '创建时间',
              value: res.data.createTime
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
