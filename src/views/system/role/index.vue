<!-- 角色管理页面 -->
<template>
  <div class="role">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>角色管理</template>
      <template v-slot:subhead>角色用来实现对操作权限的控制。</template>
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
    <!-- <Pagination :total="total" :size="form.size" :current-page="form.page" @handleCurrentChange="handleCurrentChange" /> -->
    <div v-if="dialogVisible">
      <FormTemplate :up="'角色列表'" :state="state + '角色'" :but-loading="butLoading" @submit="handleSubmit" @cancel="close">
        <template v-slot:main>
          <el-form ref="roleForm" :rules="roleRules" :model="item" label-width="80px" class="dialog-form">
            <el-form-item label="角色名" prop="name">
              <el-input v-model="item.name" size="mini" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="item.remark" type="textarea" rows="2" size="mini" />
            </el-form-item>
          </el-form>
        </template>
      </FormTemplate>
    </div>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogMenu"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
      @close="menuClose"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_edit" />
          授权菜单
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogMenu = false" />
        </div>
      </div>
      <div class="dialog-body dialog-tree">
        <el-tree ref="menuTree" :data="menuTree" node-key="id" :props="TreeProps" :default-expand-all="true" show-checkbox :check-strictly="checkStrictly" />
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogMenu = false">取 消</el-button>
        <el-button :disabled="butLoading" type="primary" size="mini" round @click="menuSubmit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import SearchForm from '@/components/Basics/SearchForm'
import BusinessTable from '@/components/Basics/BusinessTable'
import FormTemplate from '@/components/Slots/FormTemplate'
// import Pagination from '@/components/Basics/Pagination'
import { getRoleList, createRole, updateRole, deleteRole, roleBoundMenu, roleBindMenu } from '@/api/system'
export default {
  provide() {
    return {
      farther: this
    }
  },
  name: 'Role',
  components: {
    ListHeadTemplate,
    SearchForm,
    BusinessTable,
    FormTemplate
    // Pagination
  },
  data() {
    return {
      tableData: [],
      loading: false,
      butLoading: false,
      dialogVisible: false,
      dialogMenu: false,
      state: '',
      total: 0,
      ids: [],
      form: {
        name: ''
        // size: 10,
        // page: 1
      },
      item: {
        name: '',
        remark: '',
        roleId: ''
      },
      columns: [
        {
          label: '角色名',
          prop: 'name',
          event: 'detail',
          show: true
        },
        {
          label: '备注',
          prop: 'remark',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          width: 220,
          show: true,
          idName: 'roleId',
          buttons: [
            {
              label: '授权菜单',
              event: 'empower',
              icon: 'list_auth'
            },
            {
              label: '编辑',
              event: 'edit',
              icon: 'list-edit'
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
          label: '删除',
          event: 'del'
        }
      ],
      roleRules: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ]
      },
      menuTree: [],
      menuIdList: [],
      menuId: '',
      checkStrictly: true,
      TreeProps: {
        children: 'childrenNodes',
        label: 'name'
      },
      formParams: [{
        componentName: 'InputTemplate',
        keyName: 'name',
        label: '角色名称'
      }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      // this.from.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getRoleList(this.form).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // handleCurrentChange(val) {
    //   this.form.page = val
    //   this.getList()
    // }
    handleSelect(selection) {
      this.ids = selection.map((i) => { return i.roleId })
    },
    close() {
      this.dialogVisible = false
      this.item = {
        roleId: '',
        groupName: '',
        remark: ''
      }
    },
    add() {
      this.item = {
        roleId: '',
        groupName: '',
        remark: ''
      }
      this.state = '创建'
      this.dialogVisible = true
    },
    detail(item) {
      this.edit(item.roleId)
    },
    edit(id) {
      for (const item of this.tableData) {
        if (id === item.roleId) {
          this.item = Object.assign({}, item)
        }
      }
      this.state = '编辑'
      this.dialogVisible = true
    },
    del() {
      this.$confirm('是否确认删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({ roleIds: this.ids }).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            // 删除后重新请求数据
            this.ids = []
            await this.getList()
          }
        })
      })
    },
    handleSubmit() {
      this.$refs.roleForm.validate(async(valid, errorFields) => {
        if (valid) {
          this.butLoading = true
          if (this.item.roleId) {
            updateRole(this.item).then(async(res) => {
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
            createRole(this.item).then(async(res) => {
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
    menuClose() {
      this.dialogMenu = false
      this.menuTree = []
      this.menuId = ''
      this.checkStrictly = true
    },
    empower(id) {
      this.dialogMenu = true
      this.menuId = id
      this.menuIdList = []
      roleBoundMenu({ roleId: this.menuId }).then(res => {
        if (res.code == 200) {
          this.menuTree = res.data
          for (const item of res.data) {
            this.treeReset(item)
          }
          this.$refs.menuTree.setCheckedKeys(this.menuIdList, true)
          this.checkStrictly = false
        }
      })
    },
    treeReset(item) {
      if (item.isChecked) {
        this.menuIdList.push(item.id)
      }
      if (item.childrenNodes) {
        for (const item of item.childrenNodes) {
          this.treeReset(item)
        }
      }
    },
    async menuSubmit() {
      let menuIdList = []
      let menuChildList = []
      let menuHalfList = []
      menuChildList = this.$refs.menuTree.getCheckedKeys()
      menuHalfList = this.$refs.menuTree.getHalfCheckedKeys()
      menuIdList = menuChildList.concat(menuHalfList)
      if (!menuIdList.length) {
        this.$message({
          type: 'error',
          message: '请选择菜单'
        })
      } else {
        this.butLoading = true
        await roleBindMenu({
          roleId: this.menuId,
          menuIds: menuIdList
        }).then((res) => {
          if (res.code == '200') {
            this.$message({
              type: 'success',
              message: '编辑菜单成功'
            })
            this.menuClose()
          }
          this.butLoading = false
        }).catch(() => {
          this.butLoading = false
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.role{
  height: 100%;
}
</style>
