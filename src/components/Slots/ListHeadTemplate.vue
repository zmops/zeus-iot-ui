<!-- 列表页头部主键 -->
<template>
  <div class="list-head-template zeus-relative">
    <div class="list-head-template-logo zeus-absolute">
      <slot name="logo" />
    </div>
    <div class="list-head-template-main">
      <div class="title">
        <slot name="title" />
      </div>
      <div class="subhead">
        <slot name="subhead" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ListHeadTemplate',
  data() {
    return {}
  },
  created() {

  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.list-head-template {
  width: 100%;
  min-height: 104px;
  margin-bottom: 12px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(36, 46, 66, 0.06);
  padding: 24px 20px 28px;
  background-image: url('../../assets/title_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .list-head-template-logo{
    width: 48px;
    height: 48px;
    top: 50%;
    transform: translateY(-50%);
  }

  .list-head-template-main{
    padding-left: 72px;
    .title{
      font-size: 24px;
      line-height: 32px;
      font-weight: 600;
      font-style: normal;
      color: #242e42;
      text-shadow: 0 4px 8px rgba(36, 46, 66, 0.1);
    }
    .subhead{
      color: #79879c;
      font-size: 12px;
      line-height: 20px;
      margin-top: 5px;
    }
  }
}
</style>
