<!--Zabbix代理-->
<template>
  <div class="os">
    <div class="title zeus-mt-10 zeus-mb-10">
      <svg-icon icon-class="proxy_zabbix" style="font-size: 25px" />
      <span class="zeus-ml-10">Zabbix代理</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="12" class="zeus-mb-20">
        <el-card class="box-card" shadow="hover">
          <span>值处理速率(个/s)</span>
          <div class="bg zeus-pt-10 zeus-pb-10 zeus-mt-15">
            <LineChart :title="'890'" :line-data="memoryUsageChartData" :line-show="false" :height="'152px'" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="zeus-mb-20">
        <el-card class="box-card" shadow="hover">
          <span>主动上报采集器进程使用率</span>
          <div class="bg zeus-pt-10 zeus-pb-10 zeus-mt-15">
            <LineChart :title="'89%'" :line-data="memoryUsageChartData" :line-show="false" :height="'152px'" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="zeus-mb-20">
        <el-card class="box-card" shadow="hover">
          <span>缓存使用率</span>
          <div class="zeus-mt-10 zeus-relative">
            <div class="chunk1 bg zeus-inline-block">
              <el-row class="hang">
                <el-col :span="12" class="label">配置缓存:</el-col>
                <el-col :span="12">{{ memoryData.online || '--' }}</el-col>
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">历史数据索引缓存 :</el-col>
                <el-col :span="12">{{ memoryData.total || '--' }}</el-col>
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">历史数据写缓存 : </el-col>
                <el-col :span="12">{{ memoryData.disable || '--' }}</el-col>
              </el-row>
            </div>
            <div class="chart1 bg zeus-inline-block zeus-absolute">
              <LineChart :title="''" :line-data="memoryChartData" :is-to-fixed="0" :height="'100%'" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="zeus-mb-20">
        <el-card class="box-card" shadow="hover">
          <span>值缓存有效性</span>
          <div class="zeus-mt-10 zeus-relative">
            <div class="chunk1 bg zeus-inline-block">
              <el-row class="hang">
                <el-col :span="12" class="label">值缓存命中速率:</el-col>
                <el-col :span="12">{{ capacityData.online || '--' }}次/s</el-col>
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">值缓存未命中速率:</el-col>
                <el-col :span="12">{{ capacityData.total || '--' }}次/s</el-col>
              </el-row>
            </div>
            <div class="chart1 bg zeus-inline-block zeus-absolute">
              <LineChart :title="''" :line-data="capacityChartData" :is-to-fixed="0" :height="'100%'" />
            </div>
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
