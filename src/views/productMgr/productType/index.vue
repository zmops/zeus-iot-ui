<!-- 产品分类页面 -->
<template>
  <div class="product-type">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>产品分类</template>
      <template v-slot:subhead>产品分类用来对产品进行分组。当产品比较多时，合理利用产品分类会使产品的管理工作更加高效。</template>
    </ListHeadTemplate>
    <SearchForm v-if="!dialogVisible" :buttons="buttons" :batch-buttons="batchButtons" :selected="ids.length > 0" @cancel="ids = []" />
    <el-table
      v-if="!dialogVisible"
      ref="businessTable"
      v-loading="loading"
      :data="tableData"
      :height="'calc(100% - 185px)'"
      stripe
      row-key="nodeId"
      :tree-props="{children: 'childrenNodes'}"
    >
      <el-table-column prop="name" label="名称">
        <template slot-scope="props">
          <svg-icon :icon-class="$route.meta.icon24" class="icon24" :style="{marginLeft: props.row.childrenNodes === null && props.row.pid === '0' ? '23px' : '0' }" />
          <span class="event" @click="edit(props.row)">{{ props.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUserName" label="创建人">
        <template slot-scope="scope">
          {{scope.row.createUserName ? scope.row.createUserName : '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime ? scope.row.createTime : '-'}}
        </template>
      </el-table-column>
      <el-table-column width="180">
        <template slot-scope="scope">
          <div class="setting-buttons">
            <el-button
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="edit(scope.row)"
            >
              <svg-icon icon-class="list-edit" />
              编辑</el-button>
            <el-button
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="del(scope.row.id)"
            >
              <svg-icon icon-class="list-del" />
              删除</el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>
    <div v-if="dialogVisible">
      <FormTemplate :up="'产品分类列表'" :state="state + '产品分类'" :but-loading="butLoading" @submit="handleSubmit" @cancel="close">
        <template v-slot:main>
          <el-form ref="userForm" :rules="rules" :model="dialogForm" label-width="80px" class="dialog-form">
            <el-form-item label="名称" prop="name">
              <el-input v-model="dialogForm.name" size="mini" />
            </el-form-item>
            <el-form-item label="上级分类" prop="pIds">
              <el-cascader
                v-model="dialogForm.pIds"
                clearable
                size="mini"
                class="zeus-w100"
                :options="tableData"
                :props="{ checkStrictly: true, value:'nodeId', label:'name', children:'childrenNodes' }"
              />
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
import FormTemplate from '@/components/Slots/FormTemplate'
import { deleteProductType, updateProductType, createProductType, getProductTypeTree } from '@/api/porductMgr'

export default {
  name: 'ProductType',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    ListHeadTemplate,
    SearchForm,
    FormTemplate
  },
  data() {
    return {
      tableData: [],
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
      loading: false,
      butLoading: false,
      dialogVisible: false,
      ids: [],
      state: '',
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      dialogForm: {
        name: '',
        pIds: null,
        pid: null
      },
      form: {
        name: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /* 获取列表*/
    getList() {
      this.loading = true
      getProductTypeTree().then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
        }
      }).catch(() => {
        this.loading = false
      })
    },

    /* 关闭弹窗的回调 */
    close() {
      this.dialogVisible = false
      this.dialogForm = {
        name: '',
        pIds: null,
        pid: null
      }
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    edit(item) {
      if (item.pids) {
        const x = item.pids.replace(/\[|]/g, '').split(',')
        x.shift()
        x.pop()
        item.pIds = x
      }
      this.dialogForm = JSON.parse(JSON.stringify(item))
      this.state = '编辑'
      this.dialogVisible = true
    },
    del(id) {
      this.$confirm('是否确认删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProductType({ ids: [id] }).then(async(res) => {
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
      this.ids = selection.map((i) => { return i.nodeId })
    },
    handleSubmit() {
      this.$refs.userForm.validate(async(valid) => {
        if (valid) {
          this.butLoading = true
          const pIds = this.dialogForm.pIds
          if (pIds && pIds.length) {
            this.dialogForm.pid = pIds[pIds.length - 1]
          }
          if (this.dialogForm.nodeId) {
            updateProductType(this.dialogForm).then(async(res) => {
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
            createProductType(this.dialogForm).then(async(res) => {
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
.product-type {
  width: 100%;
  height: calc(100vh - 88px);
  .icon24{
    font-size: 24px;
    margin-right: 10px;
    position: relative;
    top: 3px;
  }

  .event{
    color: #409eff;
    cursor: pointer;
  }
}
::v-deep.el-table{
  font-size: 12px;
}
</style>
