<!-- 告警规则表单组件 -->
<template>
  <el-form ref="dialogForm" :rules="rules" :model="formData" :validate-on-rule-change="false" label-width="80px" class="alarm-form">
    <el-form-item label="告警名称" prop="eventRuleName">
      <el-input v-model="formData.eventRuleName" :disabled="formData.inherit =='1' && isDev" size="mini"/>
    </el-form-item>
    <el-form-item label="告警级别" prop="eventLevel">
      <el-select v-model="formData.eventLevel" placeholder="请选择告警级别" size="mini">
        <el-option
          v-for="(item, index) in levelList"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="启用通知" prop="eventNotify">
      <el-switch
        v-model="formData.eventNotify"
        size="mini"
        active-value="1"
        inactive-value="0"
        active-text="启用"
        inactive-text="禁用"
        :disabled="formData.inherit =='1' && isDev"
        active-color="#55BC8A"
        inactive-color="#AB2F29">
      </el-switch>
      <div class="el-form-item-tips zeu s-inline-block">
        <svg-icon icon-class="tips" class="icon"/>
        <span>包括平台内部和外部的所有通知。</span>
      </div>
    </el-form-item>
    <!--    <el-form-item label="启用告警规则" prop="status">-->
    <!--      <el-switch-->
    <!--        v-model="formData.status"-->
    <!--        :disabled="formData.inherit =='1' && isDev"-->
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
      <el-input v-model="formData.remark" :disabled="formData.inherit =='1' && isDev" type="textarea" rows="2" size="mini"/>
    </el-form-item>
    <el-form-item label="触发条件">
      <div class="zeus-mb-10">
        满足下列
        <el-select v-model="formData.expLogic" :disabled="formData.inherit =='1' && isDev" placeholder="" size="mini" class="select-w50 zeus-ml-5 zeus-mr-5">
          <el-option label="任意" value="or"/>
          <el-option label="所有" value="and"/>
        </el-select>
        条件时,触发告警
      </div>
      <Triggers v-for="(item, index) in formData.expList" :key="item.guid" :disabled="formData.inherit =='1' && isDev" :productId="formData.inheritProductId" v-model="formData.expList[index]" :ind="index" :is-dev="isDev" :device-list="deviceList" :inherit="formData.inherit" @del="del" ref="triggers"/>
      <el-button class="add-btn" :disabled="formData.inherit =='1' && isDev" plain icon="el-icon-plus" size="mini" @click="addTrigger">增加触发条件
      </el-button>
    </el-form-item>
    <el-form-item label="执行动作">
      <action v-for="(item, index) in formData.deviceServices" :key="item.guid"
              :disabled="formData.inherit =='1' && isDev" v-model="formData.deviceServices[index]" :ind="index"
              :is-dev="isDev" :device-list="deviceList" @del="delAction"></action>
      <el-button class="add-btn" :disabled="formData.inherit =='1' && isDev" plain icon="el-icon-plus" size="mini"
                 @click="addAction">增加执行动作
      </el-button>
    </el-form-item>
    <el-form-item label="标签">
      <Tag ref="tag" v-model="formData.tags"/>
    </el-form-item>
  </el-form>
</template>

<script>
import { getDeviceList } from '@/api/deviceMgr'
import { getProductList, getServiceList } from '@/api/porductMgr'
import Triggers from '@/components/Detail/Triggers'
import action from '@/views/deviceMgr/device/action'
import Tag from '@/components/Detail/Tag'
import { guid } from '@/utils'

export default {
  name: 'AlarmForm',
  components: {
    Triggers,
    action,
    Tag
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          // eventRuleName: '',
          // eventLevel: '3',
          // eventNotify: '1',
          // status: 'ENABLE',
          // remark: '',
          // expLogic: 'or',
          // expList: [
          //   {
          //     deviceId: '',
          //     productAttrId: '',
          //     incident: '',
          //     condition: '=',
          //     productAttrType: '属性',
          //     function: 'last',
          //     timeType: '时间',
          //     unit: 'm'
          //   }
          // ],
          // deviceServices: []
        }
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
        // expList: [
        //   { required: true, message: '请选择触发条件', trigger: 'blur' },
        //   { validator: checkData, trigger: 'blur' }
        // ],
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
    addTrigger() {
      if (this.validateTriggers()) {
        this.formData.expList.push({
          guid: guid(),
          deviceId: '',
          productAttrId: '',
          condition: '=',
          value: '',
          scope: '',
          productAttrType: '属性',
          function: 'last',
          period: '时间',
          unit: 'm'
        })
      }
    },
    validateTriggers() {
      if (this.$refs.triggers && this.$refs.triggers.length) {
        for (const i of this.$refs.triggers) {
          if (!i.validateForm()) {
            return false
          }
        }
        return true
      } else {
        return true
      }
    },
    validateForm() {
      let flag = false
      this.$refs.dialogForm.validate((valid) => {
        flag = valid
      })
      return flag && this.$refs.tag.verification() && this.verification() && this.validateTriggers()
    },
    del(index) {
      this.formData.expList.splice(index, 1)
    },
    delAction(index) {
      this.formData.deviceServices.splice(index, 1)
    },
    addAction() {
      let obj = {
        guid: guid(),
        executeDeviceId: '',
        serviceId: ''
      }
      if (!this.isDev) {
        obj = {
          guid: guid(),
          serviceId: ''
        }
      }
      if (this.verification()) {
        this.formData.deviceServices.push(obj)
      }
    },
    reset() {
      this.$refs.dialogForm.resetFields()
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
  width: 1250px;
  background-color: #fff;

  .add-btn {
    width: 100%;
    border-style: dashed;
  }

  ::v-deep {
    .el-switch__label * {
      font-size: 12px !important;
    }
  }

  .select-w50 {
    width: 80px;
  }
}
</style>
