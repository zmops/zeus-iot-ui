<!--详情-事件页面 -->
<template>
  <div class="incident">
    <SearchForm v-if="!dialogVisible" :params="formParams" :buttons="buttons" :columns="columns" @search="search"/>
    <BusinessTable
      v-if="!dialogVisible"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      :h="'calc(100% - 115px)'"
      @detail="detail"
    />
    <Pagination v-if="!dialogVisible" :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    <div v-if="dialogVisible">
      <FormTemplate :up="'事件列表'" :state="state + '事件'" :but-loading="butLoading" @submit="submit" @cancel="close">
        <template v-slot:main>
          <incidentForm v-if="dialogVisible" ref="incidentForm" v-model="dialogForm" :is-dev="isDev"/>
        </template>
      </FormTemplate>
    </div>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import incidentForm from '@/views/deviceMgr/device/incidentForm'
import FormTemplate from '@/components/Slots/FormTemplate'
import {
  createAttrEvent,
  detailAttrEvent,
  updateAttrEvent,
  getAttrEventByPage,
  deleteAttrEvent,
} from '@/api/deviceMgr'

export default {
  name: 'Incident',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    SearchForm,
    Pagination,
    incidentForm,
    FormTemplate
  },
  props: {
    isDev: Boolean
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'attrName',
          label: '事件名称'
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
      total: 0,
      size: 10,
      page: 1,
      dialogVisible: false,
      dialogForm: {
        eventLevel: '1'
      },
      state: '',
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      columns: [
        {
          label: '事件名称',
          prop: 'attrName',
          event: 'detail',
          show: true
        },
        {
          label: '标识符',
          prop: 'key',
          show: true
        },
        {
          label: '来自产品',
          prop: 'templateId',
          show: true
        },
        // {
        //   label: '事件级别',
        //   prop: 'eventLevelName',
        //   show: true
        // },
        {
          label: '数据类型',
          prop: 'valueTypeName',
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
          width: 180,
          idName: 'attrId',
          buttons: [
            {
              label: '编辑',
              event: 'edit',
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
    this.getList()
  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getAttrEventByPage({
        ...this.form,
        prodId: this.$route.query.id,
        maxRow: this.size,
        page: this.page
      }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    detail(item) {
      this.edit(item.attrId)
    },
    edit(attrId) {
      detailAttrEvent({attrId}).then((res) => {
        if (res.code == 200) {
          this.dialogForm = res.data
          this.state = '编辑'
          this.dialogVisible = true
        }
      })
    },
    delete(attrId) {
      const i = this.tableData.find((item) => {
        return item.attrId === attrId
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
          deleteAttrEvent({ attrIds: [attrId] }).then(async(res) => {
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
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    submit() {
      if (this.$refs.incidentForm.validateForm()) {
        this.butLoading = true
        if (this.state === '编辑') {
          updateAttrEvent(this.dialogForm).then(async(res) => {
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
          createAttrEvent(this.dialogForm).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '添加成功',
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
      this.dialogForm = { eventLevel: '1' }
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.incident{
  height: 100%;
}
</style>
