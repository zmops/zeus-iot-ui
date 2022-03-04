<template>
  <div v-if="!dialogVisible" class="mapping">
    <el-card v-for="(item, index) in mapList" :key="index" class="box-card zeus-mb-10" shadow="hover">
      <el-row>
        <el-col :span="8">
          <svg-icon icon-class="mapping" class="mapping-icon"/>
          <span class="mapping-name zeus-inline-block zeus-ml-10 on-click" @click="edit(item)">{{ item.name }}</span>
        </el-col>
        <el-col :span="8">
          <el-row v-for="(i, ind) in list(item.mappings)" :key="ind" class="zeus-mb-15">
            <el-col :span="12">
              <svg-icon icon-class="mapping-equal" class="zeus-mr-5"/>
              <span>{{ i.value }}</span>
            </el-col>
            <el-col :span="12">
              <svg-icon icon-class="mapping-shift" class="zeus-mr-5"/>
              <span>{{ i.newvalue }}</span>
            </el-col>
          </el-row>
          <h3 v-if="item.mappings.length > 3">...</h3>
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
  </div>
  <div v-else class="mapping">
    <div v-if="dialogVisible">
      <FormTemplate :up="'值映射列表'" :state="state + '值映射'" :but-loading="butLoading" @submit="handleSubmit" @cancel="dialogVisible = false">
        <template v-slot:main>
          <el-form ref="mappingForm" :rules="mapRules" :model="mapItem" label-width="80px" class="dialog-form">
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
                <el-button type="text" class=" zeus-icon" @click="mapItem.valueMaps.splice(index, 1)">
                  <svg-icon icon-class="but_del"></svg-icon>
                </el-button>
              </div>
              <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="mapAdd">增加</el-button>
            </el-form-item>
          </el-form>
        </template>
      </FormTemplate>
    </div>
  </div>
</template>

<script>
import {getDevValueMapList, deleteDevValueMap, updateDevValuemap} from '@/api/deviceMgr'
import {getValueMapList, deleteValueMap, updateValuemap} from '@/api/porductMgr'
import FormTemplate from '@/components/Slots/FormTemplate'
export default {
  props: {
    isDev: Boolean
  },
  components: {
    FormTemplate
  },
  data() {
    return {
      id: '',
      mapItem: {},
      showMap: false,
      butLoading: false,
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
    list(item) {
      return item.length > 3 ? item.slice(0, 3) : item
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
          deleteDevValueMap({ valuemapid: i }).then(res => {
            if (res.code == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getMapList()
            }
          })
        } else {
          deleteValueMap({ valuemapid: i }).then(res => {
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
          this.butLoading = true
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
              this.butLoading = false
            }).catch(() => {
              this.butLoading = false
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
              this.butLoading = false
            }).catch(() => {
              this.butLoading = false
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
  //padding: 20px;
  background-color: #fff;

  .add-btn{
    width: 100%;
    border-style: dashed;
    background-color: #F9FBFD;

    &:hover{
      background-color: #EFF4F9;
    }
  }

  .on-click{
    color: #409eff;
    cursor: pointer;
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

    .icon{
      color: #50A1FB;
      margin-right: 4px;
    }
  }
}
</style>
