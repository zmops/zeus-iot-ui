<!--通信服务页面-->
<template>
  <div class="module">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>通信服务</template>
      <template v-slot:subhead>通信服务对本平台各类通信服务进行统一管理。</template>
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
          <svg-icon :icon-class="$route.meta.icon24" style="font-size: 24px" />
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in columns" :key="index" :label="item.label">
        <template slot-scope="scope">
          <span v-if="item.prop === 'buttons'" class="setting-buttons">
            <el-button
              v-if="scope.row.acknowledged === '未确认' && scope.row.statusName !== '已解决'"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="upload(scope.row.eventId)"
            >
              <svg-icon icon-class="list_affirm" />
              上传
            </el-button>
            <el-button
              v-if="scope.row.statusName === '未解决'"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="del(scope.row.eventId)"
            >
              <svg-icon icon-class="list_affirm" />
              删除
            </el-button>
            <el-button
              v-if="scope.row.statusName === '未解决'"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="republish(scope.row.eventId)"
            >
              <svg-icon icon-class="list_affirm" />
              重新发布
            </el-button>
            <el-button
              v-if="scope.row.statusName === '未解决'"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="unpublish(scope.row.eventId)"
            >
              <svg-icon icon-class="list_affirm" />
              取消发布
            </el-button>
            <el-button
              v-if="scope.row.statusName === '未解决'"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="publish(scope.row.eventId)"
            >
              <svg-icon icon-class="list_affirm" />
              发布
            </el-button>
          </span>
          <span v-else-if="item.event" class="event" @click="detail(scope.row.deviceId)">
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
          <moduleForm ref="moduleForm" v-model="dialogForm" />
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
import { getSceneByPage, createScene, deleteScene, detailScene, modifyStatusScene, updateScene } from '@/api/scene'

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
          keyName: 'productId',
          label: '通信服务类型',
          options: ['待上传', '未发布', '已发布']
        },
        {
          componentName: 'InputTemplate',
          keyName: 'eventRuleName',
          label: '通信服务名称'
        }
      ],
      columns: [
        {
          label: '通信服务名称',
          prop: 'eventRuleName',
          event: 'detail',
          show: true
        },
        {
          label: '通信服务类型',
          prop: 'triggerDevice',
          show: true
        },
        {
          label: '运行状态',
          prop: 'status',
          status: true,
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '创建人',
          prop: 'remark',
          show: true
        },
        {
          label: '创建时间',
          prop: 'remark',
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
        // prodId: null,
        // attrId: '',
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
        eventRuleName: '',
        eventLevel: '3',
        eventNotify: '1',
        status: 'ENABLE',
        triggerType: '0',
        remark: '',
        scheduleConf: '',
        expLogic: 'or',
        timeIntervals: null,
        timeIntervals2: [],
        expList: [
          {
            deviceId: '',
            productAttrId: '',
            incident: '',
            condition: '=',
            productAttrType: '属性',
            function: 'last',
            value: '',
            period: '时间',
            unit: 'm',
            scope: ''
          }
        ],
        deviceServices: []
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
      getSceneByPage({ ...this.form, maxRow: this.size, page: this.page, classify: '1' }).then((res) => {
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
      this.edit(item.eventRuleId)
    },
    edit(eventRuleId) {
      detailScene({ eventRuleId, deviceId: this.form.prodId }).then((res) => {
        if (res.code == 200) {
          this.dialogForm = res.data
          if (this.dialogForm.timeExpList && this.dialogForm.timeExpList.length){
            const arr = this.dialogForm.timeExpList.map((i) => {
              return [i.startTime, i.endTime]
            })
            this.$set(this.dialogForm, 'timeIntervals2', arr)
          } else {
            this.$set(this.dialogForm, 'timeIntervals2', [])
          }
          this.state = '编辑'
          this.dialogVisible = true
        }
      })
    },
    add() {
      this.$prompt('请输入设备协议名称', '新增', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '设备协议名称不能为空'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '协议名称是: ' + value
        })
      })
    },
    disable(id) {
      this.modifyStatus(id, 'DISABLE')
    },
    enable(id) {
      this.modifyStatus(id, 'ENABLE')
    },
    modifyStatus(eventRuleId, status) {
      modifyStatusScene({ eventRuleId, status, deviceId: this.form.prodId }).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    del(eventRuleId) {
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteScene({ eventRuleId, deviceId: this.form.prodId }).then(async(res) => {
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
        this.dialogForm.classify = '1'
        if (this.dialogForm.timeIntervals2 && this.dialogForm.timeIntervals2.length) {
          const arr = []
          this.dialogForm.timeIntervals2.forEach((item) => {
            if (item[0] !== '' && item[1] !== '') {
              arr.push({ startTime: item[0], endTime: item[1] })
            }
          })
          this.dialogForm.timeIntervals = arr
        }
        if (this.state === '创建') {
          createScene(this.dialogForm).then((res) => {
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
          updateScene(this.dialogForm).then((res) => {
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
        eventRuleName: '',
        eventLevel: '3',
        eventNotify: '1',
        status: 'ENABLE',
        remark: '',
        expLogic: 'or',
        triggerType: '0',
        scheduleConf: '',
        timeIntervals: null,
        timeIntervals2: [],
        expList: [
          {
            deviceId: '',
            productAttrId: '',
            incident: '',
            condition: '=',
            productAttrType: '属性',
            function: 'last',
            value: '',
            period: '时间',
            unit: 'm',
            scope: ''
          }
        ],
        deviceServices: []
      }
      this.$refs.sceneForm.reset()
    },
    upload(id) {

    },
    republish(id) {

    },
    unpublish(id) {

    },
    publish(id) {

    }
  }
}
</script>
<style lang="scss" scoped>
.module{
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
.table{
  font-size: 12px;
}
</style>
