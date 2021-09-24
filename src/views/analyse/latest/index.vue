<!-- 最新数据页面 -->
<template>
  <div class="latest">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>最新数据</template>
      <template v-slot:subhead></template>
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
import { getDeviceList, getAttrTrapperList } from '@/api/deviceMgr'
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
      formParams: [
        {
          componentName: 'SelectTemplate',
          keyName: 'deviceId',
          label: '设备',
          optionId: 'deviceId',
          optionName: 'name',
          options: this.deviceList
        },
        {
          componentName: 'SelectTemplate',
          keyName: 'attrIds',
          multiple: true,
          label: '属性',
          w: 300,
          optionId: 'attrId',
          optionName: 'name',
          options: this.attrList
        }
      ],
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
      attrList: [],
      attributeList: [],
      form: {
        deviceId: '',
        attrIds: []
      }
    }
  },
  watch: {
    'form.attrIds': {
      handler(val) {
        this.getList()
      }
    },
    'form.deviceId': {
      immediate: true,
      handler(val) {
        this.form.attrIds = []
        if (val === '') {
          this.formParams = [
            {
              componentName: 'SelectTemplate',
              keyName: 'deviceId',
              label: '设备',
              optionId: 'deviceId',
              optionName: 'name',
              options: this.deviceList
            },
            {
              componentName: 'SelectTemplate',
              keyName: 'attrIds',
              multiple: true,
              label: '属性',
              w: 300,
              optionId: 'attrId',
              optionName: 'attrName',
              options: []
            }
          ]
        } else {
          getAttrTrapperList({ prodId: val }).then((res) => {
            if (res.code == 200) {
              this.attrList = res.data
              this.formParams = [
                {
                  componentName: 'SelectTemplate',
                  keyName: 'deviceId',
                  label: '设备',
                  optionId: 'deviceId',
                  optionName: 'name',
                  options: this.deviceList
                },
                {
                  componentName: 'SelectTemplate',
                  keyName: 'attrIds',
                  multiple: true,
                  label: '属性',
                  w: 300,
                  optionId: 'attrId',
                  optionName: 'attrName',
                  options: this.attrList
                }
              ]
            }
          })
        }
        this.getList()
      }
    }
  },
  created() {
    this.searchInit()
  },
  methods: {
    searchInit() {
      // 获取设备列表
      getDeviceList({}).then((res) => {
        if (res.code == 200) {
          const data = res.data
          this.deviceList = data
          if (data.length) {
            this.form.deviceId = data[0].deviceId
          }
        }
      })
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
    }
  }
}
</script>
