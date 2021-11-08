<!-- 产品表单页面 -->
<template>
  <div class="form-content">
    <el-form ref="productForm" :rules="productRules" :model="form" label-width="80px" label-position="top" class="dialog-form">
      <el-form-item label="产品ID" prop="prodCode">
        <el-input v-model="form.prodCode" size="mini" />
      </el-form-item>
      <el-form-item label="产品名称" prop="prodName">
        <el-input v-model="form.prodName" size="mini" />
      </el-form-item>
      <el-form-item label="产品分类" prop="groupId">
        <TreeSelect :id="prodId ? form.groupId : ''" ref="tree" :name="prodId ? form.groupIdName : ''" :default-props="treeProps" :data="treeData" @changeGroupId="changeGroupId" />
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
      <el-form-item label="图标" prop="icon">
        <el-upload
          class="upload-demo"
          action=""
          :auto-upload="false"
          :on-change="imgChange"
          accept=".jpg, .png"
          :show-file-list="false">
          <el-button size="small" style="background-color: #EFF4F9" round><svg-icon icon-class="upload" /> {{ form.icon ? '替换图标' : '上传图标' }} </el-button>
          <span slot="tip" class="el-upload__tip el-form-item-tips zeus-ml-20">建议长宽比为1:1,只能上传jpg/png文件，且不超过2MB</span>
        </el-upload>
        <div v-if="form.icon" class="icon-div zeus-relative zeus-mt-10">
          <img width="100%" height="100%" :src="form.icon" alt="">
          <svg-icon icon-class="close" class="icon-close zeus-absolute zeus-cursor-pointer" @click="form.icon = ''" />
        </div>
        <img v-else width="91px" height="91px" src="@/assets/zwsc.png" alt="">
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import TreeSelect from '@/components/Basics/TreeSelect.vue'
import { getProductTypeTree, createProduct, productDetail, UpdateProduct } from '@/api/porductMgr'
import { getDictListByCode } from '@/api/system'
export default {
  components: {
    TreeSelect
  },
  props: {
    prodId: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default() {
        return {
          groupId: '',
          prodCode: '',
          prodName: '',
          prodType: '',
          manufacturer: '',
          model: '',
          remark: '',
          icon: ''
        }
      }
    },
  },
  data() {
    return {
      form: {},
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
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.form = val
      }
    }
  },
  async created() {
    await this.getDictList()
    await this.getTypeTree()
    if (this.prodId) {
      this.getDetail()
    }
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
    async getDetail() {
      await productDetail({ productId: this.prodId }).then(res => {
        if (res.code == 200) {
          this.form = res.data
        }
      })
    },
    validateForm() {
      this.$emit('input', this.form)
      let flag = false
      this.$refs.productForm.validate((valid) => {
        flag = valid
      })
      return flag
    },
    handleCancle() {
      this.$emit('close')
    },
    changeGroupId(id) {
      this.form.groupId = id
    },
    imgChange(file) {
      if (file.size && file.size > 2 * 1024 * 1024) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
      this.getBase64(file.raw).then((res) => {
        this.$set(this.form, 'icon', res.imgResult)
      })
    },
    /* 获取图片转base64 */
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        let imgResult = ''
        let imageSize = ''
        reader.readAsDataURL(file)
        reader.onload = () => {
          imgResult = reader.result
        }
        reader.onerror = (error) => {
          reject(error)
        }
        reader.onloadend = () => {
          // 获取上传图片的尺寸
          const img = new Image()
          img.src = imgResult
          img.onload = () => {
            imageSize = img.width + ',' + img.height
            resolve({ imgResult, imageSize })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-div{
  width: 92px;
  height: 92px;
  padding: 12px;
  border: 1px #F1F5FA solid;
  border-radius: 4px;

  &:hover{
    border-color: #D0E6FF;
    .icon-close{
      display: block;
    }
  }

  .icon-close{
    display: none;
    top: 2px;
    right: 2px;
    font-size: 12px;
  }
}
</style>
