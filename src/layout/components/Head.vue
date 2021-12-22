<!-- 页面公共头部 -->
<template>
  <div>
    <div class="Head zeus-flex-between">
      <router-link key="expand" class="sidebar-logo-link" to="/">
        <img src="@/assets/logo-.png" width="250">
        <!-- <svg-icon class="" icon-class="logo" style="font-size: 30px" /> -->
        <!-- <span class="head-title zeus-bold zeus-ml-10 ">Zeus IOT</span> -->
      </router-link>
      <div class="right-menu">
        <el-button round size="small" type="text" class="head-but" @click="doc">
          <svg-icon icon-class="doc" class="zeus-mr-5" />文档
        </el-button>
        <el-button round size="small" type="text" class="head-but" @click="dialogAbout = true">
          <svg-icon icon-class="about" class="zeus-mr-5" />关于
        </el-button>
        <el-dropdown class="avatar-container zeus-ml-25" trigger="click">
          <div class="avatar-wrapper zeus-flex-default">
            <img src="../../assets/avater.jpg" class="user-avatar">
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
      v-dialogDrag
      :visible.sync="dialogAbout"
      :width="'680px'"
      :show-close="false"
      class="aboutDialog"
    >
      <div class="brief">
        <img src="@/assets/logo-.png">
        <div class="text">Zeus IoT是一个集设备数据采集、存储、分析、观测为一体的开源物联网平台，全球首创基于Zabbix的物联网分布式数据采集架构，具备超百万级IoT设备的并发监控能力。致力于让设备接入和数据处理变得开箱即用，使物联网企业得以聚焦行业应用开发，极大的缩短物联网系统的开发周期，成为物联网项目提效降本的贴身伴侣。</div>
        <div class="version">Zeus IoT 版本：1.0.0-BETA</div>
      </div>
      <div class="info">
        <div>
          <div class="info-t zeus-inline-block zeus-mr-20">
            <svg-icon icon-class="about-github" class="zeus-mr-10" />
            <span class="zeus-mr-10">技术请求</span>
            <a href="https://github.com/zmops/zeus-iot" target="_blank">github.com/zmops/zeus-iot</a>
          </div>
          <svg-icon icon-class="about-feedback" class="zeus-mr-10" />
          <span class="zeus-mr-10">意见反馈</span>
          <span class="zeus-mr-10">0519-83611968</span>
          <a href="mailto:support@zmops.com" target="_blank">support@zmops.com</a>
        </div>
        <div class="zeus-mt-15">
          <div class="info-t zeus-inline-block zeus-mr-20">
            <svg-icon icon-class="about-support" class="zeus-mr-10" />
            <span class="zeus-mr-10">服务支持</span>
            <a href="https://www.zmops.com" target="_blank">www.zmops.com</a>
          </div>
          <svg-icon icon-class="about-add" class="zeus-mr-10" />
          <span class="zeus-mr-10">联系地址</span>
          <span>江苏省常州市新北区府琛商务广场2幢1227-1229室</span>
        </div>
        <div class="qr-code zeus-inline-block">
          <img src="@/assets/about-qq.png">
          <div class="zeus-mt-10">官方技术交流群</div>
        </div>
        <div class="qr-code zeus-ml-20 zeus-inline-block">
          <img src="@/assets/about-wechat.jpg">
          <div class="zeus-mt-10">Zeus IoT官方公众号</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
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
import EventBus from '@/utils/event-bus'
export default {
  name: 'Head',
  data() {
    return {
      dialogVisible: false,
      dialogAbout: false,
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
      EventBus.$emit('closeSocket', 'app')
      this.$router.push(`/login`)
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async(valid, errorFields) => {
        if (valid) {
          const { oldPassword, newPassword } = this.dialogForm
          changePwd({ oldPassword: this.$stringToHex(oldPassword), newPassword: this.$stringToHex(newPassword) }).then(async(res) => {
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
    },
    doc() {
      window.open('https://www.zmops.com/docs', '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.Head {
  width: 100%;
  height: 68px;
  background-color: #F2F5FC;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-image-source: radial-gradient(circle at 50% 3%, rgba(193, 201, 209, .53), hsla(0, 0%, 100%, .2));
  border-image-slice: 1;
  box-shadow: 0 0 10px 0 #E1E7EB;
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

    .head-but{
      padding: 10px 15px;
      font-size: 12px;
      color: #242E42;

      &:hover{
        background-color: #fff!important;
      }
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
        top: 10px;

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
  .popper__arrow::after{
    border-bottom-color: #fff !important;
  }
}

.aboutDialog{
  ::v-deep.el-dialog__header{
    display: none;
  }

  ::v-deep.el-dialog__body{
    padding: 0!important;
  }

  .brief{
    width: 100%;
    height: 262px;
    border-radius: 3px 3px 0 0;
    padding: 40px 28px 0 28px;
    background-image: url('../../assets/about-bg.png');
    background-repeat: no-repeat;
    background-size: 100% auto;

    img{
      width: 230px;
      height: 37px;
    }

    .text{
      margin-top: 30px;
      font-size: 12px;
      color: #242E42;
      line-height: 28px;
    }

    .version{
      margin-top: 20px;
      font-size: 12px;
      font-weight: bold;
      color: #242E42;
      line-height: 28px;
    }
  }

  .info{
    width: 100%;
    height: 253px;
    font-size: 12px;
    background-color: #fff;
    padding-top: 28px;
    padding-left: 28px;
    border-radius: 0 0 3px 3px;

    a:hover{
      color: #1A84F9;
    }

    .qr-code{
      text-align: center;
      margin-top: 30px;

      img{
        width: 100px;
        height: 100px;
        padding: 10px;
        border: 1px #E7EBEF solid;
      }
    }

    .info-t{
      width: 240px;
      border-right: 2px #E9EDF1 solid;
    }
  }
}
</style>
