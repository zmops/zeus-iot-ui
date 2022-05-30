<!--场景联动页面-->
<template>
  <div class="scene">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>场景联动</template>
      <template v-slot:subhead>对场景联动规则进行管理。可以实现跨设备的业务逻辑。当属性、事件满足设定规则时，自动实现联动功能。</template>
    </ListHeadTemplate>
    <SearchForm v-if="!dialogVisible" :params="formParams" :buttons="buttons" :batch-buttons="batchButtons" :columns="columns" @search="search"/>
    <BusinessTable
      v-if="!dialogVisible"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      @detail="detail"
    />
    <Pagination v-if="!dialogVisible" :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    <div v-if="dialogVisible">
      <FormTemplate :up="'场景联动列表'" :state="state + '场景联动'" :width="1050" :but-loading="butLoading" @submit="submit" @cancel="close">
        <template v-slot:main>
          <sceneForm ref="sceneForm" v-model="dialogForm" />
        </template>
      </FormTemplate>
    </div>
  </div>
</template>
<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import sceneForm from '@/views/rule/scene/sceneForm'
import FormTemplate from '@/components/Slots/FormTemplate'
import { getSceneByPage, createScene, deleteScene, detailScene, modifyStatusScene, updateScene } from '@/api/scene'

export default {
  name: 'scene',
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
    sceneForm,
    FormTemplate
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'eventRuleName',
          label: '场景联动名称'
        }
      ],
      columns: [
        {
          label: '场景联动名称',
          prop: 'eventRuleName',
          event: 'detail',
          show: true
        },
        // {
        //   label: '级别',
        //   prop: 'eventLevelName',
        //   show: true
        // },
        // {
        //   label: '相关属性',
        //   prop: 'asyncName',
        //   show: true
        // },
        {
          label: '触发设备',
          prop: 'triggerDevice',
          show: true
        },
        {
          label: '执行设备',
          prop: 'executeDevice',
          show: true
        },
        {
          label: '启用状态',
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
          label: '',
          prop: 'buttons',
          show: true,
          width: 270,
          idName: 'eventRuleId',
          buttons: [
            {
              label: '复制',
              event: 'copy',
              icon: 'list_copy'
            },
            {
              label: '删除',
              event: 'delete',
              icon: 'list-del'
            },
            {
              label: '启用',
              event: 'enable',
              icon: 'list-enable'
            },
            {
              label: '禁用',
              event: 'disable',
              icon: 'list-disable'
            }
          ]
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
        expLogic: 'and',
        timeIntervals: null,
        timeIntervals2: [],
        isVacationStrategy: true,
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
              let dayOfWeeks = []
              if (i.dayOfWeeks) {
                dayOfWeeks = i.dayOfWeeks.split(',')
              }
              return { time: [i.startTime, i.endTime], dayOfWeeks }
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
      this.state = '创建'
      this.dialogVisible = true
    },
    copy(eventRuleId) {
      detailScene({ eventRuleId, deviceId: this.form.prodId }).then((res) => {
        if (res.code == 200) {
          this.dialogForm = res.data
          if (this.dialogForm.timeExpList && this.dialogForm.timeExpList.length){
            const arr = this.dialogForm.timeExpList.map((i) => {
              let dayOfWeeks = []
              if (i.dayOfWeeks) {
                dayOfWeeks = i.dayOfWeeks.split(',')
              }
              this.$delete(i, 'eventRuleId')
              return { time: [i.startTime, i.endTime], dayOfWeeks }
            })
            this.$set(this.dialogForm, 'timeIntervals2', arr)
          } else {
            this.$set(this.dialogForm, 'timeIntervals2', [])
          }

          this.$delete(this.dialogForm, 'eventRuleId')
          this.state = '复制'
          this.dialogVisible = true
        }
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
    delete(eventRuleId) {
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
      if (this.$refs.sceneForm.validateForm()) {
        this.butLoading = true
        this.dialogForm.classify = '1'
        if (this.dialogForm.timeIntervals2 && this.dialogForm.timeIntervals2.length) {
          const arr = []
          this.dialogForm.timeIntervals2.forEach((i) => {
            const item = i.time
            const week = i.dayOfWeeks
            if (item[0] !== '' && item[1] !== '') {
              arr.push({ startTime: item[0], endTime: item[1], dayOfWeeks: week.join(',') })
            }
          })
          this.dialogForm.timeIntervals = arr
        }
        if (this.state === '创建' || this.state === '复制') {
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
        expLogic: 'and',
        triggerType: '0',
        scheduleConf: '',
        timeIntervals: null,
        timeIntervals2: [],
        isVacationStrategy: true,
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
    }
  }
}
</script>
<style lang="scss" scoped>
.scene{
  height: 100%;
}
</style>
