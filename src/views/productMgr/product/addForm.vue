<!-- 产品表单页面 -->
<template>
  <div class="form-content">
    <div class="dialog-body">
      <el-form ref="productForm" :rules="productRules" :model="form" label-width="80px" label-position="top" class="dialog-form">
        <el-form-item label="产品ID" prop="prodCode">
          <el-input v-model="form.prodCode" size="mini" />
          <div class="el-form-item-tips">
            <i class="el-icon-info" />输入产品ID
          </div>
        </el-form-item>
        <el-form-item label="产品名称" prop="prodName">
          <el-input v-model="form.prodName" size="mini" />
        </el-form-item>
        <el-form-item label="产品分类" prop="groupId">
          <TreeSelect ref="tree" :default-props="treeProps" :data="treeData" @changeGroupId="changeGroupId" />
        </el-form-item>
        <el-form-item label="设备类型" prop="prodType">
          <el-select v-model="form.prodType" placeholder="请选择设备类型" size="mini">
            <el-option
              v-for="item in dictlist"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="厂商">
          <el-input v-model="form.manufacturer" size="mini" />
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="form.model" size="mini" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.remark" type="textarea" rows="2" size="mini" />
        </el-form-item>
      </el-form>
    </div>
    <el-footer class="dialog-footer-btn">
      <el-button size="mini" round @click="handleCancle">取 消</el-button>
      <el-button type="primary" size="mini" round @click="handleSubmit">确 定</el-button>
    </el-footer>
  </div>
</template>

<script>
import TreeSelect from '@/components/Basics/TreeSelect.vue'
import { getProductTypeTree, createProduct } from '@/api/porductMgr'
import { getDictListByCode } from '@/api/system'
export default {
  components: {
    TreeSelect
  },
  data() {
    return {
      form: {
        groupId: '',
        prodCode: '',
        prodName: '',
        prodType: '',
        manufacturer: '',
        model: '',
        remark: ''
      },
      productRules: {
        prodCode: [
          { required: true, message: '请输入产品ID', trigger: 'blur' }
        ],
        prodName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        groupId: [
          { required: true, message: '请选择产品分类', trigger: 'change' }
        ],
        prodType: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ]
      },
      treeProps: {
        children: 'childrenNodes',
        label: 'name'
      },
      treeData: [],
      status: false,
      dictlist: []
    }
  },
  async created() {
    await this.getDictList()
    await this.getTypeTree()
  },
  methods: {
    getDictList() {
      getDictListByCode({ dictTypeCode: 'DEVICE_TYPE' }).then(res => {
        if (res.code == 200) {
          this.dictlist = res.data
        }
      })
    },
    getTypeTree() {
      getProductTypeTree().then(res => {
        if (res.code == 200) {
          this.treeData = res.data
        }
      })
    },
    handleCancle() {
      this.$emit('close')
    },
    handleSubmit() {
      this.$refs.productForm.validate(async(valid, errorFields) => {
        if (valid) {
          createProduct(this.form).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.$emit('closeDialog')
            }
          })
        }
      })
    },
    changeGroupId(id) {
      this.form.groupId = id
    }
  }
}
</script>
