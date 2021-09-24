<template>
  <div ref="myChart" :style="{ width: width, height: height }"></div>
</template>

<script>
import echarts from "echarts";
import {ftimestampToData} from "@/utils";

export default {
  name: "BarChart",
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '140px'
    },
    infoData: {
      type: [Array, Object],
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  watch: {
    infoData: {
      immediate: true,
      deep: true,
      handler: function(val) {
        this.$nextTick(() => {
          this.initChart()
        })
      }
    }
  },
  methods: {
    initChart() {
      const chart = echarts.init(this.$refs.myChart)
      const option = {
        tooltip: {
          show: false,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '1',
          right: '15',
          bottom: '1',
          top: '1',
          containLabel: true
        },
        xAxis: {
          show: false,
          axisLabel: {
            margin: -20
          }
        },
        yAxis: {
          type: 'category',
          boundaryGap: [0, 0.01],
          data: this.infoData.name,
          axisLabel: {
            margin: 20
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: '设备',
            type: 'bar',
            data: this.infoData.value,
            label: {
              show: true,
              position: 'right',
              color: '#000'
            },
            barWidth: 12,
            itemStyle: {
              color: '#55A2F9'
            }
          }
        ]
      }
      chart.clear()
      chart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.BarChart {

}
</style>
