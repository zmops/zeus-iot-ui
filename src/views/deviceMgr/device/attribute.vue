<!-- 设备详情-属性页面 -->
<template>
  <div class="attribute">
    <!--    <SearchForm :params="formParams" :buttons="buttons" @search="search"/>-->
    <div v-loading="loading" class="list">
      <el-row v-if="tableData.length" :gutter="10">
        <el-col v-for="(item, index) in tableData" :key="index" :span="12" class="zeus-mb-10">
          <el-card class="box-card" shadow="hover">
            <el-button class="zeus-right" size="mini" round @click="history(item)">
              <svg-icon icon-class="attr_history"/>
              历史数据
            </el-button>
            <div class="zeus-bold f13">{{ item.value || '-' }} {{ item.units }}</div>
            <div class="c-gray zeus-mb-15">{{ item.attrName }}</div>
            <el-row class="bg-gray">
              <el-col :span="8" class="zeus-pl-10">
                <svg-icon icon-class="attr_key"/>
                {{ item.key }}
              </el-col>
              <el-col :span="8" class="zeus-pl-10">
                <svg-icon icon-class="attr_type"/>
                {{ item.valueTypeName }}
              </el-col>
              <el-col :span="8" class="zeus-pl-10">
                <svg-icon icon-class="attr_time"/>
                {{ item.clock }}
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <el-empty v-else description="暂无数据"></el-empty>
      <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    </div>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :width="'700px'"
      @close="dialogForm = {}"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">{{ state }}属性</div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <attributeForm v-if="dialogVisible" ref="attributeForm" v-model="dialogForm"/>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="submit">确 定</el-button>
      </el-footer>
    </el-dialog>
    <!--历史数据-->
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible2"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :width="'1090px'"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">属性历史数据</div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible2 = false"/>
        </div>
      </div>
      <div class="zeus-pt-10 zeus-pl-25 zeus-pr-25">
        <el-row class="bg-gray zeus-mt-15">
          <el-col :span="8" class="zeus-pl-10">属性名称: {{ itemData.attrName }}</el-col>
          <el-col :span="8" class="zeus-pl-10">
            <svg-icon icon-class="attr_key"/>
            标识符: {{ itemData.key }}
          </el-col>
          <el-col :span="8" class="zeus-pl-10">
            <svg-icon icon-class="attr_type"/>
            数据类型: {{ itemData.valueTypeName }}
          </el-col>
        </el-row>
        <div class="chart-box">
          <el-date-picker
            v-model="dialogTime"
            size="small"
            class="zeus-mb-15"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="-"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeTime"
          >
          </el-date-picker>
          <div v-if="itemData.valueType == 3 || itemData.valueType == 0" class="zeus-right radio">
            <div class="radio-button" :class="dialogRadio === '趋势图' ? 'activity' :''" @click="dialogRadio = '趋势图'">趋势图
            </div>
            <div class="radio-button" :class="dialogRadio === '表格' ? 'activity' :''" @click="dialogRadio = '表格'">表格
            </div>
          </div>
          <div v-if="dialogRadio === '趋势图' && (itemData.valueType == 3 || itemData.valueType == 0)" v-loading="loading2"
               class="zeus-relative">
            <img class="chart-img" :src="img">
            <div class="zeus-absolute img-title"></div>
          </div>
          <div v-if="dialogRadio === '表格' || !(itemData.valueType == 3 || itemData.valueType == 0)">
            <BusinessTable
              :table-data="tableData2"
              :columns="columns"
              :loading="loading2"
            />
            <Pagination :total="total2" :size="size2" :current-page="page2"
                        @handleCurrentChange="handleCurrentChange2"/>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import attributeForm from '@/views/deviceMgr/device/attributeForm'
import {
  getAttrTrapperByPage,
  deleteAttrTrapper,
  detailAttrTrapper,
  updateAttrTrapper,
  createAttrTrapper,
  getHistory,
  getCharts
} from '@/api/deviceMgr'
import {ftimestampToData} from '@/utils/index'
import BusinessTable from '@/components/Basics/BusinessTable'

