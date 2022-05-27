<template>
  <div class="DeviceSelect" ref="DeviceSelect">
    <div class="zeus-pt-15 zeus-pb-15 zeus-pl-10 zeus-pr-10 screen">
      <el-row :gutter="10">
        <el-col :span="7">
          <el-cascader
            class="zeus-w100"
            size="mini"
            placeholder="请选择产品分类"
            popper-class="device-cascader"
            v-model="prodTypes"
            :options="productTypeList"
            :show-all-levels="false"
            :props="{ expandTrigger: 'hover',multiple: true,children: 'childrenNodes', checkStrictly: true,value: 'id', label: 'name' }"
          ></el-cascader>
        </el-col>
        <el-col :span="7">
          <el-select v-model="form.productIds" multiple filterable size="mini" placeholder="请选择产品" class="zeus-w100">
            <el-option
              v-for="(item, index) in productList"
              :key="index"
              :label="item.name"
              :value="item.productId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <el-select v-model="form.deviceGroupIds" multiple filterable size="mini" placeholder="请选择设备组" class="zeus-w100">
            <el-option
              v-for="item in deviceGroup"
              :key="item.deviceGroupId"
              :label="item.name"
              :value="item.deviceGroupId.toString()"
            />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button round size="mini" class="but" @click="reset"><svg-icon icon-class="cz" /> 重置</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="7" class="zeus-mt-10">
          <el-input v-model="form.name" size="mini" placeholder="请输入设备名称" @keyup.enter.native="search"/>
        </el-col>
        <el-col :span="7" class="zeus-mt-10">
          <el-input v-model="form.deviceId" size="mini" placeholder="请输入设备ID" @keyup.enter.native="search"/>
        </el-col>
        <el-col :span="3" :offset="7" class="zeus-mt-10">
          <el-button round size="mini" class="but" @click="search"><svg-icon icon-class="list_search" /> 搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="label zeus-mt-5">
      <div class="radio">
        <div v-for="(item, index) in radioList" :key="index" class="radio-button" :class="type === item ? 'activity' :''" @click="type = item">
          {{ item }}
        </div>
      </div>
    </div>
<!--    <el-table-->
<!--      v-if="type === '设备列表'"-->
<!--      :data="tableData"-->
<!--      :loading="loading"-->
<!--      ref="DeviceSelectTable"-->
<!--      style="width: 100%">-->
<!--      <el-table-column prop="name" label="设备名称"></el-table-column>-->
<!--      <el-table-column prop="deviceId" label="设备ID"></el-table-column>-->
<!--      <el-table-column prop="status" label="状态"></el-table-column>-->
<!--    </el-table>-->
    <BusinessTable
      v-if="type === '设备列表'"
      ref="DeviceSelectTable"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :h="'calc(100% - 147px)'"
      :selection="multiple"
      scroll
      @select="handleSelect"
      @selectedItem="selectedItem"
      @load="load"
    />
    <baidu-map
      v-if="type === '设备地图'"
      class="map"
      :zoom="zoom"
      :center="center"
      :ak="selfKey"
      inertial-dragging
      :scroll-wheel-zoom="true"
      @ready="mapReady"
    >
      <bml-marker-clusterer :average-center="true" :styles="[{url, size: {width: 68, height: 68}, textColor: '#fff'}]">
        <bm-marker v-for="(marker, index) of markers" :key="index" :position="{lng: marker.lng, lat: marker.lat}" @click="markerClick(marker.deviceId)">
          <bm-label :content="marker.name" :offset="{width: 0, height: 30}"/>
        </bm-marker>
      </bml-marker-clusterer>
    </baidu-map>
    <el-footer v-if="multiple" class="dialog-footer-btn">
      <el-button size="mini" round @click="closeDialog">取 消</el-button>
      <el-button type="primary" size="mini" :loading="submitLoading" round @click="submit">确 定</el-button>
    </el-footer>
  </div>
</template>

<script>
import { getProductTypeTree, getProductList } from '@/api/porductMgr'
import { getDeviceGrpList, getDeviceByPage } from '@/api/deviceMgr'
import BusinessTable from '@/components/Basics/BusinessTable'
import distribute from '@/assets/distribute.png'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmMarker, BmlMarkerClusterer, BmLabel } from 'vue-baidu-map'

