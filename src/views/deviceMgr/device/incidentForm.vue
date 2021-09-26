<!-- 事件表单 -->
<template>
  <el-form ref="dialogForm" :rules="rules" :model="formData" label-width="80px" label-position="top" class="attribute-form">
    <el-form-item label="事件名称" prop="attrName">
      <el-input v-model="formData.attrName" size="mini" :disabled="disabled"/>
    </el-form-item>
    <el-form-item label="标识符" prop="key">
      <el-input v-model="formData.key" size="mini" :disabled="disabled"/>
      <div class="el-form-item-tips">
        <svg-icon icon-class="tips" />
        <span>可以包含数字、字母、-_.。更多特殊形式请见文档</span>
        <span v-if="false">标识符内可使用本产品 变量 的 键，且必须包含在{$}内；若变量的键为 PWD，则完整标识符可以为 xx{$PWD}xxx</span>
      </div>
    </el-form-item>
    <el-form-item label="数据类型" prop="valueType">
      <el-select v-model="formData.valueType" size="mini" placeholder="请选择数据类型" :disabled="disabled">
        <el-option
          v-for="item in valueList"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        />
      </el-select>
      <div class="el-form-item-tips">
        <svg-icon icon-class="tips" />想要枚举？使用下面的值映射或数据预处理。
      </div>
    </el-form-item>
    <el-form-item v-if="formData.valueType == '3' || formData.valueType == '0'" label="单位">
      <el-select v-model="formData.units" filterable size="mini" placeholder="请选择单位" :disabled="disabled">
        <el-option-group
          v-for="group in unitsList"
          :key="group.label"
          :label="group.label"
        >
          <el-option
            v-for="item in group.options"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-option-group>
      </el-select>
    </el-form-item>
    <el-form-item label="事件级别" prop="eventLevel">
      <el-select v-model="formData.eventLevel" size="mini" placeholder="请选择事件级别" :disabled="disabled">
        <el-option
          v-for="item in levelList"
          :key="item.code"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="描述">
      <el-input v-model="formData.remark" type="textarea" rows="2" size="mini"/>
    </el-form-item>
    <el-form-item label="数据预处理">
      <Pretreatment v-model="formData.processStepList" :disabled="disabled" />
    </el-form-item>
    <el-form-item label="值映射">
      <el-select v-model="formData.valuemapid" size="mini" placeholder="请选择值映射" :disabled="disabled">
        <el-option
          v-for="item in mapList"
          :key="item.valuemapid"
          :label="item.name"
          :value="item.valuemapid"
        />
      </el-select>
      <div class="el-form-item-tips">
        <svg-icon icon-class="tips" />若配置，则实际保存的依然是原始值。只是方便让展现数据的可读性更好。
      </div>
    </el-form-item>
    <el-form-item label="标签">
      <Tag v-model="formData.tags" />
    </el-form-item>
  </el-form>
</template>

<script>
import { getDictListByCode, groupDictByCode } from '@/api/system'
import { getAttrTrapperByPage, getDevValueMapList } from '@/api/deviceMgr'
import { getValueMapList } from '@/api/porductMgr'
import Pretreatment from '@/components/Detail/Pretreatment'
import Tag from '@/components/Detail/Tag'

export default {
  name: 'AttributeForm',
  components: {
    Pretreatment,
    Tag
  },
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    },
    isDev: Boolean
  },
  data() {
    const checkData = (rule, value, callback) => {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error('请输入数字、字母或符号!'))
        } else {
          callback()
        }
      }
      callback()
    }
    return {
      formData: this.value,
      rules: {
        attrName: [
          { required: true, message: '请输入事件名称', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入标识符', trigger: 'blur' },
          { validator: checkData, trigger: 'blur' }
        ],
        eventLevel: [
          { required: true, message: '请选择事件级别', trigger: 'change' }
        ],
        valueType: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ]
      },
      sourceList: [],
      attrList: [],
      valueList: [],
      unitsList: [],
      mapList: [],
      prodId: null,
      levelList: [
        { label: '信息', value: '1' },
        { label: '低级', value: '2' },
        { label: '中级', value: '3' },
        { label: '高级', value: '4' },
        { label: '紧急', value: '5' }
      ]
    }
  },
  computed: {
    disabled() {
      return this.formData.attrId && this.formData.templateId !== ''
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
  created() {
    if (this.$route.query.id) {
      this.prodId = this.$route.query.id
      this.formData.productId = this.prodId
      this.getDict()
    }
  },
  methods: {
    getDict() {
      getDictListByCode({ dictTypeCode: 'ATTR_TYPE' }).then(res => {
        if (res.code == 200) {
          this.sourceList = res.data
        }
      })
      getDictListByCode({ dictTypeCode: 'DATA_TYPE' }).then(res => {
        if (res.code == 200) {
          this.valueList = res.data
        }
      })
      groupDictByCode({ dictTypeCode: 'UNITS' }).then(res => {
        if (res.code == 200) {
          this.unitsList = this.groupFormat(res.data)
        }
      })
      getAttrTrapperByPage({ prodId: this.prodId }).then(res => {
        if (res.code == 200) {
          this.attrList = res.data
        }
      })
      if (this.isDev) {
        getDevValueMapList({ deviceId: this.prodId }).then(res => {
          if (res.code == 200) {
            this.mapList = res.data
          }
        })
      } else {
        getValueMapList({ productId: this.prodId }).then(res => {
          if (res.code == 200) {
            this.mapList = res.data
          }
        })
      }
    },
    validateForm() {
      let flag = false
      this.$refs.dialogForm.validate((valid) => {
        flag = valid
      })
      return flag
    },
    groupFormat(data) {
      const list = []
      for (const key in data) {
        const item = {
          label: key,
          options: data[key]
        }
        list.push(item)
      }
      return list
    }
  }
}
</script>

<style lang="scss" scoped>
.attribute-form {
  width: 600px;
}
</style>
