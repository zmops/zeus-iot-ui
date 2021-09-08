<!--全局概览页面-->
<template>
  <div class="globalOverview">
    <div class="time">
      <el-date-picker
        v-model="time"
        type="datetimerange"
        clearable
        size="mini"
        prefix-icon="el-icon-date"
        value-format="timestamp"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </div>
    <el-row :gutter="20" class="zeus-mt-10">
      <el-col :span="12">
        <el-card class="box-card" shadow="hover">
          <span>在线设备</span>
          <div class="zeus-mt-10 flex">
            <div class="chunk1 bg zeus-inline-block">
              <el-row class="hang">
                <el-col :span="12" class="label">在线设备:</el-col>
                <el-col :span="12">158</el-col>
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">设备总数:</el-col>
                <el-col :span="12">512</el-col>
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">未启用设备:</el-col>
                <el-col :span="12">52</el-col>
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">产品:</el-col>
                <el-col :span="12">35</el-col>
              </el-row>
            </div>
            <div class="chart1 bg zeus-inline-block">
              <LineChart :title="'在线设备趋势'" :line-data="chartData" :is-to-fixed="0" :height="'100%'" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="hover">
          <span>未解决告警</span>
          <div class="zeus-mt-10 flex">
            <div class="chunk1 bg zeus-inline-block">
              <el-row class="hang">
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">未解决告警:</el-col>
                <el-col :span="12">12</el-col>
              </el-row>
              <el-row class="hang">
                <el-col :span="12" class="label">今日告警:</el-col>
                <el-col :span="12">5</el-col>
              </el-row>
              <el-row class="hang">
              </el-row>
            </div>
            <div class="chart1 bg zeus-inline-block">
              <LineChart :title="'在线设备趋势'" :line-data="chartData" :is-to-fixed="0" :height="'100%'" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="zeus-mt-20">
        <el-card class="box-card" shadow="hover">
          <span>今日调用服务</span>
          <div class="zeus-right">
            <span class="c-hui">近7日调用服务: </span>8585
          </div>
          <div class="bg zeus-pt-10 zeus-pb-10 zeus-pl-10 zeus-pr-10 zeus-mt-15">
            <LineChart :title="'7580'" :line-data="chartData" :line-show="false" :height="'152px'" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="zeus-mt-20">
        <el-card class="box-card" shadow="hover">
          <span>今日事件</span>
          <div class="zeus-right">
            <span class="c-hui">近7日事件: </span>8585
          </div>
          <div class="bg zeus-pt-10 zeus-pb-10 zeus-pl-10 zeus-pr-10 zeus-mt-15">
            <LineChart :title="'7580'" :line-data="chartData" :line-show="false" :height="'152px'" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="zeus-mt-20">
        <el-card class="box-card" shadow="hover">
          <span>取数速率(个/s)</span>
          <div class="bg zeus-pt-10 zeus-pb-10 zeus-pl-10 zeus-pr-10 zeus-mt-15">
            <LineChart :title="'7580'" :line-data="chartData" :line-show="false" :height="'152px'" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="10" class="zeus-mt-20">
        <el-card class="box-card data-size" shadow="hover">
          <span>数据量统计</span>
          <el-row :gutter="6" class="zeus-mt-15">
            <el-col :span="12">
              <div class="bg stat">
                <svg-icon icon-class="jrlssj" class="zeus-mr-5" />
                <span>今日历史数据条数</span>
                <span class="zeus-right">7,580</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="bg stat">
                <svg-icon icon-class="zlssjts" class="zeus-mr-5" />
                <span>总历史数据条数</span>
                <span class="zeus-right">7,580</span>
              </div>
            </el-col>
            <el-col :span="12" class="zeus-mt-5">
              <div class="bg stat">
                <svg-icon icon-class="zlssjkj" class="zeus-mr-5" />
                <span>总历史数据空间</span>
                <span class="zeus-right">57GB</span>
              </div>
            </el-col>
            <el-col :span="12" class="zeus-mt-5">
              <div class="bg stat">
                <svg-icon icon-class="zfwdycs" class="zeus-mr-5" />
                <span>总服务调用次数</span>
                <span class="zeus-right">7,580</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="14" class="zeus-mt-20">
        <el-card class="box-card" shadow="hover">
          <span>告警数量</span>
          <div class="bg zeus-pt-10 zeus-pb-10 zeus-pl-10 zeus-pr-10 zeus-mt-15">
            <BarChart :height="'160px'"></BarChart>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import LineChart from '@/components/Basics/LineChart'
import BarChart from '@/components/Basics/BarChart'
export default {
  name: "globalOverview",
  components: {
    LineChart,
    BarChart
  },
  data() {
    return {
      time: [],
      chartData:[[1630897200000,1],[1630900800000,8],[1630904400000,7],[1630908000000,6],[1630911600000,7],[1630915200000,6],[1630918800000,7],[1630922400000,7],[1630926000000,7],[1630929600000,6],[1630933200000,5],[1630936800000,5],[1630940400000,4],[1630944000000,4],[1630947600000,4],[1630951200000,3],[1630954800000,2],[1630958400000,2],[1630962000000,3],[1630965600000,3],[1630969200000,3],[1630972800000,3],[1630976400000,7],[1630980000000,8],[1630983600000,5]]
    }
  },
  created() {

  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.globalOverview {
  padding: 0 10px;

  .time{
    text-align: right;
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
    padding: 14px;
    height: 195px;
    flex: 1;
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
    height: 255px;
  }

}
</style>