export default {
  name: 'DeviceSelect',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    BaiduMap,
    BmMarker,
    BmLabel,
    BmlMarkerClusterer
  },
  props: {
    deviceIds: {
      type: [Number, String],
      default() {
        return ''
      }
    },
    multiple: Boolean
  },
  data() {
    return {
      form: {
        prodTypes: [],
        productIds: [],
        name: '',
        deviceId: '',
        deviceGroupIds: []
      },
      BMap: null,
      submitLoading: false,
      prodTypes: [],
      selfKey: 'bG3Dzof798yBGM7BzzF1uANWriBPOT5x',
      zoom: 6,
      url: distribute,
      center: {
        lng: 107.451703,
        lat: 34.043414
      },
      markers: [],
      type: '设备列表',
      ids: [],
      h: '',
      productTypeList: [],
      productList: [],
      deviceGroup: [],
      tableData: [],
      radioList: ['设备列表', '设备地图'],
      columns: [
        {
          label: '设备名称',
          prop: 'name',
          event: 'selectedItem',
          show: true
        },
        {
          label: '设备ID',
          prop: 'deviceId',
          show: true
        },
        // {
        //   label: '产品',
        //   prop: 'productName',
        //   show: true
        // },
        // {
        //   label: '设备类型',
        //   prop: 'typeName',
        //   show: true
        // },
        {
          label: '状态',
          prop: 'status',
          status: true,
          show: true
        },
        {
          label: '在线状态',
          prop: 'online',
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '最近在线时间',
          prop: 'latestOnline',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 120,
          idName: 'deviceId',
          buttons: [
            {
              label: '查看详情',
              event: 'detail2',
              icon: 'list_eye'
            }
          ]
        }
      ],
      loading: false,
      page: 0,
      count: 1
    }
  },
  created() {
    // 获取搜索条件
    if (localStorage.getItem('prodTypes')) {
      this.prodTypes = JSON.parse(localStorage.getItem('prodTypes'))
    }
    if (localStorage.getItem('devForm')) {
      this.form = JSON.parse(localStorage.getItem('devForm'))
    }
    this.init()
    // this.getList(true)
    this.$nextTick(() => {
      this.h = this.$refs.DeviceSelect.offsetHeight - 147
    })
  },
  mounted() {

  },
  methods: {
    search() {
      // 保存搜索条件
      localStorage.setItem('prodTypes', JSON.stringify(this.prodTypes))
      localStorage.setItem('devForm', JSON.stringify(this.form))
      this.page = 1
      this.tableData = []
      console.log('search')
      this.getList()
    },
    init() {
      getProductTypeTree().then(res => {
        if (res.code == 200) {
          this.productTypeList = res.data
        }
      })
      getProductList({}).then(res => {
        if (res.code == 200) {
          this.productList = res.data
        }
      })
      getDeviceGrpList({}).then((res) => {
        if (res.code == 200) {
          this.deviceGroup = res.data
        }
      })
    },
    getList(tage) {
      if (this.prodTypes.length > 0) {
        const arr = []
        this.prodTypes.forEach((item) => {
          if (item.length > 0) {
            arr.push(item[item.length - 1])
          }
        })
        this.form.prodTypes = arr
      } else {
        this.form.prodTypes = []
      }
      this.form.page = this.page
      this.form.maxRow = 50
      getDeviceByPage(this.form).then((res) => {
        if (res.code == 200) {
          this.tableData = this.tableData.concat(res.data)
          this.count = res.count
          if (tage) {
            const dev = this.tableData.find((i) => {
              return i.deviceId === this.deviceIds
            })
            this.$refs.DeviceSelectTable.setSelection(dev)
          }
          if (res.data && res.data.length) {
            this.markers = []
            res.data.forEach((i) => {
              if (i.position) {
                const arr = i.position.split(',')
                if (arr.length > 1) {
                  i.lat = arr[1]
                  i.lng = arr[0]
                  i.show = false
                  this.markers.push(i)
                }
              }
            })
          }
        }
      })
    },
    detail2(id) {
      const url = this.$router.resolve({
        path: '/deviceMgr/device/detail',
        query: { id }
      })
      window.open(url.href, '_blank')
    },
    handleSelect(selection, row) {
      // if (row === undefined) {
      //   return false
      // }
      // this.$refs.DeviceSelectTable.clearSelection()
      // this.$refs.DeviceSelectTable.setSelection(row)
      // this.ids = row.deviceId
      this.ids = selection.map((i) => { return i.deviceId })
    },
    reset() {
      this.prodTypes = []
      this.form = {
        prodTypes: [],
        productIds: [],
        name: '',
        deviceId: '',
        deviceGroupIds: []
      }
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    selectedItem(item) {
      this.$emit('checked', item.deviceId)
      this.$emit('closeDialog')
    },
    load() {
      if (this.tableData.length < this.count) {
        console.log('加载....')
        this.page++
        this.getList()
      }
    },
    submit() {
      this.submitLoading = true
      this.$emit('checked', this.ids)
      this.$emit('closeDialog')
    },
    mapReady({ BMap, map }) {
      // console.log(BMap)
      // console.log(map)
      // this.BMap = BMap
    },
    markerClick(deviceId) {
      this.$emit('checked', deviceId)
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="scss" scoped>
.DeviceSelect {
  width: 100%;
  height: calc(100vh - 282px);
  //padding: 15px;
  background-color: #fff;

  .screen {
    background-color: #F9FBFD;
  }

  .but{
    background-color: #EFF4F9;

    &:hover{
      background-color: #CCD3DB;
    }
  }

  .map {
    width: 100%;
    height: calc(100vh - 440px);
  }

  .label {
    width: 100%;
    padding: 5px 15px;
    background-color: #EFF4F9;

    .radio {
      width: 214px;
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
      }

      .activity {
        background-color: #36435C;
        color: #fff;
        border-radius: 25px;
      }

    }
  }
}
</style>
<style lang="scss">
.device-cascader{
  background-color: #242E42;

  .el-radio__inner{
    background-color: #B6C2CD!important;
    border-color: #B6C2CD!important;
  }

  .is-checked .el-radio__inner{
    background-color: #1f7cd2 !important;
    border-color: #2990ef !important;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #1A84F9!important;
    border-color: #1A84F9!important;
  }
  .el-checkbox__inner{
    background-color: #B6C2CD!important;
    border-color: #B6C2CD!important;
  }

  .el-cascader-node__label{
    color: #fff;
  }

  .el-cascader-node:not(.is-disabled):hover, .el-cascader-node:not(.is-disabled):focus{
    background: #36435C!important;
  }

  .el-cascader-node{

    &:hover{
      background-color: #36435C;
    }
  }

  .popper__arrow:after{
    border-bottom-color: #242E42!important;
  }
}
.dialog-footer-btn{
  bottom: -57px!important;
}
</style>
