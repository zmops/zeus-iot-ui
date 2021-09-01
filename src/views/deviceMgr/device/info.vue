<!-- 设备基础信息页面 -->
<template>
  <div class="info">
    <div class="zeus-product-tit">基本信息</div>
    <div class="zeus-product basics">
      <div class="left">
        <svg-icon icon-class="big-device" style="font-size: 46px"/>
      </div>
      <div class="content">
        <el-row :gutter="18" class="row">
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ infoData.deviceId || '-' }}</div>
              <div class="tit">设备ID</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ infoData.name || '-' }}</div>
              <div class="tit">设备名称</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ infoData.typeName || '-' }}</div>
              <div class="tit">设备类型</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info">
              <div class="con">
                <span v-for="(item, index) in dialogForm.groupList" :key="index" class="group-item">{{ item }}</span>
              </div>
              <div class="tit">设备组</div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="18" class="row">
          <el-col :span="6">
            <div class="info">
              <div class="con">{{ infoData.remark || '-' }}</div>
              <div class="tit">描述信息</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info">
              <div class="con">
                {{ infoData.position || '-' }}
                <a v-if="infoData.position" class="show-map zeus-ml-5" @click="dialogMap = true">查看地图</a>
              </div>
              <div class="tit">坐标信息</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info">
              <div class="con">{{ infoData.addr || '-' }}</div>
              <div class="tit">位置信息</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="right">
        <el-button size="mini" round @click="dialogVisible = true">
          <svg-icon icon-class="dialog_edit" style="margin-right: 5px"/>
          编辑
        </el-button>
      </div>
    </div>
    <el-dialog
      v-if="dialogMap"
      :visible.sync="dialogMap"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_edit"/>
          查看地图
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogMap = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <baidu-map
          class="bm-view2 zeus-mt-20"
          :zoom="15"
          :center="center"
          :ak="selfKey"
          inertial-dragging
          :scroll-wheel-zoom="true"
          @ready="mapReady"
        >
          <bm-marker :position="point" animation="BMAP_ANIMATION_BOUNCE"/>
        </baidu-map>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_edit"/>
          编辑基本信息
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <deviceForm ref="deviceForm" v-model="dialogForm" :state="'编辑'" :product-list="productList" :device-group="deviceGroup"/>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="submit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmMarker } from 'vue-baidu-map'
import deviceForm from '@/views/deviceMgr/device/deviceForm'
import { getProductList } from '@/api/porductMgr'
import { getDeviceGrpList, updateDevice } from '@/api/deviceMgr'

export default {
  name: 'DeviceInfo',
  components: {
    // 地图
    BaiduMap,
    // marker控件
    BmMarker,
    deviceForm
  },
  props: {
    infoData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    infoData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.dialogForm = JSON.parse(JSON.stringify(val))
          if (this.dialogForm.groupIds) {
            this.dialogForm.deviceGroupIds = this.dialogForm.groupIds.split(',')
          }
          if (this.dialogForm.groupName) {
            this.dialogForm.groupList = this.dialogForm.groupName.split(',')
          }
        }
      }
    }
  },
  data() {
    return {
      // 百度地图key
      selfKey: 'bG3Dzof798yBGM7BzzF1uANWriBPOT5x',
      // 已选坐标，呈现mark用
      point: {},
      position: '',
      // 搜索关键字
      keyword: '',
      // 初始化地图中心点
      center: null,
      dialogVisible: false,
      dialogForm: {},
      rules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        productId: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ]
      },
      productList: [],
      deviceGroup: [],
      dialogMap: false
    }
  },
  created() {
    getProductList({}).then((res) => {
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
    search(e) {
      console.log(e)
    },
    submit() {
      if (this.$refs.deviceForm.validateForm()) {
        updateDevice(this.dialogForm).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.$emit('updata')
          }
        })
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  .bm-view2 {
    width: 100%;
    height: 500px;
  }

  .basics {
    display: flex;
    align-items: stretch;
    justify-content: space-between;

    .left {
      flex: 0 0 84px;
      background: #F9FBFD;
      border-radius: 4px;
      padding: 15px 19px;
    }

    .content {
      flex: 1;
      margin: 0 14px;

      .row {
        height: 64px;
        border-radius: 4px;
        background: #F9FBFD;
        border: 1px solid #EFF4F9;
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        margin-left: 0px !important;
        margin-right: 0px !important;

        .info {
          padding: 0 9px;

          .con {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 13px;
            color: #242E42;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .group-item {
            display: inline-block;
            background-color: #E3E9EF;
            padding: 4px 5px;
            margin-right: 5px;
          }

          .show-map {
            color: #1A84F9;
          }

          .tit {
            font-size: 12px;
            color: #79879C;
          }
        }
      }
    }

    .right {
      flex: 0 0 62px;

      .el-button {
        padding: 5px 9px;
        border: 1px solid #EFF4F9;
        background: #EFF4F9;
      }

      .el-button:hover {
        border: 1px solid #CCD3DB;
        background: #E3E9EF;
      }
    }
  }
}
</style>
