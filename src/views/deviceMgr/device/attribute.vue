<!-- 设备详情-属性页面 -->
<template>
  <div class="attribute">
    <SearchForm :params="formParams" @search="search" />
    <div class="zeus-mt-10 zeus-pl-10 zeus-pr-10 zeus-pb-10 list" v-load="loading">
      <el-row v-if="this.tableData.length" :gutter="10">
        <el-col v-for="(item, index) in tableData" :key="index" :span="6" class="zeus-mt-10">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>{{ item.name }}</span>
              <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-pie-chart">历史数据</el-button>
            </div>
            <div class="body zeus-bold">52%</div>
            <div class="footer">
              <span>sth</span>&nbsp;|&nbsp;
              <span>整数</span>&nbsp;|&nbsp;
              <span>2021-08-17 18:13:30</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-empty v-else description="暂无数据"></el-empty>
      <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import { getAttrTrapperByPage } from '@/api/deviceMgr'
export default {
  name: 'Attribute',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    SearchForm,
    Pagination
  },
  data() {
    return {
      form: {
        attrName: '',
        key: ''
      },
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'attrName',
          label: '属性名称'
        },
        {
          componentName: 'InputTemplate',
          keyName: 'key',
          label: '属性标识'
        }
      ]
    }
  },
  created() {
    if (this.$route.query.id) {
      this.form.prodId = this.$route.query.id
      this.getList()
    }
  },
  methods: {
    getList() {
      this.loading = true
      getAttrTrapperByPage({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    search() {

    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
  }
}
</script>

<style lang="scss" scoped>
.attribute {
  width: 100%;

  .list{
    background-color: #fff;
  }

  .box-card{

    .body{
      height: 120px;
      line-height: 50px;
      font-size: 18px;
    }

    .footer{
      font-size: 12px;
      color: #87909D;
    }
  }
}
</style>
