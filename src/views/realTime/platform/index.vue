<template>
  <div class="platform">
    <el-row class="head">
      <el-col :span="12">
        <div class="radio">
          <div v-for="(item, index) in tabs" :key="index" class="radio-button" :class="radio === item ? 'activity' :''" @click="changeTabs(item)">{{item}}</div>
        </div>
      </el-col>
      <el-col :span="12">
<!--        <el-date-picker-->
<!--          v-model="time"-->
<!--          class="zeus-right date"-->
<!--          type="datetimerange"-->
<!--          clearable-->
<!--          size="mini"-->
<!--          prefix-icon="el-icon-date"-->
<!--          value-format="timestamp"-->
<!--          range-separator="-"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--          @change="init()"-->
<!--        />-->
      </el-col>
    </el-row>
    <os v-if="radio === '操作系统'" />
    <jvm v-if="radio === 'JVM'" />
    <zabbix v-if="radio === 'Zabbix代理'" />
    <sql v-if="radio === 'PostgreSQL'" />
  </div>
</template>

<script>
import os from '@/views/realTime/proxy/os'
import jvm from '@/views/realTime/proxy/jvm'
import zabbix from '@/views/realTime/proxy/zabbix'
import sql from '@/views/realTime/proxy/sql'

export default {
  name: 'platform',
  components: {
    os,
    jvm,
    zabbix,
    sql
  },
  data() {
    return {
      radio: '操作系统',
      tabs: ['操作系统', 'JVM', 'Zabbix代理', 'PostgreSQL'],
      time: []
    }
  },
  created() {
    if (this.$route.query.tabsName) {
      this.radio = this.$route.query.tabsName
    }
  },
  methods: {
    changeTabs(name) {
      this.radio = name
      const { path, query } = this.$route
      this.$router.replace({
        path,
        query: {
          ...query,
          tabsName: name
        }
      })
    },
    init(){

    }
  }
}
</script>

<style lang="scss" scoped>
.platform {
  width: 100%;
  .head{
    width: 100%;
    background-color: #F2F5FC;
    padding: 6px 8px;
    box-shadow: 4px 4px 8px 0 #E2EAF2;

    .radio {
      width: 400px;
      height: 33px;
      line-height: 28px;
      padding: 2px;
      border-radius: 25px;
      border: 1px #CCD3DB solid;
      background-color: #F9FBFD;
      display: flex;

      .radio-button {
        flex: 1;
        text-align: center;
        font-size: 12px;
        color: #5F708A;
        cursor: pointer;
        &:hover{
          background-color: #ebeff7;
          border-radius: 25px;
        }
      }

      .activity {
        background-color: #36435C;
        color: #fff;
        border-radius: 25px;
        &:hover{
          background-color: #36435C;
          color: #fff;
          border-radius: 25px;
        }
      }

    }
    ::v-deep.el-input__inner{
      border-radius: 20px!important;
      height: 32px!important;
      background: #F9FBFD;
      border: 1px solid #CCD3DB;
      .el-range-input{
        background: #F9FBFD;
      }
      .el-range-input::placeholder{
        color: #5F708A;
      }
    }
    ::v-deep.el-input__inner:hover{
      border: 1px solid #79879C;
    }
  }
}
</style>
