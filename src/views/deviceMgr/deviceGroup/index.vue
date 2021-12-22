<!-- 设备组页面 -->
<template>
  <div class="deviceGroup">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>设备组</template>
      <template v-slot:subhead>设备组用来对设备进行分组。可以与用户组相结合，一起对数据权限进行精确控制。</template>
    </ListHeadTemplate>
    <SearchForm v-if="!dialogVisible" :params="formParams" :buttons="buttons" :batch-buttons="batchButtons" :selected="ids.length > 0" :columns="columns" @search="search" @cancel="ids = []" />
    <BusinessTable
      v-if="!dialogVisible"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :selection="true"
      :icon="$route.meta.icon24"
      @detail="detail"
      @select="handleSelect"
    />
    <Pagination v-if="!dialogVisible" :total="total" :size="form.maxRow" :current-page="form.page" @handleCurrentChange="handleCurrentChange" />
    <div v-if="dialogVisible">
      <FormTemplate :up="'设备组列表'" :state="state + '设备组'" :but-loading="butLoading" @submit="handleSubmit" @cancel="close">
        <template v-slot:main>
          <el-form ref="deviceGroupForm" :rules="deviceGroupRules" :model="item" label-width="80px" class="dialog-form">
            <el-form-item label="设备组名" prop="name">
              <el-input v-model="item.name" size="mini" />
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
import { getDeviceGrpByPage, createDeviceGroup, updateDeviceGroup, deleteDeviceGroup } from '@/api/deviceMgr'
export default {
  provide() {
    return {
      farther: this
    }
  },
  name: 'DeviceGroup',
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
        maxRow: 20,
        page: 1
      },
      tableData: [],
      loading: false,
      butLoading: false,
      total: 0,
      ids: [],
      state: '',
      dialogVisible: false,
      item: {
        deviceGroupId: '',
        name: '',
        remark: ''
      },
      columns: [
        {
          label: '组名',
          prop: 'name',
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
          show: true,
          idName: 'deviceGroupId',
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
      deviceGroupRules: {
        name: [
          { required: true, message: '请输入设备组名', trigger: 'blur' }
        ]
      },
      formParams: [{
        componentName: 'InputTemplate',
        keyName: 'name',
        label: '设备组名称'
      }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.form.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getDeviceGrpByPage(this.form).then((res) => {
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
      this.ids = selection.map((i) => { return i.deviceGroupId })
    },
    close() {
      this.dialogVisible = false
      this.item = {
        deviceGroupId: '',
        name: '',
        remark: ''
      }
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    detail(item) {
      this.edit(item.deviceGroupId)
    },
    edit(id) {
      for (const item of this.tableData) {
        if (id === item.deviceGroupId) {
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
        deleteDeviceGroup({ deviceGroupIds: this.ids }).then(async(res) => {
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
      this.$refs.deviceGroupForm.validate(async(valid, errorFields) => {
        if (valid) {
          this.butLoading = true
          if (this.item.deviceGroupId) {
            updateDeviceGroup(this.item).then(async(res) => {
              if (res.code == 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.close()
                await this.getList()
              }
              this.butLoading = false
            }).catch((res) => {
              this.butLoading = false
            })
          } else {
            createDeviceGroup(this.item).then(async(res) => {
              if (res.code == 200) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.close()
                await this.getList()
              }
              this.butLoading = false
            }).catch((res) => {
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
.deviceGroup{
  height: 100%;
}
</style>
