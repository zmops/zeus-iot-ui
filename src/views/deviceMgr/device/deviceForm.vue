<!-- 创建/修改设备表单 -->
<template>
  <div class="device-form">
    <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="80px" label-position="top" class="dialog-form">
      <el-form-item label="设备ID" prop="deviceId">
        <el-input v-model="dialogForm.deviceId" size="mini" :disabled="state === '编辑'"/>
      </el-form-item>
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="dialogForm.name" size="mini"/>
      </el-form-item>
      <el-form-item label="产品" prop="productId">
        <el-select v-model="dialogForm.productId" :disabled="state === '编辑'" filterable placeholder="请选择产品" size="mini">
          <el-option
            v-for="item in productList"
            :key="item.productId"
            :label="item.name"
            :value="item.productId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备组" prop="deviceGroupIds">
        <el-select v-model="dialogForm.deviceGroupIds" multiple filterable placeholder="请选择设备组" size="mini">
          <el-option
            v-for="item in deviceGroup"
            :key="item.deviceGroupId"
            :label="item.name"
            :value="item.deviceGroupId.toString()"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini"/>
      </el-form-item>
      <el-form-item label="坐标" prop="position">
        <el-input v-model="dialogForm.position" size="mini"/>
      </el-form-item>
      <el-form-item label="地址" prop="addr">
        <el-input v-model="dialogForm.addr" size="mini"/>
      </el-form-item>
    </el-form>
    <baidu-map
      class="bm-view zeus-mt-20"
      :zoom="15"
      :center="center"
      :ak="selfKey"
      inertial-dragging
      :scroll-wheel-zoom="true"
      @ready="mapReady"
      @click="selectPoint"
    >
      <bm-marker :position="point" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"/>
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :show-address-bar="true"
        :auto-location="true"/>
      <bm-control class="map-input zeus-pl-10 zeus-pr-10 zeus-pt-10">
        <bm-auto-complete v-model="keyword" :sug-style="{zIndex: 9999}">
          <el-input v-model="keyword" placeholder="请输入关键字" class="map-input"/>
        </bm-auto-complete>
      </bm-control>
      <bm-local-search :keyword="keyword" :auto-viewport="true" :panel="false"/>
    </baidu-map>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map'
import { BmAutoComplete, BmControl, BmGeolocation, BmLocalSearch, BmMarker } from 'vue-baidu-map/index'

export default {
  name: 'DeviceForm',
  components: {
    // 地图
    BaiduMap,
    // 手动定位控件
    BmGeolocation,
    // 检索控件
    BmLocalSearch,
    // marker控件
    BmMarker,
    // 自定义控件
    BmControl,
    // 自动填充
    BmAutoComplete
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          name: '',
          productId: '',
          deviceGroupIds: [],
          remark: ''
        }
      }
    },
    state: {
      type: String,
      default: ''
    },
    productList: {
      type: Array,
      default() {
        return []
      }
    },
    deviceGroup: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        productId: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ]
      },
      dialogForm: this.value,
      selfKey: 'bG3Dzof798yBGM7BzzF1uANWriBPOT5x',
      point: {},
      position: '',
      keyword: '',
      center: null
    }
  },
  watch: {
    dialogForm: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {

  },
  beforeDestroy() {
    this.keyword = ''
    this.dialogForm = {
      name: '',
      productId: '',
      deviceGroupIds: [],
      remark: ''
    }
  },
  methods: {
    selectPoint({ type, target, point, pixel, overlay }) {
      this.point = point
      this.dialogForm.position = point.lng + ',' + point.lat
    },
    mapReady({ BMap, map }) {
      const _this = this
      if (_this.dialogForm.position) {
        const arr = _this.dialogForm.position.split(',')
        _this.center = {
          lng: arr[0],
          lat: arr[1]
        }
        _this.point = {
          lng: arr[0],
          lat: arr[1]
        }
      } else {
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
      }
    },
    validateForm() {
      let flag = false
      this.$refs.dialogForm.validate((valid) => {
        flag = valid
      })
      return flag
    }
  }
}
</script>

<style lang="scss" scoped>
.device-form {
  .bm-view {
    width: 600px;
    height: 500px;
  }
  .map-input {
    width: 100%;
  }
}
</style>
