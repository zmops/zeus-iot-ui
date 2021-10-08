<!-- 属性表单页面 -->
<template>
  <div class="form-content">
    <div class="dialog-body">
      <el-form ref="attrForm" :rules="attrRules" :model="form" label-width="80px" label-position="top"
               class="dialog-form">
        <el-form-item label="属性名称" prop="attrName">
          <el-input v-model="form.attrName" size="mini"/>
        </el-form-item>
        <el-form-item label="标识符" prop="key">
          <el-input v-model="form.key" size="mini"/>
          <div class="el-form-item-tips">
            <svg-icon icon-class="tips" class="icon" />
            <span>可以包含数字、字母、-_.。更多特殊形式请见文档</span>
            <span v-if="false">标识符内可使用本产品 变量 的 键，且必须包含在{$}内；若变量的键为 PWD，则完整标识符可以为 xx{$PWD}xxx</span>
          </div>
        </el-form-item>
        <el-form-item label="来源类型" prop="source">
          <el-select v-model="form.source" size="mini" placeholder="请选择来源类型">
            <el-option
              v-for="item in sourceList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.source === '3'" label="来源属性" prop="depAttrId">
          <el-select v-model="form.depAttrId" size="mini" placeholder="请选择来源属性">
            <el-option
              v-for="item in attrList"
              :key="item.attrId"
              :label="item.attrName"
              :value="item.attrId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型" prop="valueType">
          <el-select v-model="form.valueType" size="mini" placeholder="请选择数据类型">
            <el-option
              v-for="item in valueList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
          <div class="el-form-item-tips">
            <svg-icon icon-class="tips" class="icon" />想要枚举？使用下面的值映射或数据预处理。
          </div>
        </el-form-item>
        <el-form-item label="单位">
          <el-select v-model="form.units" clearable filterable size="mini" placeholder="请选择单位">
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
        <!-- <el-form-item label="取数间隔">
          <el-input v-model="form.key" size="mini" />
        </el-form-item> -->
        <el-form-item label="描述">
          <el-input v-model="form.remark" type="textarea" rows="2" size="mini"/>
        </el-form-item>
        <el-form-item label="数据预处理">
          <div v-for="(item,index) in processStepList" :key="'pre'+index" class="zeus-list-conten zeus-flex-between">
            <div class="left zeus-flex-default">
              <div class="zeus-list-item">
                <el-select v-model="item.type" size="mini" placeholder="请选择方法名称" @change="proChange(index)">
                  <el-option-group
                    v-for="group in preTypeList"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="type in group.options"
                      :key="type.code"
                      :label="type.name"
                      :value="type.code"
                    />
                  </el-option-group>
                </el-select>
              </div>
              <div v-if="item.type !== '7' && item.type !== '8' && item.type !== '25' && item.type !== '21'"
                   class="zeus-list-item">
                <el-input v-model="item.value" size="mini" :placeholder="tipsText(item.type)"/>
              </div>
              <div v-if="item.type === '25'" class="zeus-list-item">
                <el-input v-model="item.value" size="mini" placeholder="被替换文本"/>
              </div>
              <div v-if="item.type === '25'" class="zeus-list-item">
                <el-input v-model="item.value2" size="mini" placeholder="替换为"/>
              </div>
              <div v-if="item.type === '21'" class="zeus-list-item" @click="changeJs(index)">
                <el-input v-model="item.value" class="zeus-attr-js" size="mini" disabled placeholder="script" suffix-icon="el-icon-edit-outline"/>
              </div>
            </div>
            <i class="el-icon-delete zeus-icon" @click="delItem('pre',index)"/>
          </div>
          <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="preAdd">增加预处理步骤</el-button>
          <div class="el-form-item-tips">
            <svg-icon icon-class="tips" class="icon" />若配置，则最终保存的是预处理后的数据。
          </div>
        </el-form-item>
        <el-form-item label="值映射">
          <el-select v-model="form.valuemapid" size="mini" placeholder="请选择值映射">
            <el-option
              v-for="item in mapList"
              :key="item.valuemapid"
              :label="item.name"
              :value="item.valuemapid"
            />
          </el-select>
          <div class="el-form-item-tips">
            <svg-icon icon-class="tips" class="icon" />若配置，则实际保存的依然是原始值。只是方便让展现数据的可读性更好。
          </div>
        </el-form-item>
        <el-form-item label="标签">
          <div v-for="(item,index) in form.tags" :key="'tag'+index" class="zeus-list-conten zeus-flex-between">
            <div class="left zeus-flex-default">
              <div class="zeus-list-item">
                <el-input v-model="item.tag" size="mini">
                  <template slot="prepend">键</template>
                </el-input>
              </div>
              <div class="zeus-list-item">
                <el-input v-model="item.value" size="mini">
                  <template slot="prepend">值</template>
                </el-input>
              </div>
            </div>
            <i class="el-icon-delete zeus-icon" @click="delItem('tag',index)"/>
          </div>
          <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="tagAdd">增加标签</el-button>
          <div class="el-form-item-tips">
            <svg-icon icon-class="tips" class="icon" />可在属性上增加自定义标签，以方便统计分析。
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-footer class="dialog-footer-btn">
      <el-button size="mini" round @click="handleCancle">取 消</el-button>
      <el-button type="primary" size="mini" round @click="handleSubmit">确 定</el-button>
    </el-footer>
    <el-dialog
      v-dialogDrag
      :visible.sync="jsVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :show-close="false"
      :width="'700px'"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_edit"/>
          Java Script
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="jsVisible = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <p>function (value) {</p>
        <json-editor ref="JsonEditor" :json="jsValue" @change="handleJsonChange1"/>
        <!-- <el-input v-model="jsValue" type="textarea" placeholder="return value" maxlength="65535" show-word-limit :autosize="{ minRows: 3, maxRows: 15}" /> -->
        <p>}</p>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="jsCancle">取 消</el-button>
        <el-button type="primary" size="mini" round @click="jsSubmit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import {
  getValueMapList,
  getAttrTrapperByPage,
  createAttrTrapper,
  updateAttrTrapper,
  detailAttrTrapper
} from '@/api/deviceMgr'
import JsonEditor from '@/components/Basics/JsonEditor.vue'
import { getDictListByCode, groupDictByCode } from '@/api/system'

