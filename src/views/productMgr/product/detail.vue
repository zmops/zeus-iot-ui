<template>
  <div class="product-detail">
    <DetailTemplate :up="'产品'" :to="'/productMgr/product'" icon="product24" :title="detailInfo.prodName" :subhead="detailInfo.remark" :detail-list="detailList" :tabs="tabs" @changeTabs="changeTabs">
      <template v-slot:main>
        <div v-if="tabName === '基础信息'">
          <Basics @edit="edit" />
        </div>
        <div v-if="tabName === '属性'">
          <Attribute />
        </div>
        <div v-if="tabName === '标签'" class="zeus-product">
          <LabelDate />
        </div>
        <div v-if="tabName === '变量'" class="zeus-product">
          <Variable />
        </div>
        <div v-if="tabName === '值映射'" class="zeus-product">
          <Mapping />
        </div>
        <serve v-if="tabName === '服务'" />
        <device v-else-if="tabName === '设备'" />
      </template>
    </DetailTemplate>
  </div>
</template>

<script>
import DetailTemplate from '@/components/Slots/DetailTemplate.vue'
import Basics from './basics.vue'
import Attribute from './attribute.vue'
import LabelDate from './labeldate.vue'
import Variable from './variable.vue'
import Mapping from './mapping.vue'
import serve from '@/views/productMgr/product/serve'
import device from '@/views/productMgr/product/device'

import { productDetail } from '@/api/porductMgr'
export default {
  components: {
    DetailTemplate,
    Basics,
    Attribute,
    LabelDate,
    Variable,
    Mapping,
    serve,
    device
  },
  data() {
    return {
      detailList: [],
      detailInfo: '',
      prodId: '',
      tabName: 'basics',
      // 右边tab切换
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
          label: '设备',
          name: '设备'
        }
      ]
    }
  },
  async created() {
    if (this.$route.query.id) {
      await this.getDetail(this.$route.query.id)
    }
    if (this.$route.query.tabsName) {
      this.tabName = this.$route.query.tabsName
    }
  },
  methods: {
    changeTabs(name) {
      this.tabName = name
    },
    async getDetail(id) {
      this.prodId = id
      await productDetail({ productId: id }).then(res => {
        if (res.code == 200) {
          this.detailInfo = res.data
          this.detailList = [
            {
              key: '产品ID',
              value: res.data.prodCode
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
              value: ''
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
        }
      })
    },
    edit() {
      this.getDetail(this.prodId)
    }
  }
}
</script>
<style scoped>
.product-detail{
  background: #ffffff;
}
</style>
