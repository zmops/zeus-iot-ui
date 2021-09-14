<!-- 告警规则表单组件 -->
<template>
  <el-form ref="dialogForm" :rules="rules" :model="formData" label-width="80px" label-position="top" class="alarm-form">
    <el-form-item label="告警名称" prop="name">
      <el-input v-model="formData.name" size="mini"/>
    </el-form-item>
    <el-form-item label="告警级别" prop="level">
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
        active-color="#55BC8A"
        inactive-color="#AB2F29">
      </el-switch>
    </el-form-item>
    <el-form-item label="描述" prop="remark">
      <el-input v-model="formData.remark" type="textarea" rows="2" size="mini"/>
    </el-form-item>
    <el-form-item label="触发条件" prop="trigger">
      <Triggers v-model="formData.trigger" :is-dev="isDev" :device-list="deviceList" />
    </el-form-item>
    <el-form-item label="执行动作">
      <Action v-model="formData.action" :is-dev="isDev" :device-list="deviceList" />
    </el-form-item>
    <el-form-item label="标签">
      <Tag v-model="formData.tags" />
    </el-form-item>
  </el-form>
</template>

<script>
import { getDeviceList } from '@/api/deviceMgr'
import { getProductList } from '@/api/porductMgr'
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
          { required: true, message: '请输入告警名称', trigger: 'blur' }
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
      deviceList: [],
      isDev: true
    }
  },
  created() {
    if (this.$route.path.indexOf('/product') > -1) {
      this.isDev = false
      // 获取产品列表
      getProductList({}).then((res) => {
        if (res.code == 200) {
          this.deviceList = res.data
        }
      })
    }
    if (this.$route.path.indexOf('/device') > -1) {
      this.isDev = true
      // 获取设备列表
      getDeviceList({}).then((res) => {
        if (res.code == 200) {
          this.deviceList = res.data
        }
      })
    }
    // this.formData = JSON.parse(JSON.stringify(this.value))
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
