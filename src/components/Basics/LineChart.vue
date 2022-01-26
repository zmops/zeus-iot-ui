<template>
  <div class="myChart" :style="{ width: width, height: height }">
    <div ref="myChart" :style="{ width: width, height: height }"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '140px'
    },
    unit: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default() {
        return '#E8F2F8'
      }
    },
    lineColor: {
      type: String,
      default() {
        return '#5F8EFD'
      }
    },
    lineShow: {
      type: Boolean,
      default: true
    },
    lineData: {
      type: [Array, Object],
      default() {
        return []
      }
    },
    dataZoomBol: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null,
      unit2: ''
    }
  },
  watch: {
    lineData: {
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
      const chart = echarts.init(this.$refs.myChart, 'light')
      const option = {
        title: {
          text: this.title,
          left: 20,
          top: 0,
          textStyle: {
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'axis',
          type: 'line',
          confine: true
        },
        grid: {
          left: '30',
          right: '40',
          bottom: this.dataZoomBol ? '40px' : '0px',
          top: '55',
          containLabel: true,
          borderColor: '#fc0c0c'
        },
        legend: {
          icon: 'circle',
          right: '10',
          top: this.title ? '12' : 0
          // data: [
          //   'character','avg','log','not supported','numeric (float)','text','numeric (unsigned)'
          // ]
        },
        xAxis: {
          type: 'category',
          boundaryGap: false, // 坐标轴两边留白
          axisLabel: {
            // 坐标轴刻度标签的相关设置。
            show: this.lineShow,
            interval: 'auto', // 设置为 1，表示『隔一个标签显示一个标签』
            margin: 15,
            textStyle: {
              color: '#a6a7aa',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12
            }
          },
          axisTick: {
            // 坐标轴刻度相关设置。
            show: false
          },
          axisLine: {
            // 坐标轴轴线相关设置
            show: this.lineShow,
            lineStyle: {
              color: '#E5E9ED'
              // opacity:0.2
            }
          },
          splitLine: {
            // 坐标轴在 grid 区域中的分隔线。
            show: false,
            lineStyle: {
              color: '#E5E9ED'
              // 	opacity:0.1
            }
          },
          splitArea: {
            // 背景分割样式
            show: false,
            areaStyle: {
              color: ['#ffffff', '#F9F9FB']
            }
          }
        },
        dataZoom: [
          {
            show: this.dataZoomBol,
            realtime: true,
            start: 0,
            end: 100
          },
          {
            show: this.dataZoomBol,
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitNumber: 5,
            axisLabel: {
              show: this.lineShow,
              textStyle: {
                color: '#a8aab0',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 12
              },
              interval: 20
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: this.lineShow,
              lineStyle: {
                color: '#E5E9ED'
                // 	opacity:0.1
              }
            }
          }
        ],
        color: ['#D14643', '#F5A623', '#FFE400', '#50ABD5', '#6EC59C'],
        series: this.lineData
      }
      chart.clear()
      chart.setOption(option)
      window.addEventListener('resize', () => {
        if (chart) {
          chart.resize()
        }
      });
    }
  }
}
</script>

<!--<style lang="scss" scoped>-->
<!--.myChart {-->
<!--}-->
<!--</style>-->
