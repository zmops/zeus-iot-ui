<!-- 场景联动表单组件 -->
<template>
  <el-form ref="dialogForm" :rules="rules" :model="formData" label-width="80px" label-position="top" class="alarm-form">
    <el-form-item label="场景联动名称" prop="name">
      <el-input v-model="formData.name" size="mini"/>
    </el-form-item>
    <el-form-item label="级别" prop="level">
      <el-select v-model="formData.level" placeholder="请选择告警级别" size="mini">
        <el-option
          v-for="(item, index) in levelList"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="启用" prop="status">
      <el-switch
        v-model="formData.status"
        size="mini"
        active-value="ENABLE"
        inactive-value="DISABLE"
        active-text="启用"
        inactive-text="禁用"
        active-color="#242E42"
        inactive-color="#ff4949">
      </el-switch>
    </el-form-item>
    <el-form-item label="描述" prop="remark">
      <el-input v-model="formData.remark" type="textarea" rows="2" size="mini"/>
    </el-form-item>
    <el-form-item label="触发条件" prop="trigger">
      <Triggers v-model="formData.trigger" :device-list="deviceList" />
    </el-form-item>
    <el-form-item label="执行动作">
      <Action v-model="formData.action" :device-list="deviceList" />
    </el-form-item>
  </el-form>
</template>

<script>
import { getDeviceList } from '@/api/deviceMgr'
import Triggers from '@/components/Detail/Triggers'
import Action from '@/components/Detail/Action'

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
        return {
          level: '中级',
          status: 'ENABLE'
        }
      }
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
  data() {
    return {
      formData: {
        level: '中级',
        status: 'ENABLE'
      },
      rules: {
        name: [
          { required: true, message: '请输入场景联动名称', trigger: 'blur' }
        ]
      },
      levelList: [
        { label: '提示', value: '提示' },
        { label: '低级', value: '低级' },
        { label: '中级', value: '中级' },
        { label: '高级', value: '高级' },
        { label: '紧急', value: '紧急' }
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
}
</style>
