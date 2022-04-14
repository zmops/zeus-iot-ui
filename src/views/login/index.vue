<template>
  <div class="login-div">
    <div class="login-container">
      <div class="logo-container">
        <img src="@/assets/logo-.png" class="logo">
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <div class="title-container">
          <el-divider content-position="center">欢迎登录</el-divider>
        </div>

        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入账号"
            name="用户名"
            :autofocus="true"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="密码"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>

        <el-button class="box-shadow btn-container" :loading="loading" round type="primary" @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { nextFirstLink } from '@/utils'
import EventBus from '@/utils/event-bus'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    EventBus.$emit('closeSocket', 'app')
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const { username, password } = this.loginForm
          this.$store.dispatch('user/login', { username, password: this.$stringToHex(password) }).then(async(r) => {
            if (r) {
              await this.$store.dispatch('user/getMember').then(() => {
                const path = nextFirstLink(
                  this.$store.state.permission.addRoutes
                )
                this.$router.push({
                  path
                })
                EventBus.$emit('openSocket', 'app')
              })
            }
            // this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 100%;

    input {
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #6A737D;
      height: 40px;
      background: #F7F8FA;
      border: 1px solid #C3CEE9;
      border-radius: 19px;

      &:-webkit-autofill {
        // box-shadow: 0 0 0px 1000px $bg inset !important;
        // -webkit-text-fill-color: $cursor !important;
      }
    }
    input:focus{
      background: #ffffff;
      border: 1px solid #1A84F9;
      color: #242E42;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #EFF4F9;
$dark_gray: #889aa4;
$light_gray: #242E42;

.pass_text{
  //font-size: 12px;
  line-height: 15px;
  color: #b5b5b8;
}

.login-div{
  background-color: #e4e7ec;
  height: 100vh;
  width: 100%;
}

.login-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: url('../../assets/logo_bg.png') center no-repeat;
  .logo-container{
    padding-top: 160px;
    margin: 0 auto;
    text-align: center;
    img{
      width: 147px;
      margin: 0px auto 40px auto;
    }
  }

  .box-shadow {
    border-radius: 30px;
    box-shadow: 0 8px 16px 0 rgba(35, 45, 65, 0.28) !important
  }

  .login-form {
    position: relative;
    width: 450px;
    padding: 60px 84px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 6px 10px 0px #E4E6EB;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;

    ::v-deep.el-form-item{
      margin-bottom: 28px;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    margin-bottom: 50px;
    .el-divider{
      background: linear-gradient(to right,  transparent 0%, #DADDE2 50%, transparent 100%,);
    }
    .el-divider__text{
      font-weight: bold;
      color: #000000;
      line-height: 40px;
      font-size: 14px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .btn-container{
    margin: 30px auto 20px auto;
    padding: 13px 66px;
    box-shadow: 0px 8px 20px 0px #242E42;
  }
}
</style>
