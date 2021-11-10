<!-- 系统字典页面 -->
<template>
  <div class="dict-type">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>系统字典</template>
      <template v-slot:subhead></template>
    </ListHeadTemplate>
    <SearchForm v-if="!dialogVisible" :params="formParams" :buttons="buttons" :batch-buttons="batchButtons" :selected="ids.length > 0" :columns="columns" @search="search" @cancel="ids = []" />
    <BusinessTable
      v-if="!dialogVisible"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :selection="true"
      :icon="$route.meta.icon24"
      @select="handleSelect"
      @detail="detail"
    />
    <Pagination v-if="!dialogVisible" :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange" />
    <div v-if="dialogVisible">
      <FormTemplate :up="'字典列表'" :state="state + '字典'" :but-loading="butLoading" @submit="dicTypeSubmit" @cancel="close">
        <template v-slot:main>
          <el-form ref="dictTypeForm" :rules="rules" :model="dialogForm" label-width="80px" class="dialog-form">
            <el-form-item label="名称" prop="name">
              <el-input v-model="dialogForm.name" size="mini" />
            </el-form-item>
            <el-form-item label="编码" prop="code">
              <el-input v-model="dialogForm.code" size="mini" />
            </el-form-item>
            <el-form-item v-if="state === '编辑字典项' || state === '编辑字典类型'" label="状态" prop="status">
              <el-select v-model="dialogForm.status" placeholder="请选择" size="mini" class="zeus-w100">
                <el-option label="启用" value="ENABLE" />
                <el-option label="禁用" value="DISABLE" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini" />
            </el-form-item>
          </el-form>
        </template>
      </FormTemplate>
    </div>

    <!--字典项列表-->
    <el-drawer :visible.sync="drawerShow" @close="close">
      <div slot="title" class="dialog-title">
        <span style="color: #000" class="zeus-mr-25">{{ dictTypeName }}</span>
        <el-button round size="mini" type="primary" @click="addDict">新增</el-button>
      </div>
      <BusinessTable
        :table-data="tableData2"
        :columns="columns2"
        :loading="loading2"
        @detail="detail2"
      />
    </el-drawer>
    <!--  字典类型弹窗  -->
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible2"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
      @close="close"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon v-if="state.indexOf('创建') !== -1" icon-class="dialog_add" />
          <svg-icon v-if="state.indexOf('编辑') !== -1" icon-class="dialog_edit" />
          {{ state }}
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible2 = false" />
        </div>
      </div>
      <div class="dialog-body">
        <el-form ref="dictTypeForm" :rules="rules" :model="dialogForm" label-width="80px" class="dialog-form">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogForm.name" size="mini" />
          </el-form-item>
          <el-form-item label="编码" prop="code">
            <el-input v-model="dialogForm.code" size="mini" />
          </el-form-item>
          <el-form-item v-if="state === '编辑字典项' || state === '编辑字典类型'" label="状态" prop="status">
            <el-select v-model="dialogForm.status" placeholder="请选择" size="mini" class="zeus-w100">
              <el-option label="启用" value="ENABLE" />
              <el-option label="禁用" value="DISABLE" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini" />
          </el-form-item>
        </el-form>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible2 = false">取 消</el-button>
        <el-button :disabled="butLoading" type="primary" size="mini" round @click="dicTypeSubmit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import FormTemplate from '@/components/Slots/FormTemplate'
