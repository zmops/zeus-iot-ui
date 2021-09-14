<!--产品详情页面 -->
<template>
  <div class="product-detail">
    <DetailTemplate :up="'产品'" :title="title" :subhead="subhead" :detail-list="detailList" :tabs="tabs" @changeTabs="changeTabs">
      <template v-slot:main>
        <info v-if="activity === '基础信息'" :info-data="info" @updata="getDetail" />
        <attributeMgr v-else-if="activity === '属性管理'" />
        <incident v-else-if="activity ==='事件管理'" />
        <serve v-else-if="activity === '服务管理'" />
        <offLineRule v-else-if="activity === '上下线规则'" />
        <alarm v-else-if="activity === '告警规则'" />
        <tag v-else-if="activity === '标签'" />
        <variable v-else-if="activity === '变量'" />
        <mapping v-else-if="activity === '值映射方案'" />
        <device v-else-if="activity === '设备'" />
      </template>
    </DetailTemplate>
  </div>
</template>
<script>
import DetailTemplate from '@/components/Slots/DetailTemplate.vue'
import mapping from '@/views/deviceMgr/device/mapping'
import tag from '@/views/deviceMgr/device/tag'
import info from '@/views/productMgr/product/info'
import incident from '@/views/productMgr/product/incident'
import serve from '@/views/productMgr/product/serve'
import alarm from '@/views/productMgr/product/alarm'
import device from '@/views/productMgr/product/device'
import variable from '@/views/deviceMgr/device/variable'
import attributeMgr from '@/views/productMgr/product/attributeMgr'
import offLineRule from '@/views/deviceMgr/device/offLineRule'
import { getProdTagList, productDetail } from '@/api/porductMgr'
export default {
  name: 'ProductDetail',
  components: {
    DetailTemplate,
    mapping,
    info,
    tag,
    incident,
    serve,
    alarm,
    variable,
    attributeMgr,
    offLineRule,
    device
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
        },
        {
          label: '设备',
          name: '设备'
        }
      ],
      subhead: '',
      title: '',
      activity: '基础信息',
      info: {},
      tagList: [],
      prodId: ''
    }
  },
  async created() {
    if (this.$route.query.id) {
      this.prodId = this.$route.query.id
      await this.getTag(this.$route.query.id)
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
    getTag(productId) {
      getProdTagList({ productId }).then((res) => {
        if (res.code == 200) {
          this.tagList = res.data
        }
      })
    },
    getDetail() {
      productDetail({ productId: this.prodId }).then((res) => {
        if (res.code == 200) {
          this.info = res.data
          this.detailList = [
            {
              key: '产品ID',
              value: res.data.productId
            },
            {
              key: '产品分类',
              value: res.data.groupIdName
            },
            {
              key: '设备类型',
              value: res.data.prodTypeName
            },
            {
              key: '厂商',
              value: res.data.manufacturer
            },
            {
              key: '型号',
              value: res.data.model
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
            {
              key: '修改时间',
              value: res.data.updateTime
            },
            {
              key: '创建人',
              value: res.data.createUser
            }
          ]
          this.subhead = res.data.remark
          this.title = res.data.prodName
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail {

}
</style>
