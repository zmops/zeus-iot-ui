<!-- 创建/修改设备表单 -->
<template>
  <div class="device-form">
    <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="80px" class="dialog-form">
      <el-form-item label="设备ID" prop="deviceId">
        <el-input v-model="dialogForm.deviceId" size="mini" :disabled="state === '编辑'"/>
        <div v-if="state !== '编辑'" class="el-form-item-tips">
          <svg-icon icon-class="tips" class="icon" />
          若不填写设备ID，则由系统自动生成唯一ID，且不再可以编辑
        </div>
      </el-form-item>
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="dialogForm.name" size="mini"/>
      </el-form-item>
      <el-form-item label="产品" prop="productId">
        <el-select v-model="dialogForm.productId" :disabled="state === '编辑' || isProduct" filterable placeholder="请选择产品" size="mini" @change="changePro">
          <el-option
            v-for="item in productList"
            :key="item.productId"
            :label="item.name"
            :value="item.productId"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="apiShow" label="采集接口" prop="interface">
<!--        <el-radio-group v-model="dialogForm.deviceInterface.useip" size="small" class="zeus-mr-5 radio">-->
<!--          <el-radio-button label="1">IP</el-radio-button>-->
<!--          <el-radio-button label="0">DNS</el-radio-button>-->
<!--        </el-radio-group>-->
        <el-input v-if="dialogForm.deviceInterface.useip == '1'" v-model="dialogForm.deviceInterface.ip" placeholder="请输入IP" size="mini" class="w390 zeus-mr-5"/>
<!--        <el-input v-if="dialogForm.deviceInterface.useip == '0'" v-model="dialogForm.deviceInterface.dns" placeholder="请输入DNS" size="mini" class="w390 zeus-mr-5"/>-->
        <el-input v-model="dialogForm.deviceInterface.port" placeholder="请输入端口号" size="mini" class="w100"/>
      </el-form-item>
      <el-form-item label="设备组" prop="deviceGroupIds">
        <el-select v-model="dialogForm.deviceGroupIds" multiple filterable placeholder="请选择设备组" size="mini" @change="changeDevGroup">
          <el-option
            v-for="item in deviceGroup"
            :key="item.deviceGroupId"
            :label="item.name"
            :value="item.deviceGroupId.toString()"
          />
        </el-select>
        <div class="el-form-item-tips">
          <svg-icon icon-class="tips" class="icon" />帮助对数据权限进行精确控制。
        </div>
      </el-form-item>
      <el-form-item label="代理" prop="proxyId">
        <el-select v-model="dialogForm.proxyId" clearable filterable placeholder="请选择代理" size="mini">
          <el-option
            v-for="item in proxyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini"/>
      </el-form-item>
      <el-form-item label="坐标" prop="position">
        <el-input v-model="dialogForm.position" size="mini"/>
        <div class="el-form-item-tips">
          <svg-icon icon-class="tips" class="icon" />请点击地图来获取坐标，或直接输入经纬度，如 119.977871,31.822535
        </div>
      </el-form-item>
      <el-form-item label="地址" prop="addr">
        <el-input v-model="dialogForm.addr" size="mini"/>
      </el-form-item>
    </el-form>
    <div v-if="selfKey === ''" class="bm-view zeus-mt-20">
      <div class="tips">
        <svg-icon icon-class="tips" class="icon" />
        <span>为正常使用地图控件,请设置用户Key。</span>
      </div>
      <div class="zeus-text-align-c no-key">
        <svg-icon icon-class="loadFail" style="font-size:50px"/>
        <div class="zeus-mt-5">加载失败</div>
      </div>
    </div>
    <baidu-map
      v-else
      class="bm-view zeus-mt-20"
      :zoom="15"
      :center="center"
      :ak="selfKey"
      inertial-dragging
      @ready="mapReady"
      @click="selectPoint"
    >
      <bm-marker :position="point"/>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
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
import { getProxyList } from '@/api/system'
import { BmAutoComplete, BmControl, BmGeolocation, BmLocalSearch, BmMarker, BmNavigation } from 'vue-baidu-map/index'
import { getProductAttrTrapperList } from '@/api/porductMgr'

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
    BmAutoComplete,
    BmNavigation
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
    },
    isProduct: Boolean
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        productId: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ],
        deviceGroupIds: [
          { required: true, message: '请选择设备组', trigger: 'change' }
        ]
      },
      dialogForm: {},
      selfKey: 'bG3Dzof798yBGM7BzzF1uANWriBPOT5x', // 请先到百度地图开放平台申请AK
      point: {},
      position: '',
      keyword: '',
      center: null,
      proxyList: [],
      apiShow: false
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.dialogForm = val
      }
    }
  },
  created() {
    getProxyList({}).then((res) => {
      if (res.code == '200') {
        this.proxyList = res.data
      }
    })
  },
  beforeDestroy() {
    this.keyword = ''
    this.dialogForm = {
      deviceId: '',
      name: '',
      productId: '',
      deviceGroupIds: [],
      remark: '',
      position: '',
      addr: ''
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
      this.$emit('input', this.dialogForm)
      let flag = false
      this.$refs.dialogForm.validate((valid) => {
        flag = valid
      })
      return flag
    },
    changeDevGroup(val) {
      this.$forceUpdate()
    },
    changePro(prodId) {
      getProductAttrTrapperList({ prodId, source: 0 }).then((res) => {
        if (res.code == '200' && res.data.length) {
          this.apiShow = true
          this.dialogForm.deviceInterface = {
            useip: '1',
            port: '10050',
            main: '1',
            type: '1',
            ip: '127.0.0.1'
          }
        } else {
          this.apiShow = false
          this.dialogForm.deviceInterface = {
            useip: '1',
            port: '10050',
            main: '1',
            type: '1',
            ip: '127.0.0.1'
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.device-form {
  .bm-view {
    margin-left: 80px;
    width: 520px;
    height: 500px;
    background-color: #F6F7FA;
  }
  .map-input {
    width: 100%;
  }
  .no-key{
    margin-top: 180px;

    div{
      color: #36435c;
    }
  }
  .w390{
    width: 495px;
  }
  .w100{
    width: 100px;
  }
  .radio{
    vertical-align: top;
  }
  .tips{
    width: 100%;
    height: 32px;
    line-height: 32px;
    background-color: #CDE5FF;
    color: #36435C;
    font-size: 12px;
    padding-left: 20px;

    .icon{
      color: #50A1FB;
      margin-right: 4px;
    }
  }
}
</style>
