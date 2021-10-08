<!--详情-告警页面 -->
<template>
  <div class="alarm">
    <SearchForm :params="formParams" :buttons="buttons" :columns="columns" @search="search" />
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange" />
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
      @close="close"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon v-if="state === '创建'" icon-class="dialog_add" />
          <svg-icon v-if="state === '编辑'" icon-class="dialog_edit" />
          {{ state }}告警规则
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="dialog-body">
        <alarmForm ref="alarmForm" v-model="dialogForm" />
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="submit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import alarmForm from '@/views/deviceMgr/device/alarmForm'
import { getEventByPage, updateEvent, updateEventDev, deleteDevEvent, detailEventDev, createDevAlarm, modifyStatusEventDev} from '@/api/deviceMgr'
import { detailEvent, createAlarm, deleteEvent, modifyStatusEvent} from '@/api/porductMgr'

export default {
  name: 'Alarm',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    SearchForm,
    Pagination,
    alarmForm
  },
  props: {
    isDev: Boolean
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '告警规则名称'
        }
      ],
      form: {
        name: ''
      },
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      dialogForm: {
        eventRuleName: '',
        eventLevel: '3',
        eventNotify: '1',
        status: 'ENABLE',
        remark: '',
        expLogic: 'or',
        expList: [
          {
            deviceId: '',
            productAttrId: '',
            incident: '',
            condition: '=',
            productAttrType: '属性',
            function: 'last',
            period: '时间',
            unit: 'm'
          }
        ],
        deviceServices: []
      },
      dialogVisible: false,
      state: '',
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      columns: [
        {
          label: '告警名称',
          prop: 'eventRuleName',
          show: true
        },
        {
          label: '告警级别',
          prop: 'eventLevelName',
          show: true
        },
        {
          label: '来自产品',
          prop: 'inheritName',
          show: true
        },
        // {
        //   label: '相关属性',
        //   prop: 'productName',
        //   show: true
        // },
        {
          label: '启用状态',
          prop: 'status',
          status: true,
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 270,
          idName: 'eventRuleId',
          fixed: 'right',
          buttons: [
            {
              label: '编辑',
              event: 'detail',
              icon: 'list-edit'
            },
            {
              label: '删除',
              event: 'delete',
              icon: 'list-del'
            },
            {
              label: '启用',
              event: 'enable',
              icon: 'list-enable'
            },
            {
              label: '禁用',
              event: 'disable',
              icon: 'list-disable'
            }
          ]
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getEventByPage({ ...this.form, prodId: this.$route.query.id, maxRow: this.size, page: this.page, classify: '0' }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    detail(eventRuleId) {
      if (this.isDev) {
        detailEventDev({ eventRuleId, deviceId: this.$route.query.id }).then((res) => {
          if (res.code == 200) {
            this.dialogForm = res.data
          }
        })
      } else {
        detailEvent({ eventRuleId, prodId: this.$route.query.id }).then((res) => {
          if (res.code == 200) {
            this.dialogForm = res.data
          }
        })
      }
      this.state = '编辑'
      this.dialogVisible = true
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    close() {
      this.dialogForm = {
        eventRuleName: '',
        eventLevel: '3',
        eventNotify: '1',
        status: 'ENABLE',
        remark: '',
        expLogic: 'or',
        expList: [
          {
            deviceId: '',
            productAttrId: '',
            incident: '',
            condition: '=',
            productAttrType: '属性',
            function: 'last',
            period: '时间',
            unit: 'm'
          }
        ],
        deviceServices: []
      }
      this.$refs.alarmForm.reset()
    },
    disable(id) {
      this.modifyStatus(id, 'DISABLE')
    },
    enable(id) {
      this.modifyStatus(id, 'ENABLE')
    },
    modifyStatus(eventRuleId, status) {
      if (this.isDev) {
        modifyStatusEventDev({ eventRuleId, status, deviceId: this.$route.query.id }).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.getList()
          }
        })
      } else {
        modifyStatusEvent({ eventRuleId, status }).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.getList()
          }
        })
      }
    },
    delete(eventRuleId) {
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isDev) {
          deleteDevEvent({ eventRuleId, deviceId: this.$route.query.id }).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              // 删除后重新请求数据
              await this.getList()
            }
          })
        } else {
          deleteEvent({ eventRuleId }).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              // 删除后重新请求数据
              await this.getList()
            }
          })
        }
      })
    },
    submit() {
      if (this.$refs.alarmForm.validateForm()) {
        if (this.state === '创建') {
          if (this.isDev) {
            createDevAlarm(this.dialogForm).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.dialogVisible = false
                this.getList()
              }
            })
          } else {
            this.dialogForm.productId = this.$route.query.id
            createAlarm(this.dialogForm).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.dialogVisible = false
                this.getList()
              }
            })
          }
        } else {
          if (this.isDev) {
            updateEventDev(this.dialogForm).then((res) => {
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
            this.dialogForm.productId = this.$route.query.id
            updateEvent(this.dialogForm).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.dialogVisible = false
                this.getList()
              }
            })
          }
        }
      }
    }
  }
}
</script>
