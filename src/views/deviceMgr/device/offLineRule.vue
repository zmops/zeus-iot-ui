<!--上下线规则-->
<template>
  <div class="offLineRule zeus-relative">
    <div v-if="state === '编辑'">
      <el-divider content-position="left">上线规则</el-divider>
      <el-card v-if="ruleData.ruleFunctionRecovery === 'nodata'" class="box-card zeus-mb-25" shadow="hover">
        <span>{{ ruleData.attrNameRecovery }}</span>
        <span>在</span>
        <span>{{ ruleData.ruleConditionRecovery }}</span>
        <span>{{ unitName(ruleData.unitRecovery) }}</span>
        <span>内有值</span>
      </el-card>
      <el-card v-else class="box-card zeus-mb-25" shadow="hover">
        <span>{{ ruleData.attrNameRecovery }}</span>
        <span>最新值符合:</span>
        <span>{{ ruleData.ruleFunctionRecovery }}</span>
        <span>{{ ruleData.ruleConditionRecovery }}</span>
        <span>{{ ruleData.unitsRecoveryName }}</span>
      </el-card>
      <el-divider content-position="left">下线规则</el-divider>
      <el-card v-if="ruleData.ruleFunction === 'nodata'" class="box-card zeus-mb-25" shadow="hover">
        <span>{{ ruleData.attrName }}</span>
        <span>在</span>
        <span>{{ ruleData.ruleCondition }}</span>
        <span>{{ unitName(ruleData.unit) }}</span>
        <span>内无值</span>
      </el-card>
      <el-card v-else class="box-card zeus-mb-25" shadow="hover">
        <span>{{ ruleData.attrName }}</span>
        <span>最新值符合:</span>
        <span>{{ ruleData.ruleFunction }}</span>
        <span>{{ ruleData.ruleCondition }}</span>
        <span>{{ ruleData.unitsName }}</span>
      </el-card>
    </div>
    <el-empty v-else description="暂无数据"></el-empty>
    <el-button v-if="!isDev" size="mini" round class="zeus-absolute edit" @click="edit">
      <svg-icon icon-class="dialog_edit" style="margin-right: 5px"/>
      {{ state }}
    </el-button>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'800px'"
      :show-close="false"
      @close="close"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_edit"/>
          {{ state }}上下线规则
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <el-form ref="attrForm" :model="dialogForm" :rules="rules" label-width="80px" label-position="top">
          <el-form-item label="上线规则" prop="onLine">
            <el-select v-model="dialogForm.onLine.depAttrId" size="mini" placeholder="请选择属性" class="w3"
                       @change="changeOnLineAttr">
              <el-option
                v-for="item in attrList"
                :key="item.attrId"
                :label="item.attrName"
                :value="item.attrId"
              />
            </el-select>
            <el-select v-model="dialogForm.onLine.type" size="mini" class="w1 zeus-ml-10">
              <el-option label="在" value="nodata"/>
              <el-option label="最新值符合" value="last"/>
            </el-select>
            <el-input v-if="dialogForm.onLine.type === 'nodata'" v-model="dialogForm.onLine.num" size="mini" class="w1 zeus-ml-10"/>
            <el-select v-if="dialogForm.onLine.type === 'nodata'" v-model="dialogForm.onLine.timeType" size="mini"
                       class="w1 zeus-ml-10 zeus-mr-10">
              <el-option v-for="(item, index) in units" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
            <span v-if="dialogForm.onLine.type === 'nodata'">内有值</span>
            <el-select v-if="dialogForm.onLine.type === 'last'" v-model="dialogForm.onLine.exp" size="mini" class="w1 zeus-ml-10">
              <el-option label="=" value="="/>
              <el-option label=">" value=">"/>
              <el-option label="<" value="<"/>
              <el-option label="<>" value="<>"/>
              <el-option label="<=" value="<="/>
              <el-option label=">=" value=">="/>
            </el-select>
            <el-input v-if="dialogForm.onLine.type === 'last'" v-model="dialogForm.onLine.num" size="mini"
                      class="w1 zeus-ml-10 zeus-mr-10"/>
            <span v-if="dialogForm.onLine.type === 'last'">{{ dialogForm.onLine.unit }}</span>
          </el-form-item>
          <el-form-item label="下线规则" prop="offLine">
            <el-select v-model="dialogForm.offLine.depAttrId" size="mini" placeholder="请选择属性" class="w3"
                       @change="changeOffLineAttr">
              <el-option
                v-for="item in attrList"
                :key="item.attrId"
                :label="item.attrName"
                :value="item.attrId"
              />
            </el-select>
            <el-select v-model="dialogForm.offLine.type" size="mini" class="w1 zeus-ml-10">
              <el-option label="在" value="nodata"/>
              <el-option label="最新值符合" value="last"/>
            </el-select>
            <el-input v-if="dialogForm.offLine.type === 'nodata'" v-model="dialogForm.offLine.num" size="mini"
                      class="w1 zeus-ml-10"/>
            <el-select v-if="dialogForm.offLine.type === 'nodata'" v-model="dialogForm.offLine.timeType" size="mini"
                       class="w1 zeus-ml-10 zeus-mr-10">
              <el-option v-for="(item, index) in units" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
            <span v-if="dialogForm.offLine.type === 'nodata'">内无值</span>
            <el-select v-if="dialogForm.offLine.type === 'last'" v-model="dialogForm.offLine.exp" size="mini" class="w1 zeus-ml-10">
              <el-option label="=" value="="/>
              <el-option label=">" value=">"/>
              <el-option label="<" value="<"/>
              <el-option label="<>" value="<>"/>
              <el-option label="<=" value="<="/>
              <el-option label=">=" value=">="/>
            </el-select>
            <el-input v-if="dialogForm.offLine.type === 'last'" v-model="dialogForm.offLine.num" size="mini"
                      class="w1 zeus-ml-10 zeus-mr-10"/>
            <span v-if="dialogForm.offLine.type === 'last'">{{ dialogForm.offLine.unit }}</span>
          </el-form-item>
        </el-form>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="handleSubmit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>
