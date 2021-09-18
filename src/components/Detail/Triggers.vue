<!-- 触发条件组件 -->
<template>
  <div class="Triggers zeus-relative">
    <el-select v-if="isDev" v-model="item.deviceId" placeholder="请选择设备" size="mini" class="select1 zeus-mr-5" @change="deviceChange">
      <el-option
        v-for="(i, index) in deviceList"
        :key="index"
        :label="i.name"
        :value="i.deviceId"
      />
    </el-select>
<!--    <el-select v-model="item.type" size="mini" class="select3 zeus-mr-5">-->
<!--      <el-option label="属性" value="属性"/>-->
<!--      <el-option label="事件" value="事件"/>-->
<!--    </el-select>-->
    <el-select v-model="item.attr" placeholder="请选择属性" size="mini" class="select2 zeus-mr-5" @change="attrChange">
      <el-option
        v-for="(i, index) in deviceAttribute"
        :key="index"
        :label="i.attrName"
        :value="i.attrId"
      />
    </el-select>
<!--    <el-select v-if="item.type === '事件'" v-model="item.incident" placeholder="请选择事件" size="mini" class="select2 zeus-mr-5">-->
<!--      <el-option-->
<!--        v-for="(i, index) in incidentList"-->
<!--        :key="index"-->
<!--        :label="i.label"-->
<!--        :value="i.value"-->
<!--      />-->
<!--    </el-select>-->
    <div v-if="item.function ==='avg'||item.function ==='max'||item.function ==='min'||item.function ==='sum'" class="zeus-mt-5 zeus-mb-5">
      <span class="zeus-mr-5">在</span>
      <el-select v-model="item.timeType" size="mini" class="select3 zeus-mr-5">
        <el-option label="时间" value="时间"/>
        <el-option label="周期" value="周期"/>
      </el-select>
      <el-input v-model="item.scope" size="mini" class="input zeus-mr-5"/>
      <el-select v-if="item.timeType === '时间' " v-model="item.unit" size="mini" class="select3 zeus-mr-5">
        <el-option label="秒" value="s"/>
        <el-option label="分钟" value="m"/>
        <el-option label="小时" value="h"/>
      </el-select>
      <span v-else class="zeus-mr-5">次</span>
      <span class="zeus-mr-5">内</span>
    </div>
    <div v-if="item.function ==='nodata'" class="zeus-mt-5 zeus-mb-5">
      <span class="zeus-mr-5">在</span>
      <el-input v-model="item.scope" size="mini" class="input zeus-mr-5"/>
      <el-select v-model="item.unit" size="mini" class="select3 zeus-mr-5">
        <el-option label="秒" value="s"/>
        <el-option label="分钟" value="m"/>
        <el-option label="小时" value="h"/>
      </el-select>
      <span class="zeus-mr-5">内</span>
    </div>
    <div class="zeus-mt-5">
      <el-select v-model="item.function" size="mini" class="select1 zeus-mr-5">
        <el-option label="最新值" value="last" />
        <el-option label="平均值" value="avg" :disabled="attrValueType != '3' && attrValueType != '0'" />
        <el-option label="最大值" value="max" :disabled="attrValueType != '3' && attrValueType != '0'" />
        <el-option label="最小值" value="min" :disabled="attrValueType != '3' && attrValueType != '0'" />
        <el-option label="和值" value="sum" :disabled="attrValueType != '3' && attrValueType != '0'" />
        <el-option label="值有变化" value="change" />
        <el-option label="无值" value="nodata" />
      </el-select>
    </div>
    <el-select v-if="item.function === 'nodata' || (item.function === 'change' && (attrValueType == '1' || attrValueType == '4'))" v-model="item.value" size="mini" class="select3 zeus-mr-5 zeus-mt-5">
      <el-option label="为真" value="1"/>
      <el-option label="为假" value="0"/>
    </el-select>
    <div v-else class="zeus-mt-5">
      <el-select v-model="item.condition" size="mini" class="select3 zeus-mr-5">
        <el-option
          v-for="(i, index) in conditionList"
          :key="index"
          :label="i.label"
          :value="i.value"
        />
      </el-select>
      <el-input v-model="item.value" size="mini" class="input zeus-mr-10"/>
      <span>{{ units }}</span>
    </div>
    <el-button type="text" icon="el-icon-delete" class="zeus-absolute delete" @click="del()"></el-button>
  </div>
</template>

<script>
import {getAttrTrapperList} from '@/api/deviceMgr'

export default {
  name: 'Triggers',
  props: {
    value: {
      type: Object,
      default() {
        return {
          deviceId: '',
          attr: '',
          incident: '',
          condition: '=',
          type: '属性',
          function: 'last',
        }
      }
    },
    ind: {
      type: Number,
      default: 0
    },
    deviceList: {
      type: Array,
      default() {
        return []
      }
    },
    isDev: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      item: {},
      incidentList: [],
      deviceAttribute: [],
      id: '',
      attrValueType: '',
      units: '',
      conditionList: [
        { label: '=', value: '=' },
        { label: '>', value: '>' },
        { label: '<', value: '<' },
        { label: '<>', value: '<>' },
        { label: '>=', value: '>=' },
        { label: '<=', value: '<=' }
      ]
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.item = val
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = '' + this.$route.query.id
      this.item.deviceId = this.id
      this.getDevAttrList(this.id)
    }
  },
  methods: {
    deviceChange(val) {
      this.item.attr = ''
      this.item.incident = ''
      this.item.condition = '='
      this.item.type = '属性'
      this.item.function = 'last'
      this.item.timeType = '时间'
      this.item.unit = 'm'
      // 获取事件列表

      // 设备属性列表
      this.getDevAttrList(val)
    },
    attrChange(val) {
      this.item.incident = ''
      this.item.condition = '='
      this.item.type = '属性'
      this.item.function = 'last'
      this.item.timeType = '时间'
      this.item.unit = 'm'
      const attr = this.deviceAttribute.find((i) => {
        return i.attrId === val
      })
      this.units = attr.unitsName
      this.attrValueType = attr.valueType
      this.item.productAttrKey = attr.key
    },
    getDevAttrList(prodId) {
      getAttrTrapperList({prodId}).then((res) => {
        if (res.code == '200') {
          this.deviceAttribute = res.data
        }
      })
    },
    del() {
      this.$emit('del', this.ind)
    }
  }
}
</script>

<style lang="scss" scoped>
.Triggers {
  background-color: #E6EDF4;
  padding: 8px;
  margin-bottom: 6px;

  .delete{
    top: 0;
    right: 8px;
  }

  .select1 {
    width: 130px;
  }

  .select2 {
    width: 130px;
  }

  .select3 {
    width: 60px;
  }

  .input {
    width: 120px;
  }

  .del {
    right: 0;
    top: -2px;
  }

}
</style>
