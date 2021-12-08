<template>
  <div :class="listShow ? 'detail-wrap' : 'detail-wrap hidden'">
    <div class="detail-left">
      <div class="left-tit">
        <svg-icon icon-class="monitor-jq" style="font-size: 20px; margin-right: 5px"></svg-icon>
        <span>刷新时间：{{time}}</span>
      </div>
      <div class="left-con">
        <FloorTopo
          v-show="listShow"
          :dianList="linkedMo"
          @selectDian="selectDian"
          @dblclick="showDetail"
          :time="new Date().getTime()"
          :backImage="backImage"
          :width="Number(imageSize[0])"
          :height="Number(imageSize[1])"
          screen
        ></FloorTopo>
        <FloorTopo
          v-if="!listShow"
          :dianList="linkedMo"
          @selectDian="selectDian"
          @dblclick="showDetail"
          :time="new Date().getTime()"
          :backImage="backImage"
          :width="Number(imageSize[0])"
          :height="Number(imageSize[1])"
          screen
        ></FloorTopo>
      </div>
    </div>
    <div class="detail-right">
      <div class="right-tit">
        <div class="left">
          <div>
            总数
            <span>64</span>
          </div>
          <div class="ml">
            <svg-icon icon-class="monitor-gj" style="font-size: 16px; margin-right: 4px"></svg-icon>告警
            <span>2</span>
          </div>
        </div>
      </div>
      <div class="status-list">
        <svg-icon icon-class="shrink" class="shrink" @click="shrink"></svg-icon>
        <svg-icon icon-class="shrink-left" v-if="!listShow" class="shrink-left" @click="shrink"></svg-icon>
        <svg-icon icon-class="shrink-right" v-if="listShow" class="shrink-right" @click="shrink"></svg-icon>
        <div class="status-tit">状态列表</div>
        <div class="status-wrap">
          <el-table
              :data="dianList"
              v-loading="loading"
              stripe
              class="dark"
              size="mini"
              @row-click="rowClick"
              style="width: 100%">
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                prop="name"
                label="对象"
                width="180">
            </el-table-column>
            <el-table-column
                prop="moType"
                label="类型"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="在线状态">
              <template>
                <span>在线</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="告警状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 1" style="color:#ff5968;">告警</span>
                <span v-else >正常</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FloorTopo from '@/components/FloorTopo/index'
