<!-- 设备页面 -->
<template>
  <div class="business-log">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>设备</template>
      <template v-slot:subhead>设备基本信息</template>
    </ListHeadTemplate>
    <SearchForm :params="formParams" :buttons="buttons" :columns="columns" @search="search" />
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      @detail="detail"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange" />
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
        <div class="left">{{ state }}</div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="dialog-body">
        <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="80px" label-position="top" class="dialog-form">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="dialogForm.name" size="mini" />
          </el-form-item>
          <el-form-item label="产品" prop="productId">
            <el-select v-model="dialogForm.productId" :disabled="'deviceId' in dialogForm" filterable placeholder="请选择产品" size="mini">
              <el-option
                v-for="item in productList"
                :key="item.productId"
                :label="item.name"
                :value="item.productId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备组" prop="deviceGroupIds">
            <el-select v-model="dialogForm.deviceGroupIds" multiple filterable placeholder="请选择设备组" size="mini">
              <el-option
                v-for="item in deviceGroup"
                :key="item.deviceGroupId"
                :label="item.name"
                :value="item.deviceGroupId.toString()"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini" />
          </el-form-item>
        </el-form>
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
import {
  getDeviceByPage,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceGrpList
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
    Pagination
  },
  data() {
    return {
      formParams: [],
      deviceGroup: [],
      productList: [],
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
        {
          label: '最近在线时间',
          prop: 'code',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 160,
          idName: 'deviceId',
          fixed: 'right',
          buttons: [
            {
              label: '编辑',
              event: 'edit'
            },
            {
              label: '删除',
              event: 'delete'
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
        remark: ''
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
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '设备名称'
        },
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
      this.state = '创建设备'
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
      this.state = '编辑设备'
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
      this.$confirm('是否确认删除该数据数据?', '提示', {
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
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    close() {
      this.dialogForm = {
        name: '',
        productId: '',
        deviceGroupIds: [],
        remark: ''
      }
    },
    submit() {
      this.$refs.dialogForm.validate(async(valid) => {
        if (valid) {
          if (this.dialogForm.deviceId) {
            updateDevice(this.dialogForm).then(async(res) => {
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
            createDevice(this.dialogForm).then(async(res) => {
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
