<!-- 产品页面 -->
<template>
  <div class="business-log">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>产品</template>
      <template v-slot:subhead>产品是一组具有相同属性、服务、事件等要素的设备集合，比如某品牌的某型号的传感器。创建产品是使用平台的第一步，快速创建产品后才可定义产品下的属性、服务、事件、告警规则等要素，进而添加相应设备。</template>
    </ListHeadTemplate>
    <SearchForm v-if="!dialogVisible" :params="formParams" :buttons="buttons" :columns="columns" @search="search" />
    <BusinessTable
      v-if="!dialogVisible"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      @detail="detail"
    />
    <Pagination v-if="!dialogVisible" :total="total" :size="form.maxRow" :current-page="form.page" @handleCurrentChange="handleCurrentChange" />
    <div v-if="dialogVisible">
      <FormTemplate :up="'产品列表'" :state="state + '产品'" :but-loading="butLoading" @submit="handleSubmit" @cancel="dialogVisible = false">
        <template v-slot:main>
          <ProductForm ref="ProductForm" v-model="dialogForm" />
        </template>
      </FormTemplate>
    </div>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import SearchForm from '@/components/Basics/SearchForm'
import ProductForm from './addForm.vue'
import BusinessTable from '@/components/Basics/BusinessTable'
import FormTemplate from '@/components/Slots/FormTemplate'
import Pagination from '@/components/Basics/Pagination'
import { getProductByPage, DeleteProduct, UpdateProduct, createProduct } from '@/api/porductMgr'
import { getDictListByCode } from '@/api/system'
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
    Pagination,
    FormTemplate
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
      butLoading: false,
      state: '',
      total: 0,
      formParams: [],
      typeList: [],
      dialogForm: {},
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
          prop: 'prodName',
          event: 'detail',
          show: true
        },
        {
          label: '产品ID',
          prop: 'prodCode',
          show: true
        },
        {
          label: '产品分类',
          prop: 'groupIdName',
          show: true
        },
        {
          label: '设备类型',
          prop: 'prodTypeName',
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
          prop: 'deviceNum',
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
          width: 100,
          idName: 'productId',
          show: true,
          fixed: 'right',
          buttons: [
            {
              label: '删除',
              event: 'del',
              icon: 'list-del'
            }
          ]
        }
      ]
    }
  },
  created() {
    this.searchInit()
    this.getList()
  },
  methods: {
    async searchInit() {
      // 获取设备类型
      await getDictListByCode({ dictTypeCode: 'DEVICE_TYPE' }).then((res) => {
        if (res.code == 200) {
          this.typeList = res.data
        }
      })
      this.formParams = [
        {
          componentName: 'SelectTemplate',
          keyName: 'prodType',
          label: '设备类型',
          optionId: 'code',
          optionName: 'name',
          options: this.typeList
        },
        {
          componentName: 'InputTemplate',
          keyName: 'prodName',
          label: '产品名称'
        }
      ]
    },
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
          }
        })
      })
    },
    closeDialog() {
      this.dialogVisible = false
      this.getList()
    },
    handleSubmit() {
      if (this.$refs.ProductForm.validateForm()) {
        this.butLoading = true
        if (this.prodId) {
          UpdateProduct(this.dialogForm).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.closeDialog()
            }
            this.butLoading = false
          }).catch(() => {
            this.butLoading = false
          })
        } else {
          createProduct(this.dialogForm).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.closeDialog()
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
