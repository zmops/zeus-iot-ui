<template>
  <div class="app-wrap">
    <svg-icon
      class="btn"
      v-if="fullShow"
      :iconClass="iconClass"
      style="font-size:20px; "
      @click="full"
    ></svg-icon>
    <div class="app-terminal">
      <div :class="dialogVisible? 'terminal vague' : 'terminal'">
        <div class="term_tit">常州产业投资集团楼宇物联实时监控中心</div>
        <div class="dateTime">
          <div class="riqi">{{ dateTime | date }} {{ weekList[dataWeek] }}</div>
          <div class="time">
            <TimeDigital class="time-svg" :time="dataHours"></TimeDigital>
            <svg-icon class="time-mh-svg" iconClass="fullscreen-time-mh"></svg-icon>
            <TimeDigital class="time-svg" :time="dataMinutes"></TimeDigital>
            <svg-icon class="time-mh-svg" iconClass="fullscreen-time-mh"></svg-icon>
            <TimeDigital class="time-svg" :time="dataSeconds"></TimeDigital>
          </div>
        </div>
        <div class="svgList">
          <img v-show="chooseArea === '1F'" src="../../assets/terminal/1F.png" class="coord_1f">
          <img v-show="chooseArea !== '1F' && hoverArea === '1F'" src="../../assets/terminal/1F.png" class="coord_1f svg-hover">
          <img v-show="chooseArea === '2F'" src="../../assets/terminal/2F.png" class="coord_2f">
          <img v-show="chooseArea !== '2F' && hoverArea === '2F'" src="../../assets/terminal/2F.png" class="coord_2f svg-hover">
          <img v-show="chooseArea === '3F'" src="../../assets/terminal/3F.png" class="coord_3f">
          <img v-show="chooseArea !== '3F' && hoverArea === '3F'" src="../../assets/terminal/3F.png" class="coord_3f svg-hover">
          <img v-show="chooseArea === '4F'" src="../../assets/terminal/4F.png" class="coord_4f">
          <img v-show="chooseArea !== '4F' && hoverArea === '4F'" src="../../assets/terminal/4F.png" class="coord_4f svg-hover">
          <img v-show="chooseArea === '5F'" src="../../assets/terminal/5F.png" class="coord_5f">
          <img v-show="chooseArea !== '5F' && hoverArea === '5F'" src="../../assets/terminal/5F.png" class="coord_5f svg-hover">
          <img v-show="chooseArea === '6F'" src="../../assets/terminal/6F.png" class="coord_6f">
          <img v-show="chooseArea !== '6F' && hoverArea === '6F'" src="../../assets/terminal/6F.png" class="coord_6f svg-hover">
        </div>
        <div class="wrap">
          <img src="../../assets/terminal/wrap-left.png" class="wrap-left">
          <div class="wrap-mid">
            <div class="area-f_1">
              <div class="active reverse" v-if="activeArea === '1F'" @click="detail(4)">
                <img src="../../assets/terminal/arrow-on.png" class="arrow-right"/>
                <img src="../../assets/terminal/active-up.png" class="tips-right-up"/>
                <img src="../../assets/terminal/active-down.png" class="tips-tight-down"/>
                <div class="active-con left-side">
                  <div class="active-left">一楼</div>
                  <div class="active-right">
                    <svg-icon icon-class="monitor-gj" style="font-size: 14px; margin-right: 12px"></svg-icon>
                    <!--                              <svg-icon icon-class="monitor-jq"-->
                    <!--                                        style="font-size: 14px; margin-right: 4px"></svg-icon>-->
                    <span>64</span>
                  </div>
                </div>
              </div>
              <div
                :class="true ? 'unactive right-tag error' : 'unactive right-tag' "
                v-else
                @mouseenter="changeArea('1F',0,4)"
                @mouseleave="leave()"
              >
                <img src="../../assets/terminal/arrow-off.png" class="arrow-right"/>
                <div>一楼</div>
              </div>
            </div>
            <div class="area-f_2">
              <div class="active" v-if="activeArea === '2F'" @click="detail(5)">
                <img src="../../assets/terminal/arrow-on.png" class="arrow-left"/>
                <img src="../../assets/terminal/active-up.png" class="tips-left-up"/>
                <img src="../../assets/terminal/active-down.png" class="tips-left-down"/>
                <div class="active-con right-side">
                  <div class="active-left">二楼</div>
                  <div class="active-right">
                    <svg-icon icon-class="monitor-gj" v-if="alarmIds.includes(5)" style="font-size: 14px; margin-right: 12px"></svg-icon>
                    <!--                              <svg-icon icon-class="monitor-jq"-->
                    <!--                                        style="font-size: 14px; margin-right: 4px"></svg-icon>-->
                    <span>{{ Info.linkedTerminalNum }}</span>
                  </div>
                </div>
              </div>
              <div
                :class="alarmIds.includes(5) ? 'unactive left-tag error' : 'unactive left-tag' "
                v-else
                @mouseenter="changeArea('2F',1,5)"
                @mouseleave="leave()"
              >
                <img src="../../assets/terminal/arrow-off.png" class="arrow-left"/>
                <div>二楼</div>
              </div>
            </div>
            <div class="area-f_3">
              <div class="active reverse" v-if="activeArea === '3F'" @click="detail(6)">
                <img src="../../assets/terminal/arrow-on.png" class="arrow-right"/>
                <img src="../../assets/terminal/active-up.png" class="tips-right-up"/>
                <img src="../../assets/terminal/active-down.png" class="tips-tight-down"/>
                <div class="active-con left-side">
                  <div class="active-left">三楼</div>
                  <div class="active-right">
                    <svg-icon icon-class="monitor-gj" v-if="alarmIds.includes(6)" style="font-size: 14px; margin-right: 12px"></svg-icon>
                    <!--                              <svg-icon icon-class="monitor-jq"-->
                    <!--                                        style="font-size: 14px; margin-right: 4px"></svg-icon>-->
                    <span>{{ Info.linkedTerminalNum }}</span>
                  </div>
                </div>
              </div>
              <div
                :class="alarmIds.includes(6) ? 'unactive right-tag error' : 'unactive right-tag' "
                v-else
                @mouseenter="changeArea('3F',2,6)"
                @mouseleave="leave()"
              >
                <img src="../../assets/terminal/arrow-off.png" class="arrow-right"/>
                <div>三楼</div>
              </div>
            </div>
            <div class="area-f_4">
              <div class="active" v-if="activeArea === '4F'" @click="detail(7)">
                <img src="../../assets/terminal/arrow-on.png" class="arrow-left"/>
                <img src="../../assets/terminal/active-up.png" class="tips-left-up"/>
                <img src="../../assets/terminal/active-down.png" class="tips-left-down"/>
                <div class="active-con right-side">
                  <div class="active-left">四楼</div>
                  <div class="active-right">
                    <svg-icon icon-class="monitor-gj" v-if="alarmIds.includes(7)" style="font-size: 14px; margin-right: 12px"></svg-icon>
                    <!--                              <svg-icon icon-class="monitor-jq"-->
                    <!--                                        style="font-size: 14px; margin-right: 4px"></svg-icon>-->
                    <span>{{ Info.linkedTerminalNum }}</span>
                  </div>
                </div>
              </div>
              <div
                :class="alarmIds.includes(7) ? 'unactive left-tag error' : 'unactive left-tag' "
                v-else
                @mouseenter="changeArea('4F',3,7)"
                @mouseleave="leave()"
              >
                <img src="../../assets/terminal/arrow-off.png" class="arrow-left"/>
                <div>四楼</div>
              </div>
            </div>
            <div class="area-f_5">
              <div class="active reverse" v-if="activeArea === '5F'" @click="detail(8)">
                <img src="../../assets/terminal/arrow-on.png" class="arrow-right"/>
                <img src="../../assets/terminal/active-up.png" class="tips-right-up"/>
                <img src="../../assets/terminal/active-down.png" class="tips-tight-down"/>
                <div class="active-con left-side">
                  <div class="active-left">五楼</div>
                  <div class="active-right">
                    <svg-icon icon-class="monitor-gj" v-if="alarmIds.includes(8)" style="font-size: 14px; margin-right: 12px"></svg-icon>
                    <!--                              <svg-icon icon-class="monitor-jq"-->
                    <!--                                        style="font-size: 14px; margin-right: 4px"></svg-icon>-->
                    <span>{{ Info.linkedTerminalNum }}</span>
                  </div>
                </div>
              </div>
              <div
                :class="alarmIds.includes(8) ? 'unactive right-tag error' : 'unactive right-tag' "
                v-else
                @mouseenter="changeArea('5F',4,8)"
                @mouseleave="leave()"
              >
                <img src="../../assets/terminal/arrow-off.png" class="arrow-right"/>
                <div>五楼</div>
              </div>
            </div>
            <div class="area-f_6">
              <div class="active" v-if="activeArea === '6F'" @click="detail(9)">
                <img src="../../assets/terminal/arrow-on.png" class="arrow-left"/>
                <img src="../../assets/terminal/active-up.png" class="tips-left-up"/>
                <img src="../../assets/terminal/active-down.png" class="tips-left-down"/>
                <div class="active-con right-side">
                  <div class="active-left">楼顶</div>
                  <div class="active-right">
                    <svg-icon icon-class="monitor-gj" v-if="alarmIds.includes(9)" style="font-size: 14px; margin-right: 12px"></svg-icon>
                    <!--                              <svg-icon icon-class="monitor-jq"-->
                    <!--                                        style="font-size: 14px; margin-right: 4px"></svg-icon>-->
                    <span>{{ Info.linkedTerminalNum }}</span>
                  </div>
                </div>
              </div>
              <div
                :class="alarmIds.includes(9) ? 'unactive left-tag error' : 'unactive left-tag' "
                v-else
                @mouseenter="changeArea('6F',5,9)"
                @mouseleave="leave()"
              >
                <img src="../../assets/terminal/arrow-off.png" class="arrow-left"/>
                <div>楼顶</div>
              </div>
            </div>
          </div>
          <img src="../../assets/terminal/wrap-right.png" class="wrap-right">
        </div>
        <div class="spot first">
          <div class="spotCon">
            <img class="big" src="../../assets/terminal/light-big.png"/>
            <img class="small" src="../../assets/terminal/light-small.png"/>
            <img class="one absolute" src="../../assets/terminal/light-up-one.png"/>
            <img class="tow absolute" src="../../assets/terminal/light-up-two.png"/>
            <img class="three absolute" src="../../assets/terminal/light-up-thr.png"/>
            <img class="four absolute" src="../../assets/terminal/light-up-two.png"/>
          </div>
        </div>
        <div class="spot sec">
          <div class="spotCon">
            <img class="small" src="../../assets/terminal/light-small.png"/>
            <img class="three absolute" src="../../assets/terminal/light-up-thr.png"/>
          </div>
        </div>
        <div class="spot thr">
          <div class="spotCon">
            <img class="small" src="../../assets/terminal/light-small.png"/>
            <img class="three absolute" src="../../assets/terminal/light-up-thr.png"/>
          </div>
        </div>
        <div class="spot fou">
          <div class="spotCon">
            <img class="small" src="../../assets/terminal/light-small.png"/>
            <img class="three absolute" src="../../assets/terminal/light-up-thr.png"/>
          </div>
        </div>
        <div class="spot fiv">
          <div class="spotCon">
            <img class="small" src="../../assets/terminal/light-small.png"/>
            <img class="three absolute" src="../../assets/terminal/light-up-thr.png"/>
          </div>
        </div>
        <div class="spot six">
          <div class="spotCon">
            <img class="small" src="../../assets/terminal/light-small.png"/>
            <img class="three absolute" src="../../assets/terminal/light-up-thr.png"/>
          </div>
        </div>
        <div class="line-left">
          <img class="long" src="../../assets/terminal/line-long.png"/>
          <img class="middle" src="../../assets/terminal/line-middle.png"/>
          <img class="short" src="../../assets/terminal/line-short.png"/>
        </div>
        <div class="line-right">
          <img class="long" src="../../assets/terminal/line-long.png"/>
          <img class="middle" src="../../assets/terminal/line-middle.png"/>
          <img class="short" src="../../assets/terminal/line-short.png"/>
        </div>
      </div>
      <el-dialog
        class="dialogDetail ccc"
        :visible.sync="dialogVisible"
        :width="'1340px'"
        v-if="dialogVisible"
        :center="true"
        :show-close="false"
        @close="closeDialog"
      >
        <div class="dialog-tit">{{ name }}视频终端监控视图</div>
        <div class="dialog_divider"></div>
        <TerminalDetail :id="4" :alarmNum="2" :Num="64" @showDetail="showDetails"></TerminalDetail>
      </el-dialog>
      <OperaDetail
        :moId="4"
        :bg="1"
        :monitor="false"
        :dialogVisible="dialogDetail"
        v-if="dialogDetail"
        @changeDetailVisible="changeDetailVisible"
      ></OperaDetail>
      <el-dialog
        class="dialogDetail ccc"
        :visible.sync="dialogDetail2"
        :width="'816px'"
      >
        <div class="dialog-t">
          <img src="../../assets/terminal/icon_yanwu.png">
          烟雾传感器
        </div>
        <div class="dialog_divider"></div>
        <div class="dialog-body">
          <el-row :gutter="8">
            <el-col :span="12">
              <el-row :gutter="8">
                <el-col :span="12">
                  <div class="img">
                    <img src="../../assets/terminal/yanwu.png">
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="border" style="height: 80px">
                    <div class="key">告警状态</div>
                    <div v-if="dev.status === '1'" class="value" style="color:#FF5968;">告警</div>
                    <div v-else class="value">正常</div>
                  </div>
                  <div class="border" style="height: 80px; margin-top: 6px">
                    <div class="key">监控状态</div>
                    <div class="value">在线</div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="border" style="height: 80px;margin-top: 6px; margin-bottom: 6px">
                    <div class="key">品牌</div>
                    <div class="value">涂鸦</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="border" style="height: 80px">
                    <div class="key">设备ID</div>
                    <div class="value">1445464225</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="border" style="height: 80px">
                    <div class="key">地址</div>
                    <div class="value">1F</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <div class="log">
                <div class="log-title">
                  设备日志
                </div>
                <div style="padding: 12px 17px 12px 25px">
                  <div style="color: #00E4FF">
                    <span>○  07月18日 17:02:04</span>
                    <span style="float: right">告警恢复</span>
                  </div>
                  <div class="interval">3小时43分35秒</div>
                  <div style="color: #00E4FF">
                    <span>○  07月18日 13:18:29</span>
                    <span style="float: right;color: #FF5968">告警触发</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
      <el-dialog
        class="dialogDetail ccc"
        :visible.sync="dialogDetail3"
        :width="'816px'"
      >
        <div class="dialog-t">
          <img src="../../assets/terminal/icon_ac.png">
          空调控制器
        </div>
        <div class="dialog_divider"></div>
        <div class="dialog-body">
          <el-row :gutter="8">
            <el-col :span="12">
              <el-row :gutter="8">
                <el-col :span="12">
                  <div class="img" style="padding-top: 15px;">
                    <img src="../../assets/terminal/ac.png">
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="border" style="height: 80px">
                    <div class="key">告警状态</div>
                    <div v-if="dev.status === '1'" class="value" style="color:#FF5968;">告警</div>
                    <div v-else class="value">正常</div>
                  </div>
                  <div class="border" style="height: 80px; margin-top: 6px">
                    <div class="key">监控状态</div>
                    <div class="value">在线</div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="border" style="height: 80px;margin-top: 6px; margin-bottom: 6px">
                    <div class="key">型号</div>
                    <div class="value">KK-32ASFFDV01ZM</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="border" style="height: 80px">
                    <div class="key">设备ID</div>
                    <div class="value">1445464225</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="border" style="height: 80px">
                    <div class="key">地址</div>
                    <div class="value">1F</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row :gutter="8">
                <el-col :span="8">
                  <div class="border" style="height: 80px">
                    <div class="key">空调状态</div>
                    <div class="value">正常</div>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="border" style="height: 80px; line-height: 80px; padding-right: 26px; padding-top: 20px">
                    <div class="key zeus-inline-block" style="vertical-align: top;margin-top: 6px">远程控制</div>
                    <div class="ac_but zeus-inline-block">
                      <div v-if="but" class="but1" @click="but = false">打开</div>
                      <div v-else class="but2" @click="but = true">关闭</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="log2">
                    <div class="log-title">
                      设备日志
                    </div>
                    <div style="padding: 12px 17px 12px 25px">
                      <div style="color: #00E4FF" class="zeus-mb-15">
                        <span>○  07月18日 17:02:04</span>
                        <span style="float: right">空调开机</span>
                      </div>
                      <div style="color: #00E4FF">
                        <span>○  07月18日 13:18:29</span>
                        <span style="float: right;">空调关机</span>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import TerminalDetail from '@/views/visualization/TerminalDetail'