export default {
  name: 'Attribute',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    SearchForm,
    Pagination,
    attributeForm,
    BusinessTable
  },
  data() {
    return {
      form: {
        attrName: '',
        key: ''
      },
      tableData: [],
      img: null,
      loading: false,
      tableData2: [],
      loading2: false,
      state: '',
      dialogVisible: false,
      dialogVisible2: false,
      total: 0,
      size: 10,
      page: 1,
      total2: 0,
      size2: 10,
      page2: 1,
      itemData: {},
      item: {},
      dialogForm: {},
      dialogTime: [
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
        new Date().getTime()
      ],
      dialogRadio: '趋势图',
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      columns: [
        {
          label: '时间',
          prop: 'clock',
          show: true
        },
        {
          label: '值',
          prop: 'value',
          show: true
        },
        {
          label: '提示信息',
          prop: 'unitsName',
          show: true
        }
      ],
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'attrName',
          label: '属性名称'
        },
        {
          componentName: 'InputTemplate',
          keyName: 'key',
          label: '属性标识'
        }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近5分钟',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 5 * 60 * 1000)
              picker.$emit('pick', ['now-5m', 'now'])
            }
          },
          {
            text: '最近15分钟',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 15 * 60 * 1000)
              picker.$emit('pick', ['now-15m', 'now'])
            }
          },
          {
            text: '最近30分钟',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 30 * 60 * 1000)
              picker.$emit('pick', ['now-30m', 'now'])
            }
          },
          {
            text: '最近1小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 60 * 60 * 1000)
              picker.$emit('pick', ['now-1h', 'now'])
            }
          },
          {
            text: '最近3小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3 * 60 * 60 * 1000)
              picker.$emit('pick', ['now-3h', 'now'])
            }
          },
          {
            text: '最近6小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 6 * 60 * 60 * 1000)
              picker.$emit('pick', ['now-6h', 'now'])
            }
          },
          {
            text: '最近12小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 12 * 60 * 60 * 1000)
              picker.$emit('pick', ['now-12h', 'now'])
            }
          },
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 24 * 60 * 60 * 1000)
              picker.$emit('pick', ['now-24h', 'now'])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', ['now-1w', 'now'])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', ['now-1M', 'now'])
            }
          }
        ]
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.form.prodId = this.$route.query.id
      this.getList()
    }
  },
  methods: {
    getList() {
      this.loading = true
      getAttrTrapperByPage({...this.form, maxRow: this.size, page: this.page}).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    getList2() {
      if (this.dialogTime === null) return false
      this.loading2 = true
      let from = ''
      let to = ''
      if (typeof this.dialogTime[0] === 'number') {
        from = ftimestampToData(this.dialogTime[0]) + ':00'
        to = ftimestampToData(this.dialogTime[1]) + ':00'
      } else {
        from = this.dialogTime[0]
        to = this.dialogTime[1]
      }
      const data = {
        timeFrom: from,
        timeTill: to,
        deviceId: this.$route.query.id,
        attrIds: [this.itemData.attrId],
        maxRow: this.size2,
        page: this.page2
      }
      const data2 = {
        from,
        to,
        attrIds: this.itemData.attrId,
        width: 896,
        height: 200
      }
      getCharts(data2).then((res) => {
        this.loading2 = false
        if (res) {
          this.img = window.URL.createObjectURL(new Blob([res]))
        }
      })
      getHistory(data).then((res) => {
        this.loading2 = false
        if (res.code == 200) {
          this.tableData2 = res.data
          this.total2 = res.count
        }
      }).catch(() => {
        this.loading2 = false
      })
    },
    changeTime(val) {
      if (val) {
        this.page2 = 1
        this.getList2()
      }
    },
    search() {
      this.page = 1
      this.getList()
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    edit(attrId) {
      detailAttrTrapper({attrId}).then(res => {
        if (res.code == 200) {
          this.dialogForm = res.data
          this.state = '编辑'
          this.dialogVisible = true
        }
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    handleCurrentChange2(val) {
      this.page2 = val
      this.getList2()
    },
    submit() {
      if (this.$refs.attributeForm.validateForm()) {
        if (this.dialogForm.attrId) {
          updateAttrTrapper(this.dialogForm).then(async (res) => {
            if (res.code == 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getList()
            }
          })
        } else {
          createAttrTrapper(this.dialogForm).then(async (res) => {
            if (res.code == 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getList()
            }
          })
        }
      }
    },
    del(id) {
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAttrTrapper({attrIds: [id]}).then(async (res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            // 删除后重新请求数据
            await this.getList()
          }
        })
      })
    },
    history(item) {
      this.itemData = item
      this.getList2()
      this.dialogVisible2 = true
    }
  }
}
</script>

<style lang="scss" scoped>
.attribute {
  width: 100%;
  background-color: #fff;
  padding: 12px;

  .list {
    background-color: #F9FBFD;
    padding: 12px;
  }

  .box-card {
    font-size: 12px;
    color: #242E42;

    ::v-deep.el-card__body {
      padding-bottom: 12px !important;
    }

    .f13 {
      font-size: 13px !important;
    }

    .c-gray {
      margin-top: 7px;
      color: #79879C !important;
    }
  }
}

.chart-img {
  min-height: 172px;
  //max-width: 1000px;
}

.img-title {
  width: 100%;
  height: 25px;
  top: 1px;
  background-color: #fff;
}

.bg-gray {
  background-color: #EFF4F9;
  height: 36px;
  line-height: 36px;
  color: #242E42;
}

.chart-box {
  margin-top: 12px;
  border: 1px #CCD3DB solid;
  padding: 11px 19px;
}

::v-deep.el-range-editor--small.el-input__inner {
  border-radius: 25px;
  background-color: #E6EDF4;

  .el-range-input {
    background-color: #E6EDF4;
  }
}

.radio {
  width: 214px;
  height: 33px;
  line-height: 28px;
  padding: 2px;
  border-radius: 25px;
  border: 1px #CCD3DB solid;
  display: flex;

  .radio-button {
    flex: 1;
    text-align: center;
    font-size: 12px;
    color: #5F708A;
    cursor: pointer;
  }

  .activity {
    background-color: #36435C;
    color: #fff;
    border-radius: 25px;
  }

}
</style>
