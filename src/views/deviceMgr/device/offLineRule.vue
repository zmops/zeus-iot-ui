<!--上下线规则-->
<template>
  <div class="offLineRule">
    <el-form ref="attrForm" :model="form" :rules="rules" label-width="80px" label-position="top" :disabled="isDev">
      <el-form-item label="上线规则" prop="onLine">
        <el-select v-model="form.onLine.depAttrId" size="mini" placeholder="请选择属性" class="w3">
          <el-option
            v-for="item in attrList"
            :key="item.attrId"
            :label="item.attrName"
            :value="item.attrId"
          />
        </el-select>
        <el-select v-model="form.onLine.type" size="mini" class="w3 zeus-ml-10">
          <el-option label="在特定时间内有值" value="1"/>
          <el-option label="最新值符合条件" value="2"/>
        </el-select>
        <el-input v-if="form.onLine.type === '1'" v-model="form.onLine.time" size="mini" class="w1 zeus-ml-10"/>
        <el-select v-if="form.onLine.type === '1'" v-model="form.onLine.timeType" size="mini" class="w1 zeus-ml-10">
          <el-option label="秒" value="s"/>
          <el-option label="分钟" value="m"/>
          <el-option label="小时" value="h"/>
        </el-select>
        <el-select v-if="form.onLine.type === '2'" v-model="form.onLine.exp" size="mini" class="w1 zeus-ml-10">
          <el-option label="=" value="="/>
          <el-option label=">" value=">"/>
          <el-option label="<" value="<"/>
          <el-option label="<>" value="<>"/>
          <el-option label="<=" value="<="/>
          <el-option label=">=" value=">="/>
        </el-select>
        <el-input v-if="form.onLine.type === '2'" v-model="form.onLine.num" size="mini" class="w1 zeus-ml-10 zeus-mr-10"/>
        <span v-if="form.onLine.type === '2'">{{'属性的单位'}}</span>
      </el-form-item>
      <el-form-item label="下线规则" prop="offLine">
        <el-select v-model="form.offLine.depAttrId" size="mini" placeholder="请选择属性" class="w3">
          <el-option
            v-for="item in attrList"
            :key="item.attrId"
            :label="item.attrName"
            :value="item.attrId"
          />
        </el-select>
        <el-select v-model="form.offLine.type" size="mini" class="w3 zeus-ml-10">
          <el-option label="在特定时间内无值" value="1"/>
          <el-option label="最新值符合条件" value="2"/>
        </el-select>
        <el-input v-if="form.offLine.type === '1'" v-model="form.offLine.time" size="mini" class="w1 zeus-ml-10"/>
        <el-select v-if="form.offLine.type === '1'" v-model="form.offLine.timeType" size="mini" class="w1 zeus-ml-10">
          <el-option label="秒" value="s"/>
          <el-option label="分钟" value="m"/>
          <el-option label="小时" value="h"/>
        </el-select>
        <el-select v-if="form.offLine.type === '2'" v-model="form.offLine.exp" size="mini" class="w1 zeus-ml-10">
          <el-option label="=" value="="/>
          <el-option label=">" value=">"/>
          <el-option label="<" value="<"/>
          <el-option label="<>" value="<>"/>
          <el-option label="<=" value="<="/>
          <el-option label=">=" value=">="/>
        </el-select>
        <el-input v-if="form.offLine.type === '2'" v-model="form.offLine.num" size="mini" class="w1 zeus-ml-10 zeus-mr-10"/>
        <span v-if="form.offLine.type === '2'">{{'属性的单位'}}</span>
      </el-form-item>
    </el-form>
    <el-button v-if="!isDev" type="primary" size="mini" round>保 存</el-button>
  </div>
</template>
<script>
import {getAttrTrapperList} from '@/api/deviceMgr'
import {getProductAttrTrapperList} from '@/api/porductMgr'

export default {
  name: "offLineRule",
  props: {
    isDev: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: {
        onLine: {
          depAttrId: '',
          type: '1',
          time: '',
          timeType: 'm',
          exp: '=',
          num: ''
        },
        offLine: {
          depAttrId: '',
          type: '1',
          time: '',
          timeType: 'm',
          exp: '=',
          num: ''
        }
      },
      attrList: [],
      rules: {
        onLine: [
          { required: true }
        ],
        offLine: [
          { required: true }
        ]
      }
    }
  },
  watch: {
    isDev: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          getAttrTrapperList({ prodId: this.$route.query.id }).then((res) => {
            if (res.code == 200) {
              this.attrList = res.data
            }
          })
        } else {
          getProductAttrTrapperList({ prodId: this.$route.query.id }).then((res) => {
            if (res.code == 200) {
              this.attrList = res.data
            }
          })
        }
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.offLineRule {
  .w1{
    width: 100px;
  }
  .w2{
    width: 150px;
  }
  .w3{
    width: 200px;
  }
  .w4{
    width: 250px;
  }
}
</style>
