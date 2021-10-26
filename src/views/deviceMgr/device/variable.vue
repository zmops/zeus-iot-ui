<!-- 详情-变量页面 -->
<template>
  <div class="variable">
    <SearchForm :buttons="buttons" :columns="columns"/>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      @detail="detail"
    />
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
      @closed="close"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_edit"/>
          {{ state }}变量
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false"/>
        </div>
      </div>
      <div class="tips">
        <svg-icon icon-class="tips" class="icon" />
        <span>可设置自定义变量，适用于同一产品不同设备下，键相同而值可能不同的情况，以方便取用。</span>
      </div>
      <div class="dialog-body">
        <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="80px" label-position="top" class="form">
          <el-form-item label="键" prop="key">
            <span class="zeus-bold">{$ </span>
            <el-input v-model="dialogForm.key" size="mini" class="macro" />
            <span class="zeus-bold"> }</span>
          </el-form-item>
          <el-form-item label="值" prop="value">
            <el-input v-model="dialogForm.value" size="mini"/>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="dialogForm.description" type="textarea" rows="2" size="mini"/>
          </el-form-item>
        </el-form>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button :disabled="butLoading" type="primary" size="mini" round @click="handleSubmit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import { deleteMacro, getMacroByPage, createMacro, updateMacro } from '@/api/deviceMgr'

export default {
  name: 'Variable',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    SearchForm
  },
  props: {
    isDev: Boolean
  },
  data() {
    return {
      rules: {
        key: [
          { required: true, message: '请输入键', trigger: 'blur' },
          { pattern: /^[0-9A-Z_]{1,}$/, message: '只能输入大写字母或数字或_' }
        ],
        value: [
          { required: true, message: '请输入值', trigger: 'blur' }
        ]
      },
      dialogForm: {
        description: '',
        value: '',
        key: ''
      },
      tableData: [],
      loading: false,
      butLoading: false,
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      columns: [
        {
          label: '变量名称',
          event: 'detail',
          prop: 'macro',
          show: true
        },
        {
          label: '值',
          prop: 'value',
          show: true
        },
        {
          label: '描述',
          prop: 'description',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 180,
          idName: 'hostmacroid',
          fixed: 'right',
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
      ],
      state: '',
      dialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getMacroByPage({
        deviceId: this.$route.query.id
      }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
        }
      }).catch(() => {
        this.loading = false
      })
    },
    delete(hostmacroid) {
      const i = this.tableData.find((item) => {
        return item.hostmacroid === hostmacroid
      })
      if (i.inherit == '1') {
        this.$message({
          message: '当前变量不可删除',
          type: 'warning'
        })
        return false
      }
      this.$confirm('是否确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMacro({ hostmacroid }).then(async(res) => {
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
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    detail(item) {
      this.edit(item.hostmacroid)
    },
    edit(id) {
      const i = this.tableData.find((item) => {
        return item.hostmacroid === id
      })
      // if (i.inherit == '1') {
      //   this.$message({
      //     message: '当前变量不可编辑',
      //     type: 'warning'
      //   })
      //   return false
      // }
      const data = JSON.parse(JSON.stringify(i))
      let macro = data.macro.substring(2)
      macro = macro.substring(0, macro.length - 1)
      data.key = macro
      this.dialogForm = data
      this.state = '编辑'
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.butLoading = true
          this.dialogForm.deviceId = this.$route.query.id
          this.dialogForm.macro = '{$' + this.dialogForm.key + '}'
          if (this.state === '编辑') {
            updateMacro(this.dialogForm).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.dialogVisible = false
                this.getList()
              }
              this.butLoading = false
            }).catch(() => {
              this.butLoading = false
            })
          } else {
            createMacro(this.dialogForm).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.dialogVisible = false
                this.getList()
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
      this.dialogForm = {
        description: '',
        value: '',
        key: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.variable {
  width: 100%;
  min-height: 70px;
  background-color: #fff;
  padding: 17px 16px 4px 16px;
  box-shadow: 6px 8px 16px #E2EAF2;

  .tips{
    width: 100%;
    height: 32px;
    line-height: 32px;
    background-color: #CDE5FF;
    color: #36435C;
    font-size: 12px;
    padding-left: 20px;

    .icon{
      margin-right: 4px;
    }
  }

  .form{
    width: 600px;
    .macro{
      width: 572px;
    }
  }
}
</style>
