<!-- 系统参数页面 -->
<template>
  <div class="sys-param">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>系统参数</template>
      <template v-slot:subhead></template>
    </ListHeadTemplate>
    <el-form ref="paramForm" v-loading="loading" label-width="230px" label-position="left" class="dialog-form zeus-ml-20">
      <el-form-item v-for="(item, index) in list" :key="index" :label="item.name" :rules="{required: true,message: '请输入', trigger: 'blur'}">
        <el-input v-model="item.value" size="mini" />
      </el-form-item>
      <el-form-item>
        <el-button round size="mini" type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getParamList, updateParam } from '@/api/system'
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
export default {
  name: 'SysParam',
  components: {
    ListHeadTemplate
  },
  data() {
    return {
      loading: false,
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getParamList().then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.list = res.data
        }
      }).catch(() => {
        this.loading = false
      })
    },
    /* 提交表单 */
    submit() {
      updateParam({ sysParamList: this.list }).then(async(res) => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          await this.getList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sys-param {
  width: 100%;
  padding-bottom: 30px;
  background-color: #fff;
}
</style>
