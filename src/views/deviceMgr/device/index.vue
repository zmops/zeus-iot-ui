<!-- 设备页面 -->
<template>
  <div class="device">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>设备</template>
      <template v-slot:subhead>物理设备要连接到平台，需要先在平台创建设备(支持单个或批量导入创建)，并获取连接到平台的鉴权信息(待定)。设备列表支持灵活的搜索和导出。</template>
    </ListHeadTemplate>
    <SearchForm v-if="!dialogVisible" :params="formParams" :buttons="buttons" :columns="columns" @search="search"/>
    <BusinessTable
      v-if="!dialogVisible"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      @detail="detail"
      @proDetail="proDetail"
    />
    <Pagination v-if="!dialogVisible" :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    <div v-if="dialogVisible" style="padding-bottom: 12px">
      <FormTemplate :up="'设备列表'" :state="state + '设备'" :but-loading="butLoading" @submit="submit" @cancel="close">
        <template v-slot:main>
          <deviceForm v-if="dialogVisible" ref="deviceForm" v-model="dialogForm" :state="state" :product-list="productList" :device-group="deviceGroup"/>
        </template>
      </FormTemplate>
    </div>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import FormTemplate from '@/components/Slots/FormTemplate'
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
import { getProductList, getProductTypeTree } from '@/api/porductMgr'

export default {
  provide() {
    return {
      farther: this
    }
  },
  name: 'Device',
  components: {
    ListHeadTemplate,
    FormTemplate,
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
      treeData: [],
      butLoading: false,
      form: {
        name: '',
        productIds: [],
        prodType: '',
        prodTypeNames: [],
        prodTypeName: '',
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
          event: 'detail',
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
          event: 'proDetail',
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
          width: 180,
          idName: 'deviceId',
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
      size: 20,
      page: 1,
      typeList: [],
      state: '创建',
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
          ip: '127.0.0.1'
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
    // 从url中获取搜索条件
    if (this.$route.query.form) {
      const form = JSON.parse(this.$route.query.form)
      if (form.deviceGroupIds){
        form.deviceGroupId = form.deviceGroupIds[0]
      }
      this.form = form
    }
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
      // 获取产品分类数据
      await getProductTypeTree().then((res) => {
        if (res.code == 200) {
          this.treeData = res.data
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
          componentName: 'CascaderTemplate',
          keyName: 'prodTypeNames',
          label: '产品分类',
          optionId: 'name',
          optionName: 'name',
          childrenName: 'childrenNodes',
          options: this.treeData
        },
        {
          componentName: 'SelectTemplate',
          keyName: 'productIds',
          label: '产品',
          optionId: 'productId',
          optionName: 'name',
          multiple: true,
          options: this.productList
        },
        {
          componentName: 'KeyValueTemplate',
          keyName: 'tag',
          label: '标签'
        },
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '设备名称'
        }
      ]
    },
    search() {
      // 获取搜索条件并保存在url内
      if (this.form.deviceGroupId){
        this.$set(this.form, 'deviceGroupIds', [this.form.deviceGroupId])
      }
      const form = JSON.stringify(this.form)
      this.$router.push({
        path: '/deviceMgr/device',
        query: {
          form
        }
      })
      this.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      if (this.form.prodTypeNames && this.form.prodTypeNames.length){
        this.form.prodTypeName = this.form.prodTypeNames[this.form.prodTypeNames.length - 1]
      }
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
    proDetail(item) {
      this.$router.push({
        path: '/productMgr/product/detail',
        query: {
          id: item.productId
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
      this.dialogVisible = false
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
            this.close()
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
<style lang="scss" scoped>
.device{
  height: 100%;
}
</style>