<script>
import { getAttrTrapperList, getTrigger, createTrigger, updateTrigger } from '@/api/deviceMgr'
import { getProductAttrTrapperList } from '@/api/porductMgr'

export default {
  name: 'offLineRule',
  props: {
    isDev: Boolean
  },
  data() {
    return {
      form: {
        onLine: {
          depAttrId: '',
          type: 'nodata',
          timeType: 'm',
          exp: '=',
          num: ''
        },
        offLine: {
          depAttrId: '',
          type: 'nodata',
          timeType: 'm',
          exp: '=',
          num: ''
        }
      },
      dialogForm: {
        onLine: {
          depAttrId: '',
          type: 'nodata',
          timeType: 'm',
          exp: '=',
          num: ''
        },
        offLine: {
          depAttrId: '',
          type: 'nodata',
          timeType: 'm',
          exp: '=',
          num: ''
        }
      },
      attrList: [],
      state: '编辑',
      ruleId: null,
      rules: {
        onLine: [
          { required: true }
        ],
        offLine: [
          { required: true }
        ]
      },
      dialogVisible: false,
      id: null,
      ruleData: {},
      units: [
        { label: '秒', value: 's' },
        { label: '分钟', value: 'm' },
        { label: '小时', value: 'h' },
        { label: '次', value: '' }
      ]
    }
  },
  created() {
    this.id = this.$route.query.id
    this.detail()
  },
  methods: {
    close() {
      // this.form = {
      //   onLine: {
      //     depAttrId: '',
      //     type: 'nodata',
      //     timeType: 'm',
      //     exp: '=',
      //     num: ''
      //   },
      //   offLine: {
      //     depAttrId: '',
      //     type: 'nodata',
      //     timeType: 'm',
      //     exp: '=',
      //     num: ''
      //   }
      // }
    },
    unitName(v) {
      const i = this.units.find((item) => {
        return item.value === v
      })
      return i.label
    },
    detail() {
      // 获取详情,有数据就是编辑,没数据就是创建
      getTrigger({ relationId: this.id }).then((res) => {
        if (res.code == 200) {
          const data = res.data
          this.ruleData = data
          if (data && data.ruleId) {
            this.ruleId = data.ruleId
            this.state = '编辑'
            this.form.offLine = {
              depAttrId: data.attrId,
              type: data.ruleFunction === 'nodata' ? 'nodata' : 'last',
              timeType: data.ruleFunction === 'nodata' ? data.unit : '',
              exp: data.ruleFunction === 'nodata' ? '' : data.ruleFunction,
              num: data.ruleCondition
            }
            this.form.onLine = {
              depAttrId: data.attrIdRecovery,
              type: data.ruleFunctionRecovery === 'nodata' ? 'nodata' : 'last',
              timeType: data.ruleFunctionRecovery === 'nodata' ? data.unitRecovery : '',
              exp: data.ruleFunctionRecovery === 'nodata' ? '' : data.ruleFunctionRecovery,
              num: data.ruleConditionRecovery
            }
          } else {
            this.state = '创建'
          }
        }
      })
    },
    changeOffLineAttr(id) {
      const item = this.attrList.find((i) => {
        return i.attrId === id
      })
      this.dialogForm.offLine.key = item.key
      this.dialogForm.offLine.unit = item.unitsName
    },
    changeOnLineAttr(id) {
      const item = this.attrList.find((i) => {
        return i.attrId === id
      })
      this.dialogForm.onLine.key = item.key
      this.dialogForm.onLine.unit = item.unitsName
    },
    async edit() {
      this.dialogForm = JSON.parse(JSON.stringify(this.form))
      if (this.isDev) {
        await getAttrTrapperList({ prodId: this.$route.query.id }).then((res) => {
          if (res.code == 200) {
            this.attrList = res.data
          }
        })
      } else {
        await getProductAttrTrapperList({ prodId: this.$route.query.id }).then((res) => {
          if (res.code == 200) {
            this.attrList = res.data
          }
        })
      }
      this.dialogVisible = true
      if (this.dialogForm.offLine.depAttrId) {
        this.changeOffLineAttr(this.dialogForm.offLine.depAttrId)
      }
      if (this.dialogForm.onLine.depAttrId) {
        this.changeOnLineAttr(this.dialogForm.onLine.depAttrId)
      }
    },
    handleSubmit() {
      const { onLine, offLine } = this.dialogForm
      const data = {
        relationId: this.id,

        attrId: offLine.depAttrId,
        ruleFunction: offLine.type === 'nodata' ? 'nodata' : offLine.exp,
        ruleCondition: offLine.num,
        unit: offLine.type === 'nodata' ? offLine.timeType : '',
        productAttrKey: offLine.key,

        attrIdRecovery: onLine.depAttrId,
        ruleFunctionRecovery: onLine.type === 'nodata' ? 'nodata' : onLine.exp,
        ruleConditionRecovery: onLine.num,
        unitRecovery: onLine.type === 'nodata' ? onLine.timeType : '',
        productAttrKeyRecovery: onLine.key
      }
      if (this.state === '编辑') {
        data.ruleId = this.ruleId
        updateTrigger(data).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.detail()
          }
        })
      } else {
        createTrigger(data).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.detail()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.offLineRule {
  width: 100%;
  padding: 20px 100px 20px 20px;
  background-color: #fff;

  .box-card span {
    //background-color: #E3E9EF;
    //margin-right: 8px;
    padding: 6px 0;
    //color: #fff;
    font-size: 12px;
  }

  .edit {
    right: 18px;
    top: 35px;
    transform: translateY(-50%);
    padding: 5px 9px;
    border: 1px solid #EFF4F9;
    background: #EFF4F9;
  }

  .w1 {
    width: 100px;
  }

  .w2 {
    width: 150px;
  }

  .w3 {
    width: 200px;
  }

  .w4 {
    width: 250px;
  }
}
</style>
