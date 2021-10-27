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
      v-if="mapShow"
      class="map"
      :zoom="zoom"
      :center="center"
      :ak="selfKey"
      inertial-dragging
      :scroll-wheel-zoom="true"
      @ready="mapReady"
      @moving="syncCenterAndZoom"
      @moveend="syncCenterAndZoom"
      @zoomend="syncCenterAndZoom"
    >
      <bml-marker-clusterer :average-center="true" :styles="[{url, size: {width: 68, height: 68}, textColor: '#fff'}]">
        <bm-marker v-for="(marker, index) of markers" :key="index" :position="{lng: marker.lng, lat: marker.lat}" @click="openWindow(marker)"></bm-marker>
      </bml-marker-clusterer>
      <bm-info-window v-for="(marker, index) of markers" :key="index" :auto-pan="true" :width="300" :position="{lng: marker.lng, lat: marker.lat}" :title="`<a style='color: #1A84F9' href='#/deviceMgr/device/detail?id=${marker.deviceId}'>${marker.name}</a>`" :show="marker.show" @close="marker.show = false">
        <div class="item zeus-mt-10">
          <span class="name">设备ID:</span>
          <span class="value">{{ device.deviceId || '-' }}</span>
        </div>
        <div class="item">
          <span class="name">产品:</span>
          <span class="value">{{ device.productName || '-' }}</span>
        </div>
        <div class="item">
          <span class="name">设备类型:</span>
          <span class="value">{{ device.typeName || '-' }}</span>
        </div>
        <div class="item">
          <span class="name">状态:</span>
          <span class="value">{{ device.statusName || '-' }}</span>
        </div>
        <div class="item">
          <span class="name">在线状态:</span>
          <span v-if="device.online == '1'" class="value">在线</span>
          <span v-else-if="device.online == '0'" class="value">离线</span>
          <span v-else class="value">-</span>
        </div>
        <div class="item">
          <span class="name">设备组:</span>
          <span class="value">{{ device.groupName || '-' }}</span>
        </div>
        <div class="item">
          <span class="name">描述:</span>
          <span class="value">{{ device.remark || '-' }}</span>
        </div>
        <div class="item">
          <span class="name">创建时间:</span>
          <span class="value">{{ device.createTime || '-' }}</span>
        </div>
      </bm-info-window>
    </baidu-map>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmMarker, BmlMarkerClusterer, BmInfoWindow } from 'vue-baidu-map'
import { deviceDetail, getDeviceGrpList, getDeviceList } from '@/api/deviceMgr'
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
      center: {
        lng: 107.451703,
        lat: 34.043414
      },
      zoom: 6,
      url: distribute,
      form: {
        name: '',
        productId: '',
        prodType: '',
        deviceGroupId: ''
      },
      deviceGroup: [],
      productList: [],
      typeList: [],
      device: {},
      mapShow: false
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
      this.mapShow = false
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
          this.mapShow = true
        }
      }).catch((res) =>{
        this.mapShow = true
      })
    },
    mapReady({ BMap, map }) {
      // const _this = this
      // if (_this.center.lat === 0) {
      //   // 获取自动定位方法
      //   const geolocation = new BMap.Geolocation()
      //   // 获取自动定位获取的坐标信息
      //   geolocation.getCurrentPosition(
      //     function(r) {
      //       _this.center = {
      //         lng: r.point.lng,
      //         lat: r.point.lat
      //       }
      //     },
      //     { enableHighAccuracy: true }
      //   )
      // }
    },
    detail(id) {
      this.$router.push({
        path: '/deviceMgr/device/detail',
        query: { id }
      })
    },
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
    },
    openWindow(marker) {
      marker.show = true
      deviceDetail({ deviceId: marker.deviceId }).then((res) => {
        if (res.code == 200) {
          this.device = res.data
        }
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

  .item{
    width: 300px;
    font-size: 14px;
    height: 25px;
    line-height: 25px;

    .name{
      display: inline-block;
      width: 80px;
      text-align: right;
      vertical-align: top;
    }

    .value{
      display: inline-block;
      padding-left: 20px;
      width: 200px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
