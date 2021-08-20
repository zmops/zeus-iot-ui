<template>
  <div class="product-detail">
    <DetailTemplate :up="'产品'" :detail-list="detailList" :tabs="tabs" @changeTabs="changeTabs">
      <template v-slot:main>
        <div v-if="tabName === 'basics'" class="zeus-product">
          <Basics @edit="edit" />
        </div>
        <div v-if="tabName === 'attribute'">
          <Attribute />
        </div>
        <div v-if="tabName === 'label'" class="zeus-product">
          <LabelDate />
        </div>
        <div v-if="tabName === 'variable'" class="zeus-product">
          <Variable />
        </div>
        <div v-if="tabName === 'mapping'" class="zeus-product">
          <Mapping />
        </div>
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

import { productDetail } from '@/api/porductMgr'
export default {
  components: {
    DetailTemplate,
    Basics,
    Attribute,
    LabelDate,
    Variable,
    Mapping
  },
  data() {
    return {
      detailList: [],
      prodId: '',
      tabName: 'basics',
      // 右边tab切换
      tabs: [
        {
          label: '基础信息',
          name: 'basics'
        },
        {
          label: '属性',
          name: 'attribute'
        },
        {
          label: '事件',
          name: 'event'
        },
        {
          label: '服务',
          name: 'service'
        },
        {
          label: '告警规则',
          name: 'alarm'
        },
        {
          label: '标签',
          name: 'label'
        },
        {
          label: '变量',
          name: 'variable'
        },
        {
          label: '值映射',
          name: 'mapping'
        },
        {
          label: '设备',
          name: 'equipment'
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
      await productDetail({ prodId: id }).then(res => {
        if (res.code == 200) {
          this.detailList = [
            {
              key: '产品ID',
              value: res.data.prodCode
            },
            {
              key: '产品分类',
              value: res.data.groupName
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
