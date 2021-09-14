<!--场景联动页面-->
<template>
  <div class="scene">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>场景联动</template>
      <template v-slot:subhead>对场景联动规则进行管理。可以实现跨设备的业务逻辑。当属性、事件满足设定规则时，自动实现联动功能。</template>
    </ListHeadTemplate>
    <SearchForm :params="formParams" :buttons="buttons" :batch-buttons="batchButtons" :selected="ids.length > 0" :columns="columns" @search="search"/>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      :selection="true"
      @select="handleSelect"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    <el-dialog
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
      @close="close"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon v-if="state === '创建'" icon-class="dialog_add" />
          <svg-icon v-if="state === '编辑'" icon-class="dialog_edit" />
          {{ state }}场景联动
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="dialog-body">
        <sceneForm v-model="dialogForm" />
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="submit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>
<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import sceneForm from '@/views/rule/scene/sceneForm'
import {getAttrTrapperList, getDeviceList} from "@/api/deviceMgr";

export default {
  name: "scene",
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
    sceneForm
  },
  data() {
    return {
      formParams: [],
      columns: [
        {
          label: '场景联动名称',
          prop: 'name',
          show: true
        },
        {
          label: '级别',
          prop: 'mark',
          show: true
        },
        {
          label: '相关属性',
          prop: 'asyncName',
          show: true
        },
        {
          label: '启用状态',
          prop: 'remark',
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
          width: 160,
          idName: 'id',
          fixed: 'right',
          buttons: [
            {
              label: '编辑',
              event: 'detail',
              icon: 'list-edit'
            }
          ]
        }
      ],
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      form: {
        deviceId: null,
        attrId: '',
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
      dialogForm: {}
    }
  },
  watch: {
    'form.deviceId': {
      immediate: true,
      async handler(val) {
        this.form.attrId = ''
        let attrTemplate = []
        if (val !== '') {
          await getAttrTrapperList({prodId: val}).then((res) => {
            if (res.code == 200) {
              attrTemplate = res.data
            }
          })
        }
        this.formParams = [
          {
            componentName: 'SelectTemplate',
            keyName: 'deviceId',
            label: '设备',
            optionId: 'deviceId',
            optionName: 'name',
            options: this.devList
          },
          {
            componentName: 'SelectTemplate',
            keyName: 'attrId',
            label: '属性',
            optionId: 'attrId',
            optionName: 'attrName',
            options: attrTemplate
          },
          {
            componentName: 'InputTemplate',
            keyName: 'name',
            label: '场景联动名称'
          }
        ]
      }
    }
  },
  created() {
    this.searchInit()
  },
  methods: {
    searchInit() {
      getDeviceList({}).then((res) => {
        if (res.code == 200) {
          this.devList = res.data
          this.form.deviceId = ''
        }
      })
    },
    search() {
      this.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    getList() {
      // this.loading = true
      // getServiceByPage({ ...this.form, maxRow: this.size, page: this.page, prodId: this.prodId }).then((res) => {
      //   this.loading = false
      //   if (res.code == 200) {
      //     this.tableData = res.data
      //     this.total = res.count
      //   }
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    handleSelect(selection) {
      this.ids = selection.map((i) => { return i.id })
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    submit() {

    },
    close() {

    },
  }
}
</script>

<style lang="scss" scoped>
.scene {

}
</style>