import {
  deleteDictType,
  updateDictType,
  createDictType,
  getDictTypeByPage,
  getDictList, createDict, updateDict, deleteDict
} from '@/api/system'
export default {
  name: 'DictType',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    ListHeadTemplate,
    BusinessTable,
    SearchForm,
    Pagination,
    FormTemplate
  },
  data() {
    return {
      formParams: [{
        componentName: 'InputTemplate',
        keyName: 'condition',
        label: '字典名称/编号'
      }],
      form: {
        condition: ''
      },
      dialogForm: {
        name: '',
        code: '',
        systemFlag: 'N',
        remark: '',
        status: ''
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
      ids: [],
      tableData: [],
      tableData2: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' }
        ]
      },
      columns: [
        {
          label: '名称',
          prop: 'name',
          event: 'detail',
          show: true
        },
        {
          label: '编号',
          prop: 'code',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          status: true,
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
          show: true,
          width: 180,
          idName: 'dictTypeId',
          buttons: [
            {
              label: '编辑',
              event: 'edit',
              icon: 'list-edit'
            },
            {
              label: '配置',
              event: 'allocation',
              icon: 'list_allocation'
            }
          ]
        }
      ],
      columns2: [
        {
          label: '名称',
          prop: 'name',
          event: 'detail',
          show: true
        },
        {
          label: '编号',
          prop: 'code',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          status: true,
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
          show: true,
          idName: 'dictId',
          width: 180,
          buttons: [
            {
              label: '编辑',
              event: 'edit2',
              icon: 'list-edit'
            },
            {
              label: '删除',
              event: 'del',
              icon: 'list-del'
            }
          ]
        }
      ],
      loading: false,
      loading2: false,
      butLoading: false,
      total: 0,
      size: 10,
      page: 1,
      drawerShow: false,
      state: '',
      dialogVisible: false,
      dialogVisible2: false,
      dictTypeId: null,
      dictTypeName: ''
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
    /* 获取列表*/
    getList() {
      this.loading = true
      getDictTypeByPage({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleSelect(selection) {
      this.ids = selection.map((i) => { return i.dictTypeId })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    /* 展开字典项 */
    allocation(dictTypeId) {
      this.drawerShow = true
      this.loading2 = true
      this.dictTypeId = dictTypeId
      const i = this.tableData.find((item) => {
        return item.dictTypeId === dictTypeId
      })
      this.dictTypeName = i.name
      getDictList({ dictTypeId }).then((res) => {
        this.loading2 = false
        if (res.code == 200) {
          this.tableData2 = res.data
        }
      }).catch(() => {
        this.loading2 = false
      })
    },
    add() {
      this.state = '创建字典类型'
      this.dialogVisible = true
    },
    addDict() {
      this.state = '创建字典项'
      this.dialogVisible2 = true
    },
    detail(item){
      this.edit(item.dictTypeId)
    },
    edit(id) {
      const i = this.tableData.find((item) => {
        return item.dictTypeId === id
      })
      this.dialogForm = JSON.parse(JSON.stringify(i))
      this.state = '编辑字典类型'
      this.dialogVisible = true
    },
    detail2(item) {
      this.edit2(item.dictId)
    },
    edit2(id) {
      const i = this.tableData2.find((item) => {
        return item.dictId === id
      })
      this.dialogForm = JSON.parse(JSON.stringify(i))
      this.state = '编辑字典项'
      this.dialogVisible2 = true
    },
    /* 删除字典类型 */
    delete() {
      this.$confirm('是否确认删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDictType({ dictTypeIds: this.ids }).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.ids = []
            // 删除后重新请求数据
            await this.getList()
          }
        })
      })
    },
    /* 删除字典项 */
    del(dictId) {
      this.$confirm('是否确认删除这条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDict({ dictIds: [dictId] }).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            // 删除后重新请求数据
            await this.allocation(this.dictTypeId)
          }
        })
      })
    },
    close() {
      this.dialogVisible = false
      this.dialogForm = {
        name: '',
        code: '',
        systemFlag: 'N',
        remark: '',
        status: ''
      }
    },
    /* 提交表单 */
    dicTypeSubmit() {
      this.$refs.dictTypeForm.validate((valid, errorFields) => {
        if (valid) {
          this.butLoading = true
          switch (this.state) {
            case '创建字典类型':
              createDictType(this.dialogForm).then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                  this.close()
                  this.dialogVisible2 = false
                  this.getList()
                }
                this.butLoading = false
              }).catch(() => {
                this.butLoading = false
              })
              break
            case '编辑字典类型':
              updateDictType(this.dialogForm).then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.close()
                  this.dialogVisible2 = false
                  this.getList()
                }
                this.butLoading = false
              }).catch(() => {
                this.butLoading = false
              })
              break
            case '创建字典项':
              this.dialogForm.dictTypeId = this.dictTypeId
              createDict(this.dialogForm).then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                  // this.close()
                  this.dialogVisible2 = false
                  this.allocation(this.dialogForm.dictTypeId)
                }
                this.butLoading = false
              }).catch(() => {
                this.butLoading = false
              })
              break
            case '编辑字典项':
              updateDict(this.dialogForm).then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  // this.close()
                  this.dialogVisible2 = false
                  this.allocation(this.dialogForm.dictTypeId)
                }
                this.butLoading = false
              }).catch(() => {
                this.butLoading = false
              })
              break
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dict-type{
  height: 100%;
}
</style>
