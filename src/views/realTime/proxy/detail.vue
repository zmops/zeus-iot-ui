<!-- 详情页面 -->
<template>
  <div class="proxy-detail">
    <DetailTemplate :up="'代理监控'" :icon="'proxy24'" :title="title" :subhead="subhead" :detail-list="detailList" :tabs="tabs" show-time @changeTabs="changeTabs" @changeTime="changeTime">
      <template v-slot:main>
        <os v-if="activity === '操作系统'" />
        <jvm v-if="activity === 'JVM'" />
        <zabbix v-if="activity === 'Zabbix代理'" />
        <sql v-if="activity === 'PostgreSQL'" />
      </template>
    </DetailTemplate>
  </div>
</template>
<script>
import DetailTemplate from '@/components/Slots/DetailTemplate.vue'
import os from '@/views/realTime/proxy/os'
import jvm from '@/views/realTime/proxy/jvm'
import zabbix from '@/views/realTime/proxy/zabbix'
import sql from '@/views/realTime/proxy/sql'
import { detailTenant } from '@/api/system'
export default {
  name: 'proxyDetail',
  components: {
    DetailTemplate,
    os,
    jvm,
    zabbix,
    sql
  },
  data() {
    return {
      detailList: [],
      tabs: [
        {
          label: '操作系统',
          name: '操作系统'
        },
        {
          label: 'JVM',
          name: 'JVM'
        },
        {
          label: 'Zabbix代理',
          name: 'Zabbix代理'
        },
        {
          label: 'PostgreSQL',
          name: 'PostgreSQL'
        }
      ],
      subhead: '',
      title: '',
      activity: '操作系统',
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
    changeTime(time) {

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
