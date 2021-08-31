<!--设备详情-服务页面 -->
<template>
  <div class="serve">
    <SearchForm :params="formParams" :buttons="buttons" :columns="columns" @search="search"/>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
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
          {{ state }}服务
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="dialog-body">
        <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="80px" label-position="top" class="dialog-form">
          <el-form-item label="服务名称" prop="name">
            <el-input v-model="dialogForm.name" size="mini" />
          </el-form-item>
          <el-form-item label="标识符" prop="key">
            <el-input v-model="dialogForm.key" size="mini" />
          </el-form-item>
          <el-form-item label="调用方式" prop="mode">
            <el-select v-model="dialogForm.mode" placeholder="请选择产品" size="mini">
              <el-option label="同步" value="同步"/>
              <el-option label="异步" value="异步"/>
            </el-select>
          </el-form-item>
          <el-form-item label="输入参数" prop="remark">
            <Variable :variable-list="dialogForm.list" @change="change" />
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
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import Variable from '@/components/Detail/Variable'
import { getDeviceByPage } from '@/api/deviceMgr'

export default {
  name: 'Serve',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    SearchForm,
    Pagination,
    Variable
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '服务名称'
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
      dialogVisible: false,
      state: '',
      total: 0,
      size: 10,
      page: 1,
      dialogForm: {
        name: '',
        productId: '',
        deviceGroupIds: [],
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入标识符', trigger: 'blur' }
        ],
        mode: [
          { required: true, message: '请选择调用方式', trigger: 'change' }
        ]
      },
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      columns: [
        {
          label: '服务名称',
          prop: 'name',
          show: true
        },
        {
          label: '标识符',
          prop: 'deviceId',
          show: true
        },
        {
          label: '来自产品',
          prop: 'templateId',
          show: true
        },
        {
          label: '调用方式',
          prop: 'productName',
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
          width: 160,
          idName: 'deviceId',
          fixed: 'right',
          buttons: [
            {
              label: '编辑',
              event: 'detail'
            },
            {
              label: '删除',
              event: 'delete'
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
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    close() {
      this.dialogForm = {
        name: '',
        productId: '',
        deviceGroupIds: [],
        remark: ''
      }
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
    change(list) {
      this.dialogForm.list = list
    },
    submit() {
      this.$refs.dialogForm.validate(async(valid) => {
        if (valid) {
          // 判断输入参数是否有键,有值就必须得填写完整,可以不填
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.serve {

}
</style>
