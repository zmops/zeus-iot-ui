<!-- 设备页面 -->
<template>
  <div class="business-log">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>设备</template>
      <template v-slot:subhead>物理设备要连接到平台，需要先在平台创建设备(支持单个或批量导入创建)，并获取连接到平台的鉴权信息(待定)。设备列表支持灵活的搜索和导出。</template>
    </ListHeadTemplate>
    <SearchForm :params="formParams" :buttons="buttons" :columns="columns" @search="search"/>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      @detail="detail"
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
          {{ state }}设备
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <deviceForm v-if="dialogVisible" ref="deviceForm" v-model="dialogForm" :state="state" :product-list="productList" :device-group="deviceGroup"/>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button :disabled="butLoading" type="primary" size="mini" round @click="submit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import deviceForm from '@/views/deviceMgr/device/deviceForm'
import {
  getDeviceByPage,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceGrpList, modifyStatusDev
} from '@/api/deviceMgr'
import { getDictListByCode } from '@/api/system'
import { getProductList } from '@/api/porductMgr'

export default {
  provide() {
    return {
      farther: this
    }
  },
  name: 'Device',
  components: {
    ListHeadTemplate,
    BusinessTable,
    SearchForm,
    Pagination,
    deviceForm
  },
  data() {
    return {
      formParams: [],
      deviceGroup: [],
      productList: [],
      butLoading: false,
      form: {
        name: '',
        productId: '',
        prodType: '',
        deviceGroupId: ''
      },
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
      columns: [
        {
          label: '设备名称',
          prop: 'name',
          event: true,
          show: true
        },
        {
          label: '设备ID',
          prop: 'deviceId',
          show: true
        },
        {
          label: '产品',
          prop: 'productName',
          show: true
        },
        {
          label: '设备类型',
          prop: 'typeName',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          status: true,
          show: true
        },
        {
          label: '在线状态',
          prop: 'online',
          show: true
        },
        {
          label: '设备组',
          prop: 'groupName',
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          show: true
        },
        // {
        //   label: '最近在线时间',
        //   prop: 'latestOnline',
        //   show: true
        // },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 160,
          idName: 'deviceId',
          fixed: 'right',
          buttons: [
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
      typeList: [],
      state: '',
      dialogVisible: false,
      dialogForm: {
        name: '',
        productId: '',
        deviceGroupIds: [],
        remark: '',
        deviceInterface: {
          useip: '1',
          port: '10050',
          main: '1',
          type: '1',
          ip: '',
          dns: ''
        }
      },
      rules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        productId: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.searchInit()
  },
  methods: {
    async searchInit() {
      // 获取设备组列表
      await getDeviceGrpList({}).then((res) => {
        if (res.code == 200) {
          this.deviceGroup = res.data
        }
      })
      // 获取设备类型
      await getDictListByCode({ dictTypeCode: 'DEVICE_TYPE' }).then((res) => {
        if (res.code == 200) {
          this.typeList = res.data
        }
      })
      // 获取产品列表
      await getProductList({}).then((res) => {
        if (res.code == 200) {
          this.productList = res.data
        }
      })
      this.formParams = [
        {
          componentName: 'SelectTemplate',
          keyName: 'deviceGroupId',
          label: '设备组',
          optionId: 'deviceGroupId',
          optionName: 'name',
          options: this.deviceGroup
        },
        {
          componentName: 'SelectTemplate',
          keyName: 'prodType',
          label: '设备类型',
          optionId: 'code',
          optionName: 'name',
          options: this.typeList
        },
        {
          componentName: 'SelectTemplate',
          keyName: 'productId',
          label: '产品',
          optionId: 'productId',
          optionName: 'name',
          options: this.productList
        },
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '设备名称'
        }
      ]
    },
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getDeviceByPage({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
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
    edit(id) {
      const i = this.tableData.find((item) => {
        return item.deviceId === id
      })
      this.dialogForm = JSON.parse(JSON.stringify(i))
      if (this.dialogForm.groupIds) {
        this.dialogForm.deviceGroupIds = this.dialogForm.groupIds.split(',')
      }
      this.state = '编辑'
      this.dialogVisible = true
    },
    detail(item) {
      this.$router.push({
        path: '/deviceMgr/device/detail',
        query: {
          id: item.deviceId
        }
      })
    },
    delete(deviceId) {
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDevice({ deviceId }).then(async(res) => {
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
    close() {
      this.dialogForm = {
        deviceId: '',
        name: '',
        productId: '',
        deviceGroupIds: [],
        remark: '',
        position: '',
        addr: ''
      }
    },
    submit() {
      if (this.$refs.deviceForm.validateForm()) {
        this.butLoading = true
        createDevice(this.dialogForm).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.dialogVisible = false
            await this.getList()
          }
          this.butLoading = false
        }).catch(() => {
          this.butLoading = false
        })
      }
    },
    disable(id) {
      this.modifyStatus(id, 'DISABLE')
    },
    enable(id) {
      this.modifyStatus(id, 'ENABLE')
    },
    modifyStatus(deviceId, status) {
      modifyStatusDev({ deviceId, status }).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getList()
        }
      })
    }
  }
}
</script>
