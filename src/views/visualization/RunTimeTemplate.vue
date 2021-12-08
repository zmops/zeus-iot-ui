<!-- 终端监控-运行时长 -->
<template>
  <div :class="bg===1?'sRunningTime':'RunningTime'">
    <span class="title">运 行 时 长</span>
    <div class="time">
      <div class="time-item day bg">{{ day }}</div>
      <div class="time-item unit">Day</div>
      <div class="time-item bg hour">{{ h }}</div>
      <div class="time-item unit">h</div>
      <div class="time-item bg hour">{{ m }}</div>
      <div class="time-item unit">m</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RunTimeTemplate',
  props: {
    moId: {
      type: [String, Number],
      default: 0,
    },
    uptime: {
      type: [String, Number],
    },
    bg:{
      type:Number,
    }
  },
  watch: {
    uptime: {
      deep: true,
      immediate: true,
      handler: function (val) {
          if (this.uptime) {
            let day = Math.floor(this.uptime / (24 * 3600)) // Math.floor()向下取整
            let hour = Math.floor((this.uptime - day * 24 * 3600) / 3600)
            let minute = Math.floor(
              (this.uptime - day * 24 * 3600 - hour * 3600) / 60
            )
            this.day = day < 10 ? '0' + day : day
            this.h = hour < 10 ? '0' + hour : hour
            this.m = minute < 10 ? '0' + minute : minute
          } else {
            this.day = '--'
            this.h = '--'
            this.m = '--'
          }
      },
    },
  },
  data() {
    return {
      day: 0,
      h: 0,
      m: 0,
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.RunningTime {
  width: 100%;
  height: 100px;
  padding-top: 15px;
    padding-left: 20px;
    padding-right: 24px;
  border: 1px #dee5ed solid;
  display: flex;
  justify-content: center;

  .title {
    writing-mode: vertical-lr;
    height: 75px;
    padding-top: 3px;
    color: #12191f;
  }

  .time {
    margin-left: 24px;
    display: inline-block;
    vertical-align: top;
    width: 326px;
    height: 70px;
    padding: 10px 14px 12px 16px;
    border-radius: 6px;
    background-image: linear-gradient(#e0e3e5, #b1bac4);

    .bg {
      text-align: center;
      color: #12191f;
      font-size: 24px;
      border-radius: 4px;
      //box-shadow: 0px -1px 2px 0px #464646;
      //background-image: linear-gradient(#dadfe5, #f4f6f8, #cbd3da);
    }

    .time-item {
      display: inline-block;
      vertical-align: bottom;
      height: 48px;
      line-height: 48px;
    }

    .day {
      width: 60px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      -moz-background-size: 100% 100%;
      position: relative;
      background-image: url('../../assets/terminal/run-time-day.png');
    }

    .hour {
      margin-left: 12px;
      width: 44px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      -moz-background-size: 100% 100%;
      position: relative;
      background-image: url('../../assets/terminal/run-time-h.png');
    }

    .unit {
      margin-left: 4px;
      color: #12191f;
      font-size: 14px;
    }
  }
}
.sRunningTime{
  width: 100%;
  height: 100px;
    padding-top: 15px;
    padding-left: 20px;
    padding-right: 24px;
  border: 1px solid;
  display: flex;
  justify-content: center;
  border-image: linear-gradient(0deg, #0c5270, #0c5270) 10 10;
  background: linear-gradient(183deg, rgba(0, 186, 255, 0.2) 0%, rgba(0, 168, 255, 0.09) 100%);

  .title {
    writing-mode: vertical-lr;
    height: 80px;
    padding-top: 3px;
    color: #00DEFF;
    font-family: Source Han Sans CN;
    font-weight: 500;
    font-size: 14px;
  }

  .time {
    margin-left: 24px;
    display: inline-block;
    vertical-align: top;
    width: 320px;
    height: 70px;
    padding: 12px;
    border-radius: 6px!important;
    //border-image: linear-gradient(0deg, #065386, #0096E4) 1 1!important;
    background: linear-gradient(0deg, rgba(0, 132, 207, 0.42), rgba(24, 57, 165, 0));
    border: 1px solid #065386;
    .bg {
      text-align: center;
      font-size: 24px;
      color: #00E4FF;
      font-family: Helvetica;
      font-weight: 400;
      background: rgba(1, 18, 50, 0.22);
      border: 1px solid #065284;
      //border-image: linear-gradient(0deg, #065284, #007CB6, #064E79) 1 1;
      box-shadow: 0px 0px 10px 0px rgba(10, 23, 42, 0.51);
      border-radius: 4px;
      //box-shadow: 0px -1px 2px 0px #464646;
      //background-image: linear-gradient(#dadfe5, #f4f6f8, #cbd3da);
    }

    .time-item {
      display: inline-block;
      vertical-align: bottom;
      height: 48px;
      line-height: 48px;
    }

    .day {
      width: 60px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      -moz-background-size: 100% 100%;
      position: relative;
      border-radius: 4px;
      //background-image: url('../../assets/image/run-time-day.png');
    }

    .hour {
      margin-left: 12px;
      width: 44px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      -moz-background-size: 100% 100%;
      position: relative;
      //background-image: url('../../assets/image/run-time-h.png');
    }

    .unit {
      margin-left: 4px;
      color: #00E4FF;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
    }
  }
}
</style>
