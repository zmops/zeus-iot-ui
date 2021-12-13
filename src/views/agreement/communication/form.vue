<template>
  <el-form ref="form" :rules="rules" :model="dialogForm" label-width="80px" label-position="top" class="form">
    <el-form-item label="通信服务名称" prop="name">
      <el-input v-model="dialogForm.name" size="mini"/>
    </el-form-item>
    <el-form-item label="生效代理" prop="effectProxy">
      <el-select v-model="dialogForm.effectProxy" clearable placeholder="请选择" size="mini">
        <el-option v-for="(item,index) in proxyList" :key="index" :label="item.name" :value="item.id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="通信服务类型" prop="protocolType">
      <el-select v-model="dialogForm.protocolType" placeholder="请选择" size="mini">
        <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.code"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="dialogForm.protocolType === '1'" label="ClientId" prop="clientId">
      <el-input v-model="dialogForm.clientId" size="mini"/>
      <div class="el-form-item-tips">
        <svg-icon icon-class="tips" class="icon" />通常为必填项，以MQTT服务端的要求为准。
      </div>
    </el-form-item>
    <el-form-item v-if="dialogForm.protocolType === '1'" label="服务地址" prop="ip">
      <el-input v-model="dialogForm.ip" size="mini"/>
    </el-form-item>
    <el-form-item v-if="dialogForm.protocolType === '1'" label="服务端口" prop="port">
      <el-input v-model="dialogForm.port" size="mini"/>
    </el-form-item>
    <el-form-item v-if="dialogForm.protocolType === '1'" label="最大消息长度" prop="msgLength">
      <el-input v-model="dialogForm.msgLength" size="mini"/>
    </el-form-item>
    <el-form-item label="描述" prop="remark">
      <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini"/>
    </el-form-item>
  </el-form>
</template>
<script>
import { getDictListByCode, getProxyList } from '@/api/system'

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
          { required: true, message: '请输入协议名称', trigger: 'blur' }
        ],
        protocolType: [
          { required: true, message: '请选择通信服务类型', trigger: 'change' }
        ],
        ip: [
          { required: true, message: '输入服务地址', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '输入服务端口', trigger: 'blur' }
        ]
      },
      proxyList: [],
      typeList: [
        {
          code: '1',
          name: 'MQTT 客户端'
        }
      ]
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
    getProxyList({}).then((res) => {
      if (res.code == 200) {
        this.proxyList = res.data
      }
    })
    // getDictListByCode({ dictTypeCode: 'PROTOCOL_SERVICE_TYPE' }).then((res) => {
    //   if (res.code == 200) {
    //     this.typeList = res.data
    //   }
    // })
  },
  methods: {
    validateForm() {
      this.$emit('input', this.dialogForm)
      let flag = false
      this.$refs.form.validate((valid) => {
        flag = valid
      })
      return flag
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 600px;
}
</style>
