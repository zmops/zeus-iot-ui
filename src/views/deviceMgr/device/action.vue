<!-- 执行动作组件 -->
<template>
  <div class="Action">
    <el-select v-if="isDev" v-model="item.executeDeviceId" :disabled="disabled" placeholder="设备列表" size="mini" :popper-class="'xlk'" @focus="dialogVisible = true" clearable class="select1 zeus-mr-5">
      <el-option
        v-for="(i, index) in deviceList"
        :key="index"
        :label="i.name"
        :value="i.deviceId"
      />
    </el-select>
    <el-select v-model="item.serviceId" :disabled="disabled" placeholder="服务列表" size="mini" class="select2 zeus-mr-5" @focus="getSer">
      <el-option
        v-for="(i, index) in serviceList"
        :key="index"
        :label="i.name"
        :value="i.id"
      />
    </el-select>
    <el-button type="text" :disabled="disabled" class=" del" @click="del(ind)">
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
        <DeviceSelect multiple :deviceIds="item.executeDeviceId" @closeDialog="dialogVisible = false" @checked="checked"></DeviceSelect>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getServiceList } from '@/api/porductMgr'
import DeviceSelect from '@/components/Basics/DeviceSelect'

export default {
  name: 'Action',
  components: {
    DeviceSelect
  },
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
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
    ind: {
      type: Number,
      default: 0
    },
    disabled: Boolean
  },
  data() {
    return {
      item: this.value,
      serviceList: [],
      dialogVisible: false
    }
  },
  watch: {
    // item: {
    //   deep: true,
    //   handler(val) {
    //     this.$emit('input', val)
    //   }
    // },
    value: {
      deep: true,
      handler(val) {
        this.item = val
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getService(this.$route.query.id)
    }
    if (this.item.executeDeviceId && this.item.serviceId) {
      this.getService(this.item.executeDeviceId)
    }
  },
  methods: {
    checked(ids) {
      // 判断是多选还是单选
      if (ids.constructor === Array) {
        this.$emit('batch', ids)
      } else {
        this.item.executeDeviceId = ids
        this.deviceChange(ids)
      }
    },
    getSer() {
      this.getService(this.item.executeDeviceId)
    },
    getService(prodId) {
      getServiceList({ prodId }).then((res) => {
        if (res.code == '200') {
          this.serviceList = res.data
        }
      })
    },
    deviceChange(val) {
      this.item.serviceId = ''
      // 获取服务列表
      this.getService(val)
    },
    del() {
      this.$emit('del', this.ind)
    }
  }
}
</script>

<style lang="scss" scoped>
.Action {
  .select1 {
    width: 170px;
  }

  .select2 {
    width: 180px;
  }

}
</style>
