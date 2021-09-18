<!-- 执行动作组件 -->
<template>
  <div class="Action">
    <div v-for="(item, index) in formData" :key="index">
      <el-select v-if="isDev" v-model="item.executeDeviceId" placeholder="设备列表" size="mini" class="select1 zeus-mr-5" @change="deviceChange">
        <el-option
          v-for="(i, ind) in deviceList"
          :key="ind"
          :label="i.name"
          :value="i.deviceId"
        />
      </el-select>
<!--      <el-select v-else v-model="item.deviceId" placeholder="产品列表" size="mini" class="select1 zeus-mr-5" @change="deviceChange">-->
<!--        <el-option-->
<!--          v-for="(i, ind) in deviceList"-->
<!--          :key="ind"-->
<!--          :label="i.name"-->
<!--          :value="i.productId"-->
<!--        />-->
<!--      </el-select>-->
      <el-select v-model="item.serviceId" placeholder="服务列表" size="mini" class="select2 zeus-mr-5" @change="serviceChange">
        <el-option
          v-for="(i, ind) in serviceList"
          :key="ind"
          :label="i.name"
          :value="i.id"
        />
      </el-select>
      <el-button v-if="formData.length > 1" type="text" icon="el-icon-delete" class=" del" @click="del(index)"></el-button>
      <Variable v-if="item.list && item.list.length" v-model="item.list" :show-but="showBut" />
    </div>
    <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="addAction">增加执行动作</el-button>
  </div>
</template>
<script>
import Variable from '@/components/Detail/Variable'
import { getServiceList, getServiceData } from '@/api/porductMgr'
export default {
  name: 'Action',
  components: {
    Variable
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    showBut: {
      type: Boolean,
      default: true
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
      formData: this.value,
      serviceList: []
    }
  },
  watch: {
    formData: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {

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
      // 获取服务列表
      this.getService(val)
    },
    serviceChange(serviceId) {
      // getServiceData({serviceId}).then((res) => {
      //
      // })
    },
    del(index) {
      this.formData.splice(index, 1)
    },
    addAction() {
      this.formData.push(
        {
          list: [
            {
              tag: '',
              value: '',
              remark: ''
            }
          ]
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.Action {
  .select1{
    width: 170px;
  }
  .select2{
    width: 180px;
  }

}
</style>
