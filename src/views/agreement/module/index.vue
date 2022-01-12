<!--协议组件页面-->
<template>
  <div class="module">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>协议组件</template>
      <template v-slot:subhead>协议组件是对设备与本平台数据通信方式的详细定义。</template>
    </ListHeadTemplate>
    <SearchForm v-if="!dialogVisible" :params="formParams" :buttons="buttons" :batch-buttons="batchButtons" :columns="columns" @search="search"/>
    <el-table
      v-if="!dialogVisible"
      v-loading="loading"
      :data="tableData"
      style="width: 100%;padding: 0 12px 12px 12px;"
      :height="'calc(100% - 242px)'"
      class="table">
      <el-table-column width="48">
        <template>
          <svg-icon :icon-class="$route.meta.icon24" style="font-size: 24px"/>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in columns" :key="index" :label="item.label" :width="item.width">
        <template slot-scope="scope">
          <span v-if="item.prop === 'buttons'" class="setting-buttons">
            <el-button
              v-if="scope.row.status == 0"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="upload(scope.row.protocolComponentId)"
            >
              <svg-icon icon-class="list_upload"/>
              上传
            </el-button>
            <el-button
              v-if="scope.row.status == 2"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="republish(scope.row.protocolComponentId)"
            >
              <svg-icon icon-class="list_republish"/>
              重新发布
            </el-button>
            <el-button
              v-if="scope.row.status == 2"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="unpublish(scope.row.protocolComponentId)"
            >
              <svg-icon icon-class="list_unpublish"/>
              取消发布
            </el-button>
            <el-button
              v-if="scope.row.status == 1"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="publish(scope.row.protocolComponentId)"
            >
              <svg-icon icon-class="list_publish"/>
              发布
            </el-button>
            <el-button
              v-if="scope.row.status == 0 || scope.row.status == 1"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="del(scope.row.protocolComponentId)"
            >
              <svg-icon icon-class="list-del"/>
              删除
            </el-button>
          </span>
          <div v-else-if="item.prop === 'status'">
            <span v-if="scope.row.status == 0" style="color: #F1C232">待上传</span>
            <span v-if="scope.row.status == 1" style="color: #CC3333">未发布</span>
            <span v-if="scope.row.status == 2" style="color: #128E75">已发布</span>
          </div>
          <span v-else-if="item.event" class="event" @click="upload(scope.row.protocolComponentId)">
            {{ scope.row[item.prop] ? scope.row[item.prop] : '-' }}
          </span>
          <span v-else>
            {{ scope.row[item.prop] ? scope.row[item.prop] : '-' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination v-if="!dialogVisible" :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    <div v-if="dialogVisible">
      <FormTemplate :up="'协议组件列表'" :state="state + '协议组件'" :but-loading="butLoading" @submit="submit" @cancel="close">
        <template v-slot:main>
          <moduleForm ref="moduleForm" v-model="dialogForm"/>
        </template>
      </FormTemplate>
    </div>
  </div>
</template>
<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import moduleForm from '@/views/agreement/module/form'
import FormTemplate from '@/components/Slots/FormTemplate'
import {
  createComponent,
  getProtocolComponentByPage,
  deleteComponent,
  updateComponent,
  unPublish,
  publish
} from '@/api/agreement'

export default {
  name: 'module',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    ListHeadTemplate,
    SearchForm,
    Pagination,
    moduleForm,
    FormTemplate
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'SelectTemplate',
          keyName: 'status',
          label: '发布状态',
          optionId: 'value',
          optionName: 'label',
          options: [
            { label: '待上传', value: '0' },
            { label: '未发布', value: '1' },
            { label: '已发布', value: '2' }
          ]
        },
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '设备协议名称'
        }
      ],
      columns: [
        {
          label: '设备协议名称',
          prop: 'name',
          event: 'detail',
          show: true
        },
        {
          label: '设备协议ID',
          prop: 'protocolComponentId',
          show: true
        },
        {
          label: '协议识别ID',
          prop: 'uniqueId',
          show: true
        },
        {
          label: '发布状态',
          prop: 'status',
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '创建人',
          prop: 'createUserName',
          show: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 270,
          idName: 'eventRuleId'
        }
      ],
      tableData: [],
      loading: false,
      butLoading: false,
      total: 0,
      size: 10,
      page: 1,
      form: {
        status: '',
        name: ''
      },
      devList: [],
      ids: [],
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
      dialogVisible: false,
      state: '',
      dialogForm: {
        name: '',
        effectProxy: '',
        source: '1',
        remark: '',
        protocolComponentId: ''
      }
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    getList() {
      this.loading = true
      getProtocolComponentByPage({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
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
      this.ids = selection.map((i) => {
        return i.id
      })
    },
    detail(item) {

    },
    add() {
      this.$prompt('请输入设备协议名称', '新增', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '设备协议名称不能为空'
      }).then(({ value }) => {
        createComponent({ name: value }).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.getList()
          }
        })
      })
    },
    del(id) {
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteComponent({ protocolComponentIds: [id] }).then(async(res) => {
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
    submit() {
      if (this.$refs.moduleForm.validateForm()) {
        this.butLoading = true
        updateComponent(this.dialogForm).then((res) => {
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
    },
    close() {
      this.dialogVisible = false
      this.dialogForm = {
        name: '',
        effectProxy: '',
        source: '1',
        remark: '',
        protocolComponentId: ''
      }
    },
    upload(id) {
      const i = this.tableData.find((item) => {
        return item.protocolComponentId === id
      })
      this.dialogForm = JSON.parse(JSON.stringify(i))
      this.dialogForm.source = '1'
      this.state = '编辑'
      this.dialogVisible = true
    },
    republish(id) {
      this.$confirm('是否确认重新发布?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        publish({ protocolComponentId: id }).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            // 删除后重新请求数据
            await this.getList()
          }
        })
      })
    },
    unpublish(id) {
      this.$confirm('是否确认取消发布?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unPublish({ protocolComponentId: id }).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            // 删除后重新请求数据
            await this.getList()
          }
        })
      })
    },
    publish(id) {
      this.$confirm('是否确认发布?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        publish({ protocolComponentId: id }).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            // 删除后重新请求数据
            await this.getList()
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.module {
  height: 100%;
}

.setting-buttons .setting-button {
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
}

.setting-buttons ::v-deep.el-button.is-round:hover {
  background: #eff4f9;
  border: 1px solid #ccd3db;
}

.event {
  color: #409eff;
  cursor: pointer;
}

.table {
  font-size: 12px;
}
</style>
