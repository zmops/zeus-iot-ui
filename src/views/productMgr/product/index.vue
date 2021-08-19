<!-- 产品页面 -->
<template>
  <div class="business-log">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>产品</template>
      <template v-slot:subhead>产品是一组具有相同属性、服务、事件等定义的设备集合，比如某品牌的某型号的传感器。创建产品是使用平台的第一步，快速创建产品后才可定义产品物模型、告警规则，进而添加相应设备。</template>
    </ListHeadTemplate>
    <SearchForm :params="formParams" :buttons="buttons" :columns="columns" @search="search" />
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      @detail="detail"
    />
    <Pagination :total="total" :size="form.maxRow" :current-page="form.page" @handleCurrentChange="handleCurrentChange" />
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">{{ state }}产品</div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div>
        <ProductForm @close="dialogVisible = false" @closeDialog="closeDialog" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import SearchForm from '@/components/Basics/SearchForm'
import ProductForm from '@/components/productMgr/product/addForm.vue'
import BusinessTable from '@/components/Basics/BusinessTable'
import Pagination from '@/components/Basics/Pagination'
import { getProductByPage, DeleteProduct } from '@/api/porductMgr'
export default {
  provide() {
    return {
      farther: this
    }
  },
  name: 'Product',
  components: {
    ListHeadTemplate,
    SearchForm,
    ProductForm,
    BusinessTable,
    Pagination
  },
  data() {
    return {
      form: {
        prodName: '',
        prodType: '',
        groupId: '',
        maxRow: 20,
        page: 1
      },
      tableData: [],
      loading: false,
      dialogVisible: false,
      state: '',
      total: 0,
      formParams: [],
      item: '',
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      columns: [
        {
          label: '产品名称',
          prop: 'name',
          event: true,
          show: true
        },
        {
          label: '产品ID',
          prop: 'productCode',
          show: true
        },
        {
          label: '产品分类',
          prop: 'groupIdName',
          show: true
        },
        {
          label: '设备类型',
          prop: 'typeName',
          show: true
        },
        {
          label: '厂商',
          prop: 'manufacturer',
          show: true
        },
        {
          label: '型号',
          prop: 'model',
          show: true
        },
        {
          label: '设备总数',
          prop: '',
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
          width: 80,
          idName: 'productId',
          show: true,
          fixed: 'right',
          buttons: [
            {
              label: '删除',
              event: 'del'
            }
          ]
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.form.page = 1
      this.getList()
    },
    getList() {
      getProductByPage(this.form).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = Number(res.count)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.getList()
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    edit(id) {
      // this.state = '更新'
      // this.dialogVisible = true
    },
    detail(item) {
      this.$router.push({
        path: '/productMgr/product/detail',
        query: {
          id: item.productId
        }
      })
    },
    del(id) {
      this.$confirm('是否确认删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteProduct({ productId: id }).then(async(res) => {
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
    async closeDialog() {
      this.dialogVisible = false
      await this.getList()
    }
  }
}
</script>
