<!-- 用户组页面 -->
<template>
  <div class="user-group">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>用户组管理</template>
      <template v-slot:subhead>用户组用来对用户进行分组。可以与设备组相结合，一起对数据权限进行精确控制。</template>
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
    <Pagination v-if="!dialogVisible" :total="total" :size="form.maxRow" :current-page="form.page" @handleCurrentChange="handleCurrentChange" />
    <div v-if="dialogVisible">
      <FormTemplate :up="'用户组列表'" :state="state + '用户组'" :but-loading="butLoading" @submit="handleSubmit" @cancel="close">
        <template v-slot:main>
          <el-form ref="groupNameForm" :rules="groupNameRules" :model="item" label-width="80px" class="dialog-form">
            <el-form-item label="用户组名" prop="groupName">
              <el-input v-model="item.groupName" size="mini" />
            </el-form-item>
            <el-form-item label="设备组" prop="deviceGroupIds">
              <el-select v-model="item.deviceGroupIds" multiple filterable placeholder="请选择设备组" size="mini">
                <el-option
                  v-for="i in deviceGroup"
                  :key="i.deviceGroupId"
                  :label="i.name"
                  :value="i.deviceGroupId.toString()"
                />
              </el-select>
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
import SearchForm from '@/components/Basics/SearchForm'
import BusinessTable from '@/components/Basics/BusinessTable'
import Pagination from '@/components/Basics/Pagination'
import FormTemplate from '@/components/Slots/FormTemplate'
import { getUsrGrpByPage, createUserGroup, updateUserGroup, deleteUserGroup } from '@/api/system'
import { getDeviceGrpList } from '@/api/deviceMgr'
export default {
  provide() {
    return {
      farther: this
    }
  },
  name: 'UserGroup',
  components: {
    ListHeadTemplate,
    SearchForm,
    BusinessTable,
    Pagination,
    FormTemplate
  },
  data() {
    return {
      form: {
        name: '',
        maxRow: 10,
        page: 1
      },
      tableData: [],
      deviceGroup: [],
      loading: false,
      butLoading: false,
      total: 0,
      ids: [],
      state: '',
      columns: [
        {
          label: '组名',
          prop: 'groupName',
          event: 'detail',
          show: true
        },
        {
          label: '租户',
          prop: 'tenantName',
          show: true
        },
        {
          label: '备注',
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
          width: 120,
          idName: 'userGroupId',
          show: true,
          buttons: [
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
      groupNameRules: {
        groupName: [
          { required: true, message: '请输入用户组名', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      item: {
        userGroupId: '',
        deviceGroupIds: [],
        groupName: '',
        remark: ''
      },
      formParams: [{
        componentName: 'InputTemplate',
        keyName: 'groupName',
        label: '用户组名称'
      }]
    }
  },
  created() {
    this.getList()
    // 获取设备组列表
    getDeviceGrpList({}).then((res) => {
      if (res.code == 200) {
        this.deviceGroup = res.data
      }
    })
  },
  methods: {
    search() {
      this.form.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getUsrGrpByPage(this.form).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = Number(res.count)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.getList()
    },
    handleSelect(selection) {
      this.ids = selection.map((i) => { return i.userGroupId })
    },
    close() {
      this.dialogVisible = false
      this.item = {
        userGroupId: '',
        groupName: '',
        remark: ''
      }
    },
    detail(item) {
      this.edit(item.userGroupId)
    },
    edit(id) {
      for (const item of this.tableData) {
        if (id === item.userGroupId) {
          this.item = Object.assign({}, item)
        }
      }
      if (this.item.groupIds) {
        this.$set(this.item, 'deviceGroupIds', this.item.groupIds.split(','))
      }
      this.state = '编辑'
      this.dialogVisible = true
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    del() {
      this.$confirm('是否确认删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserGroup({ userGroupIds: this.ids }).then(async(res) => {
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
      this.$refs.groupNameForm.validate(async(valid, errorFields) => {
        if (valid) {
          this.butLoading = true
          this.$delete(this.item, 'groupIds')
          if (this.state === '编辑') {
            updateUserGroup(this.item).then(async(res) => {
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
            createUserGroup(this.item).then(async(res) => {
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
.user-group{
  height: 100%;
}
</style>
