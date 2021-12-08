<!--平台授权-->
<template>
  <div class="release">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>平台授权</template>
      <template v-slot:subhead></template>
    </ListHeadTemplate>
    <div class="info">
      <span class="title">授权信息</span>
      <div class="bg-w zeus-mt-10 zeus-pl-15 zeus-pr-15 zeus-pt-15 zeus-pb-15">
        <el-row class="zeus-pt-15 zeus-pb-15 zeus-pl-20 zeus-pr-20 bg-gray">
          <el-col :span="6">
            <div class="value">ZEUSIOT物联网分布式管理平台</div>
            <div class="key">产品名称</div>
          </el-col>
          <el-col :span="6">
            <div class="value">1.0</div>
            <div class="key">版本号</div>
          </el-col>
          <el-col :span="6">
            <div class="value">0001</div>
            <div class="key">授权号</div>
          </el-col>
          <el-col :span="6">
            <div class="value">2021-03-09-2022-03-08</div>
            <div class="key">有效期</div>
          </el-col>
        </el-row>
        <el-row class="zeus-mt-5 zeus-pt-15 zeus-pb-15 zeus-pl-20 zeus-pr-20 bg-gray">
          <el-col :span="6">
            <div class="value">
              <a href="https://www.zmops.com" target="_blank">江苏纵目信息科技有限公司</a>
            </div>
            <div class="key zeus-mt-5">版权所有</div>
          </el-col>
          <el-col :span="6">
            <div class="value">0519-83611968</div>
            <div class="key zeus-mt-5">服务热线</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="info zeus-mt-15">
      <span class="title">授权信息</span>
      <div class="bg-w zeus-mt-10 zeus-pl-15 zeus-pr-15 zeus-pt-15 zeus-pb-15">
        <div class="bg-gray zeus-pt-20 zeus-pr-20 zeus-pb-20 zeus-pl-20">
          <el-form ref="paramForm" :inline="true" label-width="300px" label-position="top" class="zeus-inline-block">
            <el-form-item label="被授权组织/公司">
              <el-input v-model="form.value" size="mini" class="form-input" />
            </el-form-item>
            <el-form-item label="联系人">
              <el-input v-model="form.name" size="mini" class="form-input" />
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="form.tol" size="mini" class="form-input" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.mail" size="mini" class="form-input" />
            </el-form-item>
          </el-form>
          <el-button round size="mini" type="primary" class="zeus-right">生成</el-button>
        </div>
      </div>
    </div>
    <div class="info zeus-mt-15">
      <span class="title">更新授权</span>
      <div class="bg-w zeus-mt-10 zeus-pl-15 zeus-pr-15 zeus-pt-15 zeus-pb-15">
        <div class="bg-gray zeus-pt-20 zeus-pr-20 zeus-pb-20 zeus-pl-20">
          <el-form ref="paramForm2" label-width="64px" class="zeus-inline-block" label-position="top">
            <el-form-item label="授权信息">
              <el-input
                type="textarea"
                :rows="2"
                class="form-textarea"
                v-model="form.textarea">
              </el-input>
            </el-form-item>
          </el-form>
          <el-button round size="mini" type="primary" class="zeus-right">更新</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'

export default {
  components: {
    ListHeadTemplate
  },
  data() {
    return {
      form:{}
    }
  },
  created() {

  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.release {
  width: 100%;

  .bg-w{
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 6px 0 8px #E2EAF2;
  }

  .bg-gray{
    background-color: #F9FBFD;
  }

  .info{
    width: 100%;

    .title{
      font-size: 12px;
      color: #242E42;
    }

    .key{
      font-size: 12px;
      color: #79879C;
    }

    .value{
      font-size: 13px;
      color: #242E42;
      margin-bottom: 9px;
    }

    a:hover{
      color: #1A84F9;
    }

    .form-input{
      width: 350px;
    }

    .form-textarea{
      width: 1366px;
    }

    ::v-deep.el-form-item__label{
      font-size: 12px!important;
    }
  }
}
</style>
