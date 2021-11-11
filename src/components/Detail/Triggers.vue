<!-- 触发条件组件 -->
<template>
  <div class="Triggers zeus-relative">
    <el-select v-if="isDev" v-model="item.deviceId" :disabled="disabled" size="mini" placeholder="请选择设备" :popper-class="'xlk'" @focus="dialogVisible = true" clearable class="select1 zeus-mr-5">
      <el-option
        v-for="(i, index) in deviceList"
        :key="index"
        :label="i.name"
        :value="i.deviceId"
      />
    </el-select>
    <el-select v-model="item.productAttrType" :disabled="disabled" size="mini" class="select3 zeus-mr-5" @change="item.productAttrId = ''">
      <el-option label="属性" value="属性"/>
      <el-option label="事件" value="事件"/>
    </el-select>
    <el-select v-if="item.productAttrType === '属性'" v-model="item.productAttrId" :disabled="disabled" placeholder="请选择属性" size="mini" class="select2 zeus-mr-5" @change="attrChange">
      <el-option
        v-for="(i, index) in deviceAttribute"
        :key="index"
        :label="i.attrName"
        :value="i.attrId"
      />
    </el-select>
    <el-select v-if="item.productAttrType === '事件'" v-model="item.productAttrId" :disabled="disabled" placeholder="请选择事件" size="mini" class="select2 zeus-mr-5" @change="eventChange">
      <el-option
        v-for="(i, index) in incidentList"
        :key="index"
        :label="i.attrName"
        :value="i.attrId"
      />
    </el-select>
    <div v-if="item.function ==='avg'||item.function ==='max'||item.function ==='min'||item.function ==='sum'" class="zeus-inline-block">
      <span class="zeus-mr-5">在</span>
      <el-select v-model="item.period" :disabled="disabled" size="mini" class="select3 zeus-mr-5">
        <el-option label="时间" value="时间"/>
        <el-option label="周期" value="周期"/>
      </el-select>
      <el-input v-model="item.scope" :disabled="disabled" size="mini" class="input zeus-mr-5"/>
      <el-select v-if="item.period === '时间' " :disabled="disabled" v-model="item.unit" size="mini" class="select3 zeus-mr-5">
        <el-option label="秒" value="s"/>
        <el-option label="分钟" value="m"/>
        <el-option label="小时" value="h"/>
      </el-select>
      <span v-else class="zeus-mr-5">次</span>
      <span class="zeus-mr-5">内</span>
    </div>
    <div v-if="item.function ==='nodata'" class="zeus-inline-block">
      <span class="zeus-mr-5">在</span>
      <el-input v-model="item.scope" :disabled="disabled" size="mini" class="input zeus-mr-5"/>
      <el-select v-model="item.unit" :disabled="disabled" size="mini" class="select3 zeus-mr-5">
        <el-option label="秒" value="s"/>
        <el-option label="分钟" value="m"/>
        <el-option label="小时" value="h"/>
      </el-select>
      <span class="zeus-mr-5">内</span>
    </div>
    <div class="zeus-inline-block">
      <el-select v-model="item.function" :disabled="disabled" size="mini" class="select1 zeus-mr-5"
                 @change="functionChange">
        <el-option label="最新值" value="last"/>
        <el-option label="平均值" value="avg" :disabled="item.attrValueType != '3' && item.attrValueType != '0'"/>
        <el-option label="最大值" value="max" :disabled="item.attrValueType != '3' && item.attrValueType != '0'"/>
        <el-option label="最小值" value="min" :disabled="item.attrValueType != '3' && item.attrValueType != '0'"/>
        <el-option label="和值" value="sum" :disabled="item.attrValueType != '3' && item.attrValueType != '0'"/>
        <el-option label="值有变化" value="change"/>
        <el-option label="无值" value="nodata"/>
      </el-select>
    </div>
    <el-select
      v-if="item.function === 'nodata' || (item.function === 'change' && (item.attrValueType == '1' || item.attrValueType == '4'))"
      v-model="item.value" :disabled="disabled" size="mini" class="select3 zeus-mr-5">
      <el-option label="为真" value="1"/>
      <el-option label="为假" value="0"/>
    </el-select>
    <div v-else class="zeus-inline-block">
      <el-select v-model="item.condition" :disabled="disabled" size="mini" class="select3 zeus-mr-5">
        <el-option
          v-for="(i, index) in conditionList"
          :key="index"
          :label="i.label"
          :value="i.value"
        />
      </el-select>
      <el-input v-model="item.value" :disabled="disabled" size="mini" class="input zeus-mr-10"/>
      <span>{{ units }}</span>
    </div>
    <el-button type="text" :disabled="disabled" class="zeus-absolute delete" @click="del()">
      <svg-icon icon-class="but_del"></svg-icon>
    </el-button>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'1234px'"
      :show-close="false"
      append-to-body
      class="device_select_dialog"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="select"/>
          设备选择
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <DeviceSelect :deviceIds="item.deviceId" @closeDialog="dialogVisible = false" @checked="checked"></DeviceSelect>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAttrTrapperList, getEventList } from '@/api/deviceMgr'
import { getProductAttrTrapperList } from '@/api/porductMgr'
import DeviceSelect from '@/components/Basics/DeviceSelect'

