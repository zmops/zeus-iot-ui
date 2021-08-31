<!--产品详情-设备页面 -->
<template>
  <div class="alarm">
    <SearchForm :params="formParams" :buttons="buttons" :columns="columns" @search="search"/>
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange"/>
    <el-dialog
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
      @close="close"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon v-if="state === '创建'" icon-class="dialog_add" />
          <svg-icon v-if="state === '编辑'" icon-class="dialog_edit" />
          {{ state }}设备
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="dialog-body">
        <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="80px" label-position="top" class="dialog-form">
          <el-form-item v-if="state === '编辑'" label="设备ID" prop="deviceId">
            <el-input v-model="dialogForm.deviceId" size="mini" disabled/>
          </el-form-item>
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="dialogForm.name" size="mini"/>
          </el-form-item>
          <el-form-item label="产品" prop="productId">
            <el-select v-model="dialogForm.productId" :disabled="'deviceId' in dialogForm" filterable placeholder="请选择产品" size="mini">
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
            <bm-auto-complete v-model="keyword" :sug-style="{zIndex: 1}">
              <el-input v-model="keyword" placeholder="请输入关键字" class="map-input"/>
            </bm-auto-complete>
          </bm-control>
          <bm-local-search :keyword="keyword" :auto-viewport="true" :panel="false" @searchcomplete="search"/>
        </baidu-map>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="submit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmGeolocation, BmLocalSearch, BmMarker, BmControl, BmAutoComplete } from 'vue-baidu-map'
import { createDevice, getDeviceByPage, getDeviceGrpList, updateDevice } from '@/api/deviceMgr'
import { getDictListByCode } from '@/api/system'
import { getProductList } from '@/api/porductMgr'

export default {
  name: 'Alarm',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    SearchForm,
    Pagination,
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
  data() {
    return {
      formParams: [],
      deviceGroup: [],
      productList: [],
      form: {
        name: '',
        productId: '',
        prodType: '',
        deviceGroupId: ''
      },
      dialogVisible: false,
      state: '',
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      columns: [
        {
          label: '设备名称',
          prop: 'name',
          show: true
        },
        {
          label: '设备ID',
          prop: 'deviceId',
          show: true
        },
        {
          label: '产品',
          prop: 'productName',
          show: true
        },
        {
          label: '设备类型',
          prop: 'typeName',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          show: true
        },
        {
          label: '设备组',
          prop: 'groupName',
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          show: true
        },
        {
          label: '最近在线时间',
          prop: 'code',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 160,
          idName: 'deviceId',
          fixed: 'right',
          buttons: [
            {
              label: '编辑',
              event: 'detail'
            },
            {
              label: '删除',
              event: 'delete'
            }
          ]
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        productId: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ]
      },
      dialogForm: {
        name: '',
        productId: '',
        deviceGroupIds: [],
        remark: ''
      },
      selfKey: 'bG3Dzof798yBGM7BzzF1uANWriBPOT5x',
      point: {},
      position: '',
      keyword: '',
      center: null
    }
  },
  created() {
    if (this.$route.query.id) {
      this.productId = this.$route.query.id
      this.form.productId = this.$route.query.id
    }
    this.searchInit()
    this.getList()
  },
  methods: {
    async searchInit() {
      // 获取设备组列表
      await getDeviceGrpList({}).then((res) => {
        if (res.code == 200) {
          this.deviceGroup = res.data
        }
      })
      // 获取设备类型
      await getDictListByCode({ dictTypeCode: 'DEVICE_TYPE' }).then((res) => {
        if (res.code == 200) {
          this.typeList = res.data
        }
      })
      // 获取产品列表
      await getProductList({}).then((res) => {
        if (res.code == 200) {
          this.productList = res.data
        }
      })
      this.formParams = [
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '设备名称'
        },
        {
          componentName: 'SelectTemplate',
          keyName: 'deviceGroupId',
          label: '设备组',
          optionId: 'deviceGroupId',
          optionName: 'name',
          options: this.deviceGroup
        },
        {
          componentName: 'SelectTemplate',
          keyName: 'prodType',
          label: '设备类型',
          optionId: 'code',
          optionName: 'name',
          options: this.typeList
        },
        {
          componentName: 'SelectTemplate',
          keyName: 'productId',
          label: '产品',
          optionId: 'productId',
          optionName: 'name',
          options: this.productList
        }
      ]
    },
    search() {
      this.page = 1
      this.getList()
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    getList() {
      this.loading = true
      getDeviceByPage({ ...this.form, maxRow: this.size, page: this.page }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.count
        }
      }).catch(() => {
        this.loading = false
      })
    },
    detail(item) {
      this.$router.push({
        path: '/deviceMgr/device/detail',
        query: {
          id: item
        }
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    close() {
      this.dialogForm = {
        name: '',
        productId: '',
        deviceGroupIds: [],
        remark: ''
      }
    },
    submit() {
      this.$refs.dialogForm.validate(async(valid) => {
        if (valid) {
          if (this.dialogForm.deviceId) {
            // updateDevice(this.dialogForm).then(async(res) => {
            //   if (res.code == 200) {
            //     this.$message({
            //       message: '修改成功',
            //       type: 'success'
            //     })
            //     this.dialogVisible = false
            //     await this.getList()
            //   }
            // })
          } else {
            // createDevice(this.dialogForm).then(async(res) => {
            //   if (res.code == 200) {
            //     this.$message({
            //       message: '添加成功',
            //       type: 'success'
            //     })
            //     this.dialogVisible = false
            //     await this.getList()
            //   }
            // })
          }
        }
      })
    },
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
  }
}
</script>

<style lang="scss" scoped>
.alarm {
  .bm-view {
    width: 600px;
    height: 500px;
  }
}
</style>
