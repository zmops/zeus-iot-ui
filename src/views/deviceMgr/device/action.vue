<!-- 执行动作组件 -->
<template>
  <div class="Action">
    <el-select v-if="isDev" v-model="item.executeDeviceId" :disabled="disabled" placeholder="设备列表" size="mini" class="select1 zeus-mr-5" @change="deviceChange">
      <el-option
        v-for="(i, index) in deviceList"
        :key="index"
        :label="i.name"
        :value="i.deviceId"
      />
    </el-select>
    <el-select v-model="item.serviceId" :disabled="disabled" placeholder="服务列表" size="mini" class="select2 zeus-mr-5">
      <el-option
        v-for="(i, index) in serviceList"
        :key="index"
        :label="i.name"
        :value="i.id"
      />
    </el-select>
    <el-button type="text" icon="el-icon-delete" :disabled="disabled" class=" del" @click="del(ind)"></el-button>
  </div>
</template>
<script>
import { getServiceList } from '@/api/porductMgr'

export default {
  name: 'Action',
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
      serviceList: []
    }
  },
  watch: {
    item: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getService(this.$route.query.id)
    }
    if (this.item.executeDeviceId) {
      this.getService(this.item.executeDeviceId)
    }
  },
  methods: {
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
