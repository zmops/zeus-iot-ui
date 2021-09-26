<!-- 租户表单 -->
<template>
  <div class="tenant-form">
    <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="80px" label-position="top" class="dialog-form">
      <el-form-item label="租户名称" prop="name">
        <el-input v-model="dialogForm.name" size="mini"/>
      </el-form-item>
      <el-form-item label="租户管理员账号" prop="account">
        <el-input v-model="dialogForm.account" size="mini" :disabled="isEdit" />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="租户管理员密码" prop="pass">
        <el-input v-model="dialogForm.pass" type="password" size="mini"/>
      </el-form-item>
      <el-form-item v-if="!isEdit" label="确认密码" prop="password1">
        <el-input v-model="dialogForm.password1" type="password" size="mini"/>
      </el-form-item>
      <el-form-item label="联系人" prop="lxr">
        <el-input v-model="dialogForm.lxr" size="mini"/>
      </el-form-item>
      <el-form-item label="联系方式" prop="fs">
        <el-input v-model="dialogForm.fs" size="mini"/>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'tenantForm',
  props: {
    value: {
      type: Object,
      default() {
        return {
          account: '',
          name: '',
          password1: '',
          pass: ''
        }
      }
    },
    isEdit: Boolean
  },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.dialogForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        account: [
          { required: true, message: '请输入租户管理员账号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入租户名称', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        password1: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      dialogForm: this.value
    }
  },
  watch: {
    dialogForm: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {

  },
  beforeDestroy() {
    this.dialogForm = {
      name: '',
      productId: '',
      deviceGroupIds: [],
      remark: ''
    }
  },
  methods: {
    validateForm() {
      let flag = false
      this.$refs.dialogForm.validate((valid) => {
        flag = valid
      })
      return flag
    }
  }
}
</script>
