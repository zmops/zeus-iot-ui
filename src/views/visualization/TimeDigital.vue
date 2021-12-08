<template>
  <div class="digital-container">
    <i>
      <svg-icon
        v-if="tens !== null"
        :iconClass="table[tens]"
        style="font-size:40px;"
      />
    </i>
    <i>
      <svg-icon
        v-if="units !== null"
        :iconClass="table[units]"
        style="font-size:40px;"
      />
    </i>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  props: {
    time: {
      type: Number,
      default: 0,
    },

    table: {
      type: Object,
      default() {
        return {
          0: 'fullscreen-time-zero',
          1: 'fullscreen-time-one',
          2: 'fullscreen-time-two',
          3: 'fullscreen-time-three',
          4: 'fullscreen-time-four',
          5: 'fullscreen-time-five',
          6: 'fullscreen-time-six',
          7: 'fullscreen-time-seven',
          8: 'fullscreen-time-eight',
          9: 'fullscreen-time-nine'
        }
      },
    },
  },
  components: {
    SvgIcon,
  },
  watch: {
    time: {
      immediate: true,
      handler(val) {
        this.units = null
        this.tens = null
        //第一步将数值分解为个，十，百，千单个数据
        this.units = val % 10
        this.tens = parseInt((val % 100) / 10)
        // console.log(`unit:${this.units},tens:${this.tens}, `);
      },
    },
  },
  data() {
    return {
      units: null, //个位
      tens: null, //十位
    }
  },
  mounted() {
  },
}
</script>

<style lang="scss" scoped>
.digital-container {
  position: relative;
  display: flex;
  flex-direction: row;
  //width: 50px;
  height: 31px;
  justify-content: center;
  align-items: center;
  //margin-top: 10px;
  // background-color: azure;

  i{
    margin-right: 3px;
  }

  .svg-icon {
    width: 20px !important;
    //box-shadow: 2px 2px 2px 2px #26528473;
  }
}
</style>
