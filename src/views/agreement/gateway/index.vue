<!--协议网关页面-->
<template>
  <div class="module">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>协议网关</template>
      <template v-slot:subhead>协议网关控制着每个通信服务可以用哪些设备协议进行解析。</template>
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
      <el-table-column v-for="(item, index) in columns" :key="index" :label="item.label">
        <template slot-scope="scope">
          <span v-if="item.prop === 'buttons'" class="setting-buttons">
            <el-button
              v-if="scope.row.status == 0"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="stop(scope.row.protocolGatewayId)"
            >
              <svg-icon icon-class="list_stop"/>
              停止
            </el-button>
            <el-button
              v-if="scope.row.status == 1"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="start(scope.row.protocolGatewayId)"
            >
              <svg-icon icon-class="list_start"/>
              启动
            </el-button>
            <el-button
              v-if="scope.row.status == 1"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="del(scope.row.protocolGatewayId)"
            >
              <svg-icon icon-class="list-del"/>
              删除
            </el-button>
          </span>
          <div v-else-if="item.prop === 'status'">
            <span v-if="scope.row.status == 1" style="color: #CC3333">已停止</span>
            <span v-if="scope.row.status == 0" style="color: #128E75">已启动</span>
          </div>
          <span v-else-if="item.event" class="event" @click="upload(scope.row.protocolGatewayId)">
            {{ scope.row[item.prop] ? scope.row[item.prop] : '-' }}
          </span>
          <span v-else-if="item.prop === 'protocolService'" class="event" @click="toService(scope.row.protocolServiceName)">
            {{ scope.row.protocolServiceName ? scope.row.protocolServiceName : '-' }}
          </span>
          <span v-else>
            {{ scope.row[item.prop] ? scope.row[item.prop] : '-' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination v-if="!dialogVisible" :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    <div v-if="dialogVisible">
      <FormTemplate :up="'协议网关列表'" :state="state + '协议网关'" :but-loading="butLoading" @submit="submit" @cancel="close">
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
import moduleForm from '@/views/agreement/gateway/form'
import FormTemplate from '@/components/Slots/FormTemplate'
import {
  updateGateway,
  getProtocolGatewayByPage,
  deleteGateway,
  createGateway,
  startGateway,
  stopGateway
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
          keyName: 'protocolType',
          label: '协议网关类型',
          optionId: 'code',
          optionName: 'name',
          options: [
            { name: 'MQTT 客户端', code: '1' }
          ]
        },
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '协议网关名称'
        }
      ],
      columns: [
        {
          label: '协议网关名称',
          prop: 'name',
          event: 'detail',
          show: true
        },
        {
          label: '协议网关类型',
          prop: 'protocolTypeName',
          show: true
        },
        {
          label: '通讯服务',
          prop: 'protocolService',
          show: true
        },
        {
          label: '运行状态',
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
        protocolType: '',
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
        protocolType: '',
        protocolServiceId: '',
        remark: '',
        qos: '',
        protocolGatewayMqttList: [
          {
            topic: '',
            protocolComponentId: ''
          }
        ]
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
      getProtocolGatewayByPage({ ...this.form, maxRow: this.size, page: this.page}).then((res) => {
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
    toService(name) {
      if (name) {
        this.$router.push({
          path: '/agreement/communication',
          query: {
            name
          }
        })
      }
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    del(id) {
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGateway({ protocolGatewayIds: [id] }).then(async(res) => {
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
        if (this.state === '创建') {
          createGateway(this.dialogForm).then((res) => {
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
        } else {
          updateGateway(this.dialogForm).then((res) => {
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
    },
    close() {
      this.dialogVisible = false
      this.dialogForm = {
        name: '',
        protocolType: '',
        protocolServiceId: '',
        remark: '',
        qos: '',
        protocolGatewayMqttList: [
          {
            topic: '',
            protocolComponentId: ''
          }
        ]
      }
    },
    upload(id) {
      const i = this.tableData.find((item) => {
        return item.protocolGatewayId === id
      })
      this.dialogForm = JSON.parse(JSON.stringify(i))
      this.dialogForm.source = '1'
      this.state = '编辑'
      this.dialogVisible = true
    },
    start(id) {
      this.$confirm('是否确认启动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        startGateway({ protocolGatewayId: id }).then(async(res) => {
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
    stop(id) {
      this.$confirm('是否确认停止?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stopGateway({ protocolGatewayId: id }).then(async(res) => {
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
