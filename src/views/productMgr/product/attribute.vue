<template>
  <div>
    <div class="zeus-product-tit">属性</div>
    <div class="zeus-product">
      <SearchForm :params="formParams" :buttons="buttons" :batch-buttons="batchButtons" :selected="ids.length > 0" :columns="columns" @search="search" @cancel="ids = []" />
      <BusinessTable
        :table-data="tableData"
        :columns="columns"
        :loading="loading"
        :selection="true"
        @select="handleSelect"
      />
      <Pagination :total="total" :size="form.maxRow" :current-page="form.page" @handleCurrentChange="handleCurrentChange" />
      <el-dialog
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :width="'700px'"
      >
        <div slot="title" class="dialog-title zeus-flex-between">
          <div class="left">
            <svg-icon v-if="state === '创建'" icon-class="dialog_add" />
            <svg-icon v-if="state === '编辑'" icon-class="dialog_edit" />
            {{ state }}属性
          </div>
          <div class="right">
            <svg-icon icon-class="dialog_close" class="closeicon" />
            <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
          </div>
        </div>
        <AttrForm :items="item" @close="dialogVisible = false" @closeDialog="closeDialog" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import SearchForm from '@/components/Basics/SearchForm'
import BusinessTable from '@/components/Basics/BusinessTable'
import Pagination from '@/components/Basics/Pagination'
import AttrForm from './attrForm.vue'
import { getAttrTrapperByPage, deleteAttrTrapper } from '@/api/porductMgr'
export default {
  provide() {
    return {
      farther: this
    }
  },
  components: {
    SearchForm,
    BusinessTable,
    Pagination,
    AttrForm
  },
  data() {
    return {
      // 属性列表传参
      form: {
        prodId: '',
        attrName: '',
        key: '',
        page: 1,
        maxRow: 10
      },
      item: '',
      tableData: [],
      loading: false,
      total: 0,
      ids: [],
      state: '',
      dialogVisible: false,
      // 属性页面搜索项配置
      formParams: [{
        componentName: 'InputTemplate',
        keyName: 'attrName',
        label: '属性名称'
      }, {
        componentName: 'InputTemplate',
        keyName: 'key',
        label: '属性标识'
      }],
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
          event: 'del'
        }
      ],
      // 属性列表配置
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
          label: '单位',
          prop: 'unitsName',
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
          label: '操作',
          prop: 'buttons',
          width: 80,
          idName: 'attrId',
          show: true,
          fixed: 'right',
          buttons: [
            {
              label: '编辑',
              event: 'edit',
              icon: 'list-edit'
            }
          ]
        }
      ]
    }
  },
  async created() {
    if (this.$route.query.id) {
      this.prodId = this.$route.query.id
      await this.getAttribute()
    }
  },
  methods: {
    getAttribute() {
      this.form.prodId = this.prodId
      getAttrTrapperByPage(this.form).then(res => {
        if (res.code == 200) {
          this.tableData = res.data
          this.total = Number(res.count)
        }
      })
    },
    search() {
      this.form.page = 1
      this.getAttribute()
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.getAttribute()
    },
    async closeDialog() {
      this.dialogVisible = false
      await this.getAttribute()
    },
    handleSelect(selection) {
      this.ids = selection.map((i) => { return i.attrId })
    },
    add() {
      this.item = ''
      this.state = '创建'
      this.dialogVisible = true
    },
    edit(id) {
      this.item = id
      this.state = '编辑'
      this.dialogVisible = true
    },
    del() {
      console.log(this.ids)
      this.$confirm('是否确认删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAttrTrapper({ attrIds: this.ids }).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            // 删除后重新请求数据
            this.ids = []
            await this.getAttribute()
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