export default {
  components: {
    JsonEditor
  },
  props: {
    items: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        attrName: '',
        key: '',
        units: '',
        source: '',
        remark: '',
        productId: '',
        valueType: '',
        processStepList: null,
        valuemapid: '',
        tags: [{
          tag: '',
          value: ''
        }]
      },
      attrRules: {
        attrName: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入标识符', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请选择来源类型', trigger: 'change' }
        ],
        depAttrId: [
          { required: true, message: '请选择来源属性', trigger: 'change' }
        ],
        valueType: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ]
      },
      processStepList: [{
        type: '',
        value: '',
        value2: ''
      }],
      mapList: [],
      sourceList: [],
      attrList: [],
      valueList: [],
      unitsList: [],
      preTypeList: [],
      jsSeat: null,
      jsVisible: false,
      jsValue: '',
      prodId: ''
    }
  },
  watch: {
    items: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getDetail()
        } else {
          this.processStepList = [{
            type: '',
            value: '',
            value2: ''
          }]
          this.form = {
            attrName: '',
            key: '',
            units: '',
            source: '',
            remark: '',
            productId: '',
            valueType: '',
            processStepList: [{
              type: '',
              value: '',
              value2: ''
            }],
            valuemapid: '',
            tags: [{
              tag: '',
              value: ''
            }]
          }
          this.$nextTick(() => {
            this.$refs.attrForm.resetFields()
          })
        }
      }
    },
    'form.key': {
      immediate: true,
      handler(val) {
        this.form.key = val.replace(/[\W]/g, '')
      }
    }
  },
  async created() {
    this.getDict()
    if (this.$route.query.id) {
      this.prodId = this.$route.query.id
      this.form.productId = this.prodId
      await this.getMapList()
      await this.getAttribute()
    }
  },
  methods: {
    tipsText(type) {
      switch (type) {
        case '4':
          return '从开头和结尾移除的字符串'
        case '3':
          return '从开头移除的字符串'
        case '2':
          return '从结尾移除的字符串'
        case '1':
          return '计算倍数'
        case '11':
          return 'XPath'
        case '12':
          return '$.path.to.node'
        case '':
          return '选中方法的参数说明'
      }
    },
    changeJs(i) {
      this.jsSeat = i
      this.jsVisible = true
      this.jsValue = this.processStepList[i].value
    },
    handleJsonChange1(val) {
      if (this.jsValue !== val) {
        this.jsValue = val
      }
    },
    jsCancle() {
      this.jsValue = ''
      this.jsSeat = null
      this.jsVisible = false
    },
    jsSubmit() {
      this.processStepList[this.jsSeat].value = this.jsValue
      this.jsCancle()
    },
    proChange(index) {
      this.processStepList[index].value = ''
      this.processStepList[index].value2 = ''
    },
    getDetail() {
      detailAttrTrapper({ attrId: this.items }).then(res => {
        if (res.code == 200) {
          this.form = res.data
          this.processStepList = []
          for (const item of res.data.processStepList) {
            let obj = {}
            switch (item.type) {
              case '25':
                const arr = item.params.split('\\\\n')
                obj = {
                  type: item.type,
                  value: arr[0],
                  value2: arr[1]
                }
                break
              case '7':
              case '8':
                obj = {
                  type: item.type,
                  value: '',
                  value2: ''
                }
                break
              default:
                obj = {
                  type: item.type,
                  value: item.params,
                  value2: ''
                }
                break
            }
            this.processStepList.push(obj)
          }
        }
      })
    },
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
      groupDictByCode({ dictTypeCode: 'DATA_PRE_TYPE' }).then(res => {
        if (res.code == 200) {
          this.preTypeList = this.groupFormat(res.data)
        }
      })
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
    },
    getMapList() {
      getValueMapList({ deviceId: this.prodId }).then(res => {
        if (res.code == 200) {
          this.mapList = res.data
        }
      })
    },
    getAttribute() {
      const data = { prodId: this.prodId }
      getAttrTrapperByPage(data).then(res => {
        if (res.code == 200) {
          this.attrList = res.data
        }
      })
    },
    tagAdd() {
      const obj = {
        tag: '',
        value: ''
      }
      if (this.form.tags && this.form.tags.length > 0) {
        let rule = true
        for (const item of this.form.tags) {
          if (item.tag === '') {
            rule = false
          }
        }
        if (rule) {
          this.form.tags.push(obj)
        } else {
          this.$message({
            message: '请填写完整当前标签的键值',
            type: 'warning'
          })
        }
      } else {
        this.form.tags.push(obj)
      }
    },
    preAdd() {
      const obj = {
        type: '',
        value: '',
        value2: ''
      }
      if (this.processStepList && this.processStepList.length > 0) {
        let rule = true
        for (const item of this.processStepList) {
          if (item.type) {
            if (item.type === '25') {
              if (item.value === '' || item.value2 === '') {
                rule = false
              }
            } else {
              if (item.type !== '7' && item.type !== '8') {
                if (item.value === '') {
                  rule = false
                }
              }
            }
          } else {
            rule = false
          }
        }
        if (rule) {
          this.processStepList.push(obj)
        } else {
          this.$message({
            message: '请填写完整当前预处理步骤',
            type: 'warning'
          })
        }
      } else {
        this.processStepList.push(obj)
      }
    },
    delItem(type, i) {
      if (type === 'pre') {
        this.processStepList.splice(i, 1)
      }
      if (type === 'tag') {
        this.form.tags.splice(i, 1)
      }
    },
    handleCancle() {
      this.$emit('close')
    },
    handleSubmit() {
      this.$refs.attrForm.validate(async(valid, errorFields) => {
        if (valid) {
          let pre = true
          let tag = true
          if (this.processStepList.length == 1 && this.processStepList[0].type == '' && this.processStepList[0].value == '' && this.processStepList[0].value2 == '') {
            this.processStepList = []
            this.form.processStepList = null
          } else {
            if (this.processStepList && this.processStepList.length > 0) {
              let rule = true
              for (const item of this.processStepList) {
                if (item.type) {
                  if (item.type === '25') {
                    if (item.value === '' || item.value2 === '') {
                      rule = false
                    }
                  } else {
                    if (item.type !== '7' && item.type !== '8') {
                      if (item.value === '') {
                        rule = false
                      }
                    }
                  }
                } else {
                  rule = false
                }
              }
              if (rule) {
                pre = true
                const list = []
                for (const item of this.processStepList) {
                  const obj = {
                    type: item.type,
                    params: []
                  }
                  switch (item.type) {
                    case '25':
                      obj.params.push(item.value)
                      obj.params.push(item.value2)
                      break
                    case '7':
                    case '8':
                      obj.params = []
                      break
                    default:
                      obj.params.push(item.value)
                      break
                  }
                  list.push(obj)
                }
                this.form.processStepList = list
              } else {
                pre = false
                this.$message({
                  message: '请填写完整当前预处理步骤',
                  type: 'warning'
                })
              }
            }
          }
          if (this.form.tags.length == 1 && this.form.tags[0].tag == '' && this.form.tags[0].value == '') {
            this.form.tags = []
          } else {
            if (this.form.tags && this.form.tags.length > 0) {
              let rule = true
              for (const item of this.form.tags) {
                if (item.tag === '') {
                  rule = false
                }
              }
              if (rule) {
                tag = true
              } else {
                tag = false
                this.$message({
                  message: '请填写完整当前标签的键值',
                  type: 'warning'
                })
              }
            }
          }
          if (pre && tag) {
            if (this.form.attrId) {
              updateAttrTrapper(this.form).then(async(res) => {
                if (res.code == 200) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.$emit('closeDialog')
                }
              })
            } else {
              createAttrTrapper(this.form).then(async(res) => {
                if (res.code == 200) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                  this.$emit('closeDialog')
                }
              })
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.zeus-attr-js .el-input__inner {
  cursor: default !important;
}
</style>
