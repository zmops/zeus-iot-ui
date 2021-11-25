<!-- 告警方式页面 -->
<template>
  <div class="media">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>通知配置</template>
      <template v-slot:subhead>为实现平台的通知功能，需要进行参数配置。</template>
    </ListHeadTemplate>
    <div class="head">
      <el-button v-for="(item, index) in list" :key="index" :class="item.id === activity ? 'activity' : ''" class="but" type="primary" plain @click="tabsChange(item)">{{ typeList[item.type] || item.type }}</el-button>
      <el-button :class="0 === activity ? 'activity' : ''" class="but" type="primary" plain @click="tabsChange(0)">邮件</el-button>
    </div>
    <div v-if="activity === 0" class="detail zeus-pt-5 zeus-pl-20 zeus-pr-20 zeus-pb-20">
      <el-form ref="mainRuleForm" :model="form" label-width="120px" style="max-width:500px" :rules="rules">
        <el-form-item label="SMTP主机" prop="host">
          <el-input v-model="form.host" size="mini" class="w300" clearable></el-input>
        </el-form-item>
        <el-form-item label="SMTP端口" prop="port">
          <el-input v-model="form.port" size="mini" class="w300" clearable @input="portInput"></el-input>
        </el-form-item>
        <el-form-item label="SMTP用户名" prop="account">
          <el-input v-model="form.account" size="mini" class="w300" clearable></el-input>
        </el-form-item>
        <el-form-item label="SMTP密码" prop="password">
          <el-input
            v-model="form.password"
            size="mini"
            class="w300"
            @blur="passwordType='password'"
            @focus="passwordType='text'"
            :type="passwordType"
          ></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
          <div class="el-form-item-tips">
            <svg-icon icon-class="tips" class="icon" />一些邮件提供商需要输入的是Token
          </div>
        </el-form-item>
        <el-form-item label="发送账号" prop="sender">
          <el-input v-model="form.sender" class="w450" size="mini" clearable></el-input>
          <div class="el-form-item-tips">
            <svg-icon icon-class="tips" class="icon" />发送邮件账号，默认使用SMTP账号作为发送账号
          </div>
        </el-form-item>
        <el-form-item label="测试收件人" prop="receiver">
          <el-input v-model="form.receiver" class="w450" size="mini" clearable></el-input>
          <div class="el-form-item-tips">
            <svg-icon icon-class="tips" class="icon" />仅用来作为测试邮件收件人
          </div>
        </el-form-item>
        <el-form-item label="使用SSL" prop="ssl">
          <el-checkbox v-model="form.ssl" :true-label="'1'" :false-label="'0'">如果SMTP端口是465，通常需要启用SSL</el-checkbox>
        </el-form-item>
        <el-form-item label="使用TLS" prop="tls">
          <el-checkbox v-model="form.tls" :true-label="'1'" :false-label="'0'">如果SMTP端口是587，通常需要启用TLS</el-checkbox>
        </el-form-item>
        <el-form-item label="通知静默时间" prop="silent">
          <el-input v-model="form.silent" style="width: 348px" size="mini" @input="silentInput"></el-input> 小时
          <div class="el-form-item-tips">
            <svg-icon icon-class="tips" class="icon" />某个资源的同一个告警规则，在通知静默时间内只能发出1条消息。设置为0则静默功能不生效。
          </div>
        </el-form-item>
        <el-form-item>
          <el-button round size="mini" type="primary" :loading="loading" @click="handleTest" class="elform-btn">测试连接</el-button>
          <el-button round size="mini" type="primary" :loading="loading" @click="handleSubmit" class="elform-btn">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-else class="detail zeus-pt-5 zeus-pl-20 zeus-pr-20 zeus-pb-20">
      <el-divider content-position="left" class="zeus-mt-10 zeus-mb-20">告警消息模版</el-divider>
      <json-editor
        ref="jsonEditor"
        class="zeus-mt-10 zeus-mb-20"
        :json="json1"
        @change="handleJsonChange1"
      />
      <el-divider content-position="left" class="zeus-mt-10 zeus-mb-20">告警推送配置</el-divider>
      <json-editor
        ref="jsonEditor"
        class="zeus-mt-10 zeus-mb-20"
        :json="json2"
        @change="handleJsonChange2"
      />
      <el-button round size="mini" type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getMediaTypeList, updateMediaType, getDictListByCode, getMailSetting, testEmailSettings, updateEmailSettings } from '@/api/system'
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import JsonEditor from '@/components/Basics/JsonEditor'

