<!-- 设备详情-属性页面 -->
<template>
  <div class="attribute">
    <SearchForm :params="formParams" :buttons="buttons" @search="search"/>
    <div v-loading="loading" class="zeus-mt-10 zeus-pl-10 zeus-pr-10 zeus-pb-10 list">
      <el-row v-if="tableData.length" :gutter="10">
        <el-col v-for="(item, index) in tableData" :key="index" :span="6" class="zeus-mt-10">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>{{ item.attrName }}</span>
              <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-pie-chart"
                         @click="history(item)">历史数据
              </el-button>
            </div>
            <div class="body zeus-bold">待定{{ item.unitsName }}</div>
            <div class="footer">
              <span>sth</span>&nbsp;|&nbsp;
              <span>{{ item.valueTypeName }}</span>&nbsp;|&nbsp;
              <span>{{ item.updateTime }}</span>
              <div class="zeus-right zeus-inline-block">
                <el-button icon="el-icon-edit-outline" type="text" @click="edit(item.attrId)"></el-button>
                <el-button icon="el-icon-delete" type="text" @click="del(item.attrId)"></el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-empty v-else description="暂无数据"></el-empty>
      <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    </div>
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
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
        <attributeForm v-model="dialogForm"/>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="submit">确 定</el-button>
      </el-footer>
    </el-dialog>
    <!--历史数据-->
    <el-dialog
      :visible.sync="dialogVisible2"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :width="'700px'"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">属性历史数据</div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible2 = false"/>
        </div>
      </div>
      <el-descriptions class="zeus-mt-15 zeus-pl-15">
        <el-descriptions-item label="属性名称">{{ itemData.attrName }}</el-descriptions-item>
        <el-descriptions-item label="标识符">{{ itemData.key }}</el-descriptions-item>
        <el-descriptions-item label="数据类型">{{ itemData.valueTypeName }}</el-descriptions-item>
      </el-descriptions>
      <div class="zeus-pl-15 zeus-pr-15">
        <el-date-picker
          v-model="dialogTime"
          size="mini"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-radio-group v-if="itemData.valueType == 3 || itemData.valueType == 0" v-model="dialogRadio" size="mini" class="zeus-right">
          <el-radio-button label="趋势图"></el-radio-button>
          <el-radio-button label="表格"></el-radio-button>
        </el-radio-group>
      </div>
      <LineChart
        v-if=" dialogRadio === '趋势图' && (itemData.valueType == 3 || itemData.valueType == 0)"
        class="zeus-mt-15 zeus-pl-15 zeus-pr-15"
        data-zoom-bol
        :unit="itemData.unitsName"
        :height="'400px'"
        :line-data="charts"
        :line-color="'#242E42'"
        :color="'#adb9c6'"/>
      <div v-if="dialogRadio === '表格' || !(itemData.valueType == 3 || itemData.valueType == 0)">
        <BusinessTable
          :table-data="tableData2"
          :columns="columns"
          :loading="loading2"
        />
        <Pagination :total="total2" :size="size2" :current-page="page2" @handleCurrentChange="handleCurrentChange2"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import attrForm from '@/views/deviceMgr/device/attrForm'
import attributeForm from '@/views/deviceMgr/device/attributeForm'
import LineChart from '@/components/Basics/LineChart'
import {
  getAttrTrapperByPage,
  deleteAttrTrapper,
  detailAttrTrapper,
  updateAttrTrapper,
  createAttrTrapper,
  getCookie
} from '@/api/deviceMgr'
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
    LineChart,
    BusinessTable
  },
  data() {
    return {
      form: {
        attrName: '',
        key: ''
      },
      tableData: [],
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
      charts: [[1629619200000, null], [1629622800000, 18], [1629626400000, 17], [1629630000000, 16], [1629633600000, 18], [1629637200000, 18], [1629640800000, 18], [1629644400000, 20], [1629648000000, 15], [1629651600000, 15], [1629655200000, 15], [1629658800000, 15], [1629662400000, 15], [1629666000000, 15], [1629669600000, 15], [1629673200000, 15], [1629676800000, 16], [1629680400000, 21], [1629684000000, 20], [1629687600000, 20], [1629691200000, 22], [1629694800000, 20], [1629698400000, 20], [1629702000000, 22], [1629705600000, null]],
      dialogTime: [],
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
          prop: 'name',
          show: true
        },
        {
          label: '值',
          prop: 'deviceId',
          show: true
        },
        {
          label: '提示信息',
          prop: 'productName',
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
      ]
    }
  },
  created() {
    if (this.$route.query.id) {
      this.form.prodId = this.$route.query.id
      this.getList()
    }
    axios.get('http://172.16.60.98:8871/zabbix/chart.php?from=now-1h&to=now&itemids%5B0%5D=36816&type=0&profileIdx=web.item.graph.filter&profileIdx2=36816&width=1607&height=200&_=v148353k')
      .then(response => {
        console.log(response)
      })
  },
  methods: {
    getList() {
      this.loading = true
      getAttrTrapperByPage({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
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
      this.loading2 = true
      getAttrTrapperByPage({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
        this.loading2 = false
        if (res.code == 200) {
          this.tableData2 = res.data
          this.total2 = res.count
        }
      }).catch(() => {
        this.loading2 = false
      })
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
      detailAttrTrapper({ attrId }).then(res => {
        if (res.code == 200) {
          this.dialogForm = res.data
        }
      })
      this.state = '编辑'
      this.dialogVisible = true
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
      // this.$refs.dialogForm.validate(async(valid) => {
      //   if (valid) {
      if (this.dialogForm.attrId) {
        updateAttrTrapper(this.dialogForm).then(async(res) => {
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
        createAttrTrapper(this.dialogForm).then(async(res) => {
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
      //   }
      // })
    },
    del(id) {
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAttrTrapper({ attrIds: [id] }).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            // 删除后重新请求数据
            await this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    history(item) {
      this.getList2()
      this.dialogVisible2 = true
      this.itemData = item
    }
  }
}
</script>

<style lang="scss" scoped>
.attribute {
  width: 100%;

  .list {
    background-color: #fff;
  }

  .box-card {

    .body {
      height: 120px;
      line-height: 50px;
      font-size: 18px;
    }

    .footer {
      font-size: 12px;
      color: #87909D;

      ::v-deep.el-button {
        padding: 0px !important;
      }
    }
  }
}
</style>
