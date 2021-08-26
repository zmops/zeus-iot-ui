<!-- 设备组页面 -->
<template>
  <div class="business-log">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>设备组</template>
      <template v-slot:subhead>设备组基本信息</template>
    </ListHeadTemplate>
    <SearchForm :params="formParams" :buttons="buttons" :batch-buttons="batchButtons" :selected="ids.length > 0" :columns="columns" @search="search" @cancel="ids = []" />
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :selection="true"
      :icon="$route.meta.icon24"
      @select="handleSelect"
    />
    <Pagination :total="total" :size="form.maxRow" :current-page="form.page" @handleCurrentChange="handleCurrentChange" />
    <el-dialog
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
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
          {{ state }}设备组
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="dialog-body">
        <el-form ref="deviceGroupForm" :rules="deviceGroupRules" :model="item" label-width="80px" label-position="top" class="dialog-form">
          <el-form-item label="设备组名" prop="name">
            <el-input v-model="item.name" size="mini" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="item.remark" type="textarea" rows="2" size="mini" />
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
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import SearchForm from '@/components/Basics/SearchForm'
import BusinessTable from '@/components/Basics/BusinessTable'
import Pagination from '@/components/Basics/Pagination'
import { getDeviceGrpByPage, createDeviceGroup, updateDeviceGroup, deleteDeviceGroup } from '@/api/deviceMgr'
export default {
  provide() {
    return {
      farther: this
    }
  },
  name: 'DeviceGroup',
  components: {
    ListHeadTemplate,
    SearchForm,
    BusinessTable,
    Pagination
  },
  data() {
    return {
      form: {
        name: '',
        maxRow: 20,
        page: 1
      },
      tableData: [],
      loading: false,
      total: 0,
      ids: [],
      state: '',
      dialogVisible: false,
      item: {
        deviceGroupId: '',
        name: '',
        remark: ''
      },
      columns: [
        {
          label: '组名',
          prop: 'name',
          show: true
        },
        {
          label: '备注',
          prop: 'remark',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          width: 80,
          show: true,
          idName: 'deviceGroupId',
          fixed: 'right',
          buttons: [
            {
              label: '编辑',
              event: 'edit'
            }
          ]
        }
      ],
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
          event: 'del'
        }
      ],
      deviceGroupRules: {
        name: [
          { required: true, message: '请输入设备组名', trigger: 'blur' }
        ]
      },
      formParams: [{
        componentName: 'InputTemplate',
        keyName: 'name',
        label: '设备组名称'
      }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.form.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getDeviceGrpByPage(this.form).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = Number(res.count)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.getList()
    },
    handleSelect(selection) {
      this.ids = selection.map((i) => { return i.deviceGroupId })
    },
    close() {
      this.item = {
        deviceGroupId: '',
        name: '',
        remark: ''
      }
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    edit(id) {
      for (const item of this.tableData) {
        if (id === item.deviceGroupId) {
          this.item = Object.assign({}, item)
        }
      }
      this.state = '编辑'
      this.dialogVisible = true
    },
    del() {
      this.$confirm('是否确认删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDeviceGroup({ deviceGroupIds: this.ids }).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            // 删除后重新请求数据
            this.ids = []
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
    handleSubmit() {
      this.$refs.deviceGroupForm.validate(async(valid, errorFields) => {
        if (valid) {
          if (this.item.deviceGroupId) {
            updateDeviceGroup(this.item).then(async(res) => {
              if (res.code == 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.dialogVisible = false
                await this.getList()
              }
            })
          } else {
            createDeviceGroup(this.item).then(async(res) => {
              if (res.code == 200) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.dialogVisible = false
                await this.getList()
              }
            })
          }
        }
      })
    }
  }
}
</script>
