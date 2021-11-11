<template>
  <div class="form_template">
    <div class="head">
      <span class="zeus-cursor-pointer zeus-inline-block back" @click="cancel">
        <i class="el-icon-arrow-left zeus-cursor-pointer zeus-bold"/>
        返回{{ up }}
      </span>
    </div>
    <div class="main">
      <div class="title">
        <svg-icon v-if="state.indexOf('创建') > -1" icon-class="dialog_add"/>
        <svg-icon v-if="state.indexOf('编辑') > -1" icon-class="dialog_edit"/>
        {{ state }}
      </div>
      <slot name="main" />
    </div>
    <div class="foot zeus-pt-10 zeus-pb-10" :class="width === 0 ? 'zeus-text-align-c' : ''" :style="{paddingLeft: width === 0 ? 0 :(width / 2 - 52.58) + 'px'}">
      <el-button size="mini" style="background-color: #EFF4F9" round @click="cancel">取 消</el-button>
      <el-button :disabled="butLoading" type="primary" size="mini" round @click="submit">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'formTemplate',
  props: {
    up: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 600
    },
    butLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  created() {

  },
  methods: {
    submit() {
      this.$emit('submit')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
$width:600px;
.form_template {
  width: 100%;
  background-color: #fff;

  .head {
    width: 100%;
    background-color: #F9FBFD;
    box-shadow: 1px 0 0 #EFF4F9;
    padding: 11px 20px;
    border-bottom: #EFF4F9 1px solid;

    .back {
      padding: 0 24px 0 16px;
      height: 33px;
      line-height: 33px;
      font-size: 14px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      background: #ffffff;
      border-radius: 16px;
      border: #EFF4F9 1px solid;
      box-shadow: 0 0 7px #EFF2F9;

      &:hover {
        color: #1A84F9;
      }

      i {
        color: #1A84F9;
        font-weight: bold;
      }
    }
  }
  .main{
    padding: 23px 28px;

    .title{
      font-size: 14px;
      font-weight: bold;
      color: #242E42;
      margin-bottom: 30px;
    }
  }
  .foot{
    width: 100%;
    background-color: #F9FBFD;
    border-top: 1px #EFF4F9 solid;
  }
}
</style>
