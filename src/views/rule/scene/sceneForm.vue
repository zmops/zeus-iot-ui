<!-- 场景联动表单组件 -->
<template>
  <el-form ref="dialogForm" :rules="rules" :model="formData" label-width="80px" label-position="top" class="alarm-form">
    <el-form-item label="场景联动名称" prop="eventRuleName">
      <el-input v-model="formData.eventRuleName" size="mini"/>
    </el-form-item>
    <el-form-item label="级别" prop="eventLevel">
      <el-select v-model="formData.eventLevel" placeholder="请选择告警级别" size="mini">
        <el-option
          v-for="(item, index) in levelList"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
<!--    <el-form-item label="启用" prop="status">-->
<!--      <el-switch-->
<!--        v-model="formData.status"-->
<!--        size="mini"-->
<!--        active-value="ENABLE"-->
<!--        inactive-value="DISABLE"-->
<!--        active-text="启用"-->
<!--        inactive-text="禁用"-->
<!--        active-color="#55BC8A"-->
<!--        inactive-color="#AB2F29">-->
<!--      </el-switch>-->
<!--    </el-form-item>-->
    <el-form-item label="描述" prop="remark">
      <el-input v-model="formData.remark" type="textarea" rows="2" size="mini"/>
    </el-form-item>
    <el-form-item label="触发条件" prop="expList">
      <div class="zeus-mb-10">
        满足下列
        <el-select v-model="formData.expLogic" placeholder="" size="mini" class="select-w50">
          <el-option label="任意" value="or" />
          <el-option label="所有" value="and" />
        </el-select>
        条件时,触发场景联动
      </div>
      <Triggers v-for="(item, index) in formData.expList" :key="item.guid" v-model="formData.expList[index]" :ind="index" :is-dev="true" :device-list="deviceList" @del="del" />
      <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="addTrigger">增加触发条件</el-button>
    </el-form-item>
    <el-form-item label="执行动作" prop="deviceServices">
      <action v-for="(item, index) in formData.deviceServices" :key="item.guid" v-model="formData.deviceServices[index]" :ind="index" :is-dev="true" :device-list="deviceList" @del="delAction"></action>
      <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="addAction">增加执行动作</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getDeviceList } from '@/api/deviceMgr'
import Triggers from '@/components/Detail/Triggers'
import Action from '@/views/deviceMgr/device/action'
import { guid } from '@/utils'

export default {
  name: 'AlarmForm',
  components: {
    Triggers,
    Action
  },
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.formData = val
      }
    }
  },
  data() {
    const checkData = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('至少要有一个触发条件!'))
      }
      for (const item of value) {
        if (item.productAttrType === '属性' && item.productAttrId === '') {
          callback(new Error('请选择属性!'))
        }
        if (item.productAttrType === '事件' && item.productAttrId === '') {
          callback(new Error('请选择事件!'))
        }
        if (item.value === undefined || item.value === '') {
          callback(new Error('请完善触发条件!'))
        }
        if ((item.function !== 'last' && item.function !== 'change') && (item.scope === undefined || item.scope === '')) {
          callback(new Error('请完善触发条件!'))
        }
      }
      callback()
    }
    return {
      formData: {},
      rules: {
        eventRuleName: [
          { required: true, message: '请输入告警名称', trigger: 'blur' }
        ],
        expList: [
          { required: true, message: '请选择触发条件' },
          { validator: checkData }
        ],
        deviceServices: [
          { required: true, message: '请选择执行动作' }
        ],
        eventLevel: [
          { required: true, message: '请选择告警级别', trigger: 'change' }
        ]
      },
      levelList: [
        { label: '信息', value: '1' },
        { label: '低级', value: '2' },
        { label: '中级', value: '3' },
        { label: '高级', value: '4' },
        { label: '紧急', value: '5' }
      ],
      deviceList: []
    }
  },
  created() {
    // this.formData = JSON.parse(JSON.stringify(this.value))
    // 获取设备列表
    getDeviceList({}).then((res) => {
      if (res.code == 200) {
        this.deviceList = res.data
      }
    })
  },
  methods: {
    addTrigger() {
      this.formData.expList.push({
        guid: guid(),
        deviceId: '',
        productAttrId: '',
        incident: '',
        condition: '=',
        productAttrType: '属性',
        function: 'last',
        period: '时间',
        unit: 'm'
      })
    },
    validateForm() {
      let flag = false
      this.$refs.dialogForm.validate((valid) => {
        flag = valid
      })
      return flag && this.verification()
    },
    del(index) {
      this.formData.expList.splice(index, 1)
    },
    delAction(index) {
      this.formData.deviceServices.splice(index, 1)
    },
    addAction() {
      if (this.verification()) {
        this.formData.deviceServices.push({
          guid: guid(),
          executeDeviceId: '',
          serviceId: ''
        })
      }
    },
    verification() {
      for (const item of this.formData.deviceServices) {
        if (item.executeDeviceId === '' && this.isDev) {
          this.$message({
            message: '请填写完整当前执行动作',
            type: 'warning'
          })
          return false
        }
        if (item.serviceId === '') {
          this.$message({
            message: '请填写完整当前执行动作',
            type: 'warning'
          })
          return false
        }
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.alarm-form {
  width: 600px;
  .add-btn {
    width: 100%;
    border-style: dashed;
  }

  ::v-deep{
    .el-switch__label *{
      font-size: 12px!important;
    }
  }

  .select-w50{
    width: 50px;
  }
}
</style>
