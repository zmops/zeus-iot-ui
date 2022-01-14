<template>
  <el-form ref="form" :rules="rules" :model="dialogForm" label-width="120px" class="form">
    <el-form-item label="协议组件ID">
      <el-input v-model="dialogForm.protocolComponentId" disabled size="mini"/>
    </el-form-item>
    <el-form-item label="设备协议名称" prop="name">
      <el-input v-model="dialogForm.name" size="mini"/>
    </el-form-item>
    <el-form-item label="生效代理" prop="effectProxy">
      <el-select v-model="dialogForm.effectProxy" clearable placeholder="请选择" size="mini">
        <el-option v-for="(item,index) in proxyList" :key="index" :label="item.name" :value="item.id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="类型" prop="source">
      <el-select v-model="dialogForm.source" placeholder="请选择" size="mini">
        <el-option label="上传组件包" value="1"/>
<!--        <el-option label="选择Server文件" value="2"/>-->
<!--        <el-option label="选择Edge文件" value="3"/>-->
      </el-select>
    </el-form-item>
    <el-form-item label="协议包地址" prop="url">
<!--      <el-input v-model="dialogForm.url" size="mini"/>-->
      <el-upload
        class="upload-demo zeus-inline-block"
        :show-file-list="false"
        :action="uploadUrlT"
        name="file"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :data="{protocolComponentId: dialogForm.protocolComponentId}"
        accept=".jar">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <span class="zeus-ml-20 file-name">{{fileName}}</span>
    </el-form-item>
    <el-form-item label="描述" prop="remark">
      <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini"/>
    </el-form-item>
  </el-form>
</template>
<script>
import { getProxyList } from '@/api/system'
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
      uploadUrlT: process.env.VUE_APP_BASE_API + '/protocol/component/upload',
      rules: {
        name: [
          { required: true, message: '请输入协议名称', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      proxyList: [],
      uploaded: false,
      fileName: ''
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
    getProxyList({}).then((res) => {
      if (res.code == 200) {
        this.proxyList = res.data
      }
    })
  },
  methods: {
    validateForm() {
      this.$emit('input', this.dialogForm)
      if (!this.uploaded) {
        this.$message.error('请上传协议包')
        return false
      }
      let flag = false
      this.$refs.form.validate((valid) => {
        flag = valid
      })
      return flag
    },
    // 上传成功
    uploadSuccess(response, file, fileList) {
      if (response.code == 200){
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
        this.fileName = '已上传文件:' + file.name
        this.uploaded = true
      } else {
        this.$message.error('上传失败,请重试')
      }
      this.imageLoading = false
    },
    // 上传失败
    uploadError() {
      this.$message.error('上传失败,请重试')
      this.imageLoading = false
    },
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 600px;
}
</style>
