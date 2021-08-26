<!-- 最新数据页面 -->
<template>
  <div class="latest">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>最新数据</template>
      <template v-slot:subhead>这里是最新数据</template>
    </ListHeadTemplate>
    <SearchForm :params="formParams" :columns="columns" @search="search" />
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import { getLatestList } from '@/api/analyse'
import { getDeviceList } from '@/api/deviceMgr'
import { getDictListByCode } from '@/api/system'
import { getProductList } from '@/api/porductMgr'

export default {
  name: 'Latest',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    ListHeadTemplate,
    BusinessTable,
    SearchForm,
    Pagination
  },
  data() {
    return {
      formParams: [],
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      columns: [
        {
          label: '属性名称',
          prop: 'name',
          show: true
        },
        {
          label: '值',
          prop: 'value',
          show: true
        },
        {
          label: '单位',
          prop: 'unitsName',
          show: true
        },
        {
          label: '更新时间',
          prop: 'clock',
          show: true
        }
      ],
      deviceList: [],
      attributeList: [],
      form: {
        deviceId: '',
        attrIds: []
      }
    }
  },
  async created() {
    await this.searchInit()
    await this.getList()
  },
  methods: {
    async searchInit() {
      // 获取设备列表
      await getDeviceList({}).then((res) => {
        if (res.code == 200) {
          this.deviceList = res.data
          if (res.data.length) {
            this.form.deviceId = res.data.[0].deviceId
          }
        }
      })
      // 获取属性列表
      // await getDictListByCode({ dictTypeCode: 'DEVICE_TYPE' }).then((res) => {
      //   if (res.code == 200) {
      //     this.attributeList = res.data
      //   }
      // })
      this.formParams = [
        {
          componentName: 'SelectTemplate',
          keyName: 'deviceId',
          label: '设备',
          optionId: 'deviceId',
          optionName: 'name',
          options: this.deviceList
        },
      ]
    },
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getLatestList({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
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
  }
}
</script>

<style lang="scss" scoped>
.latest {

}
</style>
