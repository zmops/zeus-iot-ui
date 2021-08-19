<template>
  <div>
    <el-form ref="productForm" :rules="productRules" :model="form" label-width="80px" label-position="top" class="dialog-form">
      <el-form-item label="产品ID" prop="prodCode">
        <el-input v-model="form.prodCode" :disabled="!basicChange" size="mini" />
        <div class="el-form-item-tips">
          <i class="el-icon-info" />输入产品ID
        </div>
      </el-form-item>
      <el-form-item label="产品名称" prop="prodName">
        <el-input v-model="form.prodName" :disabled="!basicChange" size="mini" />
      </el-form-item>
      <el-form-item label="产品分类" prop="groupId">
        <TreeSelect :id="form.groupId" ref="tree" :basic-change="basicChange" :name="form.groupName" :default-props="treeProps" :data="treeData" @changeGroupId="changeGroupId" />
      </el-form-item>
      <el-form-item label="设备类型" prop="prodType">
        <el-select v-model="form.prodType" :disabled="!basicChange" size="mini">
          <el-option
            v-for="item in dictlist"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="厂商">
        <el-input v-model="form.manufacturer" :disabled="!basicChange" size="mini" />
      </el-form-item>
      <el-form-item label="型号">
        <el-input v-model="form.model" :disabled="!basicChange" size="mini" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.remark" :disabled="!basicChange" type="textarea" rows="2" size="mini" />
      </el-form-item>
    </el-form>
    <div class="zeus-form-btns zeus-flex-center">
      <el-button v-if="!basicChange" type="primary" size="mini" round @click="basicChange = true">修 改</el-button>
      <el-button v-if="basicChange" size="mini" round @click="handleCancle">取 消</el-button>
      <el-button v-if="basicChange" type="primary" size="mini" round @click="handleSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import TreeSelect from '@/components/Basics/TreeSelect.vue'
import { getProductTypeTree, productDetail, UpdateProduct } from '@/api/porductMgr'
import { getDictListByCode } from '@/api/system'
export default {
  components: {
    TreeSelect
  },
  data() {
    return {
      form: {},
      dictlist: [],
      basicChange: false,
      treeData: [],
      prodId: '',
      // 基础信息表单验证
      productRules: {
        prodCode: [
          { required: true, message: '请输入产品ID', trigger: 'blur' }
        ],
        prodName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        groupId: [
          { required: true, message: '请选择产品分类', trigger: 'blur' }
        ],
        prodType: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ]
      },
      // 基础信息产品分类树
      treeProps: {
        children: 'childrenNodes',
        label: 'name'
      }
    }
  },
  async created() {
    this.getDictList()
    if (this.$route.query.id) {
      await this.getDetail(this.$route.query.id)
    }
    this.getTypeTree()
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
    async getDetail(id) {
      this.prodId = id
      await productDetail({ prodId: id }).then(res => {
        if (res.code == 200) {
          this.form = res.data
        }
      })
    },
    changeGroupId(id) {
      this.form.groupId = id
    },
    handleCancle() {
      this.basicChange = false
      this.getDetail(this.prodId)
    },
    handleSubmit() {
      this.$refs.productForm.validate(async(valid, errorFields) => {
        if (valid) {
          UpdateProduct(this.form).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.handleCancle()
              this.$emit('edit')
            }
          })
        }
      })
    }
  }

}
</script>
