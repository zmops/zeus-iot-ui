<!-- 节假日管理页面 -->
<template>
  <div class="sys-param">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>节假日管理</template>
      <template v-slot:subhead></template>
    </ListHeadTemplate>
    <Calendar
      class="custom-calendar max-w-full"
      ref="calendar"
      :masks="masks"
      :attributes="attributes"
      disable-page-swipe
      is-expanded
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="my-day" @click="setDay(day)">
          <span class="my-day-title">{{ day.day }}</span>
          <div v-for="attr in attributes" :key="attr.key" class="zeus-text-align-c zeus-pt-5 zeus-pb-5 my-day-type" :class="attr.customData.class" @click="setDialog(attr.customData.type)">{{ attr.customData.title }}</div>
        </div>
      </template>
    </Calendar>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'500px'"
      :show-close="false"
      @close="radio = 0"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          设置节假日
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false"/>
        </div>
      </div>
      <div class="day-body">
        <el-radio-group v-model="radio">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">上班</el-radio>
          <el-radio :label="2">休息</el-radio>
        </el-radio-group>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="submit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import { vacationList, vacationUpdate } from '@/api/system'
import { Calendar } from 'v-calendar'
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'

export default {
  name: 'SysParam',
  components: {
    Calendar,
    ListHeadTemplate
  },
  data() {
    return {
      dialogVisible: false,
      radio: 0,
      masks: {
        weekdays: 'WWW'
      },
      date: '',
      attributes: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      vacationList().then((res) => {
        this.loading = false
        if (res.code == 200) {
          // this.list = res.data
          this.attributes = res.data.map((i) => {
            let customData = { title: '', class: '' }
            if (i.type == '1') {
              customData = {
                title: '上班',
                class: 'workday',
                type: i.type
              }
            } else if (i.type == '2') {
              customData = {
                title: '休息',
                class: 'day-off',
                type: i.type
              }
            }
            return { key: i.id, customData, dates: new Date(i.date) }
          })
        }
      }).catch(() => {
        this.loading = false
      })
    },
    setDay(day) {
      this.date = day.id
      this.dialogVisible = true
    },
    setDialog(type) {
      this.radio = Number(type)
    },
    /* 提交表单 */
    submit() {
      vacationUpdate({ date: this.date, type: this.radio }).then(async(res) => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.dialogVisible = false
          await this.getList()
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.my-day{
  height: 100%;
  cursor: pointer;
  //padding: 6px;

  &:hover{
    background-color: #b4e8ff;
  }
}

.my-day-title{
  position: absolute;
  top: 5px;
  left: 5px
}

.my-day-type{
  height: 100%;
  line-height: 86px;
}

.workday {
  background-color: #bebef1 !important;
  color: #6767db !important;
  &:hover{
    background-color: #b4e8ff!important;
  }
}
.day-off{
  background-color: #FDE3E4!important;
  color: #F73131!important;
  &:hover{
    background-color: #b4e8ff!important;
  }
}
.day-body{
  height: 300px;
  padding: 20px;
  line-height: 200px;
  text-align: center;
}
.sys-param {
  width: 100%;
  padding-bottom: 30px;
}

::-webkit-scrollbar {
  width: 0px;
}

::-webkit-scrollbar-track {
  display: none;
}

::v-deep .custom-calendar.vc-container {
  --day-border: 1px solid #b8c2cc;
  --day-border-highlight: 1px solid #b8c2cc;
  --day-width: 90px;
  --day-height: 90px;
  --weekday-bg: #f8fafc;
  --weekday-border: 1px solid #eaeaea;
  border-radius: 0;
  width: 100%;

  & .vc-header {
    background-color: #f1f5f8;
    padding: 10px 0;
  }

  & .vc-weeks {
    padding: 0;
  }

  & .vc-weekday {
    background-color: var(--weekday-bg);
    border-bottom: var(--weekday-border);
    border-top: var(--weekday-border);
    padding: 5px 0;
  }

  & .vc-day {
    //padding: 0 5px 3px 5px;
    text-align: left;
    height: var(--day-height);
    min-width: var(--day-width);
    background-color: white;

    &.weekday-1,
    &.weekday-7 {
      background-color: #eff8ff;
    }

    &:not(.on-bottom) {
      border-bottom: var(--day-border);

      &.weekday-1 {
        border-bottom: var(--day-border-highlight);
      }
    }

    &:not(.on-right) {
      border-right: var(--day-border);
    }
  }

  & .vc-day-dots {
    margin-bottom: 5px;
  }
}
</style>
