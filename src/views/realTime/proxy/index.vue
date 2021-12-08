<!-- 代理监控页面 -->
<template>
  <div class="proxy">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>代理监控</template>
      <template v-slot:subhead></template>
    </ListHeadTemplate>
    <div v-for="(item, index) in tableData" :key="index" class="zeus-pt-20 zeus-pb-20 zeus-pl-20 zeus-pr-20 proxyList">
      <div>
        <svg-icon :icon-class="$route.meta.icon24" style="font-size: 40px" />
        <div class="zeus-inline-block title">
          <div class="name">{{ item.proxyName }}</div>
          <div class="ip">{{ item.proxyId }}</div>
        </div>
        <div class="zeus-inline-block zeus-right">
          <el-button round size="small" type="text" class="but" @click="detail(item.proxyId)">
            <svg-icon icon-class="list_detail" /> 运行详情
          </el-button>
        </div>
      </div>
      <div class="zeus-mt-25 proxy-list-item">
        <el-row :gutter="8">
          <el-col :span="12">
            <el-row class="system">
              <el-col :span="6">
                <svg-icon icon-class="proxy_os" style="font-size: 40px" />
                <span class="title">操作系统</span>
              </el-col>
              <el-col :span="4">
                <div class="value">26%</div>
                <div class="name">内存使用率</div>
              </el-col>
              <el-col :span="4">
                <div class="value">26%</div>
                <div class="name">CPU使用率</div>
              </el-col>
              <el-col :span="5">
                <div class="value">26%</div>
                <div class="name">CPU负载(1m)</div>
              </el-col>
              <el-col :span="5">
                <div class="value">26%</div>
                <div class="name">CPU负载(5m)</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row class="system">
              <el-col :span="6">
                <svg-icon icon-class="proxy_jvm" style="font-size: 40px" />
                <span class="title">JVM</span>
              </el-col>
              <el-col :span="9">
                <div class="value">26%</div>
                <div class="name">JVM内存使用率</div>
              </el-col>
              <el-col :span="9">
                <div class="value">26%</div>
                <div class="name">JVM总内存</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row class="system">
              <el-col :span="6">
                <svg-icon icon-class="proxy_zabbix" style="font-size: 40px" />
                <span class="title">Zabbix代理</span>
              </el-col>
              <el-col :span="6">
                <div class="value">2个/s</div>
                <div class="name">值处理速率</div>
              </el-col>
              <el-col :span="6">
                <div class="value">26%</div>
                <div class="name">主动上报采集器进程使用率</div>
              </el-col>
              <el-col :span="6">
                <div class="value">26个/s</div>
                <div class="name">值缓存命中速率</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row class="system">
              <el-col :span="6">
                <svg-icon icon-class="proxy_sql" style="font-size: 40px" />
                <span class="title">PostgreSQL</span>
              </el-col>
              <el-col :span="4">
                <div class="value">25%</div>
                <div class="name">连接使用率</div>
              </el-col>
              <el-col :span="4">
                <div class="value">28小时</div>
                <div class="name">已运行</div>
              </el-col>
              <el-col :span="5">
                <div class="value">26个/s</div>
                <div class="name">死锁产生速率</div>
              </el-col>
              <el-col :span="5">
                <div class="value">正常</div>
                <div class="name">测试连接状态</div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import { monitorInfo } from '@/api/realTime'

export default {
  name: 'proxy',
  components: {
    ListHeadTemplate
  },
  data() {
    return {
      tableData: [],
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      monitorInfo({}).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
        }
      }).catch(() => {
        this.loading = false
      })
    },
    detail(id) {
      this.$router.push({
        path: '/realTime/proxy/detail',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.proxy {
  width: 100%;
  .proxyList{
    width: 100%;
    background-color: #fff;
    margin-bottom: 12px;

    .but{
      padding: 10px 15px;

      &:hover{
        background-color: #EFF4F9!important;
      }
    }

    .title{
      margin-left: 13px;
    }

    .name{
      color: #242E42;
      font-size: 12px;
      font-weight: bold;
    }

    .ip{
      margin-top: 10px;
      color: #242E42;
      font-size: 12px;
    }

    .proxy-list-item{
      background-color: #F9FBFD;
      padding: 4px 12px 12px 12px;

      .system{
        margin-top: 8px;
        padding: 18px;
        background-color: #fff;
        border: #CCD3DB 1px solid;
        border-radius: 4px;

        .title{
          line-height: 40px;
          vertical-align: top;
          font-size: 12px;
          color: #242E42;
        }

        .value{
          color: #242E42;
          font-size: 13px;
        }

        .name{
          margin-top: 8px;
          color: #79879C;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