import TimeDigital from '@/views/visualization/TimeDigital'
import OperaDetail from '@/views/visualization/OperaDetail'
// import {
//   homeMoStatus,
//   homeMoOfflineAnalyse,
//   homeLatestOffline,
//   homeLatestMacChange,
//   homeTopN,
//   homeMoLocationAnalyse,
// } from '@/api/basics'
// import {
//   getLocationByPage,
//   getLocationDetail,
//   locationAlarm,
// } from '@/api/locationMgr'
// import {getDetail, getUserList} from "@/api/cameramgr";

export default {
  components: {
    TerminalDetail,
    OperaDetail,
    TimeDigital
  },
  filters: {
    date: (dateStr) => {
      return dateStr.split(' ')[0]
    },
    time: (dateStr) => {
      return dateStr.split(' ')[1]
    },
  },
  data() {
    return {
      Temperature: '',
      nowHour: '',
      nowMin: '',
      nowSec: '',
      nowWeek: '',
      nowDate: '',
      timer: null,
      timer2: null,
      timer3: null,
      flootTimer: null,
      floot: -1,
      DataTimer: null,
      activeArea: '',
      chooseArea: '',
      dateTime: '',
      dataWeek: 0,
      dataSeconds: 0,
      dataMinutes: 0,
      dataHours: 0,
      weekList: [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
      ],
      hoverArea: '',
      terminalData: {},
      RoseData: [],
      pingList: [],
      frequency: [],
      newest: [],
      replace: [],
      dialogVisible: false,
      dialogDetail: false,
      dialogDetail2: false,
      dialogDetail3: false,
      iconClass: 'fullscreen-white',
      fullShow: true,
      location: [],
      Info: {"id":7,"name":"4F","pid":2,"parentName":"常州产业投资集团大楼","deptId":1,"sort":170,"linkedTerminalNum":3,"linkedTerminalAlarmNum":0,"childs":[],"backImage":"data:image/png;base64,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... (10024 total length)","thumbnail":"data:image/png;base64,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... (10025 total length)","linkedMo":[{"moId":203,"moNum":"CAMERA-203","assetNum":"CAMERA-203","hostid":10540,"name":"指纹锁4","ip":"18.0.0.47","port":"80","moType":"zhiwen","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:145","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263145","description":"ZmopsCamera09","templateid":10409,"locationId":7,"createTime":1630410840390,"updateTime":1634190970086,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"516.0929462728859,754.1976964363558"},{"moId":217,"moNum":"CAMERA-217","assetNum":"CAMERA-217","hostid":10549,"name":"人体传感器3","ip":"18.0.0.63","port":"80","moType":"renti","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:141","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263141","description":"ZmopsCamera106","templateid":10409,"locationId":7,"createTime":1630414445544,"updateTime":1634190970088,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"754.2434407693985,392.71989428945074"},{"moId":226,"moNum":"CAMERA-226","assetNum":"CAMERA-226","hostid":10560,"name":"三石摄像头74","ip":"18.0.0.74","port":"80","moType":"domeCamera","brand":"涂鸦","macAddr":"10:12:fb:b9:d1:153","serialNumber":"DS-2CD2725EF-IZS20200904AACHE742263153","description":"ZmopsCamera117","templateid":10409,"locationId":7,"createTime":1630414446923,"updateTime":1634190970083,"deptId":1,"sourceType":1,"username":"admin","password":"Zmops@0610","status":0,"macChanged":1,"position":"186.93571885898004,712.8638772340889"}],"imageSize":"1078,931"},
      name: '',
      id: '',
      number: '',
      alarmNum: '',
      alarmIds: '',
      mid: '',
      monitor: '',
      dev:{},
      but: true,
    }
  },
  async created() {
    // this.fullShow = this.$route.meta.full
    await this.getLocation()
    this.timer = setInterval(() => {
      this.FormatDate()
    }, 1000)
    this.toggles()
    this.flootTimer = setInterval(() => {
      this.toggles()
    }, 5000)
    this.getData()
    this.DataTimer = setInterval(() => {
      this.getData()
    }, 10000)
    this.timer3 = setInterval(() => {
      this.dateTime = this.moment(new Date()).format('YYYY年MM月DD日  HH:mm:ss')
      let myDate = new Date()
      this.dataWeek = myDate.getDay() // 获取当前星期X(0-6,0代表星期天)
      this.dataHours = myDate.getHours() // 获取当前小时数(0-23)
      this.dataMinutes = myDate.getMinutes() // 获取当前分钟数(0-59)
      this.dataSeconds = myDate.getSeconds() // 获取当前秒数(0-59)
    }, 1000)
  },
  destroyed() {
    clearInterval(this.timer)
    clearInterval(this.timer2)
    clearInterval(this.timer3)
    clearInterval(this.flootTimer)
    clearInterval(this.DataTimer)
    this.timer = null
    this.timer2 = null
    this.timer3 = null
    this.flootTimer = null
    this.DataTimer = null
  },
  // mounted() {
  //   screenfull.on('change', this.change)
  // },
  mounted() {
    //监听键盘按键事件
    let self = this
    this.$nextTick(() => {
      document.addEventListener('keyup', (e) => {
        if (e.keyCode == 27) {
          self.closeScreenFull()
        }
      })
    })
  },
  methods: {
    async getLocation() {
      // await getLocationByPage({page: 1, size: 99}).then((res) => {
      //   if (res.code == 200) {
      //     this.location = res.data
      //   }
      // })
    },
    getLocationName(id) {
      for (const item of this.location) {
        if (item.id == id) {
          return item.name
        }
      }
    },
    getData() {
      // locationAlarm().then((res) => {
      //   if (res.code == 200) {
      //     this.alarmIds = res.data
      //   }
      // })
      // homeMoStatus().then((res) => {
      //   if (res.code == 200) {
      //     this.terminalData = res.data
      //   }
      // })
      // homeMoLocationAnalyse({locationId: 2}).then((res) => {
      //   if (res.code == 200) {
      //     this.RoseData = res.data
      //   }
      // })
      // homeTopN({n: 5}).then((res) => {
      //   if (res.code == 200) {
      //     this.pingList = []
      //     if (res.data.icmppingsec) {
      //       for (const item of res.data.icmppingsec) {
      //         let obj = item
      //         obj.load = parseFloat(obj.load).toFixed(1)
      //         if (obj.trends[0]) {
      //           let vals = obj.trends[0].metricValues
      //           let objs = {
      //             value: [],
      //             name: [],
      //           }
      //           for (const val of vals) {
      //             objs.value.push(parseFloat(val.originalVal))
      //             objs.name.push(val.mclock)
      //           }
      //           obj.valueList = objs
      //         }
      //         this.pingList.push(obj)
      //       }
      //     }
      //   }
      // })
      // homeMoOfflineAnalyse({n: 5}).then((res) => {
      //   if (res.code == 200) {
      //     this.frequency = res.data
      //   }
      // })
      // homeLatestOffline({n: 5}).then((res) => {
      //   if (res.code == 200) {
      //     this.newest = []
      //     let max = 0
      //     for (const item of res.data) {
      //       if (item.uptime > max) {
      //         max = item.uptime
      //       }
      //     }
      //     for (const item of res.data) {
      //       item.percent = (item.uptime / max).toFixed(2) * 100
      //       this.newest.push(item)
      //     }
      //   }
      // })
      // homeLatestMacChange({n: 5}).then((res) => {
      //   if (res.code == 200) {
      //     this.replace = res.data
      //   }
      // })
    },
    /*全屏*/
    full() {
      if (screenfull.isEnabled) {
        screenfull.toggle(this.$el)
      }
      // this.$router.push('/terminalScreen')
    },
    closeScreenFull() {
      if (!this.fullShow) {
        this.$router.push('/panel/terminalScreen')
      }
    },
    FormatDate() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let week = date.getDay()
      let H = date.getHours()
      let M = date.getMinutes()
      let S = date.getSeconds()
      this.nowDate =
        year +
        '.' +
        (month > 9 ? month : '0' + month) +
        '.' +
        (day > 9 ? day : '0' + day)
      this.nowWeek = '星期' + '日一二三四五六'.charAt(week)
      this.nowHour = H > 9 ? H : '0' + H
      this.nowMin = M > 9 ? M : '0' + M
      this.nowSec = S > 9 ? S : '0' + S
    },
    FormatTime(time) {
      var now = new Date(time)
      var year = now.getFullYear() + ''
      var month = now.getMonth() + 1 + ''
      var date = now.getDate() + ''
      month = month.length < 2 ? '0' + month : month
      date = date.length < 2 ? '0' + date : date

      return year + '-' + month + '-' + date
    },
    tigger(m) {
      this.timer2 = setInterval(() => {
        this.flootTimer = setInterval(() => {
          this.toggles()
        }, 5000)
        clearInterval(this.timer2)
        this.timer2 = null
      }, m)
    },
    async toggles() {
      this.floot = this.floot++ < 6 ? this.floot++ : 0
      this.hoverArea = ''
      switch (this.floot) {
        case 0:
          this.activeArea = '1F'
          this.chooseArea = '1F'
          await this.getLocationInfo(4)
          break
        case 1:
          this.activeArea = '2F'
          this.chooseArea = '2F'
          await this.getLocationInfo(5)
          break
        case 2:
          this.activeArea = '3F'
          this.chooseArea = '3F'
          await this.getLocationInfo(6)
          break
        case 3:
          this.activeArea = '4F'
          this.chooseArea = '4F'
          await this.getLocationInfo(7)
          break
        case 4:
          this.activeArea = '5F'
          this.chooseArea = '5F'
          await this.getLocationInfo(8)
          break
        case 5:
          this.activeArea = '6F'
          this.chooseArea = '6F'
          await this.getLocationInfo(9)
          break
      }
    },
    async changeArea(value, index, id) {
      await this.getLocationInfo(id)
      this.hoverArea = value
      this.activeArea = value
      this.floot = index
      clearInterval(this.timer2)
      clearInterval(this.flootTimer)
      this.timer2 = null
      this.flootTimer = null
      this.tigger(10000)
    },
    leave() {
      this.hoverArea = ''
    },
    async detail(id) {
      await this.getLocationInfo(id)
      this.name = this.Info.parentName + this.Info.name
      this.id = this.Info.id
      this.number = this.Info.linkedTerminalNum
      this.alarmNum = this.Info.linkedTerminalAlarmNum
      this.activeArea = this.hoverArea
      this.chooseArea = this.hoverArea
      this.hoverArea = ''
      if (this.number == 0) {
        this.$message.closeAll()
        this.$message({
          message: '暂未关联设备',
          iconClass: 'el-icon-warning-outline',
          center: true,
          duration: 3000,
          customClass: 'tipsmessage',
          offset: 125,
        })
      } else {
        this.dialogVisible = true
        clearInterval(this.timer2)
        clearInterval(this.flootTimer)
        this.timer2 = null
        this.flootTimer = null
      }
    },
    async getLocationInfo(id) {
      // await getLocationDetail({id: id}).then((res) => {
      //   if (res.code == 200) {
      //     this.Info = res.data
      //   }
      // })
    },
    closeDialog() {
      clearInterval(this.timer2)
      clearInterval(this.flootTimer)
      this.timer2 = null
      this.flootTimer = null
      this.tigger(10000)
    },
    link(value) {
      let url = {}
      switch (value) {
        case 'operatingCon':
          url = this.$router.resolve({
            path: '/cameraMgr/operatingCon',
          })
          break
        case 'offlineHistory':
          url = this.$router.resolve({
            path: '/cameraMgr/offlineHistory',
          })
          break
        case 'changeRecord':
          url = this.$router.resolve({
            path: '/cameraMgr/changeRecord',
          })
          break
      }
      window.open(url.href, '_blank')
    },
    showDetail(row) {
      this.mid = row.moId || row.mo_id
      this.monitor = false
      this.dialogDetail = true
    },
    showDetails(id, val, type) {
      this.mid = id
      this.monitor = val
      if (type === 'aioCamera' || type === 'hsdCamera' || type === 'domeCamera' || type === 'shootCamera') {
        this.dialogDetail = true
      } else if(type === 'center'){
        // getDetail({ moId: id }).then((res) => {
        //   this.dev = res.data
        // })
        this.dialogDetail3 = true
      }else {
        // getDetail({ moId: id }).then((res) => {
        //   this.dev = res.data
        // })
        this.dialogDetail2 = true
      }
    },

    changeDetailVisible(val) {
      this.dialogDetail = val
    },
  }
}
</script>

