<!-- 日志页面 -->
<template>
  <div class="record">
    <div class="search zeus-pl-20">
      <div>
        <div class="zeus-right radio">
          <div v-for="(item, index) in radioList" :key="index" class="radio-button" :class="form.logType === item ? 'activity' :''" @click="changeRadio(item)">
            {{item}}
          </div>
        </div>
      </div>
      <div style="flex: 1">
        <SearchForm :params="formParams" :columns="columns" @search="search"/>
      </div>
    </div>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :h="'calc(100% - 115px)'"
      :icon="$route.meta.icon24"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import { getLogByPage } from '@/api/deviceMgr'

export default {
  name: 'Record',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    SearchForm,
    Pagination
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'DateTimePickerTemplate',
          keyName: 'time',
          label: '触发时间'
        }
      ],
      radioList: ['告警日志', '服务日志', '事件日志'],
      form: {
        logType: '告警日志',
        time: []
      },
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      columns: [
        {
          label: '日志类型',
          prop: 'logType',
          show: true
        },
        {
          label: '触发时间',
          prop: 'triggerTime',
          show: true
        },
        {
          label: '内容',
          prop: 'content',
          show: true
        },
        {
          label: '输入参数',
          prop: 'param',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          show: true
        },
        // {
        //   label: '',
        //   prop: 'buttons',
        //   show: true,
        //   width: 160,
        //   idName: 'id',
        //   fixed: 'right',
        //   buttons: [
        //     {
        //       label: '解决',
        //       event: 'solve'
        //     }
        //   ]
        // }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      if (this.form.time && this.form.time.length) {
        this.form.timeFrom = this.form.time[0]
        this.form.timeTill = this.form.time[0]
      }
      getLogByPage({ ...this.form, maxRow: this.size, page: this.page, deviceId: this.$route.query.id }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    changeRadio(val) {
      this.form.logType = val
      this.search()
    },
    solve(id) {

    }
  }
}
</script>
<style lang="scss" scoped>
.record{
  height: 100%;
}
.search{
  background-color: #F9FBFD;
  display: flex;
  align-items: center;
}
.radio {
  width: 214px;
  height: 33px;
  line-height: 28px;
  padding: 2px;
  border-radius: 25px;
  border: 1px #CCD3DB solid;
  display: flex;

  .radio-button {
    flex: 1;
    text-align: center;
    font-size: 12px;
    color: #5F708A;
    cursor: pointer;
  }

  .activity {
    background-color: #36435C;
    color: #fff;
    border-radius: 25px;
  }

}
</style>
