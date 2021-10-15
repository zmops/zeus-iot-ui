<template>
  <div class="distributed zeus-relative">
    <div class="zeus-absolute search zeus-pt-15 zeus-pb-15 zeus-pl-15 zeus-pr-15">
      <el-select v-model="form.productId" filterable clearable placeholder="请选择产品" size="mini" class="zeus-mr-10 w200">
        <el-option
          v-for="item in productList"
          :key="item.productId"
          :label="item.name"
          :value="item.productId"
        />
      </el-select>
      <el-select v-model="form.prodType" filterable clearable placeholder="请选择设备类型" size="mini" class="zeus-mr-10 w200">
        <el-option
          v-for="item in typeList"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        />
      </el-select>
      <el-select v-model="form.deviceGroupId" filterable clearable placeholder="请选择设备组" size="mini" class="zeus-mr-10 w200">
        <el-option
          v-for="item in deviceGroup"
          :key="item.deviceGroupId"
          :label="item.name"
          :value="item.deviceGroupId.toString()"
        />
      </el-select>
      <el-input v-model="form.name" placeholder="请输入设备名称" size="mini" class="zeus-mr-10 w200"/>
      <el-button type="primary" round size="mini" @click="getList">查询</el-button>
    </div>
    <baidu-map
      class="map"
      :zoom="15"
      :center="center"
      :ak="selfKey"
      inertial-dragging
      :scroll-wheel-zoom="true"
      @ready="mapReady"
    >
      <bml-marker-clusterer :average-center="true" :styles="[{url, size: {width: 68, height: 68}, textColor: '#fff'}]">
        <bm-marker v-for="(marker, index) of markers" :key="index" :position="{lng: marker.lng, lat: marker.lat}" @click="marker.show = true"></bm-marker>
      </bml-marker-clusterer>
      <bm-info-window v-for="(marker, index) of markers" :key="index" :auto-pan="true" :position="{lng: marker.lng, lat: marker.lat}" :title="`<a style='color: #1A84F9' href='#/deviceMgr/device/detail?id=${marker.deviceId}'>${marker.name}</a>`" :show="marker.show" @close="marker.show = false">
        <p>设备ID: {{ marker.deviceId || '-' }}</p>
        <p>产品: {{ marker.productName || '-' }}</p>
        <p>设备类型: {{ marker.typeName || '-' }}</p>
        <p>状态: {{ marker.statusName || '-' }}</p>
        <p>在线状态: {{ marker.online || '-' }}</p>
        <p>设备组: {{ marker.groupName || '-' }}</p>
        <p>描述: {{ marker.remark || '-' }}</p>
        <p>创建时间: {{ marker.createTime || '-' }}</p>
      </bm-info-window>
    </baidu-map>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmMarker, BmlMarkerClusterer, BmInfoWindow } from 'vue-baidu-map'
import { getDeviceGrpList, getDeviceList } from '@/api/deviceMgr'
import { getDictListByCode } from '@/api/system'
import { getProductList } from '@/api/porductMgr'
import distribute from '@/assets/distribute.png'
export default {
  name: 'distributed',
  components: {
    // 地图
    BaiduMap,
    // marker控件
    BmMarker,
    BmlMarkerClusterer,
    BmInfoWindow
  },
  data() {
    return {
      markers: [],
      // 百度地图key
      selfKey: 'bG3Dzof798yBGM7BzzF1uANWriBPOT5x', // 请先到百度地图开放平台申请AK
      // 已选坐标，呈现mark用
      point: {},
      position: '',
      // 搜索关键字
      keyword: '',
      // 初始化地图中心点
      center: null,
      url: distribute,
      form: {
        name: '',
        productId: '',
        prodType: '',
        deviceGroupId: ''
      },
      deviceGroup: [],
      productList: [],
      typeList: []
    }
  },
  created() {
    this.searchInit()
    this.getList()
  },
  methods: {
    searchInit() {
      // 获取设备组列表
      getDeviceGrpList({}).then((res) => {
        if (res.code == 200) {
          this.deviceGroup = res.data
        }
      })
      // 获取设备类型
      getDictListByCode({ dictTypeCode: 'DEVICE_TYPE' }).then((res) => {
        if (res.code == 200) {
          this.typeList = res.data
        }
      })
      // 获取产品列表
      getProductList({}).then((res) => {
        if (res.code == 200) {
          this.productList = res.data
        }
      })
    },
    getList() {
      getDeviceList(this.form).then((res) => {
        if (res.code == '200') {
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
    mapReady({ BMap, map }) {
      const _this = this
      // 获取自动定位方法
      const geolocation = new BMap.Geolocation()
      // 获取自动定位获取的坐标信息
      geolocation.getCurrentPosition(
        function(r) {
          _this.center = {
            lng: r.point.lng,
            lat: r.point.lat
          }
          _this.point = {
            lng: r.point.lng,
            lat: r.point.lat
          }
        },
        { enableHighAccuracy: true }
      )
    },
    detail(id) {
      this.$router.push({
        path: '/deviceMgr/device/detail',
        query: { id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.distributed {
  width: 100%;
  height: calc(100vh - 94px);

  .search{
    top: 23px;
    left: 23px;
    //width: 300px;
    background-color: #fff;
    z-index: 999;

    .w200{
      width: 200px;
    }
  }

  .map{
    width: 100%;
    height: 100%;
  }
}
</style>
