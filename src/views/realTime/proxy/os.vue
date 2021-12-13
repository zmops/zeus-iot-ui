<!--操作系统-->
<template>
  <div class="os">
    <div class="title zeus-mt-10 zeus-mb-10">
      <svg-icon icon-class="proxy_os" style="font-size: 25px" />
      <span class="zeus-ml-10">操作系统</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="12" class="zeus-mb-20">
        <el-card class="box-card" shadow="hover">
          <span>内存信息</span>
          <div class="zeus-mt-10 zeus-relative">
            <div class="chunk1 bg zeus-inline-block">
              <el-row class="hang">
                <el-col :span="12" class="label">内存使用率:</el-col>
                <el-col :span="12">{{ Number(memoryData.memoryUtilization).toFixed(2) + '%' || '--' }}</el-col>
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">总内存 :</el-col>
                <el-col :span="12">{{ memoryData.memoryTotal || '--' }}</el-col>
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">可用内存 : </el-col>
                <el-col :span="12">{{ memoryData.memoryAvailable || '--' }}</el-col>
              </el-row>
            </div>
            <div class="chart1 bg zeus-inline-block zeus-absolute">
              <LineChart :title="'内存使用率'" :line-data="memoryChartData" :unit="'%'" :is-to-fixed="0" :height="'100%'" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="zeus-mb-20">
        <el-card class="box-card" shadow="hover">
          <span>CPU负载</span>
          <div class="zeus-mt-10 zeus-relative">
            <div class="chunk1 bg zeus-inline-block">
              <el-row class="hang">
                <el-col :span="12" class="label">1m:</el-col>
                <el-col :span="12">{{ capacityData.cpuLoadAvg1 + '%' || '--' }}</el-col>
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">2m :</el-col>
                <el-col :span="12">{{ capacityData.cpuLoadAvg5 + '%' || '--' }}</el-col>
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">10m : </el-col>
                <el-col :span="12">{{ capacityData.cpuLoadAvg15+ '%' || '--' }}</el-col>
              </el-row>
            </div>
            <div class="chart1 bg zeus-inline-block zeus-absolute">
              <LineChart :title="'CPU负载趋势'" :line-data="capacityChartData" :is-to-fixed="0" :height="'100%'" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="zeus-mb-20">
        <el-card class="box-card" shadow="hover">
          <span>运行中进程数</span>
          <div class="zeus-mt-10 zeus-relative">
            <div class="chunk1 bg zeus-inline-block">
              <el-row class="hang">
                <el-col :span="12" class="label">运行进程数:</el-col>
                <el-col :span="12">{{ processData.run || '--' }}</el-col>
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">进程总数 :</el-col>
                <el-col :span="12">{{ processData.num || '--' }}</el-col>
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">最大进程数 : </el-col>
                <el-col :span="12">{{ processData.max || '--' }}</el-col>
              </el-row>
            </div>
            <div class="chart1 bg zeus-inline-block zeus-absolute">
              <LineChart :title="'运行中进程数'" :line-data="processChartData" :is-to-fixed="0" :height="'100%'" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="zeus-mb-20">
        <el-card class="box-card" shadow="hover">
          <span>CPU使用率</span>
          <div class="bg zeus-pt-10 zeus-pb-10 zeus-mt-15">
            <LineChart :title="'26%'" :line-data="memoryUsageChartData" :line-show="false" :height="'170px'" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from '@/components/Basics/LineChart'
import { cpuLoad, cpuUtilization, process, memory } from '@/api/realTime'
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
    this.init()
  },
  methods: {
    init() {
      cpuLoad().then((res) => {
        if (res.code == 200) {
          this.capacityData = res.data
          if (res.data.trends) {
            const chart = res.data.trends.map((i) => {
              return [i.date, Number(i.val)]
            })
            this.capacityChartData = [
              {
                type: 'line',
                showSymbol: false,
                data: chart
              }
            ]
          }
        }
      })
      cpuUtilization().then((res) => {
        if (res.code == 200) {
          if (res.data) {
            const chart = res.data.map((i) => {
              return [i.date, Number(i.val)]
            })
            this.memoryUsageChartData = [
              {
                type: 'line',
                showSymbol: false,
                data: chart
              }
            ]
          }
        }
      })
      process().then((res) => {
        if (res.code == 200) {
          this.processData = res.data
          if (res.data.trends) {
            const chart = res.data.trends.map((i) => {
              return [i.date, Number(i.val)]
            })
            this.processChartData = [
              {
                type: 'line',
                showSymbol: false,
                data: chart
              }
            ]
          }
        }
      })
      memory().then((res) => {
        if (res.code == 200) {
          this.memoryData = res.data
          if (res.data.trends) {
            const chart = res.data.trends.map((i) => {
              return [i.date, Number(i.val)]
            })
            this.memoryChartData = [
              {
                type: 'line',
                showSymbol: false,
                data: chart
              }
            ]
          }
        }
      })
    }
  }
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
