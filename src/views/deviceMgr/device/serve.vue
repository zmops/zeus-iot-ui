<!--详情-服务页面 -->
<template>
  <div class="serve">
    <SearchForm v-if="!dialogVisible" :params="formParams" :buttons="buttons" :columns="columns" @search="search" />
    <BusinessTable
      v-if="!dialogVisible"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :h="'calc(100% - 115px)'"
      :icon="$route.meta.icon24"
      @detail="detail"
    />
    <Pagination v-if="!dialogVisible" :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange" />
    <div v-if="dialogVisible">
      <FormTemplate :up="'服务列表'" :state="state + '服务'" :but-loading="butLoading" @submit="submit" @cancel="close">
        <template v-slot:main>
          <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="80px" class="dialog-form">
            <el-form-item label="服务名称" prop="name">
              <el-input v-model="dialogForm.name" size="mini" :disabled="isDev && dialogForm.inherit == '1'" />
            </el-form-item>
            <el-form-item label="标识符" prop="mark">
              <el-input v-model="dialogForm.mark" size="mini" :disabled="isDev && dialogForm.inherit == '1'" />
            </el-form-item>
            <el-form-item label="调用方式" prop="async">
              <el-select v-model="dialogForm.async" placeholder="请选择调用方式" size="mini" :disabled="isDev && dialogForm.inherit == '1'">
                <el-option label="同步" value="0" />
                <el-option label="异步" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="输入参数" prop="productServiceParamList">
              <Variable ref="variable" v-model="dialogForm.productServiceParamList" :name="'输入参数'" :read="isDev && dialogForm.inherit == '1'" />
            </el-form-item>
            <el-form-item label="描述" prop="remark">
              <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini" />
            </el-form-item>
          </el-form>
        </template>
      </FormTemplate>
    </div>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible2"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :width="'700px'"
      @close="serviceParams = []"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">触发服务</div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible2 = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <Variable ref="variable" v-model="serviceParams" :name="'输入参数'" read />
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="triggerService">触 发</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import Variable from '@/components/Detail/Variable'
import FormTemplate from '@/components/Slots/FormTemplate'
import { getServiceByPage, createService, updateService, deleteService, executeService } from '@/api/porductMgr'

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
    Variable,
    FormTemplate
  },
  props: {
    isDev: Boolean
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
      butLoading: false,
      dialogVisible: false,
      dialogVisible2: false,
      serviceParams: [],
      serviceId: '',
      state: '',
      total: 0,
      size: 10,
      page: 1,
      dialogForm: {
        name: '',
        mark: '',
        async: '',
        remark: '',
        relationId: '',
        productServiceParamList: []
      },
      rules: {
        name: [
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ],
        mark: [
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
          event: 'detail',
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
          width: 250,
          idName: 'id',
          buttons: [
            {
              label: '编辑',
              event: 'edit',
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
  watch: {
    isDev: {
      immediate: true,
      handler(val) {
        if (val) {
          this.columns = [
            {
              label: '服务名称',
              prop: 'name',
              event: 'detail',
              show: true
            },
            {
              label: '标识符',
              prop: 'mark',
              show: true
            },
            {
              label: '来自产品',
              prop: 'inheritName',
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
              width: 250,
              idName: 'id',
              buttons: [
                {
                  label: '触发',
                  event: 'trigger',
                  icon: 'list-trigger'
                },
                {
                  label: '编辑',
                  event: 'edit',
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
      }
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
      this.dialogVisible = false
      this.loading = true
      getServiceByPage({ ...this.form, prodId: this.$route.query.id, maxRow: this.size, page: this.page }).then((res) => {
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
      this.dialogVisible = false
      this.dialogForm = {
        name: '',
        mark: '',
        async: '',
        remark: '',
        relationId: '',
        productServiceParamList: []
      }
      this.$refs.dialogForm.resetFields()
    },
    detail(item) {
      this.edit(item.id)
    },
    /* 触发 */
    trigger(id) {
      this.serviceId = id
      const i = this.tableData.find((item) => {
        return item.id === id
      })
      if (i.productServiceParamList && i.productServiceParamList.length) {
        this.serviceParams = JSON.parse(JSON.stringify(i.productServiceParamList))
        this.dialogVisible2 = true
      } else {
        this.serviceParams = []
        this.triggerService()
      }
    },
    triggerService() {
      executeService({ deviceId: this.$route.query.id, serviceId: this.serviceId, serviceParams: this.serviceParams }).then((res)=>{
        if (res.code == 200){
          this.$message({
            message: '服务触发成功',
            type: 'success'
          })
          this.dialogVisible2 = false
        }
      }).catch(() => {
        this.$message({
          message: '服务触发失败',
          type: 'error'
        })
        this.dialogVisible2 = false
      })
    },
    edit(id) {
      const i = this.tableData.find((item) => {
        return item.id === id
      })
      this.dialogForm = JSON.parse(JSON.stringify(i))
      this.state = '编辑'
      this.dialogVisible = true
    },
    delete(id) {
      const i = this.tableData.find((item) => {
        return item.id === id
      })
      if (i.inherit == '1') {
        this.$message({
          message: '当前数据不可删除',
          type: 'warning'
        })
      } else {
        this.$confirm('是否确认删除选中的数据?', '提示', {
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
              await this.getList()
            }
          })
        })
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    submit() {
      this.$refs.dialogForm.validate(async(valid) => {
        if (valid && this.$refs.variable.verification()) {
          this.butLoading = true
          this.dialogForm.relationId = this.$route.query.id
          if (this.state === '创建') {
            createService(this.dialogForm).then((res) =>{
              if (res.code == 200) {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.close()
                this.getList()
              }
              this.butLoading = false
            }).catch(() => {
              this.butLoading = false
            })
          } else {
            updateService(this.dialogForm).then((res) =>{
              if (res.code == 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.close()
                this.getList()
              }
              this.butLoading = false
            }).catch(() => {
              this.butLoading = false
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.serve{
  height: 100%;
}
</style>
