<!-- 告警规则表单组件 -->
<template>
  <el-form ref="dialogForm" :rules="rules" :model="form" label-width="80px" label-position="top" class="alarm-form">
    <el-form-item label="告警名称" prop="name">
      <el-input v-model="form.name" size="mini"/>
    </el-form-item>
    <el-form-item label="告警级别" prop="level">
      <el-select v-model="form.level" placeholder="请选择告警级别" size="mini">
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
        v-model="form.status"
        active-value="ENABLE"
        inactive-value="DISABLE"
        active-text="启用"
        inactive-text="禁用"
        active-color="#242E42"
        inactive-color="#ff4949">
      </el-switch>
    </el-form-item>
    <el-form-item label="描述" prop="remark">
      <el-input v-model="form.remark" type="textarea" rows="2" size="mini"/>
    </el-form-item>
    <el-form-item label="触发条件" prop="trigger">
      <Triggers v-model="form.trigger" :device-list="deviceList" />
    </el-form-item>
    <el-form-item label="执行动作">
      <Action v-model="form.action" :device-list="deviceList" />
    </el-form-item>
    <el-form-item label="标签">
      <Tag v-model="form.tags" />
    </el-form-item>
  </el-form>
</template>

<script>
import { getDeviceList } from '@/api/deviceMgr'
import Triggers from '@/components/Detail/Triggers'
import Action from '@/components/Detail/Action'
import Tag from '@/components/Detail/Tag'

export default {
  name: 'AlarmForm',
  components: {
    Triggers,
    Action,
    Tag
  },
  props: {
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: this.formData,
      rules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        trigger: [
          { required: true, message: '请选择触发条件', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择产品', trigger: 'change' }
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



}
</style>