export default {
  name: 'Triggers',
  components: {
    DeviceSelect
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          // deviceId: '',
          // productAttrId: '',
          // incident: '',
          // condition: '=',
          // productAttrType: '属性',
          // function: 'last',
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
    },
    inherit: {
      type: [String, Number],
      default: '0'
    },
    productId: {
      type: String,
      default: '0'
    },
    disabled: Boolean
  },
  data() {
    return {
      item: {},
      incidentList: [],
      deviceAttribute: [],
      id: '',
      attrValueType: '',
      units: '',
      dialogVisible: false,
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
        if (this.$route.query.id) {
          this.id = '' + this.$route.query.id
          if (this.isDev && this.item.deviceId === '') {
            this.item.deviceId = this.$route.query.id
          }
          if (this.isDev) {
            if (this.inherit == '1') {
              this.getAttrList(this.productId)
              this.eventList(this.productId)
            } else {
              this.getDevAttrList(this.item.deviceId)
              this.eventList(this.item.deviceId)
            }
          } else {
            this.item.productId = this.id
            this.getAttrList(this.id)
            this.eventList(this.id)
          }
        } else {
          this.getDevAttrList(this.item.deviceId)
          this.eventList(this.item.deviceId)
        }
      }
    }
    // inherit: {
    //   deep: true,
    //   immediate: true,
    //   handler(val) {
    //   }
    // }
  },
  created() {

  },
  methods: {
    checked(ids) {
      this.item.deviceId = ids
      this.deviceChange(ids)
    },
    functionChange(val) {
      if (val === 'last' || val === 'change') {
        this.item.scope = ''
      }
    },
    deviceChange(val) {
      console.log(val)
      this.item.productAttrId = ''
      this.item.condition = '='
      this.item.productAttrType = '属性'
      this.item.function = 'last'
      this.item.period = ''
      this.item.unit = ''
      // 获取事件列表

      // 设备属性列表
      this.getDevAttrList(val)
    },
    attrChange(val) {
      const attr = this.deviceAttribute.find((i) => {
        return i.attrId === val
      })
      this.units = attr.unitsName
      this.item.attrValueType = attr.valueType
      this.item.productAttrKey = attr.key
      if (attr.valueType === '1' || attr.valueType === '4') {
        if (this.item.function === 'sum' || this.item.function === 'min' || this.item.function === 'max' || this.item.function === 'avg') {
          this.item.function = 'last'
        }
      }

      if (this.item.function === 'change') {
        this.item.value = ''
      }
      // if (attr.valueType === '3' || attr.valueType === '0') {
      //   if (this.item.function === 'nodata') {
      //
      //   }
      //
      // } else {
      //
      //   if (this.item.function === 'nodata' || this.item.function === 'change') {
      //
      //   }
      // }
      // this.item.incident = ''
      // this.item.condition = '='
      // this.item.productAttrType = '属性'

      // this.item.value = ''
      this.item.period = ''
      this.item.unit = ''
      this.item.scope = ''
    },
    eventChange(val) {
      const attr = this.incidentList.find((i) => {
        return i.attrId === val
      })
      this.units = attr.unitsName
      this.item.attrValueType = attr.valueType
      this.item.productAttrKey = attr.key
      if (attr.valueType === '1' || attr.valueType === '4') {
        if (this.item.function === 'sum' || this.item.function === 'min' || this.item.function === 'max' || this.item.function === 'avg') {
          this.item.function = 'last'
        }
      }
      if (this.item.function === 'change') {
        this.item.value = ''
      }
      this.item.period = ''
      this.item.unit = ''
      this.item.scope = ''
    },
    getDevAttrList(prodId) {
      getAttrTrapperList({ prodId }).then((res) => {
        if (res.code == '200') {
          this.deviceAttribute = res.data
        }
      })
    },
    getAttrList(prodId) {
      getProductAttrTrapperList({ prodId }).then((res) => {
        if (res.code == '200') {
          this.deviceAttribute = res.data
        }
      })
    },
    eventList(prodId) {
      getEventList({ prodId }).then((res) => {
        if (res.code == '200') {
          this.incidentList = res.data
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
  background-color: #EFF4F9;
  padding: 8px;
  margin-bottom: 6px;

  .delete {
    top: 4px;
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
