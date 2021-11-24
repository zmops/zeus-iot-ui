<!--设备详情-子设备页面 -->
<template>
  <div class="alarm">
    <SearchForm :params="formParams" :buttons="buttons" :columns="columns" @search="search" />
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      :h="'calc(100% - 115px)'"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange" />
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon v-if="state === '创建'" icon-class="dialog_add" />
          <svg-icon v-if="state === '编辑'" icon-class="dialog_edit" />
          {{ state }}子设备
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="dialog-body">
        <deviceForm ref="deviceForm" v-model="dialogForm" :state="state" :product-list="productList" :device-group="deviceGroup" />
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
import deviceForm from '@/views/deviceMgr/device/deviceForm'
import { createDevice, getDeviceByPage, getDeviceGrpList, updateDevice } from '@/api/deviceMgr'
import { getDictListByCode } from '@/api/system'
import { getProductList } from '@/api/porductMgr'

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
    deviceForm
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
      dialogVisible: false,
      state: '',
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      buttons: [
        // {
        //   type: 'primary',
        //   label: '创建',
        //   event: 'add'
        // }
      ],
      columns: [
        {
          label: '设备名称',
          prop: 'name',
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
          prop: 'statusName',
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
          buttons: [
            // {
            //   label: '编辑',
            //   event: 'detail',
            //   icon: 'list-edit'
            // },
            // {
            //   label: '删除',
            //   event: 'delete',
            //   icon: 'list-del'
            // }
          ]
        }
      ],
      dialogForm: {
        name: '',
        productId: '',
        deviceGroupIds: [],
        remark: ''
      }
    }
  },
  created() {
    this.searchInit()
    this.getList()
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
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    getList() {
      // this.loading = true
      // getDeviceByPage({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
      //   this.loading = false
      //   if (res.code == 200) {
      //     this.tableData = res.data
      //     this.total = res.count
      //   }
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    detail(item) {
      // deviceId
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
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
      if (this.$refs.deviceForm.validateForm()) {
        if (this.dialogForm.deviceId) {
          // updateDevice(this.dialogForm).then(async(res) => {
          //   if (res.code == 200) {
          //     this.$message({
          //       message: '修改成功',
          //       type: 'success'
          //     })
          //     this.dialogVisible = false
          //     await this.getList()
          //   }
          // })
        } else {
          // createDevice(this.dialogForm).then(async(res) => {
          //   if (res.code == 200) {
          //     this.$message({
          //       message: '添加成功',
          //       type: 'success'
          //     })
          //     this.dialogVisible = false
          //     await this.getList()
          //   }
          // })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.alarm {
  height: 100%;
  .bm-view {
    width: 600px;
    height: 500px;
  }
}
</style>
