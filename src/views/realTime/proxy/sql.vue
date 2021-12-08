<!--PostgreSQL-->
<template>
  <div class="os">
    <div class="title zeus-mt-10 zeus-mb-10">
      <svg-icon icon-class="proxy_sql" style="font-size: 25px" />
      <span class="zeus-ml-10">PostgreSQL</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="24" class="zeus-mb-20">
        <el-card class="box-card" shadow="hover">
          <span>基础信息</span>
          <el-row :gutter="6" class="zeus-mt-15">
            <el-col :span="12">
              <div class="bg stat">
                <svg-icon icon-class="jrlssj" class="zeus-mr-5" />
                <span>测试连接状态</span>
                <span class="zeus-right">{{ swapSpace.todayRecordNum || '-' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="bg stat">
                <svg-icon icon-class="zlssjts" class="zeus-mr-5" />
                <span>运行时长</span>
                <span class="zeus-right">{{ swapSpace.totalRecordNum || '-' }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12" class="zeus-mb-20">
        <el-card class="box-card" shadow="hover">
          <span>连接使用率</span>
          <div class="bg zeus-pt-10 zeus-pb-10 zeus-mt-15">
            <LineChart :title="'26%'" :line-data="memoryUsageChartData" :line-show="false" :height="'152px'" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="zeus-mb-20">
        <el-card class="box-card" shadow="hover">
          <span>死锁产生速率(个/s)</span>
          <div class="bg zeus-pt-10 zeus-pb-10 zeus-mt-15">
            <LineChart :title="'26'" :line-data="memoryUsageChartData" :line-show="false" :height="'152px'" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from '@/components/Basics/LineChart'
export default {
  name: 'os',
  components: {
    LineChart
  },
  data() {
    return {
      memoryData: {},
      capacityData: {},
      processData: {},
      memoryChartData: [],
      capacityChartData: [],
      processChartData: [],
      memoryUsageChartData: [],
      swapSpace: {}
    }
  },
  created() {

  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.os {
  .title{
    color: #242E42;
    height: 25px;
    line-height: 25px;

    span{
      vertical-align: top;
    }
  }

  .box-card {
    width: 100%;
  }

  .flex{
    display: flex;
  }

  .chunk1 {
    width: 170px;
    height: 195px;
    padding: 20px 16px;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }

  .label {
    color: #79879C;
    font-size: 12px;
  }

  .c-hui{
    color: #79879C;
  }

  .hang{
    width: 100%;
    line-height: 16px;
  }

  .chart1 {
    margin-left: 14px;
    padding: 14px 0;
    height: 195px;
    width: calc(100% - 184px);
    top: 0;
    right: 0;
  }

  .bg {
    background-color: #F9FBFD;
  }

  .stat{
    width: 100%;
    height: 48px;
    line-height: 48px;
    padding: 0 18px 0 12px;
  }

  .data-size{
    height: 250px;
  }
}
</style>
