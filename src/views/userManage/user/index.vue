<!-- 用户页面 -->
<template>
  <div class="user">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>用户管理</template>
      <template v-slot:subhead>用户可以属于多个用户组，以方便对数据权限进行管理。</template>
    </ListHeadTemplate>
    <SearchForm v-if="!dialogVisible" :params="formParams" :buttons="buttons" :batch-buttons="batchButtons" :selected="ids.length > 0" :columns="columns" @search="search" @cancel="ids = []" />
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
    <Pagination v-if="!dialogVisible" :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange" />
    <div v-if="dialogVisible">
      <FormTemplate :up="'用户列表'" :state="state + '用户'" :but-loading="butLoading" @submit="handleSubmit" @cancel="close">
        <template v-slot:main>
          <el-form ref="userForm" :rules="rules" :model="item" label-width="80px" class="dialog-form">
            <el-form-item label="帐号" prop="account">
              <el-input v-model="item.account" size="mini" :disabled="state === '编辑'" />
            </el-form-item>
            <el-form-item label="昵称" prop="name">
              <el-input v-model="item.name" size="mini" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="item.email" size="mini" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model.number="item.phone" size="mini" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="item.status" placeholder="请选择" size="mini" class="zeus-w100">
                <el-option label="启用" value="ENABLE" />
                <el-option label="禁用" value="DISABLE" />
              </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="item.roleId" placeholder="请选择角色" size="mini" class="zeus-w100">
                <el-option v-for="( i, index) in roleData" :key="index" :label="i.name" :value="i.roleId" />
              </el-select>
            </el-form-item>
            <el-form-item label="用户组" prop="userGroupId">
              <el-select v-model="item.userGroupId" placeholder="请选择用户组" size="mini" class="zeus-w100">
                <el-option v-for="( i, index) in groupData" :key="index" :label="i.groupName" :value="i.userGroupId" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="!item.userId" label="密码" prop="pass">
              <el-input v-model="item.pass" type="password" size="mini" />
            </el-form-item>
            <el-form-item v-if="!item.userId" label="确认密码" prop="password1">
              <el-input v-model="item.password1" type="password" size="mini" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="item.remark" type="textarea" rows="2" size="mini" />
            </el-form-item>
          </el-form>
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
import FormTemplate from '@/components/Slots/FormTemplate'
import { deleteUser, updateUser, createUser, getUserList, getUsrGrpList, getRoleList, resetPass } from '@/api/system'

export default {
  name: 'User',
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
    FormTemplate
  },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.item.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      columns: [
        {
          label: '帐号',
          prop: 'account',
          event: 'detail',
          show: true
        },
        {
          label: '用户昵称',
          prop: 'name',
          bold: true,
          show: true
        },
        {
          label: '用户组',
          prop: 'userGroupName',
          show: true
        },
        {
          label: '租户',
          prop: 'tenantName',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          status: true,
          show: true
        },
        {
          label: '角色',
          prop: 'roleName',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 210,
          idName: 'userId',
          buttons: [
            {
              label: '编辑',
              event: 'edit',
              icon: 'list-edit'
            },
            {
              label: '重置密码',
              event: 'reset',
              icon: 'list_reset'
            }
          ]
        }
      ],
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
          label: '删除用户',
          event: 'delete'
        }
      ],
      loading: false,
      butLoading: false,
      total: 0,
      size: 10,
      page: 1,
      dialogVisible: false,
      ids: [],
      state: '',
      rules: {
        account: [
          { required: true, message: '请输入帐号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        userGroupId: [
          { required: true, message: '请选择用户组', trigger: 'change' }
        ],
        roleId: [
          { required: true, message: '请请选择角色', trigger: 'change' }
        ],
        password1: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      sc: '',
      item: {
        account: '',
        name: '',
        email: '',
        roleId: '',
        phone: '',
        status: 'ENABLE',
        password1: '',
        pass: '',
        userGroupId: '',
        remark: ''
      },
      roleData: [],
      groupData: [],
      form: {
        name: ''
      },
      formParams: [{
        componentName: 'InputTemplate',
        keyName: 'name',
        label: '昵称'
      }]
    }
  },
  created() {
    this.getList()
    this.getGroupList()
    this.getRoleData()
  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    /* 获取用户列表*/
    getList() {
      this.loading = true
      getUserList({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    /* 获取用户组 */
    getGroupList() {
      getUsrGrpList().then((res) => {
        if (res.code == 200) {
          this.groupData = res.data
        }
      })
    },
    /* 获取角色 */
    getRoleData() {
      getRoleList().then((res) => {
        if (res.code == 200) {
          this.roleData = res.data
        }
      })
    },
    handleCurrentChange(val) {
      this.page = val

      this.getList()
    },
    /* 关闭弹窗的回调 */
    close() {
      this.dialogVisible = false
      this.item = {
        account: '',
        name: '',
        email: '',
        roleId: '',
        phone: '',
        password1: '',
        status: 'ENABLE',
        pass: '',
        userGroupId: '',
        remark: ''
      }
      this.$refs.userForm.resetFields()
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    detail(item) {
      this.edit(item.userId)
    },
    edit(id) {
      const i = this.tableData.find((item) => {
        return item.userId === id
      })
      this.item = JSON.parse(JSON.stringify(i))
      this.state = '编辑'
      this.dialogVisible = true
    },
    /* 重置密码 */
    reset(userId) {
      this.$confirm('是否确认重置该用户的密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPass({ userId }).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '密码重置成功',
              type: 'success'
            })
            await this.getList()
          }
        })
      })
    },
    delete() {
      this.$confirm('是否确认删除选中的用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ userIds: this.ids }).then(async(res) => {
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
    handleSelect(selection) {
      this.ids = selection.map((i) => { return i.userId })
    },
    handleSubmit() {
      this.$refs.userForm.validate(async(valid, errorFields) => {
        if (valid) {
          this.butLoading = true
          const { pass } = this.item
          if (this.item.userId) {
            updateUser(this.item).then(async(res) => {
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
            createUser({ ...this.item, password: this.$stringToHex(pass) }).then(async(res) => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  width: 100%;
  height: 100%;
}
.w100{
  width: 100%;
}
</style>
