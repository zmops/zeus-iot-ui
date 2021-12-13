<template>
  <el-form ref="form" :rules="rules" :model="dialogForm" label-width="120px" class="form">
    <el-form-item label="协议网关名称" prop="name">
      <el-input v-model="dialogForm.name" size="mini"/>
    </el-form-item>
    <el-form-item label="协议网关类型" prop="protocolType">
      <el-select v-model="dialogForm.protocolType" placeholder="请选择" size="mini" @change="changeType">
        <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.code"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="dialogForm.protocolType === '1'" label="通讯服务" prop="protocolServiceId">
      <el-select v-model="dialogForm.protocolServiceId" placeholder="请选择" size="mini">
        <el-option v-for="(item,index) in serviceList" :key="index" :label="item.name" :value="item.protocolServiceId"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="dialogForm.protocolType === '1'" label="QoS" prop="qos">
      <el-select v-model="dialogForm.qos" placeholder="请选择" size="mini">
        <el-option label="至多一次" value="0"/>
        <el-option label="至少一次" value="1"/>
        <el-option label="确保只有一次" value="2"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="dialogForm.protocolType === '1'" label="Topic与协议组件" prop="protocolGatewayMqttList">
      <div v-for="(item, index) in dialogForm.protocolGatewayMqttList" :key="index" class="zeus-mb-5">
        <el-input style="width: 210px" class="zeus-mr-10" placeholder="Topic" v-model="item.topic" size="mini"/>
        <el-select style="width: 235px;margin-right: 5px" v-model="item.protocolComponentId" placeholder="请选择协议组件" size="mini">
          <el-option v-for="(item,index) in componentList" :key="index" :label="item.name" :value="item.protocolComponentId"/>
        </el-select>
        <el-button type="text" class="del" @click="listDel(index)">
          <svg-icon icon-class="but_del"></svg-icon>
        </el-button>
      </div>
      <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="addTopic">增加Topic</el-button>
    </el-form-item>
    <el-form-item label="描述" prop="remark">
      <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini"/>
    </el-form-item>
  </el-form>
</template>
<script>
import { getServiceList, getComponentList } from '@/api/agreement'

export default {
  name: 'form',
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogForm: {},
      rules: {
        name: [
          { required: true, message: '请输入协议网关名称', trigger: 'blur' }
        ],
        protocolType: [
          { required: true, message: '请选择协议网关类型', trigger: 'change' }
        ],
        protocolServiceId: [
          { required: true, message: '请选择通信服务', trigger: 'change' }
        ],
        qos: [
          { required: true, message: '请选择QoS', trigger: 'change' }
        ]
      },
      proxyList: [],
      typeList: [
        {
          code: '1',
          name: 'MQTT 客户端'
        }
      ],
      serviceList: [],
      componentList: []
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.dialogForm = val
      }
    }
  },
  created() {
    // getDictListByCode({ dictTypeCode: 'PROTOCOL_SERVICE_TYPE' }).then((res) => {
    //   if (res.code == 200) {
    //     this.typeList = res.data
    //   }
    // })
    getComponentList({}).then((res) => {
      if (res.code == 200) {
        this.componentList = res.data
      }
    })
    getServiceList({}).then((res) => {
      if (res.code == 200) {
        this.serviceList = res.data
      }
    })
  },
  methods: {
    validateForm() {
      this.$emit('input', this.dialogForm)
      let flag = false
      this.$refs.form.validate((valid) => {
        flag = valid
      })
      return flag && this.validateList()
    },
    changeType(v) {
      getServiceList({ protocolType: v }).then((res) => {
        if (res.code == 200) {
          this.serviceList = res.data
        }
      })
    },
    validateList() {
      for (const item of this.dialogForm.protocolGatewayMqttList) {
        if (item.topic === '' || item.protocolComponentId === '') {
          this.$message({
            message: '请填写完整Topic与协议组件',
            type: 'warning'
          })
          return false
        }
      }
      return true
    },
    addTopic() {
      if (this.validateList()) {
        this.dialogForm.protocolGatewayMqttList.push({
          topic: '',
          protocolComponentId: ''
        })
      }
    },
    listDel(index) {
      this.dialogForm.protocolGatewayMqttList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 600px;
}
</style>