<style lang="scss" scoped>
.ccc::v-deep .el-dialog__header{
  padding: 0!important;
  border-bottom-width: 0!important;
}

.ccc::v-deep .el-dialog--center .el-dialog__body{
  padding: 0!important;
}
.ccc::v-deep .el-dialog__headerbtn{
  z-index: 999!important;
}
.app-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .btn {
    position: absolute;
    right: 15px;
    top: 15px;
    color: white;
    background-color: transparent;
    border: 0;
    cursor: pointer;
    z-index: 999;

    &:focus {
      outline: 0;
    }
  }
}

.dialog-t{
  height: 56px;
  line-height: 56px;
  font-size: 16px;
  background-color: rgba(6, 16, 34, 0.72);
  color: #4FCDFF;
  padding-left: 12px;
}
::v-deep .dialog-title{
  color: transparent;
}

.dialog-body{
  padding: 15px 10px 25px 10px;
  background-color: rgba(6, 16, 34, 0.72);

  .img{
    height: 166px;
    text-align: center;
    border: 1px #0A5879 solid;
    background-color: transparent;
  }

  .log2{
    margin-top: 6px;
    height: 252px;
    border: 1px #0A5879 solid;
    background-color: transparent;
  }

  .ac_but{
    float: right;
    background-color: #064E6D;
    border-radius: 7px;
    padding: 5px;
    width: 86px;
    height: 40px;

    .but1{
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding-left: 13px;
      cursor: pointer;
      color: #fff;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-image: url('../../assets/terminal/ac_open.png');

      &:hover{
        background-image: url('../../assets/terminal/ac_open_hover.png');
      }
    }
    .but2{
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding-left: 33px;
      cursor: pointer;
      color: #fff;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-image: url('../../assets/terminal/ac_off.png');

      &:hover{
        background-image: url('../../assets/terminal/ac_off_hover.png');
      }
    }
  }

  .log{
    height: 338px;
    border: 1px #0A5879 solid;
    background-color: transparent;

    .interval{
      height: 26px;
      width: 125px;
      border: 1px #074D7B solid;
      font-size: 13px;
      color: #00E1FC;
      line-height: 26px;
      background-color: #056FAB;
      border-radius: 25px;
      margin-left: 20px;
      margin-top: 14px;
      margin-bottom: 10px;
      padding: 0 15px;
    }
  }

  .log-title{
    width: 100%;
    padding-left: 22px;
    height: 42px;
    line-height: 42px;
    color: #00B6FF;
    background: linear-gradient(180deg, #06304E, #06567D);
  }

  .border{
    border: 1px #0A5879 solid;
    background-color: transparent;
    padding: 12px 18px;

    .key{
      color: #00B6FF;
      line-height: 26px;
    }
    .value{
      color: #00E4FF;
      line-height: 26px;
    }
  }
}

.vague {
  filter: blur(3px);
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.app-terminal {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
}

.moName {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.terminal {
  width: 1920px;
  height: 1080px;
  position: relative;
  overflow: hidden;
  background: url('../../assets/terminal/bg.jpg') top center;

  .coord_1f {
    position: absolute;
    top: 685px;
    left: 591px;
    width: 737px;
  }

  .coord_2f {
    position: absolute;
    top: 624px;
    left: 591px;
    width: 737px;
  }

  .coord_3f {
    position: absolute;
    top: 566px;
    left: 591px;
    width: 741px;
  }

  .coord_4f {
    position: absolute;
    top: 486px;
    left: 592px;
    width: 741px;
  }

  .coord_5f {
    position: absolute;
    top: 391px;
    left: 592px;
    width: 741px;
  }

  .coord_6f {
    position: absolute;
    top: 371px;
    left: 593px;
    width: 739px;
  }

  .area-f_1 {
    position: absolute;
    right: 1365px;
    top: 695px;
  }

  .area-f_2 {
    position: absolute;
    left: 1369px;
    top: 668px;
  }

  .area-f_3 {
    position: absolute;
    right: 1365px;
    top: 575px;
  }

  .area-f_4 {
    position: absolute;
    left: 1369px;
    top: 512px;
  }

  .area-f_5 {
    position: absolute;
    right: 1365px;
    top: 450px;
  }

  .area-f_6 {
    position: absolute;
    left: 1369px;
    top: 389px;
  }

  .svg-hover {
    opacity: 0.5;
  }

  .term_tit {
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    color: #fff;
    height: 74px;
    line-height: 74px;
    font-family: Source Han Sans CN;
    background: linear-gradient(0deg, #3896ff 20%, #ffffff 80%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .dateTime {
    color: #00a9ff;
    width: 212px;
    position: absolute;
    top: 109px;
    left: calc((100% - 212px) / 2);
    text-align: center;

    .riqi {
      color: #1887e7;
      font-size: 18px;
    }

    .time {
      margin-top: 8px;
      width: 223px;
      height: 68px;
      font-size: 14px;
      line-height: 87px;
      background-image: url('../../assets/terminal/fullscreen-time-bj.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      -moz-background-size: 100% 100%;

      .time-svg {
        display: inline-block;
      }
      .time-mh-svg {
        font-size: 40px;
      }
      .svg-icon {
        width: 20px !important;
        //box-shadow: 2px 2px 2px 2px #26528473;
      }
    }
  }

  .wrap {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    .wrap-left {
      animation: wrapLeft 2s;
      position: absolute;
      top: 66px;
      left: 48px;
    }
    .wrap-right {
      animation: wrapRight 2s;
      position: absolute;
      top: 66px;
      right: 48px;
    }

    .wrap-mid {
      width: 100%;
      height: 100%;
      //选择高亮显示
      .svgList {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      //tips提示区域
      .unactive {
        position: relative;
        color: #319aff;
        font-size: 14px;
        background: #2055ac;
        padding: 8px;
        cursor: pointer;
      }

      .error {
        color: #ef9da5;
        background: #953039;
      }

      .left-tag {
        border-radius: 4px 4px 4px 0px;
      }

      .right-tag {
        border-radius: 4px 4px 0px 4px;
      }

      .active {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: linear-gradient(
            145deg,
            transparent 4px,
            rgba(3, 217, 243, 0.3) 0
        ) left;
        padding: 1px;

        .active-con {
          background: linear-gradient(
              145deg,
              transparent 4px,
              rgba(10, 18, 32, 0.9) 0
          ) left;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .active-left {
            background: linear-gradient(
                145deg,
                transparent 4px,
                rgba(0, 222, 255, 0.52) 0
            ) left;
            padding: 0px 8px;
            height: 33px;
            line-height: 33px;
            font-size: 16px;
            font-weight: 500;
            color: #5aedff;
            text-shadow: #214064 1px 0 0, #214064 0 1px 0, #214064 -1px 0 0,
            #214064 0 -1px 0;
          }

          .active-right {
            margin-left: 2px;
            padding: 0 16px 0 10px;
            height: 33px;
            line-height: 33px;
            background: rgba(71, 122, 172, 0.32);
            color: #03d9f3;
            font-size: 16px;
          }
        }

        .active-con {
          background: linear-gradient(
              145deg,
              transparent 4px,
              rgba(10, 18, 32, 0.9) 0
          ) left;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .active-left {
            padding: 0px 8px;
            height: 33px;
            line-height: 33px;
            font-size: 16px;
            font-weight: 500;
            color: #5aedff;
            text-shadow: #214064 1px 0 0, #214064 0 1px 0, #214064 -1px 0 0,
            #214064 0 -1px 0;
          }

          .active-right {
            margin-left: 2px;
            padding: 0 16px 0 10px;
            height: 33px;
            line-height: 33px;
            color: #03d9f3;
            font-size: 16px;
          }
        }

        .right-side {
          .active-left {
            background: linear-gradient(
                145deg,
                transparent 4px,
                rgba(0, 222, 255, 0.52) 0
            ) left;
          }

          .active-right {
            background: rgba(71, 122, 172, 0.32);
          }
        }

        .left-side {
          .active-left {
            background: rgba(0, 222, 255, 0.52);
          }

          .active-right {
            background: linear-gradient(
                -145deg,
                transparent 4px,
                rgba(71, 122, 172, 0.32) 0
            ) right;
          }
        }
      }

      .reverse {
        background: linear-gradient(
            -145deg,
            transparent 4px,
            rgba(3, 217, 243, 0.3) 0
        ) right;

        .active-con {
          background: linear-gradient(
              -145deg,
              transparent 4px,
              rgba(10, 18, 32, 0.9) 0
          ) right;
        }
      }

      .arrow-left {
        position: absolute;
        left: -30px;
      }

      .arrow-right {
        position: absolute;
        right: -30px;
        transform: rotate(180deg);
      }

      .arrow-down {
        position: absolute;
        right: 50px;
        top: 45px;
        transform: rotate(270deg);
      }

      .arrow-up {
        position: absolute;
        right: 50px;
        top: 88px;
        transform: rotate(90deg);
      }

      .arrow-up2 {
        position: absolute;
        right: 51px;
        top: 25px;
        transform: rotate(90deg);
      }

      .arrow-left-bottom {
        position: absolute;
        transform: rotate(-60deg);
        left: -14px;
        bottom: -20px;
      }

      .arrow-left-center {
        position: absolute;
        transform: rotate(120deg);
        left: 32px;
        top: -27px;
      }

      .tips-left-up {
        position: absolute;
        top: 0;
        left: 0;
      }

      .tips-left-down {
        position: absolute;
        bottom: 0;
        right: 0;
      }

      .tips-right-up {
        position: absolute;
        top: 0;
        right: 0;
        transform: rotate(90deg);
      }

      .tips-tight-down {
        position: absolute;
        bottom: 0;
        left: 0;
        transform: rotate(90deg);
      }

      //院区地面
      .area-ground {
        position: absolute;
        left: 805px;
        bottom: 355px;
      }

      //地下一楼
      .area-underground {
        position: absolute;
        left: 810px;
        bottom: 282px;
      }

      //南门岗亭
      .area-south {
        position: absolute;
        left: 795px;
        top: 605px;
      }

      //西门岗亭
      .area-west {
        position: absolute;
        right: 783px;
        top: 568px;
      }

      //S_1F
      .area-s_1 {
        position: absolute;
        left: 670px;
        top: 693px;
      }

      //S_2F
      .area-s_2 {
        position: absolute;
        right: 655px;
        top: 645px;
      }

      //S_3F
      .area-s_3 {
        position: absolute;
        left: 680px;
        top: 632px;
      }

      //N-1F


      //N-2F
      .area-n_2 {
        position: absolute;
        right: 787px;
        top: 468px;
      }

      //N-3F
      .area-n_3 {
        position: absolute;
        right: 793px;
        top: 420px;
      }

      //N_4F
      .area-n_4 {
        position: absolute;
        left: 647px;
        top: 307px;
      }

      //N_5F
      .area-n_5 {
        position: absolute;
        right: 680px;
        top: 268px;
      }

      //N_6F
      .area-n_6 {
        position: absolute;
        left: 649px;
        top: 246px;
      }

      //N_7F
      .area-n_7 {
        position: absolute;
        right: 680px;
        top: 204px;
      }

      //N_8F
      .area-n_8 {
        position: absolute;
        left: 652px;
        top: 180px;
      }

      //N_9F
      .area-n_9 {
        position: absolute;
        right: 685px;
        top: 142px;
      }

      //N_10F
      .area-n_10 {
        position: absolute;
        left: 656px;
        top: 114px;
      }

      //N_11F
      .area-n_11 {
        position: absolute;
        right: 686px;
        top: 78px;
      }

      //N_12F
      .area-n_12 {
        position: absolute;
        left: 652px;
        top: 50px;
      }

      //羁押夹层3
      .area-jy-3 {
        position: absolute;
        right: 62px;
        top: 53px;
      }

      //羁押夹层2
      .area-jy-2 {
        position: absolute;
        right: 62px;
        top: 93px;
      }

      //羁押夹层1
      .area-jy-1 {
        position: absolute;
        right: 31px;
        top: 216px;
      }
    }

    .wrap-right {
      animation: wrapRight 2s;
    }

    .con {
      width: 400px;
      height: 315px;
      background: rgba(12, 25, 46, 0.5);
      border: 1px solid #2761a2;
      margin-top: 10px;
      position: relative;
      padding: 20px;

      .tipsicon {
        position: absolute;
        top: -4px;
        left: -1px;
      }

      .tipsicon2 {
        position: absolute;
        top: -4px;
        right: -1px;
        transform: rotate(90deg);
      }

      .tit {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 16px;
        color: #03ccff;
        cursor: pointer;

        img {
          margin-right: 3px;
        }
      }
    }

    .newest {
      ::v-deep .el-table .cell {
        padding: 0;
      }
    }

    .distribute {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 270px;
    }

    .info {
      height: 240px;

      .tipsNum {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .num {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          width: 166px;
          height: 138px;
          background: url('../../assets/terminal/tipsNum.png') center;
          margin-top: 20px;
          padding-top: 30px;

          .left {
            position: relative;
            top: -10px;

            .img {
              width: 50px;
              height: 50px;
              margin-right: 30px;
              position: relative;

              img {
                animation: imgRotate 3s linear infinite;
              }
            }

            .svg {
              position: absolute;
              width: 40px;
              height: 40px;
              top: 4px;
              left: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          .right {
            text-align: right;

            .text {
              color: #c1f2ff;
              font-size: 18px;
              margin-bottom: 29px;
            }

            .off {
              color: #eb4251;
            }
          }
        }
      }
    }

    .now {
      margin-top: 10px;
      height: 65px;
      line-height: 65px;
      padding: 0 20px;
      width: 400px;
      background: url('../../assets/terminal/now-bg.png') center;
      color: #26bdfa;
      font-size: 18px;
      font-weight: bold;
      font-family: FZZhengHeiS-EB-GB;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .nowtime {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  //小点点样式
  .spot {
    position: absolute;

    .spotCon {
      position: relative;

      .big {
        animation: lightSpot 10s ease-in-out infinite;
      }

      .small {
        position: absolute;
        right: -3px;
        top: -20px;
        animation: lightSpot 10s ease-in-out 1s infinite;
      }

      .one {
        top: 0;
        left: 4px;
        animation: lightline 5s ease-in-out infinite;
      }

      .tow {
        top: -90px;
        left: -8px;
        animation: lightline 4s ease-in-out 0.4s infinite;
      }

      .three {
        top: -120px;
        opacity: 0;
        left: 16px;
        animation: lightline 3s ease-in-out 1s infinite;
      }

      .four {
        top: -70px;
        left: 40px;
        animation: lightline 4s ease-in-out 0.8s infinite;
      }
    }
  }

  .first {
    top: 530px;
    right: 475px;
  }

  .sec {
    right: 205px;
    bottom: 120px;

    .spotCon {
      .three {
        top: -125px;
        left: -7px;
      }
    }
  }

  .thr {
    right: 666px;
    top: 120px;

    .spotCon {
      .three {
        top: -125px;
        left: -7px;
      }
    }
  }

  .fou {
    left: 235px;
    bottom: 90px;

    .spotCon {
      .small {
        animation: lightSpot2 10s ease-in-out 1s infinite;
      }

      .three {
        top: -125px;
        left: -7px;
      }
    }
  }

  .fiv {
    left: 355px;
    top: 225px;

    .spotCon {
      .small {
        animation: lightSpot2 10s ease-in-out 1s infinite;
      }

      .three {
        top: -125px;
        left: -7px;
      }
    }
  }

  .six {
    left: 585px;
    top: 300px;

    .spotCon {
      .small {
        animation: lightSpot2 10s ease-in-out 1s infinite;
      }

      .three {
        top: -125px;
        left: -7px;
      }
    }
  }

  //菱形定位点样式
  .location {
    position: absolute;
    z-index: 9;

    .img {
      animation: location 3s ease-in-out infinite;
    }

    .tit {
      position: relative;
      display: inline-block;
      color: #01eefd;
      font-weight: 500;
      font-size: 15px;
      padding: 2px 15px;
      background: rgba(1, 238, 253, 0.14);
      border: 1px transparent solid;
      border-image: linear-gradient(
          to right,
          rgba(1, 238, 253, 1),
          rgba(1, 238, 253, 0)
      ) 10 10;

      .tips {
        position: absolute;
      }
    }

    .dot {
      width: 8px;
      height: 5px;
      border-radius: 50%;
      background: #01eefd;
      position: absolute;
      left: 75px;
      bottom: 60px;
    }

    .in_circle {
      width: 16px;
      height: 9px;
      border-radius: 50%;
      background: rgba(1, 238, 253, 0.6);
      position: absolute;
      left: 71px;
      bottom: 57px;
      animation: inCircle 3s ease-in-out infinite;
    }

    .out_circle {
      width: 36px;
      height: 20px;
      border-radius: 50%;
      background: rgba(1, 238, 253, 0.5);
      box-shadow: 0px 0px 5px #01eefd;
      opacity: 0.9;
      position: absolute;
      left: 61px;
      bottom: 50px;
      animation: outCircle 3s ease-in-out infinite;
    }
  }

  .area {
    right: 410px;
    top: 150px;

    .tit {
      left: -205px;
      top: -77px;
      border-image: linear-gradient(
          to right,
          rgba(1, 238, 253, 0),
          rgba(1, 238, 253, 1)
      ) 10 10;
      border-right: none;

      .tips {
        right: -3px;
        bottom: 0px;
        transform: rotate(180deg);
      }
    }
  }

  .service {
    left: 900px;
    bottom: 250px;

    .tit {
      left: -40px;
      top: -68px;
      border-left: none;

      .tips {
        left: -3px;
        bottom: 0px;
      }
    }
  }

  .floor {
    left: 869px;
    top: 80px;

    .tit {
      left: -214px;
      top: -90px;
      border-image: linear-gradient(
          to right,
          rgba(1, 238, 253, 0),
          rgba(1, 238, 253, 1)
      ) 10 10;
      border-right: none;

      .tips {
        right: -3px;
        bottom: 0px;
        transform: rotate(180deg);
      }
    }
  }

  //左侧线条样式
  .line-left {
    position: relative;
    z-index: 9;
    left: -216px;
    top: 1167px;
    transform: rotate(62deg);

    img {
      position: absolute;
      left: 0;
      right: 0;
    }

    .long {
      left: 920px;
      top: -675px;
      animation: lineLeftLong 5s ease-in-out infinite;
    }

    .middle {
      left: 935px;
      top: -570px;
      animation: lineLeftMiddle 5s ease-in-out 1s infinite;
    }

    .short {
      top: -220px;
      left: 900px;
      animation: lineLeftShort 5s ease-in-out 0.5s infinite;
    }
  }

  //右侧线条样式
  .line-right {
    position: relative;
    z-index: 9;
    left: 1120px;
    top: 528px;
    transform: rotate(352deg);

    img {
      position: absolute;
    }

    .long {
      left: 865px;
      top: -638px;
      animation: lineRightLong 5s ease-in-out infinite;
    }

    .middle {
      left: 865px;
      top: -440px;
      animation: lineRightMiddle 5s ease-in-out 1s infinite;
    }

    .short {
      top: -280px;
      left: 865px;
      animation: lineRightShort 5s ease-in-out 0.5s infinite;
    }
  }
}

//动画

//左侧内容动画
@keyframes wrapLeft {
  0% {
    transform: translateX(-500px);
  }

  100% {
    transform: translateX(0px);
  }
}

//右侧内容动画
@keyframes wrapRight {
  0% {
    transform: translateX(500px);
  }

  100% {
    transform: translateX(0px);
  }
}

//终端tips动画
@keyframes imgRotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

//背景点线动画
@keyframes lightSpot {
  0% {
    transform: translate(0px, 0px);
    opacity: 0;
  }

  80% {
    opacity: 0.8;
  }

  100% {
    transform: translate(-200px, -300px);
    opacity: 0;
  }
}

@keyframes lightSpot2 {
  0% {
    transform: translate(0px, 0px);
    opacity: 0;
  }

  80% {
    opacity: 0.8;
  }

  100% {
    transform: translate(200px, -300px);
    opacity: 0;
  }
}

@keyframes lightline {
  0% {
    transform: translateY(0px);
    opacity: 0;
  }

  80% {
    opacity: 1;
  }

  100% {
    transform: translateY(-300px);
    opacity: 0;
  }
}

//定位菱形图片动画
@keyframes location {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(0px);
  }
}

//定位菱形内圆动画
@keyframes inCircle {
  0% {
    width: 16px;
    height: 9px;
    transform: translate(0px, 0px);
    opacity: 1;
  }

  100% {
    width: 32px;
    height: 18px;
    transform: translate(-8px, 5px);
    opacity: 0;
  }
}

//定位菱形外圆动画
@keyframes outCircle {
  0% {
    width: 36px;
    height: 20px;
    transform: translate(0px, 0px);
    opacity: 0.9;
  }

  100% {
    width: 72px;
    height: 40px;
    transform: translate(-19px, 11px);
    opacity: 0;
  }
}

//左侧线条动画
@keyframes lineLeftLong {
  0% {
    transform: translate(0px, 0px);
  }

  100% {
    transform: translate(-1460px, 1075px);
  }
}

@keyframes lineLeftMiddle {
  0% {
    transform: translate(0px, 0px);
  }

  100% {
    transform: translate(-1205px, 960px);
  }
}

@keyframes lineLeftShort {
  0% {
    transform: translate(0px, 0px);
  }

  100% {
    transform: translate(-1430px, 945px);
  }
}

//右侧线条动画
@keyframes lineRightLong {
  0% {
    transform: translate(0px, 0px);
  }

  100% {
    transform: translate(-1415px, 1055px);
  }
}

@keyframes lineRightMiddle {
  0% {
    transform: translate(0px, 0px);
  }

  100% {
    transform: translate(-1300px, 1060px);
  }
}

@keyframes lineRightShort {
  0% {
    transform: translate(0px, 0px);
  }

  100% {
    transform: translate(-1180px, 820px);
  }
}

//大屏表格
.col ::v-deep .el-table,
.el-table__expanded-cell {
  background-color: transparent;
  font-size: 16px;
}

.col ::v-deep .el-table tr {
  background-color: transparent !important;
  height: 38px !important;
}

.col ::v-deep .el-table tr th {
  height: 38px !important;
  background-color: transparent !important;
  border-bottom: 1px solid #ffffff00;
  color: #c1f2ff;
}

.col ::v-deep .el-table tr th .cell {
  font-size: 16px;
  font-weight: normal;
}

.col ::v-deep .el-table .status {
  color: #01edfc;
}

.col ::v-deep .el-table .error {
  color: #eb4251;
}

.col ::v-deep .el-table .lineChart {
  position: relative;
  top: -5px;
}

.col ::v-deep .el-table .continued {
  display: flex;
  align-items: center;

  .name {
    flex: 1;
    text-align: right;
  }

  .progress {
    width: 64px;
    margin-left: 5px;
  }

  ::v-deep .el-progress-bar__inner {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background: linear-gradient(-90deg, #00c1d5 0%, #3896ff 100%);
  }
}

::v-deep .el-progress-bar__outer {
  background: #28446d;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.col ::v-deep .el-table tbody tr:hover > td {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.col ::v-deep .el-table--enable-row-transition .el-table__body td,
.el-table .cell {
  background-color: transparent;
  color: #b7eaf2;
  border: none;
}

.dialogDetail ::v-deep .el-dialog {
  background: rgba(6, 16, 34, 0.72);
  border: 8px solid rgba(141, 221, 255, 0.27);
  border-radius: 4px;
}

.dialogDetail ::v-deep .el-dialog .el-dialog__body {
  border: 2px solid;
  border-image: linear-gradient(0deg, #0048b4, #008fa0) 10 10;
}

.dialog-tit {
  height: 60px;
  line-height: 60px;
  font-size: 24px;
  font-weight: 500;
  color: #4fcdff;
  text-align: center;
  background: linear-gradient(
      0deg,
      rgba(0, 71, 98, 0) 0%,
      rgba(56, 150, 255, 0.2) 70%
  );
}

.dialog_divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(
      90deg,
      rgba(101, 217, 255, 0) 15%,
      rgba(101, 217, 255, 0.34),
      rgba(101, 217, 255, 0) 85%
  );
}
</style>
<style lang="scss">
.tipsmessage {
  min-width: 248px !important;
  height: 64px;
  background: url('../../assets/terminal/tips_bg.png') center;
  border: none;
  color: #00e4ff;
  font-weight: 500;
  font-size: 16px;

  i {
    margin-right: 10px;
  }
}
</style>
