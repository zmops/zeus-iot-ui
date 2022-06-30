<!-- 场景联动表单组件 -->
<template>
  <el-form ref="dialogForm" :rules="rules" :model="formData" label-width="120px" class="alarm-form">
    <el-form-item label="场景联动名称" prop="eventRuleName">
      <el-input v-model="formData.eventRuleName" size="mini"/>
    </el-form-item>
<!--    <el-form-item label="级别" prop="eventLevel">-->
<!--      <el-select v-model="formData.eventLevel" placeholder="请选择告警级别" size="mini">-->
<!--        <el-option-->
<!--          v-for="(item, index) in levelList"-->
<!--          :key="index"-->
<!--          :label="item.label"-->
<!--          :value="item.value"-->
<!--        />-->
<!--      </el-select>-->
<!--    </el-form-item>-->
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
    <el-form-item label="触发类型" prop="triggerType">
      <el-select v-model="formData.triggerType" placeholder="" size="mini" >
        <el-option label="定时触发" value="1" />
        <el-option label="条件触发" value="0" />
      </el-select>
    </el-form-item>
    <el-form-item v-if="formData.triggerType === '1'" label="触发频率" prop="scheduleConf">
      <el-select v-model="cronData.ds" placeholder="" size="mini" class="zeus-mr-5" style="width: 120px" @change="changeType">
        <el-option label="每周" value="weekly" />
        <el-option label="每月" value="month" />
        <el-option label="一次性" value="disposable" />
      </el-select>
      <el-select v-if="cronData.ds === 'weekly'" v-model="cronData.weekly" multiple placeholder="请选择星期几" size="mini" class="zeus-mr-5" style="width: 502px" >
        <el-option label="星期一" value="MON" />
        <el-option label="星期二" value="TUE" />
        <el-option label="星期三" value="WED" />
        <el-option label="星期四" value="THU" />
        <el-option label="星期五" value="FRI" />
        <el-option label="星期六" value="SAT" />
        <el-option label="星期日" value="SUN" />
      </el-select>
      <el-select v-if="cronData.ds === 'month'" v-model="cronData.month" multiple placeholder="请选择每月几号" size="mini" class="zeus-mr-5" style="width: 400px" >
        <el-option v-for="num in 31" :key="num" :label="num" :value="num" />
      </el-select>
      <el-time-picker
        v-if="cronData.ds === 'weekly' || cronData.ds === 'month'"
        v-model="cronData.time"
        size="mini"
        value-format="s m H"
        class="time"
        placeholder="选择时间">
      </el-time-picker>
      <el-date-picker
        v-else
        v-model="cronData.time"
        size="mini"
        value-format="s m H d M yyyy"
        type="datetime"
        class="time"
        placeholder="选择日期时间">
      </el-date-picker>
      <el-checkbox v-model="formData.isVacationStrategy" :true-label="'true'" :false-label="'false'" class="zeus-ml-20">是否启用节假日</el-checkbox>
    </el-form-item>
    <el-form-item v-if="formData.triggerType === '0'" label="触发条件">
      <div class="zeus-mb-10">
        <span style="color: #606266">满足下列</span>
        <el-select v-model="formData.expLogic" placeholder="" size="mini" class="select-w50 zeus-ml-5 zeus-mr-5">
          <el-option label="任意" value="or" />
          <el-option label="所有" value="and" />
        </el-select>
        <span style="color: #606266">条件时,触发场景联动</span>
      </div>
      <Triggers v-for="(item, index) in formData.expList" :key="item.guid" v-model="formData.expList[index]" :ind="index" :is-dev="true" :device-list="deviceList" @del="del" ref="triggers" />
      <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="addTrigger">增加触发条件</el-button>
    </el-form-item>
    <el-form-item v-if="formData.triggerType === '0'" label="生效时间段" prop="time">
      <div class="el-form-item-tips">
        <svg-icon icon-class="tips" class="icon" />
        <span>规则在以下时间段内生效。若时间段为空，则永久生效。</span>
        <el-checkbox v-model="formData.isVacationStrategy" :true-label="'true'" :false-label="'false'" class="zeus-ml-20">是否启用节假日</el-checkbox>
      </div>
      <div v-for="(item, index) in formData.timeIntervals2" :key="item.guid">
        <el-select v-model="formData.timeIntervals2[index].dayOfWeeks" multiple placeholder="请选择星期" size="mini" class="zeus-mr-5" style="width: 502px" >
          <el-option label="星期一" value="1" />
          <el-option label="星期二" value="2" />
          <el-option label="星期三" value="3" />
          <el-option label="星期四" value="4" />
          <el-option label="星期五" value="5" />
          <el-option label="星期六" value="6" />
          <el-option label="星期日" value="7" />
        </el-select>
        <el-time-picker
          v-model="formData.timeIntervals2[index].time"
          is-range
          range-separator="-"
          size="mini"
          value-format="HHmmss"
          class="zeus-mr-5"
          :clearable="false"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
        <el-button type="text" @click="delTime(index)">
          <svg-icon icon-class="but_del"></svg-icon>
        </el-button>
      </div>
      <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="addTime">增加生效时间段</el-button>
    </el-form-item>
    <el-form-item label="执行动作" prop="deviceServices">
      <action v-for="(item, index) in formData.deviceServices" :key="item.guid" v-model="formData.deviceServices[index]" :ind="index" :is-dev="true" :device-list="deviceList" @del="delAction" @batch="batchSelect"></action>
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
  name: 'SceneForm',
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
  computed: {
    secondsText() {
      const date = this.cronData.time
      return date.split(' ')[0]
    },
    minutesText() {
      const date = this.cronData.time
      return date.split(' ')[1]
    },
    hoursText() {
      const date = this.cronData.time
      return date.split(' ')[2]
    },
    daysText() {
      let days = ''
      if (this.cronData.ds === 'month') {
        days = this.cronData.month.toString()
      } else if (this.cronData.ds === 'disposable') {
        const date = this.cronData.time
        days = date.split(' ')[3]
      }
      return days
    },
    weeksText() {
      return this.cronData.weekly.toString()
    },
    monthsText() {
      let months = ''
      if (this.cronData.ds === 'disposable') {
        const date = this.cronData.time
        months = date.split(' ')[4]
      }
      return months
    },
    yearsText() {
      let years = ''
      if (this.cronData.ds === 'disposable') {
        const date = this.cronData.time
        years = date.split(' ')[5]
      }
      return years
    },
    cron() {
      return `${this.secondsText || '*'} ${this.minutesText || '*'} ${this.hoursText || '*'} ${this.daysText || '?'} ${this.monthsText || '*'} ${this.weeksText || '?'} ${this.yearsText || '*'}`
    },
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
    const checkData2 = (rule, value, callback) => {
      if (this.cronData.time === '' || this.cronData.time === null) {
        callback(new Error('请选择时间!'))
      }
      if (this.cronData.ds === 'weekly' && this.cronData.weekly.length === 0) {
        callback(new Error('请选择星期!'))
      }
      if (this.cronData.ds === 'month' && this.cronData.month.length === 0) {
        callback(new Error('请选择每月几号!'))
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
          { required: true, message: '请选择触发条件', trigger: 'xiaoyao' },
          { validator: checkData, trigger: 'xiaoyao' }
        ],
        scheduleConf: [
          { required: true, message: '请选择触发频率', trigger: 'xiaoyao' },
          { validator: checkData2 }
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
      deviceList: [],
      cronData: {
        month: [],
        weekly: [],
        ds: 'weekly',
        time: ''
      }
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
  mounted() {
    this.rest()
  },
  methods: {
    addTrigger() {
      if (this.validateTriggers()) {
        let obj = {
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
        }
        if (this.formData.expList.length){
          const dev = this.formData.expList[this.formData.expList.length - 1]
          obj = {
            guid: guid(),
            deviceId: dev.deviceId,
            productAttrId: '',
            condition: '=',
            value: '',
            scope: '',
            productAttrType: '属性',
            function: 'last',
            period: '时间',
            unit: 'm'
          }
        }
        this.formData.expList.push(obj)
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
      this.formData.scheduleConf = this.cron
      let flag = false
      this.$refs.dialogForm.validate((valid) => {
        flag = valid
      })
      return flag && this.verification() && this.validateTriggers()
    },
    reset() {
      this.$refs.dialogForm.resetFields()
    },
    del(index) {
      this.formData.expList.splice(index, 1)
    },
    delTime(index) {
      this.formData.timeIntervals2.splice(index, 1)
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
    // 批量添加执行动作
    batchSelect(ids) {
      // 防止出现空白选择框
      if (this.formData.deviceServices[this.formData.deviceServices.length - 1].executeDeviceId === ''){
        this.formData.deviceServices.pop()
      }
      ids.forEach((id) => {
        this.formData.deviceServices.push({
          guid: guid(),
          executeDeviceId: id,
          serviceId: ''
        })
      })
    },
    addTime() {
      for (const item of this.formData.timeIntervals2) {
        if (item.time[0] === '' || item.time[1] === '') {
          this.$message({
            message: '请填写完整当前生效时间段',
            type: 'warning'
          })
          return false
        }
      }
      this.formData.timeIntervals2.push({ time: ['083000', '180000'], dayOfWeeks: ['1', '2', '3', '4', '5', '6', '7'] })
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
    },
    changeType(val) {
      this.cronData.month = []
      this.cronData.weekly = []
      this.cronData.time = ''
      if (val === 'weekly') {
        this.cronData.weekly = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      }
    },
    rest() {
      let data = []
      if (this.formData.scheduleConf) {
        data = this.formData.scheduleConf.split(' ')
      } else {
        data = '* * * * * SUN,MON,TUE,WED,THU,FRI,SAT *'.split(' ')
      }
      let time = ''
      if (data[0] !== '*' && data[1] !== '*' && data[2] !== '*') {
        time = data[0] + ' ' + data[1] + ' ' + data[2]
      }
      if (data[0] !== '*' && data[1] !== '*' && data[2] !== '*' && data[3] !== '?' && data[4] !== '*' && data[6] !== '*') {
        time = data[0] + ' ' + data[1] + ' ' + data[2] + ' ' + data[3] + ' ' + data[4] + ' ' + data[6]
      }
      this.cronData.time = time
      if (data[5] !== '?') {
        this.cronData.ds = 'weekly'
        this.cronData.weekly = data[5].split(',')
      } else {
        this.cronData.weekly = []
        if (data[6] !== '*') {
          this.cronData.ds = 'disposable'
        } else {
          this.cronData.month = data[3].split(',')
          this.cronData.ds = 'month'
        }
      }
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

  ::v-deep{
    .el-switch__label *{
      font-size: 12px!important;
    }
  }
  .time ::v-deep.el-input__inner{
    padding-left: 30px!important;
    padding-right: 30px!important;
  }
  .select-w50{
    width: 50px;
  }
}
</style>