export default {
  name: 'Media',
  components: {
    ListHeadTemplate,
    JsonEditor
  },
  data() {
    return {
      loading: false,
      disabled: false,
      form: {
        host: '',
        name: '',
        account: '',
        password: '',
        sender: '',
        receiver: '',
        ssl: '0',
        tls: '0',
        severity: '',
        silent: '3'
      },
      passwordType: 'password',
      list: [],
      activity: '',
      json1: '',
      json2: '',
      type: '',
      typeList: {},
      rules: {
        host: [
          { required: true, message: '请输入SMTP主机', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请输入SMTP端口', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入SMTP用户名', trigger: 'submit' },
          { validator: this.checkEmail, trigger: 'submit' }
        ],
        password: [
          { required: true, message: '请输入SMTP密码', trigger: 'blur' }
        ],
        sender: [
          { validator: this.checkEmail, trigger: 'submit' }
        ],
        receiver: [
          { validator: this.checkEmail, trigger: 'submit' }
        ],
        severity: [
          { required: true, message: '请至少选择一个接收通知级别', trigger: 'blur' }
        ],
        silent: [
          { required: true, message: '请输入通知静默时间', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    /* 获取通知类型的字典项 */
    getDictListByCode({ dictTypeCode: 'MEDIA_TYPE' }).then((res) => {
      if (res.code == 200 && res.data.length) {
        const x = res.data.map(i => {
          const obj = {}
          this.$set(obj, i.code, i.name)
          return obj
        })
        let newObj = {}
        x.forEach(i => {
          newObj = { ...newObj, ...i }
        })
        this.typeList = newObj
      }
    })
    getMailSetting().then((res) => {
      // const {
      //   host,
      //   port,
      //   account,
      //   password,
      //   ssl,
      //   tls,
      //   sender,
      //   receiver,
      //   severity,
      //   silent
      // } = res.data
      // this.form = {
      //   host,
      //   port,
      //   account,
      //   password,
      //   ssl,
      //   tls,
      //   sender,
      //   receiver,
      //   severity,
      //   silent
      // }
      if (res.code == '200') {
        this.form = res.data
        if (this.form.silent === undefined) {
          this.form.silent = '3'
        }
      }
    })
    this.getList()
    // 刷新jsonEditor
    this.$nextTick(() => {
      this.$refs.jsonEditor.refresh()
    })
  },
  methods: {
    getList() {
      this.loading = true
      getMediaTypeList().then((res) => {
        this.loading = false
        if (res.code == 200 && res.data.length) {
          this.list = res.data
          this.activity = res.data[0].id
          this.json1 = res.data[0].template
          this.json2 = res.data[0].webhooks
          this.type = res.data[0].type
        }
      }).catch(() => {
        this.loading = false
      })
    },
    tabsChange(item) {
      if (item === 0) {
        this.activity = 0
      } else {
        this.activity = item.id
        this.json1 = item.template
        this.json2 = item.webhooks
        this.type = item.type
      }
    },
    /* 提交表单 */
    async submit() {
      updateMediaType({ id: this.activity, type: this.type, template: this.json1, webhooks: this.json2 }).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    handleJsonChange1(val) {
      if (this.json1 !== val) {
        this.json1 = val
      }
    },
    handleJsonChange2(val) {
      if (this.json2 !== val) {
        this.json2 = val
      }
    },
    checkEmail(rule, value, callback) {
      const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (value && !emailReg.test(value)) {
        callback('邮箱地址格式错误')
        return false
      } else {
        callback()
      }
    },
    format(val, max) {
      const port = val.replace(/[^0-9]/gi, '')
      if (Number(port) > max) {
        return max + ''
      } else {
        return port
      }
    },
    portInput(val) {
      this.form.port = this.format(val, 65535)
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    silentInput(val) {
      this.form.silent = this.format(val, 72)
    },
    handleTest() {
      this.$refs.mainRuleForm.validate(async (valid, errorFields) => {
        if (valid) {
          if (!this.form.receiver) {
            this.$message({
              type: 'error',
              message: '请输入测试收件人邮箱'
            })
            return false
          }
          if (this.disabled) {
            return false
          }
          this.disabled = true
          // this.btnContent = '正在测试连接...'
          this.loading = true
          testEmailSettings(this.form)
            .then((res) => {
              if (res.data.status === 'success') {
                this.$message({
                  type: 'success',
                  message: '测试连接成功'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }

              this.disabled = false
              // this.btnContent = '测试连接'
              this.loading = false
            })
            .catch(() => {
              this.disabled = false
              // this.btnContent = '测试连接'
              this.loading = false
            })
        } else {
          setTimeout(() => {
            var isError = document.getElementsByClassName('is-error')
            isError[0].querySelector('input').focus()
          }, 100)
          this.$message.error(
            errorFields[Object.keys(errorFields)[0]][0].message
          )
          return false
        }
      })
    },
    handleSubmit() {
      if (this.disabled) {
        return
      }
      this.$refs.mainRuleForm.validate(async (valid, errorFields) => {
        if (valid) {
          updateEmailSettings(this.form).then((res) => {
            if (res.code == '200') {
              this.$message({
                type: 'success',
                message: '消息设置保存成功'
              })
            }
          })
        } else {
          setTimeout(() => {
            var isError = document.getElementsByClassName('is-error')
            isError[0].querySelector('input').focus()
          }, 100)
          this.$message.error(
            errorFields[Object.keys(errorFields)[0]][0].message
          )
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.show-pwd {
  position: absolute;
  right: 9px;
  top: 2px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}
.media {
  width: 100%;
  height: calc(100vh - 88px);

  .head {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 14px;
    border-radius: 4px;
    background-color: #242e42;
    margin: 0 0 12px;

    ::v-deep.el-button {
      padding: 8px 0;
      width: 96px;
      margin: 0 6px;
      box-sizing: content-box;
    }

    ::v-deep.el-button--primary {
      background: #242e42;
      border-color: transparent;
      color: #fff;
    }

    .activity{
      box-shadow: 0 0 10px #1a84f94d;
      &::v-deep.el-button--primary {
        background: $themeText!important;
        color: #fff!important;
      }
    }
    .but{
      &:hover{
        background-color: #35415A;
        color: #1A84F9;
      }
    }
  }

  .detail {
    //width: 500px;
    background-color: #fff;
  }
}
</style>
