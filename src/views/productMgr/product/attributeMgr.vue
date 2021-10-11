<!--产品详情-属性管理页面 -->
<template>
  <div class="attribute-mgr">
    <SearchForm :params="formParams" :buttons="buttons" :columns="columns" @search="search"/>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
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
        <div class="left">{{ state }}属性</div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <attributeForm v-if="dialogVisible" ref="attributeForm" v-model="dialogForm"/>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button :disabled="butLoading" type="primary" size="mini" round @click="submit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import attributeForm from '@/views/deviceMgr/device/attributeForm'
import {
  createAttrTrapper,
  deleteAttrTrapper,
  detailAttrTrapper,
  getAttrTrapperByPage,
  updateAttrTrapper
} from '@/api/porductMgr'

export default {
  name: 'AttributeMgr',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    SearchForm,
    Pagination,
    attributeForm
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'attrName',
          label: '属性名称'
        },
        {
          componentName: 'InputTemplate',
          keyName: 'key',
          label: '标识符'
        }
      ],
      form: {
        name: ''
      },
      tableData: [],
      loading: false,
      butLoading: false,
      dialogVisible: false,
      dialogForm: {},
      state: '',
      total: 0,
      size: 10,
      page: 1,
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      columns: [
        {
          label: '属性名称',
          prop: 'attrName',
          show: true
        },
        {
          label: '标识符',
          prop: 'key',
          show: true
        },
        {
          label: '来源类型',
          prop: 'sourceName',
          show: true
        },
        {
          label: '数据类型',
          prop: 'valueTypeName',
          show: true
        },
        {
          label: '取数间隔',
          prop: 'delayName',
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '修改时间',
          prop: 'updateTime',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 160,
          idName: 'attrId',
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
    if (this.$route.query.id) {
      this.form.prodId = this.$route.query.id
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
      getAttrTrapperByPage({...this.form, maxRow: this.size, page: this.page}).then((res) => {
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
    detail(attrId) {
      detailAttrTrapper({attrId}).then(res => {
        if (res.code == 200) {
          this.dialogForm = res.data
          this.state = '编辑'
          this.dialogVisible = true
        }
      })
    },
    delete(id) {
      const i = this.tableData.find((item) => {
        return item.attrId === id
      })
      if (i.templateId) {
        this.$message({
          message: '当前数据不可删除',
          type: 'warning'
        })
      } else {
        this.$confirm('是否确认删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAttrTrapper({attrIds: [id]}).then(async (res) => {
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
      }
    },
    submit() {
      if (this.$refs.attributeForm.validateForm()) {
        this.butLoading = true
        if (this.dialogForm.attrId) {
          updateAttrTrapper(this.dialogForm).then(async (res) => {
            if (res.code == 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getList()
            }
            this.butLoading = false
          }).catch(() => {
            this.butLoading = false
          })
        } else {
          createAttrTrapper(this.dialogForm).then(async (res) => {
            if (res.code == 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getList()
            }
            this.butLoading = false
          }).catch(() => {
            this.butLoading = false
          })
        }
      }
    },
  }
}
</script>