import { getLocationDetail, LinkedMo } from '@/api/visualization'
export default {
  components: {
    FloorTopo,
  },
  props: {
    id: {
      type: Number,
    },
    Num: {
      type: Number,
      default: 0,
    },
    alarmNum: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      listShow: true,
      changeID: 0,
      dianList: [{"moId":227,"moNum":"CAMERA-227","assetNum":"CAMERA-227","hostid":10561,"name":"指纹锁31","ip":"18.0.0.59","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:137","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263137","description":"ZmopsCamera102","templateid":10409,"locationId":4,"createTime":1630414448586,"updateTime":1634523097999,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":229,"moNum":"CAMERA-229","assetNum":"CAMERA-229","hostid":10563,"name":"温湿度传感器1","ip":"18.0.0.58","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","templateid":10409,"locationId":4,"createTime":1630414448636,"updateTime":1634523098002,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":219,"moNum":"CAMERA-219","assetNum":"CAMERA-219","hostid":10566,"name":"烟雾报警器2","ip":"18.0.0.60","port":"80","username":"admin","password":"Zmops@0610","moType":"yanwu","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:138","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263138","description":"ZmopsCamera103","templateid":10409,"locationId":4,"createTime":1630414445544,"updateTime":1634523098005,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":209,"moNum":"CAMERA-209","assetNum":"CAMERA-209","hostid":10544,"name":"烟雾报警器4","ip":"18.0.0.13","port":"80","username":"admin","password":"Zmops@0610","moType":"yanwu","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:111","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263111","description":"ZmopsCamera14","templateid":10409,"locationId":4,"createTime":1630410840541,"updateTime":1634523098008,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":275,"moNum":"DEVICE-141","assetNum":"DEVICE-141","name":"指纹141","ip":"18.0.3.141","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098010,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":232,"moNum":"CAMERA-232","assetNum":"CAMERA-232","hostid":10568,"name":"三石摄像头","ip":"18.0.0.37","port":"80","username":"admin","password":"Zmops@0610","moType":"hsdCamera","brand":"海康威视","macAddr":"10:12:fb:b9:d1:115","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263115","description":"ZmopsCamera115","templateid":10409,"locationId":4,"createTime":1630461720104,"updateTime":1634523098013,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":0,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":252,"moNum":"DEVICE-118","assetNum":"DEVICE-118","name":"温湿度传感器118","ip":"18.0.1.118","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098015,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":291,"moNum":"DEVICE-157","assetNum":"DEVICE-157","name":"指纹157","ip":"18.0.3.157","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098061,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":220,"moNum":"CAMERA-220","assetNum":"CAMERA-220","hostid":10562,"name":"窗帘开关2","ip":"18.0.0.64","port":"80","username":"admin","password":"Zmops@0610","moType":"chuanglian","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:142","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263142","description":"ZmopsCamera107","templateid":10409,"locationId":4,"createTime":1630414445543,"updateTime":1634523098063,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":233,"moNum":"CAMERA-233","assetNum":"CAMERA-233","hostid":10570,"name":"中央空调传感器1","ip":"18.0.0.38","port":"80","username":"admin","password":"Zmops@0610","moType":"center","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:116","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263116","description":"","templateid":10409,"locationId":4,"createTime":1630461720104,"updateTime":1634523098065,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":0,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":285,"moNum":"DEVICE-151","assetNum":"DEVICE-151","name":"指纹151","ip":"18.0.3.151","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098068,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":253,"moNum":"DEVICE-119","assetNum":"DEVICE-119","name":"温湿度传感器119","ip":"18.0.1.119","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098070,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":206,"moNum":"CAMERA-206","assetNum":"CAMERA-206","hostid":10539,"name":"智能开关12","ip":"18.0.0.4","port":"80","username":"admin","password":"Zmops@0610","moType":"zhineng","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:102","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263102","description":"ZmopsCamera02","templateid":10409,"locationId":4,"createTime":1630410840439,"updateTime":1634523098158,"deptId":1,"sourceType":1,"status":1,"statusName":"离线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":292,"moNum":"DEVICE-158","assetNum":"DEVICE-158","name":"指纹158","ip":"18.0.3.158","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098058,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":247,"moNum":"DEVICE-113","assetNum":"DEVICE-113","name":"温湿度传感器113","ip":"18.0.1.113","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098072,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":271,"moNum":"DEVICE-137","assetNum":"DEVICE-137","name":"门窗传感器137","ip":"18.0.2.137","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098075,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":258,"moNum":"DEVICE-124","assetNum":"DEVICE-124","name":"门窗传感器124","ip":"18.0.2.124","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098077,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":273,"moNum":"DEVICE-139","assetNum":"DEVICE-139","name":"门窗传感器139","ip":"18.0.2.139","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098079,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":270,"moNum":"DEVICE-136","assetNum":"DEVICE-136","name":"门窗传感器136","ip":"18.0.2.136","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098082,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":274,"moNum":"DEVICE-140","assetNum":"DEVICE-140","name":"门窗传感器140","ip":"18.0.2.140","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098084,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":281,"moNum":"DEVICE-147","assetNum":"DEVICE-147","name":"指纹147","ip":"18.0.3.147","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098086,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":240,"moNum":"DEVICE-106","assetNum":"DEVICE-106","name":"温湿度传感器106","ip":"18.0.1.106","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098089,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":242,"moNum":"DEVICE-108","assetNum":"DEVICE-108","name":"温湿度传感器108","ip":"18.0.1.108","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098091,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":239,"moNum":"DEVICE-105","assetNum":"DEVICE-105","name":"温湿度传感器105","ip":"18.0.1.105","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098094,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":241,"moNum":"DEVICE-107","assetNum":"DEVICE-107","name":"温湿度传感器107","ip":"18.0.1.107","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098096,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":222,"moNum":"CAMERA-222","assetNum":"CAMERA-222","hostid":10565,"name":"人体传感器2","ip":"18.0.0.65","port":"80","username":"admin","password":"Zmops@0610","moType":"renti","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:143","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263143","description":"ZmopsCamera108","templateid":10409,"locationId":4,"createTime":1630414445543,"updateTime":1634523098099,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":207,"moNum":"CAMERA-207","assetNum":"CAMERA-207","hostid":10546,"name":"三石摄像头8","ip":"18.0.0.9","port":"80","username":"admin","password":"Zmops@0610","moType":"shootCamera","brand":"海康威视","macAddr":"10:12:fb:b9:d1:07","serialNumber":"DS-2CD2725EF-IZS20200904AACHE74226371-0826","description":"ZmopsCamera06","templateid":10409,"locationId":4,"createTime":1630410840410,"updateTime":1634523098102,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":255,"moNum":"DEVICE-121","assetNum":"DEVICE-121","name":"门窗传感器121","ip":"18.0.2.121","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098104,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":282,"moNum":"DEVICE-148","assetNum":"DEVICE-148","name":"指纹148","ip":"18.0.3.148","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098107,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":251,"moNum":"DEVICE-117","assetNum":"DEVICE-117","name":"温湿度传感器117","ip":"18.0.1.117","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098110,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":237,"moNum":"DEVICE-103","assetNum":"DEVICE-103","name":"温湿度传感器103","ip":"18.0.1.103","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098112,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":283,"moNum":"DEVICE-149","assetNum":"DEVICE-149","name":"指纹149","ip":"18.0.3.149","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098115,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":214,"moNum":"CAMERA-214","assetNum":"CAMERA-214","hostid":10553,"name":"窗帘开关1","ip":"18.0.0.62","port":"80","username":"admin","password":"Zmops@0610","moType":"chuanglian","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:140","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263140","description":"ZmopsCamera105","templateid":10409,"locationId":4,"createTime":1630414445543,"updateTime":1634523098118,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":243,"moNum":"DEVICE-109","assetNum":"DEVICE-109","name":"温湿度传感器109","ip":"18.0.1.109","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098120,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":261,"moNum":"DEVICE-127","assetNum":"DEVICE-127","name":"门窗传感器127","ip":"18.0.2.127","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098123,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":245,"moNum":"DEVICE-111","assetNum":"DEVICE-111","name":"温湿度传感器111","ip":"18.0.1.111","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098125,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":262,"moNum":"DEVICE-128","assetNum":"DEVICE-128","name":"门窗传感器128","ip":"18.0.2.128","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098018,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":263,"moNum":"DEVICE-129","assetNum":"DEVICE-129","name":"门窗传感器129","ip":"18.0.2.129","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098020,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":230,"moNum":"CAMERA-230","assetNum":"CAMERA-230","hostid":10569,"name":"人体传感器1","ip":"18.0.0.39","port":"80","username":"admin","password":"Zmops@0610","moType":"renti","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:117","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263117","description":"ZmopsCamera117","templateid":10409,"locationId":4,"createTime":1630461720104,"updateTime":1634523098023,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":0,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":234,"moNum":"CAMERA-234","assetNum":"CAMERA-234","hostid":10572,"name":"纵目摄像头","ip":"172.16.3.244","port":"80","username":"admin","password":"Zmops@0610","moType":"domeCamera","brand":"海康威视","macAddr":"10:12:fb:b9:d1:61","serialNumber":"DS-2CD2725EF-IZS20200904AACHE74226371","description":"IPCamera","templateid":10409,"locationId":4,"createTime":1632815580219,"updateTime":1634523098026,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":0,"locationName":"1F","uptime":"27天,04:48:21","pingResponseTime":"1.0","pingLoss":0,"originalUptime":"2350101","hasUnread":0},{"moId":276,"moNum":"DEVICE-142","assetNum":"DEVICE-142","name":"指纹142","ip":"18.0.3.142","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098029,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":235,"moNum":"DEVICE-101","assetNum":"DEVICE-101","name":"温湿度传感器101","ip":"18.0.1.101","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098032,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":250,"moNum":"DEVICE-116","assetNum":"DEVICE-116","name":"温湿度传感器116","ip":"18.0.1.116","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098146,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":259,"moNum":"DEVICE-125","assetNum":"DEVICE-125","name":"门窗传感器125","ip":"18.0.2.125","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098035,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":254,"moNum":"DEVICE-120","assetNum":"DEVICE-120","name":"温湿度传感器120","ip":"18.0.1.120","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098037,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":278,"moNum":"DEVICE-144","assetNum":"DEVICE-144","name":"指纹144","ip":"18.0.3.144","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098039,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":277,"moNum":"DEVICE-143","assetNum":"DEVICE-143","name":"指纹143","ip":"18.0.3.143","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098042,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":272,"moNum":"DEVICE-138","assetNum":"DEVICE-138","name":"门窗传感器138","ip":"18.0.2.138","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098044,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":257,"moNum":"DEVICE-123","assetNum":"DEVICE-123","name":"门窗传感器123","ip":"18.0.2.123","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098047,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":256,"moNum":"DEVICE-122","assetNum":"DEVICE-122","name":"门窗传感器122","ip":"18.0.2.122","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098049,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":280,"moNum":"DEVICE-146","assetNum":"DEVICE-146","name":"指纹146","ip":"18.0.3.146","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098051,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":284,"moNum":"DEVICE-150","assetNum":"DEVICE-150","name":"指纹150","ip":"18.0.3.150","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098054,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":216,"moNum":"CAMERA-216","assetNum":"CAMERA-216","hostid":10554,"name":"三石摄像头67","ip":"18.0.0.67","port":"80","username":"admin","password":"Zmops@0610","moType":"domeCamera","brand":"海康威视","macAddr":"10:12:fb:b9:d1:145","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263145","description":"ZmopsCamera110","templateid":10409,"locationId":4,"createTime":1630414445543,"updateTime":1634523098056,"deptId":1,"sourceType":1,"status":1,"statusName":"离线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":244,"moNum":"DEVICE-110","assetNum":"DEVICE-110","name":"温湿度传感器110","ip":"18.0.1.110","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098128,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":248,"moNum":"DEVICE-114","assetNum":"DEVICE-114","name":"温湿度传感器114","ip":"18.0.1.114","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098131,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":246,"moNum":"DEVICE-112","assetNum":"DEVICE-112","name":"温湿度传感器112","ip":"18.0.1.112","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098133,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":265,"moNum":"DEVICE-131","assetNum":"DEVICE-131","name":"门窗传感器131","ip":"18.0.2.131","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098136,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":225,"moNum":"CAMERA-225","assetNum":"CAMERA-225","hostid":10559,"name":"亮度传感器3","ip":"18.0.0.72","port":"80","username":"admin","password":"Zmops@0610","moType":"liangdu","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:151","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263151","description":"ZmopsCamera115","templateid":10409,"locationId":4,"createTime":1630414446325,"updateTime":1634523098139,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":211,"moNum":"CAMERA-211","assetNum":"CAMERA-211","hostid":10550,"name":"亮度传感器1","ip":"18.0.0.71","port":"80","username":"admin","password":"Zmops@0610","moType":"liangdu","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:150","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263150","description":"ZmopsCamera114","templateid":10409,"locationId":4,"createTime":1630414445543,"updateTime":1634523098141,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":264,"moNum":"DEVICE-130","assetNum":"DEVICE-130","name":"门窗传感器130","ip":"18.0.2.130","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098143,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"},{"moId":210,"moNum":"CAMERA-210","assetNum":"CAMERA-210","hostid":10548,"name":"指纹锁2","ip":"18.0.0.3","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:51","serialNumber":"DS-2CD2725EF-IZS20200904AACHE74226351","description":"ZmopsCamera05","templateid":10409,"locationId":4,"createTime":1630410840897,"updateTime":1634523098149,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":213,"moNum":"CAMERA-213","assetNum":"CAMERA-213","hostid":10555,"name":"温湿度传感器2","ip":"18.0.0.75","port":"80","username":"admin","password":"Zmops@0610","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:154","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263154","description":"ZmopsCamera118","templateid":10409,"locationId":4,"createTime":1630414445544,"updateTime":1634523098151,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":221,"moNum":"CAMERA-221","assetNum":"CAMERA-221","hostid":10557,"name":"门窗传感器","ip":"18.0.0.66","port":"80","username":"admin","password":"Zmops@0610","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:144","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263144","description":"ZmopsCamera109","templateid":10409,"locationId":4,"createTime":1630414445543,"updateTime":1634523098154,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","uptime":"","pingResponseTime":"0.0","pingLoss":100,"originalUptime":"","hasUnread":0},{"moId":279,"moNum":"DEVICE-145","assetNum":"DEVICE-145","name":"指纹145","ip":"18.0.3.145","port":"80","username":"admin","password":"Zmops@0610","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098156,"deptId":1,"sourceType":1,"status":0,"statusName":"在线","macChanged":1,"locationName":"1F","hasUnread":0,"pingLoss":"__vue_devtool_nan__","pingResponseTime":"NaN"}],
      loading: false,
      time: '',
      imageSize: [1077,930],
      backImage: '/storage/map-bg.png',
      linkedMo: JSON.parse('[{"moId":227,"moNum":"CAMERA-227","assetNum":"CAMERA-227","hostid":10561,"name":"指纹锁31","ip":"18.0.0.59","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:137","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263137","description":"ZmopsCamera102","templateid":10409,"locationId":4,"createTime":1630414448586,"updateTime":1634523097999,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"561.0395268818648,520.5203662726632"},{"moId":229,"moNum":"CAMERA-229","assetNum":"CAMERA-229","hostid":10563,"name":"温湿度传感器1","ip":"18.0.0.58","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","templateid":10409,"locationId":4,"createTime":1630414448636,"updateTime":1634523098002,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"812.1300048828125,541.4035222624951"},{"moId":219,"moNum":"CAMERA-219","assetNum":"CAMERA-219","hostid":10566,"name":"烟雾报警器2","ip":"18.0.0.60","port":"80","moType":"yanwu","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:138","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263138","description":"ZmopsCamera103","templateid":10409,"locationId":4,"createTime":1630414445544,"updateTime":1634523098005,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"562.4892459606622,433.63352744635733"},{"moId":209,"moNum":"CAMERA-209","assetNum":"CAMERA-209","hostid":10544,"name":"烟雾报警器4","ip":"18.0.0.13","port":"80","moType":"yanwu","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:111","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263111","description":"ZmopsCamera14","templateid":10409,"locationId":4,"createTime":1630410840541,"updateTime":1634523098008,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"635.2368130976723,389.6054471412764"},{"moId":275,"moNum":"DEVICE-141","assetNum":"DEVICE-141","name":"指纹141","ip":"18.0.3.141","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098010,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"688.2238960266113,451.5110851142159"},{"moId":232,"moNum":"CAMERA-232","assetNum":"CAMERA-232","hostid":10568,"name":"三石摄像头","ip":"18.0.0.37","port":"80","moType":"hsdCamera","brand":"海康威视","macAddr":"10:12:fb:b9:d1:115","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263115","description":"ZmopsCamera115","templateid":10409,"locationId":4,"createTime":1630461720104,"updateTime":1634523098013,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":0,"position":"866.97985166519,357.8615012976876"},{"moId":252,"moNum":"DEVICE-118","assetNum":"DEVICE-118","name":"温湿度传感器118","ip":"18.0.1.118","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098015,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"111.18683242797856,749.3013028658253"},{"moId":291,"moNum":"DEVICE-157","assetNum":"DEVICE-157","name":"指纹157","ip":"18.0.3.157","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098061,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"357.00235366821295,704.9847179267159"},{"moId":220,"moNum":"CAMERA-220","assetNum":"CAMERA-220","hostid":10562,"name":"窗帘开关2","ip":"18.0.0.64","port":"80","moType":"chuanglian","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:142","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263142","description":"ZmopsCamera107","templateid":10409,"locationId":4,"createTime":1630414445543,"updateTime":1634523098063,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"556.0078333225537,359.6136386417554"},{"moId":233,"moNum":"CAMERA-233","assetNum":"CAMERA-233","hostid":10570,"name":"中央空调传感器1","ip":"18.0.0.38","port":"80","moType":"center","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:116","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263116","description":"","templateid":10409,"locationId":4,"createTime":1630461720104,"updateTime":1634523098065,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":0,"position":"726.6787910461426,385.6899448249093"},{"moId":285,"moNum":"DEVICE-151","assetNum":"DEVICE-151","name":"指纹151","ip":"18.0.3.151","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098068,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"516.6867160797119,697.470401367878"},{"moId":253,"moNum":"DEVICE-119","assetNum":"DEVICE-119","name":"温湿度传感器119","ip":"18.0.1.119","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098070,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"541.4954643249512,768.5914150092354"},{"moId":206,"moNum":"CAMERA-206","assetNum":"CAMERA-206","hostid":10539,"name":"智能开关12","ip":"18.0.0.4","port":"80","moType":"zhineng","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:102","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263102","description":"ZmopsCamera02","templateid":10409,"locationId":4,"createTime":1630410840439,"updateTime":1634523098158,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":1,"macChanged":1,"position":"735.9013639431064,618.0400909727992"},{"moId":292,"moNum":"DEVICE-158","assetNum":"DEVICE-158","name":"指纹158","ip":"18.0.3.158","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098058,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"427.4043922424317,700.3154884192696"},{"moId":247,"moNum":"DEVICE-113","assetNum":"DEVICE-113","name":"温湿度传感器113","ip":"18.0.1.113","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098072,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"274.4106063842774,667.2231092012745"},{"moId":271,"moNum":"DEVICE-137","assetNum":"DEVICE-137","name":"门窗传感器137","ip":"18.0.2.137","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098075,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"314.61610722636607,834.176926825342"},{"moId":258,"moNum":"DEVICE-124","assetNum":"DEVICE-124","name":"门窗传感器124","ip":"18.0.2.124","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098077,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"802.0434788219113,830.8559576254465"},{"moId":273,"moNum":"DEVICE-139","assetNum":"DEVICE-139","name":"门窗传感器139","ip":"18.0.2.139","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098079,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"419.82181194758925,838.8681283825654"},{"moId":270,"moNum":"DEVICE-136","assetNum":"DEVICE-136","name":"门窗传感器136","ip":"18.0.2.136","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098082,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"180.88006685599348,839.8502824561342"},{"moId":274,"moNum":"DEVICE-140","assetNum":"DEVICE-140","name":"门窗传感器140","ip":"18.0.2.140","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098084,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"766.9097640467832,217.40953691736206"},{"moId":281,"moNum":"DEVICE-147","assetNum":"DEVICE-147","name":"指纹147","ip":"18.0.3.147","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098086,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"544.9362735748291,593.0854926917306"},{"moId":240,"moNum":"DEVICE-106","assetNum":"DEVICE-106","name":"温湿度传感器106","ip":"18.0.1.106","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098089,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"703.9016609191895,335.31855162117404"},{"moId":242,"moNum":"DEVICE-108","assetNum":"DEVICE-108","name":"温湿度传感器108","ip":"18.0.1.108","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098091,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"490.34963226318365,476.5375800940743"},{"moId":239,"moNum":"DEVICE-105","assetNum":"DEVICE-105","name":"温湿度传感器105","ip":"18.0.1.105","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098094,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"925.9704627990723,769.6020885321847"},{"moId":241,"moNum":"DEVICE-107","assetNum":"DEVICE-107","name":"温湿度传感器107","ip":"18.0.1.107","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098096,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"615.2273845672607,630.4721961829415"},{"moId":222,"moNum":"CAMERA-222","assetNum":"CAMERA-222","hostid":10565,"name":"人体传感器2","ip":"18.0.0.65","port":"80","moType":"renti","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:143","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263143","description":"ZmopsCamera108","templateid":10409,"locationId":4,"createTime":1630414445543,"updateTime":1634523098099,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"915.0747903909635,446.1974623453848"},{"moId":207,"moNum":"CAMERA-207","assetNum":"CAMERA-207","hostid":10546,"name":"三石摄像头8","ip":"18.0.0.9","port":"80","moType":"shootCamera","brand":"海康威视","macAddr":"10:12:fb:b9:d1:07","serialNumber":"DS-2CD2725EF-IZS20200904AACHE74226371-0826","description":"ZmopsCamera06","templateid":10409,"locationId":4,"createTime":1630410840410,"updateTime":1634523098102,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"1010.014805736235,426.2771144721261"},{"moId":255,"moNum":"DEVICE-121","assetNum":"DEVICE-121","name":"门窗传感器121","ip":"18.0.2.121","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098104,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"508.99162864685064,385.8214145514718"},{"moId":282,"moNum":"DEVICE-148","assetNum":"DEVICE-148","name":"指纹148","ip":"18.0.3.148","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098107,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"799.613942088774,647.587911209797"},{"moId":251,"moNum":"DEVICE-117","assetNum":"DEVICE-117","name":"温湿度传感器117","ip":"18.0.1.117","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098110,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"1019.1704396626266,530.0375419471017"},{"moId":237,"moNum":"DEVICE-103","assetNum":"DEVICE-103","name":"温湿度传感器103","ip":"18.0.1.103","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098112,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"710.1690692901611,575.3391338202706"},{"moId":283,"moNum":"DEVICE-149","assetNum":"DEVICE-149","name":"指纹149","ip":"18.0.3.149","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098115,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"816.5732707977295,701.6219688269845"},{"moId":214,"moNum":"CAMERA-214","assetNum":"CAMERA-214","hostid":10553,"name":"窗帘开关1","ip":"18.0.0.62","port":"80","moType":"chuanglian","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:140","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263140","description":"ZmopsCamera105","templateid":10409,"locationId":4,"createTime":1630414445543,"updateTime":1634523098118,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"385.1594715118409,464.0459018561593"},{"moId":243,"moNum":"DEVICE-109","assetNum":"DEVICE-109","name":"温湿度传感器109","ip":"18.0.1.109","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098120,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"359.2352848052979,772.3074889991036"},{"moId":261,"moNum":"DEVICE-127","assetNum":"DEVICE-127","name":"门窗传感器127","ip":"18.0.2.127","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098123,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"432.52349472045904,433.08683546516806"},{"moId":245,"moNum":"DEVICE-111","assetNum":"DEVICE-111","name":"温湿度传感器111","ip":"18.0.1.111","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098125,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"447.76371192932135,772.3855491492501"},{"moId":262,"moNum":"DEVICE-128","assetNum":"DEVICE-128","name":"门窗传感器128","ip":"18.0.2.128","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098018,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"874.5571903459719,157.42505987598815"},{"moId":263,"moNum":"DEVICE-129","assetNum":"DEVICE-129","name":"门窗传感器129","ip":"18.0.2.129","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098020,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"697.809712551486,830.8224903702626"},{"moId":230,"moNum":"CAMERA-230","assetNum":"CAMERA-230","hostid":10569,"name":"人体传感器1","ip":"18.0.0.39","port":"80","moType":"renti","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:117","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263117","description":"ZmopsCamera117","templateid":10409,"locationId":4,"createTime":1630461720104,"updateTime":1634523098023,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":0,"position":"815.2003947482417,445.5399739936528"},{"moId":234,"moNum":"CAMERA-234","assetNum":"CAMERA-234","hostid":10572,"name":"纵目摄像头","ip":"172.16.3.244","port":"80","moType":"domeCamera","brand":"海康威视","macAddr":"10:12:fb:b9:d1:61","serialNumber":"DS-2CD2725EF-IZS20200904AACHE74226371","description":"IPCamera","templateid":10409,"locationId":4,"createTime":1632815580219,"updateTime":1634523098026,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":0,"position":"888.5118618011475,688.0600448462717"},{"moId":276,"moNum":"DEVICE-142","assetNum":"DEVICE-142","name":"指纹142","ip":"18.0.3.142","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098029,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"223.24655240981897,644.4408546302071"},{"moId":235,"moNum":"DEVICE-101","assetNum":"DEVICE-101","name":"温湿度传感器101","ip":"18.0.1.101","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098032,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"432.9622189933287,610.2946633852346"},{"moId":250,"moNum":"DEVICE-116","assetNum":"DEVICE-116","name":"温湿度传感器116","ip":"18.0.1.116","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098146,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"654.6592080527769,483.65028663047383"},{"moId":259,"moNum":"DEVICE-125","assetNum":"DEVICE-125","name":"门窗传感器125","ip":"18.0.2.125","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098035,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"517.5662318824367,833.7703977643826"},{"moId":254,"moNum":"DEVICE-120","assetNum":"DEVICE-120","name":"温湿度传感器120","ip":"18.0.1.120","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098037,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"961.0543918609619,231.29723890755088"},{"moId":278,"moNum":"DEVICE-144","assetNum":"DEVICE-144","name":"指纹144","ip":"18.0.3.144","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098039,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"618.4990880350196,701.2791068822955"},{"moId":277,"moNum":"DEVICE-143","assetNum":"DEVICE-143","name":"指纹143","ip":"18.0.3.143","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098042,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"521.5842294117721,543.0201774451485"},{"moId":272,"moNum":"DEVICE-138","assetNum":"DEVICE-138","name":"门窗传感器138","ip":"18.0.2.138","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098044,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"198.78264617919928,580.2897907111397"},{"moId":257,"moNum":"DEVICE-123","assetNum":"DEVICE-123","name":"门窗传感器123","ip":"18.0.2.123","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098047,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"606.9293810994584,834.2166278335019"},{"moId":256,"moNum":"DEVICE-122","assetNum":"DEVICE-122","name":"门窗传感器122","ip":"18.0.2.122","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098049,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"243.19609600851615,838.8239532971596"},{"moId":280,"moNum":"DEVICE-146","assetNum":"DEVICE-146","name":"指纹146","ip":"18.0.3.146","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098051,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"590.527509689331,581.1094222876778"},{"moId":284,"moNum":"DEVICE-150","assetNum":"DEVICE-150","name":"指纹150","ip":"18.0.3.150","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098054,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"1019.9120110890182,680.5313487860909"},{"moId":216,"moNum":"CAMERA-216","assetNum":"CAMERA-216","hostid":10554,"name":"三石摄像头67","ip":"18.0.0.67","port":"80","moType":"domeCamera","brand":"海康威视","macAddr":"10:12:fb:b9:d1:145","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263145","description":"ZmopsCamera110","templateid":10409,"locationId":4,"createTime":1630414445543,"updateTime":1634523098056,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":1,"macChanged":1,"position":"174.86892325062294,705.3573732090949"},{"moId":244,"moNum":"DEVICE-110","assetNum":"DEVICE-110","name":"温湿度传感器110","ip":"18.0.1.110","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098128,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"636.2378902435303,769.9595218512765"},{"moId":248,"moNum":"DEVICE-114","assetNum":"DEVICE-114","name":"温湿度传感器114","ip":"18.0.1.114","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098131,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"563.2434329986572,662.1779584444386"},{"moId":246,"moNum":"DEVICE-112","assetNum":"DEVICE-112","name":"温湿度传感器112","ip":"18.0.1.112","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098133,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"829.9831829071045,766.4653030249825"},{"moId":265,"moNum":"DEVICE-131","assetNum":"DEVICE-131","name":"门窗传感器131","ip":"18.0.2.131","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098136,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"599.4222583770752,332.8041931006661"},{"moId":225,"moNum":"CAMERA-225","assetNum":"CAMERA-225","hostid":10559,"name":"亮度传感器3","ip":"18.0.0.72","port":"80","moType":"liangdu","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:151","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263151","description":"ZmopsCamera115","templateid":10409,"locationId":4,"createTime":1630414446325,"updateTime":1634523098139,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"900.1089511614887,276.9229369936212"},{"moId":211,"moNum":"CAMERA-211","assetNum":"CAMERA-211","hostid":10550,"name":"亮度传感器1","ip":"18.0.0.71","port":"80","moType":"liangdu","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:150","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263150","description":"ZmopsCamera114","templateid":10409,"locationId":4,"createTime":1630414445543,"updateTime":1634523098141,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"936.9697908418477,589.9448428565986"},{"moId":264,"moNum":"DEVICE-130","assetNum":"DEVICE-130","name":"门窗传感器130","ip":"18.0.2.130","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098143,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"342.48932838439947,485.8144126746407"},{"moId":210,"moNum":"CAMERA-210","assetNum":"CAMERA-210","hostid":10548,"name":"指纹锁2","ip":"18.0.0.3","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:51","serialNumber":"DS-2CD2725EF-IZS20200904AACHE74226351","description":"ZmopsCamera05","templateid":10409,"locationId":4,"createTime":1630410840897,"updateTime":1634523098149,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"358.00918477981406,634.1985412451974"},{"moId":213,"moNum":"CAMERA-213","assetNum":"CAMERA-213","hostid":10555,"name":"温湿度传感器2","ip":"18.0.0.75","port":"80","moType":"wsd","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:154","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263154","description":"ZmopsCamera118","templateid":10409,"locationId":4,"createTime":1630414445544,"updateTime":1634523098151,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"725.7338523864746,767.9546085211983"},{"moId":221,"moNum":"CAMERA-221","assetNum":"CAMERA-221","hostid":10557,"name":"门窗传感器","ip":"18.0.0.66","port":"80","moType":"menchuang","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:144","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263144","description":"ZmopsCamera109","templateid":10409,"locationId":4,"createTime":1630414445543,"updateTime":1634523098154,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"289.63233566284185,529.8362289283028"},{"moId":279,"moNum":"DEVICE-145","assetNum":"DEVICE-145","name":"指纹145","ip":"18.0.3.145","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:136","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263136","description":"ZmopsCamera101","locationId":4,"createTime":1630414448636,"updateTime":1634523098156,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"723.5196751972945,699.7855010840645"}]') ,
      showMap: false,
    }
  },
  watch: {
    id: {
      deep: true,
      immediate: true,
      handler: function (val) {
        // this.getList(val)
        this.getTime()
      },
    },
  },
  methods: {
    getTime() {
      let data = new Date()
      let h = data.getHours()
      let m = data.getMinutes()
      let s = data.getSeconds()
      this.time =
        (h > 9 ? h + '' : '0' + h) +
        ':' +
        (m > 9 ? m + '' : '0' + m) +
        ':' +
        (s > 9 ? s + '' : '0' + s)
    },
    getList(id) {
      this.loading = true
      LinkedMo({ locationId: id }).then((res) => {
        if (res.code == 200) {
          this.dianList = []
          for (const item of res.data) {
            item.pingLoss = Math.round(item.pingLoss)
            item.pingResponseTime = Math.round(item.pingResponseTime).toFixed(1)
            this.dianList.push(item)
          }
          this.loading = false
        }
      })
      getLocationDetail({ id })
        .then((res) => {
          if (res.code === 200) {
            this.linkedMo = res.data.linkedMo
            if (res.data.backImage) {
              this.backImage = res.data.backImage
            } else {
              this.backImage = '/storage/map-bg.png'
            }
            if (res.data.imageSize) {
              this.imageSize = res.data.imageSize.split(',')
            } else {
              this.imageSize = [540, 540]
            }
            this.showMap = true
          }
        })
        .catch(() => {})
    },
    shrink() {
      this.listShow = !this.listShow
    },
    selectDian(id) {
      this.changeID = id
      if (id && this.listShow) {
        document.querySelector('#id' + id).scrollIntoView(true)
      }
    },
    showDetail(id, val, type) {
      val = val || false
      this.$emit('showDetail', id, val, type)
    },
    rowClick(row, column, event) {
      this.showDetail(row.moId,false,row.moType)
    }
  },
}
</script>

<style scoped lang="scss">
.detail-wrap {
  height: 610px;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  .detail-left {
    width: 50%;
    padding: 0 30px;
  }
  .detail-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 660px;
  }
  .left-tit {
    height: 55px;
    line-height: 55px;
    font-size: 16px;
    font-weight: 500;
    color: #03a9e5;
  }
  .left-con {
    height: 531px;
  }
  .right-tit {
    height: 55px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left,
    .right {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      color: #84d5f7;
      .ml {
        margin-left: 30px;
      }
    }
    .left {
      .ml {
        color: #ff5968;
      }
    }
    .right {
      span {
        display: inline-block;
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 9px;
        border-radius: 8px;
        border: 2px solid #00fffc;
        position: relative;
        top: -1px;
      }
      .ml {
        span {
          border: 2px solid #eb4251;
        }
      }
    }
  }

  ::v-deep .el-loading-mask{
    background-color: rgba(10, 60, 94, 0.5) !important
  }
  .status-list {
    height: 540px;
    background: rgba(0, 47, 79, 0.39);
    border: 1px solid #327fd6;
    border-radius: 8px 0px 0px 8px;
    border-right: none;
    position: relative;
    .shrink {
      font-size: 44px;
      position: absolute;
      left: -30px;
      top: 260px;
      cursor: pointer;
    }
    .shrink-left {
      font-size: 12px;
      position: absolute;
      left: -14px;
      top: 277px;
      cursor: pointer;
    }
    .shrink-right {
      font-size: 12px;
      position: absolute;
      left: -14px;
      top: 277px;
      cursor: pointer;
    }
    .status-tit {
      height: 48px;
      padding-left: 16px;
      background: linear-gradient(
        90deg,
        rgba(0, 138, 255, 0.59) 0%,
        rgba(4, 20, 39, 0) 100%
      );
      border-radius: 6px 0px 0px 0px;
      font-size: 18px;
      font-weight: 500;
      color: #00deff;
      line-height: 48px;
    }
    .status-wrap {
      padding: 18px 15px;
      padding-bottom: 0px;
      height: 490px;
      overflow: auto;
      .status-con {
        cursor: pointer;
        height: 145px;
        margin-bottom: 10px;
        border: 1px solid #0e8eb6;
        background: linear-gradient(
          183deg,
          rgba(0, 186, 255, 0.2) 0%,
          rgba(0, 168, 255, 0.09) 100%
        );
        border-radius: 4px;
        .con-tit {
          height: 34px;
          display: flex;
          align-items: center;
          padding: 0 8px;
          background: linear-gradient(
            0deg,
            rgba(0, 186, 255, 0.44) 0%,
            rgba(0, 0, 0, 0.01) 99%
          );
          border-radius: 4px 4px 0px 0px;
          font-size: 14px;
          font-weight: 500;
          color: #00c6ff;
          span {
            display: inline-block;
            width: 21px;
            height: 21px;
            line-height: 20px;
            margin-right: 8px;
            border-radius: 50%;
            border: 2px solid #00fffc;
            text-align: center;
          }
        }
        .con-tit-error {
          span {
            border: 2px solid #eb4251;
          }
        }
        .con-ip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          margin-bottom: 24px;
          height: 18px;
          cursor: pointer;
          .left {
            margin-left: 13px;
            font-size: 14px;
            font-weight: 500;
            color: #00c6ff;
          }
          .right {
            background: #00b6ff;
            border-radius: 2px 0px 0px 2px;
            font-size: 12px;
            font-weight: 500;
            color: #06101f;
            padding: 0 9px;
          }
        }
        .tips {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 400;
          color: #00c6ff;
          span {
            color: #00e4ff;
            font-size: 16px;
            margin-right: 2px;
          }
        }
      }
      .status-con-active {
        border: 3px solid #0e8eb6;
        box-shadow: 0px 0px 24px 0px #0e8eb6;
      }
    }
  }
}
::v-deep .dark{
  thead th{
    background: linear-gradient(
            180deg,
            #054163 0%,
            #036D9A 99%
    )!important;
    color: #00C6FF;
  }
  tr {
    background-color: #043151!important;
    color: #00C6FF;
  }
  .el-table__body tr:hover > td {
    background-color: #0c3f63!important;
  }
  td,th.is-leaf{
    border-bottom: 1px solid #0c3f63;
  }
  .el-table__row--striped td{
    background-color: #0c3f63 !important;
    color: #00C6FF;
  }
  .is-scrolling-none{
    background-color: #0c3f63 !important;
  }
}
.hidden {
  .detail-left {
    width: 100%;
  }
  .detail-right {
    right: -660px;
  }
}
</style>
