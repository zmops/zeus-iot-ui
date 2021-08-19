<template>
  <div class="zeus-mapping-dialog">
    <div class="zeus-product-tit">值映射</div>
    <el-form ref="mappingForm" :rules="mapRules" :model="mapItem" label-width="80px" label-position="top" class="dialog-form">
      <el-form-item label="方案名称" prop="valueMapName">
        <el-input v-model="mapItem.valueMapName" size="mini" />
      </el-form-item>
      <el-form-item label="映射" prop="valueMaps">
        <div v-for="(i,index) in mapItem.valueMaps" :key="'map'+index" class="zeus-list-conten zeus-flex-between">
          <div class="left zeus-flex-default">
            <div class="zeus-list-item">
              <el-input v-model="i.value" size="mini">
                <template slot="prepend">原始值</template>
              </el-input>
            </div>
            <div class="zeus-list-item">
              <el-input v-model="i.newvalue" size="mini">
                <template slot="prepend">映射为</template>
              </el-input>
            </div>
          </div>
          <i class="el-icon-delete zeus-icon" @click="del(index)" />
        </div>
        <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="mapAdd">增加</el-button>
      </el-form-item>
    </el-form>
    <div class="zeus-form-btns zeus-flex-center">
      <el-button type="primary" size="mini" round @click="handleSubmit">确 定</el-button>
      <el-button size="mini" round @click="handleCancle">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { updateValuemap } from '@/api/porductMgr'
export default {
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      mapItem: {},
      mapRules: {
        valueMapName: [
          { required: true, message: '请输入方案名称', trigger: 'blur' }
        ],
        valueMaps: [
          { required: true, message: '请填写映射值', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(val) {
        console.log(val)
        this.mapItem = Object.assign({}, val)
      }
    }
  },
  methods: {
    mapAdd() {
      const obj = {
        value: '',
        newvalue: ''
      }
      if (this.mapItem.valueMaps.length > 0) {
        let rule = true
        for (const item of this.mapItem.valueMaps) {
          if (item.value === '' || item.newvalue === '') {
            rule = false
          }
        }
        if (rule) {
          this.mapItem.valueMaps.push(obj)
        } else {
          this.$message({
            message: '请完整填写当前映射',
            type: 'warning'
          })
        }
      } else {
        this.mapItem.valueMaps.push(obj)
      }
    },
    del(i) {
      this.$confirm('是否确认删除当前数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.mapItem.valueMaps.splice(i, 1)
      })
    },
    handleSubmit() {
      this.$refs.mappingForm.validate(async(valid, errorFields) => {
        if (valid) {
          if (this.mapItem.valueMaps.length > 0) {
            let rule = true
            for (const item of this.mapItem.valueMaps) {
              if (item.value === '' || item.newvalue === '') {
                rule = false
              }
            }
            if (rule) {
              this.mapUpdate()
            } else {
              this.$message({
                message: '请完整填写当前映射',
                type: 'warning'
              })
            }
          } else {
            this.mapUpdate()
          }
        }
      })
    },
    mapUpdate() {
      const data = Object.assign({}, this.mapItem)
      const list = {}
      data.valueMaps.map((i) => {
        list[i.value] = i.newvalue
      })
      data.valueMaps = list
      updateValuemap(data).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.handleCancle()
        }
      })
    },
    handleCancle() {
      this.$emit('handleCancle')
    }
  }
}
</script>
