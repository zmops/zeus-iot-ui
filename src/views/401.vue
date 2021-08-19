<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous bullshit-info">
          出错了!
        </h1>
        <h2 class="bullshit-info">未获得任何页面的授权。</h2>
        <h4 class="bullshit-info">请联系管理员。</h4>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'
export default {
  name: 'Page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date()
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 900px;
  max-width: 100%;
  padding: 40px 20px 40px 60px;
  background-color: #fff;
  margin: 100px auto;
  box-shadow: 15px 15px 30px 0 rgb(36 46 66 / 26%);
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .bullshit-info {
    opacity: 0;
    margin-bottom: 30px;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-delay: 0.2s;
    animation-fill-mode: forwards;
  }
  @keyframes slideUp {
    0% {
      transform: translateY(60px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>
