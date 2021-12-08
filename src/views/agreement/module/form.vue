<template>
  <el-form ref="form" :rules="rules" :model="dialogForm" label-width="80px" label-position="top" class="form">
    <el-form-item label="协议组件ID">
      <span>{{}}</span>
    </el-form-item>
    <el-form-item label="设备协议名称" prop="name">
      <el-input v-model="dialogForm.name" size="mini"/>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-select v-model="dialogForm.type" placeholder="请选择" size="mini">
        <el-option label="上传组件包" value="1"/>
        <el-option label="选择Server文件" value="2"/>
        <el-option label="选择Edge文件" value="3"/>
      </el-select>
    </el-form-item>
    <el-form-item label="协议包地址" prop="url">
      <el-input v-model="dialogForm.url" size="mini"/>
    </el-form-item>
    <el-form-item label="描述" prop="remark">
      <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini"/>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'form',
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogForm: {},
      rules: {
        name: [
          { required: true, message: '请输入协议名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入协议包地址', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
      }
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.dialogForm = val
      }
    }
  },
  created() {

  },
  methods: {
    validateForm() {
      this.$emit('input', this.dialogForm)
      let flag = false
      this.$refs.form.validate((valid) => {
        flag = valid
      })
      return flag
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 600px;
}
</style>
