<!--产品详情-事件页面 -->
<template>
  <div class="incident">
    <SearchForm :params="formParams" :buttons="buttons" :columns="columns" @search="search" />
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange" />
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
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="dialog-body">
        <incidentForm v-if="dialogVisible" v-model="dialogForm" />
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
import { createAttrTrapper, getDeviceByPage, updateAttrTrapper } from '@/api/deviceMgr'

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
  data() {
    return {
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '事件名称'
        },
        {
          componentName: 'InputTemplate',
          keyName: 'name',
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
      dialogForm: {},
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
          prop: 'name',
          show: true
        },
        {
          label: '标识符',
          prop: 'deviceId',
          show: true
        },
        {
          label: '事件级别',
          prop: 'productName',
          show: true
        },
        {
          label: '数据类型',
          prop: 'typeName',
          show: true
        },
        {
          label: '取数间隔',
          prop: 'status',
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '修改时间',
          prop: 'createTime',
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

  },
  methods: {
    search() {
      this.page = 1
      this.getList()
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
      // this.$router.push({
      //   path: '/deviceMgr/device/detail',
      //   query: {
      //     id: item.deviceId
      //   }
      // })
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
      // this.$refs.dialogForm.validate(async(valid) => {
      //   if (valid) {
      // if (this.dialogForm.attrId) {
      //   updateAttrTrapper(this.dialogForm).then(async(res) => {
      //     if (res.code == 200) {
      //       this.$message({
      //         message: '修改成功',
      //         type: 'success'
      //       })
      //       this.dialogVisible = false
      //       this.getList()
      //     }
      //   })
      // } else {
      //   createAttrTrapper(this.dialogForm).then(async(res) => {
      //     if (res.code == 200) {
      //       this.$message({
      //         message: '添加成功',
      //         type: 'success'
      //       })
      //       this.dialogVisible = false
      //       this.getList()
      //     }
      //   })
      // }
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.incident {

}
</style>
