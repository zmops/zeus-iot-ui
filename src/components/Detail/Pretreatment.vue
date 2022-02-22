<!-- 数据预处理组件 -->
<template>
  <div class="Pretreatment">
    <div v-for="(item,index) in formData" :key="index" class="zeus-list-conten zeus-flex-between">
      <div class="left zeus-flex-default">
        <div class="zeus-list-item">
          <el-select v-model="item.type" size="mini" placeholder="请选择方法名称" :disabled="disabled" @change="proChange(index)">
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
        <div v-if="item.type !== '7' && item.type !== '8' && item.type !== '25' && item.type !== '21' && item.type !== '13' && item.type !== '19'" class="zeus-list-item">
          <el-input v-model="item.value" size="mini" :placeholder="tipsText(item.type)" :disabled="disabled"/>
        </div>
        <div v-if="item.type === '25'" class="zeus-list-item">
          <el-input v-model="item.value" size="mini" placeholder="被替换文本" :disabled="disabled"/>
        </div>
        <div v-if="item.type === '25'" class="zeus-list-item">
          <el-input v-model="item.value2" size="mini" placeholder="替换为" :disabled="disabled"/>
        </div>
        <div v-if="item.type === '13'" class="zeus-list-item">
          <el-input v-model.number="item.value" size="mini" placeholder="最小值" :disabled="disabled" />
        </div>
        <div v-if="item.type === '13'" class="zeus-list-item">
          <el-input v-model.number="item.value2" size="mini" placeholder="最大值" :disabled="disabled" />
        </div>
        <div v-if="item.type === '21'" class="zeus-list-item" @click="changeJs(index)">
          <el-input v-model="item.value" class="attr-js" size="mini" disabled placeholder="script" suffix-icon="el-icon-edit-outline"/>
        </div>
      </div>
      <el-button v-if="!disabled" type="text" class=" zeus-icon"  @click="formData.splice(index, 1)">
        <svg-icon icon-class="but_del"></svg-icon>
      </el-button>
    </div>
    <el-button class="add-btn" plain icon="el-icon-plus" size="mini" :disabled="disabled" @click="add">增加预处理步骤</el-button>
    <el-dialog
      v-dialogDrag
      :visible.sync="jsVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :show-close="false"
      :width="'700px'"
      @close = "jsValue = ''"
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
        <json-editor ref="JsonEditor" :mode="'text/javascript'" :json="jsValue" @change="handleJsonChange"/>
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
import { groupDictByCode } from '@/api/system'
import JsonEditor from '@/components/Basics/JsonEditor.vue'

export default {
  name: 'Pretreatment',
  components: {
    JsonEditor
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: Boolean
  },
  data() {
    return {
      formData: null,
      preTypeList: [],
      jsVisible: false,
      jsValue: '',
      jsSeat: null
    }
  },
  watch: {
    // value: {
    //   immediate: true,
    //   deep: true,
    //   handler(val) {
    //     const arr = []
    //     if (val && val.length) {
    //       val.forEach((item) => {
    //         if (item.type == '25') {
    //           const a = item.params.split('\\\\n')
    //           arr.push({
    //             type: item.type,
    //             value: a[0],
    //             value2: a[1]
    //           })
    //         } else if (item.type == '7' || item.type == '8') {
    //           arr.push({
    //             type: item.type,
    //             value: '',
    //             value2: ''
    //           })
    //         } else {
    //           arr.push({
    //             type: item.type,
    //             value: item.params,
    //             value2: ''
    //           })
    //         }
    //       })
    //     }
    //     this.formData = arr
    //   }
    // },
    formData: {
      deep: true,
      handler(val) {
        const list = []
        if (val && val.length) {
          val.forEach((item) => {
            const obj = {
              type: item.type,
              params: []
            }
            if (item.type === '25' || item.type === '13') {
              obj.params.push(item.value)
              obj.params.push(item.value2)
            } else if (item.type === '7' || item.type === '8' || item.type === '19') {
              obj.params = []
            } else {
              obj.params.push(item.value)
            }
            list.push(obj)
          })
        }
        this.$emit('input', list)
      }
    }
  },
  created() {
    this.getDict()
  },
  mounted() {
    const arr = []
    if (this.value && this.value.length) {
      this.value.forEach((item) => {
        if (item.type === '25') {
          const a = item.params.split('\\\\n')
          arr.push({
            type: item.type,
            value: a[0],
            value2: a[1]
          })
        } else if (item.type === '13') {
          const a = item.params.split('\\\\n')
          arr.push({
            type: item.type,
            value: Number(a[0]),
            value2: Number(a[1])
          })
        } else if (item.type === '7' || item.type === '8' || item.type === '19') {
          arr.push({
            type: item.type,
            value: '',
            value2: ''
          })
        } else {
          arr.push({
            type: item.type,
            value: item.params,
            value2: ''
          })
        }
      })
    }
    this.formData = arr
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
        case '20':
          return '秒'
        case '':
          return '选中方法的参数说明'
      }
    },
    getDict() {
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
    proChange(index) {
      this.formData[index].value = ''
      this.formData[index].value2 = ''
    },
    handleJsonChange(val) {
      if (this.jsValue !== val) {
        this.jsValue = val
      }
    },
    changeJs(i) {
      if (this.disabled) return
      this.jsSeat = i
      this.jsVisible = true
      this.jsValue = this.formData[i].value
    },
    jsCancle() {
      this.jsSeat = null
      this.jsVisible = false
    },
    jsSubmit() {
      this.formData[this.jsSeat].value = this.jsValue
      this.jsCancle()
    },
    verification() {
      for (const item of this.formData) {
        if (item.type !== '7' && item.type !== '8' && item.type !== '19') {
          if (item.type === '' || item.value === '') {
            this.$message({
              message: '请填写完整当前预处理步骤',
              type: 'warning'
            })
            return false
          }
          if (item.type === '13') {
            if (typeof item.value !== 'number' || typeof item.value2 !== 'number') {
              this.$message({
                message: '数据预处理-最小值最大值必须为数字',
                type: 'warning'
              })
              return false
            }
            if (item.value >= item.value2) {
              this.$message({
                message: '数据预处理-最大值必须大于最小值',
                type: 'warning'
              })
              return false
            }
          }
        }
      }
      return true
    },
    add() {
      if (this.verification()) {
        this.formData.push({
          type: '',
          value: '',
          value2: ''
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.zeus-list-conten .zeus-list-item .el-input--mini .el-input__inner{
  border-radius: 0
}
.Pretreatment {
  .add-btn {
    width: 100%;
    border-style: dashed;
  }
  ::v-deep.attr-js{
    .el-input__inner {
      cursor: text !important;
    }
    .el-icon-edit-outline{
      cursor: text !important;
    }
  }
}

</style>
