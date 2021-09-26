<template>
  <div class="mapping">
    <el-card v-for="(item, index) in mapList" :key="index" class="box-card zeus-mb-10" shadow="hover">
      <el-row>
        <el-col :span="8">
          <svg-icon icon-class="mapping" class="mapping-icon"/>
          <span class="mapping-name zeus-inline-block zeus-ml-10">{{ item.name }}</span>
        </el-col>
        <el-col :span="8">
          <el-row v-for="(i, ind) in item.mappings" :key="ind" class="zeus-mb-15">
            <el-col :span="12">
              <span class="zeus-bold zeus-mr-5">=</span>
              <span>{{ i.value }}</span>
            </el-col>
            <el-col :span="12">
              <svg-icon icon-class="mapping-shift" class="zeus-mr-5"/>
              <span>{{ i.newvalue }}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <div class="zeus-right">
            <el-button size="mini" round @click="edit(item)">
              <svg-icon icon-class="dialog_edit" style="margin-right: 5px"/>
              编辑
            </el-button>
            <el-button size="mini" round @click="del(item.valuemapid)">
              <svg-icon icon-class="list-del" style="margin-right: 5px"/>
              删除
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="add">增加</el-button>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'750px'"
      :show-close="false"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_edit" />
          {{ state }}值映射
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="tips">
        <svg-icon icon-class="tips" />
        <span>供产品内的属性选用。若属性上进行了配置，则实际保存的依然是原始值。只是让展现数据的可读性更好。</span>
      </div>
      <div class="dialog-body">
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
              <i class="el-icon-delete zeus-icon" @click="mapItem.valueMaps.splice(index, 1)" />
            </div>
            <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="mapAdd">增加</el-button>
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
import {getDevValueMapList, deleteDevValuemap, updateDevValuemap} from '@/api/deviceMgr'
import {getValueMapList, deleteValuemap, updateValuemap} from '@/api/porductMgr'
export default {
  props: {
    isDev: Boolean
  },
  data() {
    return {
      id: '',
      mapItem: {},
      showMap: false,
      dialogVisible: false,
      mapList: [],
      state: '创建',
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
  async created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      await this.getMapList()
    }
  },
  methods: {
    getMapList() {
      this.dialogVisible = false
      if (this.isDev) {
        getDevValueMapList({ deviceId: this.id }).then(res => {
          if (res.code == 200) {
            this.mapList = res.data
          }
        })
      } else {
        getValueMapList({ productId: this.id }).then(res => {
          if (res.code == 200) {
            this.mapList = res.data
          }
        })
      }
    },
    add() {
      this.mapItem = {
        valueMapName: '',
        valueMaps: [],
        valuemapid: ''
      }
      this.state = '创建'
      this.dialogVisible = true
    },
    mapAdd() {
      for (const item of this.mapItem.valueMaps) {
        if (item.newvalue === '' || item.value === '') {
          this.$message({
            message: '请填写完整当前值',
            type: 'warning'
          })
          return false
        }
      }
      this.mapItem.valueMaps.push(
        {
          value: '',
          newvalue: ''
        }
      )
    },
    edit(item) {
      this.mapItem = {
        valueMapName: item.name,
        valueMaps: item.mappings,
        valuemapid: item.valuemapid
      }
      this.dialogVisible = true
    },
    del(i) {
      this.$confirm('是否确认删除当前数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isDev) {
          deleteDevValuemap({ valuemapid: i }).then(res => {
            if (res.code == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getMapList()
            }
          })
        } else {
          deleteValuemap({ valuemapid: i }).then(res => {
            if (res.code == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getMapList()
            }
          })
        }
      })
    },
    handleSubmit() {
      this.$refs.mappingForm.validate(async(valid, errorFields) => {
        if (valid) {
          for (const item of this.mapItem.valueMaps) {
            if (item.newvalue === '' || item.value === '') {
              this.$message({
                message: '请填写完整当前值',
                type: 'warning'
              })
              return false
            }
          }
          const list = {}
          const data = JSON.parse(JSON.stringify(this.mapItem))
          data.valueMaps.map((i) => {
            list[i.value] = i.newvalue
          })
          data.valueMaps = list
          if (this.isDev) {
            data.productId = this.id
            updateDevValuemap(data).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.getMapList()
              }
            })
          } else {
            data.productId = this.id
            updateValuemap(data).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.getMapList()
              }
            })
          }
        }
      })
    },
    async handleCancle() {
      await this.getMapList()
      this.showMap = false
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.mapping{
  padding: 20px;
  background-color: #fff;

  .add-btn{
    width: 100%;
    border-style: dashed;
    background-color: #F9FBFD;

    &:hover{
      background-color: #EFF4F9;
    }
  }

  .box-card{
    font-size: 12px;
    color: #242E42;

    .mapping-icon{
      width: 24px;
      height: 24px;
    }

    .mapping-name{
      height: 24px;
      line-height: 24px;
      vertical-align: top;
    }
  }

  .tips{
    width: 100%;
    height: 32px;
    line-height: 32px;
    background-color: #CDE5FF;
    color: #36435C;
    font-size: 12px;
    padding-left: 20px;

    i{
      color: #50A1FB;
      margin-right: 6px;
    }
  }
}
</style>
