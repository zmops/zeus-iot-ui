<!--场景联动页面-->
<template>
  <div class="scene">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>场景联动</template>
      <template v-slot:subhead>对场景联动规则进行管理。可以实现跨设备的业务逻辑。当属性、事件满足设定规则时，自动实现联动功能。</template>
    </ListHeadTemplate>
    <SearchForm :params="formParams" :buttons="buttons" :batch-buttons="batchButtons" :columns="columns" @search="search"/>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
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
          <svg-icon v-if="state === '创建'" icon-class="dialog_add"/>
          <svg-icon v-if="state === '编辑'" icon-class="dialog_edit"/>
          {{ state }}场景联动
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="dialog-body">
        <sceneForm ref="sceneForm" v-model="dialogForm" />
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="submit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>
<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import sceneForm from '@/views/rule/scene/sceneForm'
import {
  createDevAlarm, deleteDevEvent, detailEventDev,
  getAttrTrapperList,
  getDeviceList,
  getEventByPage, modifyStatusEventDev,
  updateEvent,
  updateEventDev
} from '@/api/deviceMgr'
import { createAlarm, deleteEvent, detailEvent, modifyStatusEvent } from '@/api/porductMgr'

export default {
  name: 'scene',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    ListHeadTemplate,
    BusinessTable,
    SearchForm,
    Pagination,
    sceneForm
  },
  data() {
    return {
      formParams: [],
      columns: [
        {
          label: '场景联动名称',
          prop: 'eventRuleName',
          show: true
        },
        {
          label: '级别',
          prop: 'eventLevelName',
          show: true
        },
        // {
        //   label: '相关属性',
        //   prop: 'asyncName',
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
      ],
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      form: {
        prodId: null,
        attrId: '',
        name: ''
      },
      devList: [],
      ids: [],
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      batchButtons: [
        {
          type: 'danger',
          label: '删除',
          event: 'delete'
        }
      ],
      dialogVisible: false,
      state: '',
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
            value: '',
            period: '时间',
            unit: 'm'
          }
        ],
        deviceServices: []
      }
    }
  },
  watch: {
    'form.prodId': {
      immediate: true,
      async handler(val) {
        this.form.attrId = ''
        let attrTemplate = []
        if (val !== '') {
          await getAttrTrapperList({ prodId: val }).then((res) => {
            if (res.code == 200) {
              attrTemplate = res.data
            }
          })
        }
        this.formParams = [
          {
            componentName: 'SelectTemplate',
            keyName: 'prodId',
            label: '设备',
            optionId: 'deviceId',
            optionName: 'name',
            options: this.devList
          },
          {
            componentName: 'SelectTemplate',
            keyName: 'attrId',
            label: '属性',
            optionId: 'attrId',
            optionName: 'attrName',
            options: attrTemplate
          },
          {
            componentName: 'InputTemplate',
            keyName: 'eventRuleName',
            label: '场景联动名称'
          }
        ]
      }
    }
  },
  async created() {
    await this.searchInit()
    await this.getList()
  },
  methods: {
    async searchInit() {
      await getDeviceList({}).then((res) => {
        if (res.code == 200) {
          this.devList = res.data
          // this.form.prodId = ''
          if (res.data && res.data.length) {
            this.form.prodId = res.data[0].deviceId
          }
        }
      })
    },
    search() {
      this.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    getList() {
      this.loading = true
      getEventByPage({ ...this.form, maxRow: this.size, page: this.page, classify: '1' }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleSelect(selection) {
      this.ids = selection.map((i) => {
        return i.id
      })
    },
    detail(eventRuleId) {
      detailEventDev({ eventRuleId, deviceId: this.form.prodId }).then((res) => {
        if (res.code == 200) {
          this.dialogForm = res.data
        }
      })
      this.state = '编辑'
      this.dialogVisible = true
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    disable(id) {
      this.modifyStatus(id, 'DISABLE')
    },
    enable(id) {
      this.modifyStatus(id, 'ENABLE')
    },
    modifyStatus(eventRuleId, status) {
      modifyStatusEventDev({ eventRuleId, status, deviceId: this.form.prodId }).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    delete(eventRuleId) {
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDevEvent({ eventRuleId, deviceId: this.form.prodId }).then(async(res) => {
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
    submit() {
      if (this.$refs.sceneForm.validateForm()) {
        if (this.state === '创建') {
          this.dialogForm.classify = '1'
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
        }
      }
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
    }
  }
}
</script>

