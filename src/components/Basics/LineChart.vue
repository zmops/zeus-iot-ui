<template>
  <div class="myChart" :style="{ width: width, height: height }">
    <div ref="myChart" :style="{ width: width, height: height }"></div>
    <div v-if="lineShow && lineData.length === 0" class="noData">
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { ftimestampToData } from '@/utils/index'

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
    },
    maxY: {
      type: [Number, String],
      default: 'dataMax'
    },
    isToFixed: { // 是否保留小数,保留几位小数就传几,不做处理则传0
      type: Number,
      default: 2
    },
    conversion: { // 是否进行单位换算,默认不转换
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null,
      newData: [],
      unit2: ''
    }
  },
  watch: {
    lineData: {
      immediate: true,
      deep: true,
      handler: function(val) {
        if (this.conversion === 0) {// 不做单位换算
          this.newData = val
          this.unit2 = this.unit
        } else {
          let lineData1 = val.map((e) => {
            return e[1]
          })
          let max = Math.max(...lineData1)
          let unit = {}
          if (this.conversion === 1024) {
            unit = this.unitTool2(max)
          } else if (this.conversion === 1000) {
            unit = this.unitTool(max)
          }
          this.unit2 = unit.units + this.unit
          let newArr1 = []
          val.forEach((item) => {
            if (item[1]) {
              newArr1.push([item[0], item[1] / unit.unit])
            } else {
              newArr1.push([item[0], item[1]])
            }
          })
          this.newData = newArr1
        }
        this.$nextTick(() => {
          this.initChart()
        })
      }
    }
  },
  mounted() {
    // this.timer = setInterval(() => {
    //   this.chart && this.chart.resize()
    // }, 500)
    // this.$nextTick(() => {
    //     this.initChart()
    // })
  },
  beforeDestroy() {
    // if (!this.chart) {
    //   return
    // }
    // this.chart.dispose()
    // this.chart = null
  },
  methods: {
    unitTool(spreadMax) {
      let obj = {}
      if (spreadMax > 1000000000000) {
        obj.units = 'T'
        obj.unit = 1000000000000
      } else if (spreadMax > 1000000000) {
        obj.units = 'G'
        obj.unit = 1000000000
      } else if (spreadMax > 1000000) {
        obj.units = 'M'
        obj.unit = 1000000
      } else if (spreadMax > 1000) {
        obj.units = 'K'
        obj.unit = 1000
      } else {
        obj.units = ''
        obj.unit = 1
      }
      return obj
    },
    unitTool2(spreadMax) {
      let obj = {}
      if (spreadMax > 1024 * 1024 * 1024 * 1024) {
        obj.units = 'T'
        obj.unit = 1024 * 1024 * 1024 * 1024
      } else if (spreadMax > 1024 * 1024 * 1024) {
        obj.units = 'G'
        obj.unit = 1024 * 1024 * 1024
      } else if (spreadMax > 1024 * 1024) {
        obj.units = 'M'
        obj.unit = 1024 * 1024
      } else if (spreadMax > 1024) {
        obj.units = 'K'
        obj.unit = 1024
      } else {
        obj.units = ''
        obj.unit = 1
      }
      return obj
    },
    // 判断是否有数据,无数据是不加载
    // judge(){
    //     let _this=this
    //     if (_this.lineData.length>0){
    //         this.initChart()
    //     }
    // },
    initChart() {
      const chart = echarts.init(this.$refs.myChart)
      // 数据
      const vm = this
      let tooltip = {
        show: false
      }
      let unit = ''
      if (this.unit2) {
        if (this.unit2 !== 'null') {
          unit = this.unit2
        }
        tooltip = {
          trigger: 'axis',
          backgroundColor: '#ffffff',
          borderColor: '#EBEEF5',
          borderWidth: 1,
          extraCssText: 'box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);',
          axisPointer: {
            type: 'line'
          },
          formatter: function(params) {
            let items = params[0]
            let i = items.dataIndex
            let time = ftimestampToData(vm.newData[i][0])
            let val = '--'
            if (items.value[1] !== null) {
              if (vm.isToFixed) {
                val = items.value[1].toFixed(vm.isToFixed) + unit
              } else {
                val = items.value[1] + unit
              }
            }
            let str = ''
            str +=
              '<div style="color: #12191f; line-height:24px;">' +
              time +
              ' ' +
              val +
              '</div>'
            return str
          }
          //   formatter: '{b} : {c}' + this.unit,
        }
      }
      let option = {
        tooltip: tooltip,
        title: {
          text: '单位:' + unit,
          textStyle: {
            fontSize: 12
          }
        },
        grid: {
          left: '1%',
          right: '20',
          bottom: this.dataZoomBol ? '40px' : '1%',
          top: '35',
          containLabel: true,
          borderColor: '#fc0c0c'
        },
        xAxis: {
          type: 'time',
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
            show: this.lineShow,
            lineStyle: {
              color: '#E5E9ED'
              // 	opacity:0.1
            }
          },
          splitArea: {
            // 背景分割样式
            show: this.lineShow,
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
              interval: 20,
              formatter: function(value, index) {
                if (vm.isToFixed) {
                  return value.toFixed(vm.isToFixed)
                } else {
                  return value
                }
              }
            },
            axisLine: {
              show: false
            },
            max: this.maxY,
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E5E9ED'
                // 	opacity:0.1
              }
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'line',
            symbolSize: 1, // 折线折点的大小
            showSymbol: false,// 是否显示折点,不影响鼠标选中的效果
            itemStyle: {
              normal: {
                color: this.lineColor,
                lineStyle: {
                  color: this.lineColor,
                  width: 1
                },
                areaStyle: {
                  color: this.color
                }
              }
            },
            // data: this.lineData.map((v) => {
            //   return Number(v).toFixed(2)
            // }),
            data: this.newData
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
.myChart {
  position: relative;

  .noData {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 10;
    background-color: #ffffff;
    text-align: center;
    margin-top: -60px;
    margin-left: -50px;

    .noData-icon {
      font-size: 80px;
    }

    div {
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
