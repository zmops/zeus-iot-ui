<!-- 三方授权页面 -->
<template>
  <div class="thirdAuth">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>三方授权</template>
      <template v-slot:subhead>三方授权后，三方平台可以通过授权码获取本平台的API权限。</template>
    </ListHeadTemplate>
    <SearchForm :params="formParams" :columns="columns" :buttons="buttons" :batch-buttons="batchButtons" :selected="ids.length > 0" @search="search" @cancel="ids = []"/>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :selection="true"
      :icon="$route.meta.icon24"
      @select="handleSelect"
      @switchChange="switchChange"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
      @closed="dialogForm.name = ''"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_add"/>
          创建三方授权
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="80px" label-position="top" class="dialog-form">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogForm.name" size="mini"/>
          </el-form-item>
          <el-form-item label="过期时间" prop="time">
            <el-date-picker
              v-model="dialogForm.time"
              size="mini"
              type="datetime"
              placeholder="选择过期时间">
            </el-date-picker>
            <div class="el-form-item-tips zeus-inline-block zeus-ml-15">
              <svg-icon icon-class="tips" class="icon" />不填则不会过期
            </div>
          </el-form-item>
          <el-form-item label="启用" prop="status">
            <el-switch
              v-model="dialogForm.status"
              active-value="ENABLE"
              inactive-value="DISABLE"
              active-text="启用"
              inactive-text="禁用"
              active-color="#55BC8A"
              inactive-color="#AB2F29">
            </el-switch>
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini"/>
          </el-form-item>
        </el-form>
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
// import {createProxy, deleteProxy, getProxyByPage, updateProxy} from '@/api/system'

export default {
  name: 'ThirdAuth',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    ListHeadTemplate,
    BusinessTable,
    SearchForm,
    Pagination
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
      tableData: [
        {
          id: 1,
          name: '假数据',
          status: 'ENABLE',
          time1: '2021-09-02 00:00:00',
          time2: '2021-09-02 00:00:00',
          time3: '2021-09-02 00:00:00'
        },
        {
          id: 2,
          name: '假数据2',
          status: 'DISABLE',
          time1: '2021-09-02 00:00:00',
          time2: '2021-09-02 00:00:00',
          time3: '2021-09-02 00:00:00'
        }
      ],
      loading: false,
      dialogVisible: false,
      state: '',
      total: 0,
      size: 10,
      page: 1,
      dialogForm: {
        name: '',
        time: null,
        status: 'ENABLE',
        remark: ''
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
          {required: true, message: '请输入名称', trigger: 'blur'},
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'change'},
        ]
      },
      columns: [
        {
          label: '名称',
          prop: 'name',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          status: true,
          show: true
        },
        {
          label: '过期时间',
          prop: 'time1',
          show: true
        },
        {
          label: '创建时间',
          prop: 'time2',
          show: true
        },
        {
          label: '末次调用时间',
          prop: 'time3',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 160,
          idName: 'id',
          buttons: [
            {
              label: '生成token',
              event: 'createToken',
              icon: 'list_token'
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
      // this.loading = true
      // getProxyByPage({...this.form, maxRow: this.size, page: this.page}).then((res) => {
      //   this.loading = false
      //   if (res.code == 200) {
      //     this.tableData = res.data
      //     this.total = res.count
      //   }
      // }).catch(() => {
      //   this.loading = false
      // })
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
    switchChange(val) {
      console.log(val)
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
        // deleteProxy({ids: this.ids}).then(async (res) => {
        //   if (res.code == 200) {
        //     this.$message({
        //       message: '删除成功',
        //       type: 'success'
        //     })
        //     this.ids = []
        //     // 删除后重新请求数据
        //     await this.getList()
        //   }
        // })
      })
    },
    createToken(id) {
      this.$confirm('确认生成新的token? 本授权之前的token将会失效', '生成token', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const i = this.tableData.find((item) => {
          return item.id === id
        })

        this.$alert('<h4>token: sfasdfadfadfadfadsfadsfdsfdafasdfdasf</h4><div class="el-form-item-tips"><svg-icon icon-class="tips" />请自行保存token，关闭本窗口后将无法再查看本token。</div>', '生成token', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '复制',
          callback: action => {
            this.$message({
              type: 'info',
              message: `复制成功`
            })
          }
        })
      })
    },
    submit() {
      return
      this.$refs.dialogForm.validate(async (valid, errorFields) => {
        if (valid) {
          if (this.dialogForm.id) {
            // updateProxy({name: this.dialogForm.name, id: this.dialogForm.id}).then(async (res) => {
            //   if (res.code == 200) {
            //     this.$message({
            //       message: '修改成功',
            //       type: 'success'
            //     })
            //     this.dialogVisible = false
            //     await this.getList()
            //   }
            // })
          } else {
            // createProxy({name: this.dialogForm.name}).then(async (res) => {
            //   if (res.code == 200) {
            //     this.$message({
            //       message: '添加成功',
            //       type: 'success'
            //     })
            //     this.dialogVisible = false
            //     await this.getList()
            //   }
            // })
          }
        }
      })
    }
  }
}
</script>

