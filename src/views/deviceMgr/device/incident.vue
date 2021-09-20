<!--详情-事件页面 -->
<template>
  <div class="incident">
    <SearchForm :params="formParams" :buttons="buttons" :columns="columns" @search="search"/>
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
      :show-close="false"
      :width="'700px'"
      @close="dialogForm = {}"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">{{ state }}事件</div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <incidentForm v-if="dialogVisible" ref="incidentForm" v-model="dialogForm" :is-dev="isDev"/>
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
import incidentForm from '@/views/deviceMgr/device/incidentForm'
import {
  createAttrEvent,
  getDeviceByPage,
  updateAttrEvent,
  getAttrEventByPage,
  deleteAttrEvent,
  deleteEvent
} from '@/api/deviceMgr'

export default {
  name: 'Incident',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    SearchForm,
    Pagination,
    incidentForm
  },
  props: {
    isDev: Boolean
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'attrName',
          label: '事件名称'
        },
        {
          componentName: 'InputTemplate',
          keyName: 'key',
          label: '标识符'
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
      dialogVisible: false,
      dialogForm: {
        eventLevel: '1'
      },
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
          label: '事件名称',
          prop: 'attrName',
          show: true
        },
        {
          label: '标识符',
          prop: 'key',
          show: true
        },
        {
          label: '来自产品',
          prop: 'templateId',
          show: true
        },
        {
          label: '事件级别',
          prop: 'eventLevelName',
          show: true
        },
        {
          label: '数据类型',
          prop: 'valueTypeName',
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '修改时间',
          prop: 'updateTime',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 180,
          idName: 'attrId',
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
      getAttrEventByPage({
        ...this.form,
        prodId: this.$route.query.id,
        maxRow: this.size,
        page: this.page
      }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    detail(attrId) {
      const i = this.tableData.find((item) => {
        return item.attrId === attrId
      })
      this.dialogForm = JSON.parse(JSON.stringify(i))
      this.state = '编辑'
      this.dialogVisible = true
    },
    delete(attrId) {
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAttrEvent({ attrId }).then(async(res) => {
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
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    submit() {
      if (this.$refs.incidentForm.validateForm()) {
        if (this.state === '编辑') {
          updateAttrEvent(this.dialogForm).then(async(res) => {
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
          createAttrEvent(this.dialogForm).then(async(res) => {
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

    }
  }
}
</script>

<style lang="scss" scoped>
.incident {

}
</style>
