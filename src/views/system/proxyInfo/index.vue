<!-- proxy页面 -->
<template>
  <div class="proxy">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>代理配置</template>
      <template v-slot:subhead>为实现跨区域采集、数据多级汇聚、弱网优化功能，需要首先部署代理（Zabbix Proxy），然后在此进行代理配置信息的登记。配置成功后，在此也可查看代理的具体配置信息。</template>
    </ListHeadTemplate>
    <SearchForm v-if="!dialogVisible" :params="formParams" :columns="columns" :buttons="buttons" :batch-buttons="batchButtons" :selected="ids.length > 0" @search="search" @cancel="ids = []"/>
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
    <Pagination v-if="!dialogVisible" :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    <div v-if="dialogVisible">
      <FormTemplate :up="'Proxy列表'" :state="state + 'Proxy'" :but-loading="butLoading" @submit="submit" @cancel="close">
        <template v-slot:main>
          <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="80px" class="dialog-form">
            <el-form-item label="名称" prop="name">
              <el-input v-model="dialogForm.name" size="mini"/>
            </el-form-item>
            <el-form-item label="IP" prop="address">
              <el-input v-model="dialogForm.address" size="mini"/>
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
      :width="'900px'"
      :show-close="false"
      @closed=""
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          查看配置
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible2 = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <json-editor ref="JsonEditor" :mode="'text/javascript'" :json="jsValue" @change="handleJsonChange"/>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible2 = false">关 闭</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import { createProxy, deleteProxy, getProxyByPage, updateProxy } from '@/api/system'
import JsonEditor from '@/components/Basics/JsonEditor'
import FormTemplate from '@/components/Slots/FormTemplate'

export default {
  name: 'Proxy',
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
    JsonEditor,
    FormTemplate
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '名称'
        }
      ],
      tableData: [],
      loading: false,
      butLoading: false,
      dialogVisible: false,
      dialogVisible2: false,
      state: '',
      jsValue: '',
      total: 0,
      size: 10,
      page: 1,
      dialogForm: {
        name: '',
        address: ''
      },
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入IP地址', trigger: 'blur'}
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
          label: 'HostName',
          prop: 'id',
          show: true
        },
        {
          label: 'IP地址',
          prop: 'address',
          show: true
        },
        {
          label: '连接方式',
          prop: 'modeName',
          show: true
        },
        {
          label: '在线时间',
          prop: 'lastAccess',
          show: true
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 200,
          idName: 'id',
          fixed: 'right',
          buttons: [
            {
              label: '编辑',
              event: 'edit',
              icon: 'list-edit'
            },
            {
              label: '查看配置',
              event: 'check',
              icon: 'list-edit'
            }
          ]
        }
      ],
      batchButtons: [
        {
          type: 'danger',
          label: '删除',
          event: 'delete'
        }
      ],
      deviceList: [],
      attrList: [],
      attributeList: [],
      form: {
        name: ''
      },
      ids: []
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
      this.loading = true
      getProxyByPage({...this.form, maxRow: this.size, page: this.page}).then((res) => {
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
    handleSelect(selection) {
      this.ids = selection.map((i) => {
        return i.id
      })
    },
    handleJsonChange(val) {
      if (this.jsValue !== val) {
        this.jsValue = val
      }
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    delete() {
      this.$confirm('是否确认删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProxy({ids: this.ids}).then(async (res) => {
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
    detail(item) {
      this.edit(item.id)
    },
    check(id) {
      this.dialogVisible2 = true
      console.log(id);
    },
    edit(id) {
      const i = this.tableData.find((item) => {
        return item.id === id
      })
      this.dialogForm = JSON.parse(JSON.stringify(i))
      this.state = '编辑'
      this.dialogVisible = true
    },
    submit() {
      this.$refs.dialogForm.validate(async (valid, errorFields) => {
        if (valid) {
          this.butLoading = true
          if (this.state === '编辑') {
            updateProxy(this.dialogForm).then(async (res) => {
              if (res.code == 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.close()
                await this.getList()
              }
              this.butLoading = false
            }).catch(() => {
              this.butLoading = false
            })
          } else {
            createProxy(this.dialogForm).then(async (res) => {
              if (res.code == 200) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.close()
                await this.getList()
              }
              this.butLoading = false
            }).catch(() => {
              this.butLoading = false
            })
          }
        }
      })
    },
    close() {
      this.dialogVisible = false
      this.dialogForm = {
        address: '',
        name: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.proxy{
  height: 100%;
}
</style>
