<!-- 页面公共头部 -->
<template>
  <div>
    <div class="Head zeus-flex-between">
      <router-link key="expand" class="sidebar-logo-link" to="/">
        <img src="@/assets/logo-.png" width="147">
        <!-- <svg-icon class="" icon-class="logo" style="font-size: 30px" /> -->
        <!-- <span class="head-title zeus-bold zeus-ml-10 ">Zeus IOT</span> -->
      </router-link>
      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper zeus-flex-default">
            <img src="../../assets/avater.png" class="user-avatar">
            <span>{{ username }}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item divided @click.native="dialogVisible = true">
              <span style="display:block;"><svg-icon icon-class="modify" style="margin-right: 5px" />修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;"><svg-icon icon-class="logout" style="margin-right: 5px" />退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
      @close="close"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_edit" />
          修改密码
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="dialog-body">
        <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-position="top" class="dialog-form">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="dialogForm.oldPassword" type="password" size="mini" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="dialogForm.newPassword" type="password" size="mini" />
          </el-form-item>
        </el-form>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="handleSubmit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import { changePwd } from '@/api/user'

export default {
  name: 'Head',
  data() {
    return {
      dialogVisible: false,
      username: '',
      dialogForm: {
        oldPassword: '',
        newPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.username = localStorage.getItem('username')
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async(valid, errorFields) => {
        if (valid) {
          const { oldPassword, newPassword } = this.dialogForm
          changePwd({ oldPassword: this.$getRsaCode(oldPassword), newPassword: this.$getRsaCode(newPassword) }).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.logout()
            }
          })
        }
      })
    },
    close() {
      this.dialogForm = {
        oldPassword: '',
        newPassword: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.Head {
  width: 100%;
  height: 68px;
  background-color: #ffffff;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-image-source: radial-gradient(circle at 50% 3%, rgba(193, 201, 209, .53), hsla(0, 0%, 100%, .2));
  border-image-slice: 1;
  box-shadow: 0px -1px 0px 0px #E1E7EB;
  padding: 0 35px;

  .head-title {
    color: #1A84F9;
    font-size: 22px;
  }

  .right-menu {
    // float: right;
    // height: 100%;
    // line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      // margin-right: 30px;
      // height: 50px;

      .avatar-wrapper {
        // margin-top: 13px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          margin-right: 15px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 25px;
          font-size: 12px;
          margin-left: 20px;
        }
      }
    }
  }
}
.el-dropdown-menu__item--divided{
  margin-top: 0;
  border: none;
  line-height: 33px;
}
::v-deep.user-dropdown{
  background-color: #FFFFFF !important;
  .el-dropdown-menu__item{
    color: #606266 !important;
  }
  .el-dropdown-menu__item:hover{
    background: #f5f7fa !important;
  }
}
</style>
