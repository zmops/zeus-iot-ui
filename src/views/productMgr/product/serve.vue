<!--产品详情-服务页面 -->
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
          <el-form-item label="标识符" prop="mark">
            <el-input v-model="dialogForm.mark" size="mini" />
          </el-form-item>
          <el-form-item label="调用方式" prop="async">
            <el-select v-model="dialogForm.async" placeholder="请选择产品" size="mini">
              <el-option label="同步" value="0"/>
              <el-option label="异步" value="1"/>
            </el-select>
          </el-form-item>
          <el-form-item label="输入参数" prop="remark">
            <Parameter v-model="dialogForm.productServiceParamList"/>
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
import Parameter from '@/components/Detail/Parameter'
import { deleteService, updateService, createService, getServiceByPage } from '@/api/porductMgr'

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
    Parameter
  },
  data() {
    return {
      prodId: '',
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '服务名称'
        },
        {
          componentName: 'InputTemplate',
          keyName: 'mark',
          label: '标识符'
        }
      ],
      form: {
        name: '',
        mark: ''
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
        mark: '',
        async: '1',
        productServiceParamList: [],
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入标识符', trigger: 'blur' }
        ],
        async: [
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
          prop: 'mark',
          show: true
        },
        {
          label: '调用方式',
          prop: 'asyncName',
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
          idName: 'id',
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
    if (this.$route.query.id) {
      this.prodId = this.$route.query.id
      this.getList()
    }
  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getServiceByPage({ ...this.form, maxRow: this.size, page: this.page, prodId: this.prodId }).then((res) => {
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
        mark: '',
        async: '1',
        productServiceParamList: [],
        remark: ''
      }
    },
    detail(id) {
      const i = this.tableData.find((item) => {
        return item.id === id
      })
      this.dialogForm = JSON.parse(JSON.stringify(i))
      this.state = '编辑'
      this.dialogVisible = true
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    submit() {
      this.$refs.dialogForm.validate(async(valid) => {
        if (valid) {
          if (this.dialogForm.id) {
            updateService({ ...this.dialogForm, sid: this.prodId }).then((res) => {
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
            createService({ ...this.dialogForm, sid: this.prodId }).then((res) => {
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
      })
    },
    delete(id) {
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteService({ ids: [id] }).then(async(res) => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.serve {

}
</style>
