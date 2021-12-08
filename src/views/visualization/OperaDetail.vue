<template>
  <div :class="bg ===1?'soperadetail':'operadetail'">
    <el-dialog
      :width="bg ===1?'816px':'800px'"
      :visible.sync="detaildialogVisible"
      top="10vh"
      lock-scroll
      :close-on-click-modal="true"
      :close-on-press-escape="false"
      v-if="detaildialogVisible"
      @close="handleClose"
      center
      class="Detail-dialog"
    >
      <div v-loading="false" style="background-color:rgba(6, 16, 34, 1)">
        <div class="detail-title" slot="title">
          <span v-if="!classshowChange" class="left-name">{{ detailList.name }}</span>
          <el-input v-else size="mini" v-model="name" maxlength="15" minlength="1" placeholder="请输入名称"
                    style="width: 200px"></el-input>
          <span class="title-ip">{{ detailList.ip }}</span>
          <span class="title-classify" v-if="!classshowChange">{{ detailList.moTypeName || '--' }}</span>
          <el-select
            v-model="moType"
            placeholder="请选择"
            size="mini"
            style="width: 90px;"
            v-if="classshowChange"
          >
            <el-option
              v-for="item in classifyList"
              :key="item.dictId"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-button v-if="classshowChange" type="text" @click="changeclass">保存</el-button>
          <el-button v-if="classshowChange" type="text" @click="colseclass">取消</el-button>
          <svg-icon
            iconClass="tree-edit"
            class="dialog-lab-edit"
            @click="edit"
            v-if="!classshowChange && bg!== 1"
          ></svg-icon>
        </div>
        <div class="dialog-content">
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="my-border argus-mb-10" style="position: relative;">
                <div class="video" @click="imagedialogVisible = true"></div>
                <div v-if="loading2" v-loading="loading2" style="width: 100%;height: 300px"></div>
                <iframe
                  v-else
                  :src="videoUrl"
                  width="100%"
                  height="300"
                  allowfullscreen
                  allow="autoplay; fullscreen"
                  style="border: none;"
                ></iframe>
              </div>
              <el-row :gutter="10">
                <el-col :span="8">
                  <div class="my-border padding-15 list">
                    <div class="argus-mb-10 list_word">监控状态</div>
                    <div
                      :class="detailList.statusName==='在线'?'c-green':'c-red'"
                      class="font-14"
                    >{{ detailList.statusName }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="my-border padding-15 list">
                    <div class="argus-mb-10 list_word">延迟</div>
                    <div
                      :class="bg ===1?'c-blue':'c-green'"
                      class="font-14"
                    >{{ detailList.pingResponseTime ? lastNumber(detailList.pingResponseTime) : '--' }} ms
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="my-border padding-15 list">
                    <div class="argus-mb-10 list_word">丢包率</div>
                    <div :class="bg ===1?'c-blue':'c-green'" class="font-14">{{ detailList.pingLoss || '--' }}%</div>
                  </div>
                </el-col>
              </el-row>
              <div
                class="my-border argus-mt-10"
                style="position: relative;padding-bottom: 0px;"
              >
                <div class="bian-title padding-15">
                  <span>变更记录</span>
                  <svg-icon iconClass="list_export" class="bian-svg" @click="goChangjl"></svg-icon>
                </div>
                <div class="bian-content">
                  <el-timeline>
                    <el-timeline-item
                      v-for="(item,index) in tableDatas"
                      :key="index"
                      :color="'#0BABE7'"
                    >
                      <p>
                        <span class="timeLine_time">{{ item.time }}</span>
                        {{ item.event }}
                      </p>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <RunTimeTemplate
                :moId="detailList.moId"
                :uptime="163411"
                :bg="bg"
                class="argus-mb-10"
              ></RunTimeTemplate>
              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="my-border padding-15 argus-mb-10 list">
                    <div class="argus-mb-10 list_word">品牌</div>
                    <div class="argus-bold c-blue font-14">{{ detailList.brand }}</div>
                  </div>
                  <div class="my-border argus-mb-10 detailList list">
                    <div class="argus-mb-10 list_word">序列号</div>
                    <div class="argus-bold serialNum c-blue">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="detailList.serialNumber"
                        placement="top"
                        :disabled="!detailList.serialNumber"
                      >
                        <span class="serialNumbox">{{ detailList.serialNumber || '--' }}</span>
                      </el-tooltip>
                      <span
                        v-clipboard:copy="detailList.serialNumber"
                        v-clipboard:success="copy"
                        v-clipboard:error="onError"
                        class="ip-copy-icon"
                        v-if="detailList.serialNumber"
                      >
                    <svg-icon iconClass="ip_copy" style="font-size: 10px;"></svg-icon>
                  </span>
                    </div>
                  </div>
                  <div class="my-border padding-15 argus-mb-10 list">
                    <div class="argus-mb-10 list_word">系统编号</div>
                    <div class="argus-bold c-blue address">{{ detailList.moNum }}</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="my-border argus-mb-10 detailList list">
                    <div class="argus-mb-10 list_word">型号</div>
                    <div class="argus-bold serialNum c-blue">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="detailList.model"
                        placement="top"
                        :disabled="!detailList.model"
                      >
                        <span class="serialNumbox">{{ detailList.model || '--' }}</span>
                      </el-tooltip>
                      <span
                        v-clipboard:copy="detailList.model"
                        v-clipboard:success="copy"
                        v-clipboard:error="onError"
                        class="ip-copy-icon"
                        v-if="detailList.model"
                      >
                    <svg-icon iconClass="ip_copy" style="font-size: 10px;"></svg-icon>
                  </span>
                    </div>
                    <!--                <div class="argus-bold c-blue font-14">{{ detailList.model }}</div>-->
                  </div>
                  <div class="my-border padding-15 argus-mb-10 list">
                    <div class="argus-mb-10 list_word">MAC地址</div>
                    <div class="argus-bold c-blue font-14">{{ detailList.macAddr }}</div>
                  </div>
                  <div class="my-border padding-15 argus-mb-10 list">
                    <div class="argus-mb-10 list_word">地点</div>
                    <div style="position: relative;">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="detailList.locationName"
                        placement="top"
                        :disabled="detailList.locationName === ''"
                      >
                    <span
                      class="argus-bold address c-blue "
                      v-if="!showChange"
                    >{{ detailList.locationName || '--' }}</span>
                      </el-tooltip>
                      <svg-icon
                        iconClass="tree-edit"
                        class="dialog-lab-edit"
                        @click="addChoose"
                        v-if="!showChange && bg!==1"
                      ></svg-icon>
                      <el-popover
                        placement="bottom-start"
                        trigger="manual"
                        width="250"
                        v-if="showChange"
                        popper-class="addPop"
                        v-model="addvisible"
                      >
                        <el-input
                          v-model="detailList.locationName"
                          placeholder="请输入地点"
                          size="mini"
                          :readonly="true"
                          maxlength="50"
                          style="width: 120px "
                          clearable
                          slot="reference"
                          v-if="showChange"
                          @focus="addvisible= true"
                          @blur="addvisible= false"
                        ></el-input>
                      </el-popover>
                      <el-button v-if="showChange" type="text" @click="changeDesc">保存</el-button>
                      <el-button v-if="showChange" type="text" @click="colseAdd">取消</el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <div class="padding-15 my-border yunwei argus-mb-10 list">
                <div class="yunwei-le">
                  <div class="argus-mb-10 list_word">运维部门</div>
                  <div class="argus-bold c-blue">{{ detailList.deptName || '--' }}</div>
                </div>
                <div class="yunwei-ri">
                  <div class="argus-mb-10 list_word">部门用户</div>
                  <el-popover
                    placement="bottom-start"
                    width="450"
                    trigger="hover"
                    :disabled="!detailList.userNum"
                    :popper-class="bg===1?'userPop':'userNum'"
                    :visible-arrow="false"
                  >
                    <el-table
                      :data="userList"
                      :row-class-name="bg===1?'userTable':'detailTable'"
                      :header-row-class-name="bg===1?'headerUser':'headerDetail'"
                      :class="bg===1?'deta':''"
                    >
                      <el-table-column prop="name" label="用户"></el-table-column>
                      <el-table-column prop="phone" label="电话" width="100"></el-table-column>
                      <el-table-column prop="email" label="邮箱"></el-table-column>
                    </el-table>
                    <div
                      class="argus-bold underline"
                      slot="reference"
                      :style="{color:bg===1?'#00E4FF':'#03A9E5'}"
                      style="cursor: pointer;"
                    >{{ detailList.userNum || '--' }}
                    </div>
                  </el-popover>
                </div>
              </div>
              <div class="padding-15 my-border remarks list">
                <div class="argus-mb-10 list_word">备注</div>
                <span class="argus-bold c-blue" v-if="!remarksChange">{{ detailList.description || '--' }}</span>
                <svg-icon
                  iconClass="tree-edit"
                  style="cursor: pointer;margin-left: 15px;font-size: 10px;"
                  @click="remarksChange = true"
                  v-if="!remarksChange && bg!==1"
                ></svg-icon>
                <el-input
                  v-if="remarksChange"
                  v-model="detailList.description"
                  placeholder="请输入备注"
                  size="mini"
                  type="textarea"
                ></el-input>
                <el-button v-if="remarksChange" type="text" @click="changeremarks">保存</el-button>
                <el-button v-if="remarksChange" type="text" @click="colseRemarks">取消</el-button>
              </div>
            </el-col>
          </el-row>
          <!--  图片单击放大-->
          <div :class="bg===1?'DPimage':'Deatimage'" v-if="imagedialogVisible">
            <div class="video_colse" @click="imagedialogVisible=false"></div>
            <div class="video_title"><i class="el-icon-close" style="font-size: 20px;color: #909399;"
                                        @click="togetColse"></i></div>
            <iframe
              :src=" videoUrl "
              :width="bg ===1?'816':'800'"
              height="700"
              allowfullscreen
              allow="autoplay; fullscreen"
              style="border: none;"
            ></iframe>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import {
//     getDetail,
//     listDictsByCode,
//     getUserList,
//     getMacPeriod,
//     getCameraUrl,
//     getUpdate, batchAssign,
// } from '@/api/cameramgr'
import RunTimeTemplate from '@/views/visualization/RunTimeTemplate'

export default {
  name: 'OperaDetail',
  // inject: ['farther'],
  components: {
    RunTimeTemplate
  },
  props: {
    moId: {
      type: Number,
    },
    bg: {
      type: Number,
    },
    dialogVisible: {
      type: Boolean,
    },
    monitor: {
      type: Boolean,
    }
  },
  watch: {
    dialogVisible: {
      deep: true,
      immediate: true,
      handler(val) {
        this.detaildialogVisible = val
      }
    }
  },
  data() {
    return {
      addvisible: false,
      loading: false,
      loading2: false,
      detaildialogVisible: false,
      showChange: false, //修改地点
      remarksChange: false, //修改备注
      imagedialogVisible: false, //图片放大
      classshowChange: false,
      moType: '',
      name: null,
      videoUrl: '',
      tableDatas: [
        {time: "09月01日 10:02:00", event: "终端添加上线"}
      ],
      detailList: {
        assetNum: "CAMERA-232",
        brand: "海康威视",
        createTime: 1630461720104,
        deptId: 1,
        deptName: "默认部门",
        description: "ZmopsCamera115",
        hasUnread: 0,
        hostid: 10568,
        ip: "18.0.0.37",
        locationId: 4,
        locationName: "1F",
        macAddr: "10:12:fb:b9:d1:115",
        macChanged: 0,
        moId: 232,
        moNum: "CAMERA-232",
        moType: "hsdCamera",
        moTypeName: "快球",
        name: "三石摄像头",
        originalUptime: "",
        password: "Zmops@0610",
        pingLoss: "100.0",
        pingResponseTime: "0.0",
        port: "80",
        serialNumber: "DS-2CD2725EF-IZS20200904AACHE742263115",
        sourceType: 1,
        status: 0,
        statusName: "在线",
        templateid: 10409,
        updateTime: 1634523098013,
        uptime: "",
        userNum: 4,
        username: "admin"
      },
      userList: [],
      delay: 0,
      classifyList: [],
    }
  },
  created() {
    this.getloadingDetail()
    if (this.monitor) {
      this.imagedialogVisible = true
    }
  },
  methods: {
    handleClose() {
      this.detaildialogVisible = false
      this.$emit('changeDetailVisible', false)
    },
    togetColse() {
      this.imagedialogVisible = false
      this.handleClose()
    },
    //变更记录
    goChangjl() {
      let url = this.$router.resolve({
        path: '/cameraMgr/changeRecord',
        query: {
          name: this.detailList.ip,
        },
      })
      window.open(url.href, '_blank')
    },
    copy() {
      this.$message.success('复制成功')
    },
    onError() {
      // console.log(e);
    },
    //  详情页修改类型
    changeclass() {
      this.classshowChange = false
      // getUpdate({
      //   moId:this.moId,
      //   moType: this.moType,
      //     name: this.name
      // }).then(()=>{
      //   this.getloadingDetail()
      // })
    },
    //取消修改类型
    colseclass() {
      this.getloadingDetail()
      this.classshowChange = false
    },
    edit() {
      this.classshowChange = true
      this.name = this.detailList.name
      this.moType = this.detailList.moType
    },
    //更新
    getloadingUpdate() {
      // console.log(this.port.moTypeName)
      // getUpdate({ })
    },
    //明细列表
    async getloadingDetail() {
      this.loading = true
      this.loading2 = true
      const moId = this.moId
      // getDetail({ moId }).then((res) => {
      //   this.detailList = res.data
      //   const deptId = this.detailList.deptId
      //   getUserList({ deptId }).then((res) => {
      //     this.userList = res.data
      //   })
      //     this.loading = false
      // })
      const dictTypeCode = 'cameraClassify'
      // listDictsByCode({ dictTypeCode }).then((res) => {
      //   this.classifyList = res.data
      // })
      // getMacPeriod({ moId }).then((res) => {
      //   this.tableDatas = res.data
      // })
      //     await getCameraUrl({ moId }).then((res) => {
      //   this.videoUrl = res.data.url + '&iframe=yes'
      // })
      //     await setTimeout(() => {
      //         getCameraUrl({ moId }).then((res) => {
      //             this.videoUrl = res.data.url + '&iframe=yes'
      //             this.loading2 = false
      //         })
      //     },2000)
    },
    addChoose() {
      this.showChange = true
      this.addvisible = true
    },
    //修改地点
    changeDesc() {
      this.showChange = false
      //   batchAssign({
      //   moIds:[this.moId],
      //   locationId: this.detailList.locationId
      // }).then(()=>{
      //   this.getloadingDetail()
      //   this.$message({
      //     message: '修改成功',
      //     type: 'success',
      //   })
      // })
    },
    //取消地址修改
    colseAdd() {
      this.getloadingDetail()
      this.showChange = false
    },
    changeremarks() {
      this.remarksChange = false
      // getUpdate({
      //   moId:this.moId,
      //   description: this.detailList.description
      // }).then(()=>{
      //   this.getloadingDetail()
      //   this.$message({
      //     message: '修改成功',
      //     type: 'success',
      //   })
      // })
    },
    //取消备注修改
    colseRemarks() {
      this.getloadingDetail()
      this.remarksChange = false
    },
    lastNumber(num) {
      return Number(num).toFixed(1)
    },
    //  地点树
    handleNodeClick(data) {
      this.detailList.locationName = data.name
      this.detailList.locationId = data.id
      this.addvisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/common.scss';

.operadetail {
  //padding: 10px;
  .my-border {
    border: 1px #dee5ed solid;
  }

  .c-green {
    color: #3da407;
    font-weight: bold;
    font-size: 14px;
  }

  .c-red {
    color: #d64e4e;
    font-weight: bold;
    font-size: 14px;
  }

  .font-14 {
    font-size: 14px;
    height: 20px;
  }

  .padding-15 {
    padding: 15px;
  }

  .bian-title {
    position: relative;
    font-weight: bold;
    padding-bottom: 10px;

    .bian-svg {
      position: absolute;
      right: 10px;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .video {
    width: 100%;
    height: 260px;
    cursor: pointer;
    position: absolute;
  }

  .video_colse {
    width: 100%;
    height: 100%;
    cursor: pointer;
    position: fixed;
    top: 0px;
    left: 0px;
    background: transparent;
    z-index: -9999;
  }

  .bian-content {
    max-height: 200px;
    overflow: scroll;
    padding-top: 15px;
  }

  .detailList {
    padding: 15px;
    height: 80px;
  }

  .serialNum {
    position: relative;

    .serialNumbox {
      max-width: 140px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      vertical-align: bottom;
    }

    .ip-copy-icon {
      cursor: pointer;
      display: none;
      position: absolute;
      right: 0px;
      bottom: 1px;
    }

    &:hover {
      cursor: pointer;

      .ip-copy-icon {
        display: inline-block;
      }
    }
  }

  .bian-last {
    margin-top: 30px;
    margin-bottom: 0px !important;
  }

  .detail-title {
    width: 100%;
    border-bottom: 2px solid #dee5ed;
    text-align: left;
    padding-bottom: 15px;
    font-family: Source Han Sans CN;

    .left-name {
      font-size: 16px;
      color: #12191f;
      font-weight: bold;
    }

    .title-ip {
      font-size: 14px;
      font-weight: bold;
      color: #0862a2;
      margin-left: 10px;
      margin-right: 10px;
    }

    .title-classify {
      font-weight: 500;
      font-size: 12px;
      display: inline-block;
      background: rgba(13, 101, 196, 0.1);
      border-radius: 2px;
      color: #0d65c4;
      height: 24px;
      padding-left: 8px;
      padding-right: 8px;
      line-height: 27px;
    }
  }

  .yunwei {
    display: flex;
    flex-direction: row;

    .yunwei-le {
      width: 40%;
    }

    .yunwei-ri {
      width: 60%;
    }
  }

  .address {
    display: inline-block;
    max-width: 180px;
    height: 18px;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
  }

  .dialog-lab-edit {
    margin-left: 10px;
    font-size: 10px;

    &:hover {
      cursor: pointer;
    }
  }

  .dialog-content {
    margin-top: 15px;
    position: relative;
  }

  .Deatimage {
    position: absolute;
    width: 800px;
    height: 700px;
    top: 0px;
    left: -30px;
    z-index: 9999;

    .video_title {
      text-align: right;
      position: absolute;
      top: -75px;
      width: 100%;
      height: 75px;
      padding-right: 10px;
      padding-top: 20px;

      i {
        background-color: #fff;
        cursor: pointer;
      }
    }
  }

  ::v-deep.el-timeline {
    padding-left: 15px;
  }

  ::v-deep.el-timeline-item {
    margin-top: -15px;

    .el-timeline-item__content {
      color: #12191f;

      span {
        margin-right: 10px;
      }
    }
  }

  ::v-deep.el-timeline-item__node--normal {
    width: 9px;
    height: 9px;
  }

  ::v-deep.el-timeline-item__node::after {
    width: 5px;
    height: 5px;
    position: absolute;
    background: #ffffff;
    border-radius: 5px;
    top: 2px;
    left: 2px;
    content: '';
  }

  ::v-deep.el-timeline-item__tail {
    border-left: 3px solid #9de5ff;
    left: 2px;
  }

  .livedialog {
    ::v-deep.el-dialog {
      padding: 0px;
    }
  }

  .Detail-dialog::v-deep.el-dialog {
    border-radius: 4px;
    padding: 20px 25px 28px 30px;
  }

  .Detail-dialog::v-deep.el-dialog .el-dialog__headerbtn {
    top: 20px;
  }

}

.soperadetail {

  //padding: 10px;
  border-radius: 4px;

  .my-border {
    border: 1px solid #0c5270;
  }

  .font-14 {
    font-size: 14px;
    height: 20px;
  }

  .c-blue {
    color: #00E4FF;
    font-weight: 500;
    font-size: 14px;
  }

  .c-green {
    color: #00E4FF;
    font-weight: 500;
    font-size: 14px;
  }

  .c-red {
    color: #d64e4e;
    font-weight: 500;
    font-size: 14px;
  }

  .padding-15 {
    padding: 15px;
  }

  .bian-title {
    position: relative;
    font-weight: 500;
    padding-bottom: 10px;
    color: #00C6FF;
    background: linear-gradient(0deg, rgba(3, 169, 229, 0.6) 0%, rgba(3, 169, 229, 0.1) 100%);

    .bian-svg {
      position: absolute;
      right: 10px;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .video {
    width: 100%;
    height: 260px;
    cursor: pointer;
    position: absolute;
  }

  .video_colse {
    width: 100%;
    height: 100%;
    cursor: pointer;
    position: fixed;
    top: 0px;
    left: 0px;
    background: transparent;
    z-index: -9999;
  }

  .bian-content {
    max-height: 200px;
    overflow: scroll;
    padding-top: 15px;
  }

  .detailList {
    padding: 15px;
    height: 80px;
  }

  .list {
    background: linear-gradient(183deg, rgba(0, 186, 255, 0.2) 0%, rgba(0, 168, 255, 0.09) 100%);
    border-image: linear-gradient(0deg, #0c5270, #0c5270) 10 10;

    .list_word {
      color: #00B6FF;
      font-weight: 500;
      font-family: Source Han Sans CN;
    }
  }

  .serialNum {
    position: relative;

    .serialNumbox {
      max-width: 140px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      vertical-align: bottom;
    }

    .ip-copy-icon {
      cursor: pointer;
      display: none;
      position: absolute;
      right: 0px;
      bottom: 1px;
    }

    &:hover {
      cursor: pointer;

      .ip-copy-icon {
        display: inline-block;
      }
    }
  }

  .bian-last {
    margin-top: 30px;
    margin-bottom: 0px !important;
  }

  .detail-title {
    width: 100%;
    border-bottom: 2px solid rgba(101, 217, 255, 0.34);
    text-align: left;
    padding-bottom: 15px;
    font-family: Source Han Sans CN;
    color: #4FCDFF;
    font-weight: 500;
    //background: linear-gradient(0deg, rgba(0, 71, 98, 0) 0%, #3896FF 100%);
    //border-radius: 6px 6px 0px 0px;

    .left-name {
      font-size: 16px;
    }

    .title-ip {
      font-size: 14px;
      margin-left: 10px;
      margin-right: 10px;
    }

    .title-classify {
      font-size: 12px;
      display: inline-block;
      background: linear-gradient(90deg, rgba(0, 138, 255, 0.6) 0%, rgba(0, 138, 255, 0.59) 100%);
      border-radius: 4px;
      color: #4FCDFF;
      height: 24px;
      padding-left: 8px;
      padding-right: 8px;
      line-height: 27px;
    }
  }

  .yunwei {
    display: flex;
    flex-direction: row;

    .yunwei-le {
      width: 40%;
    }

    .yunwei-ri {
      width: 60%;
    }
  }

  .address {
    display: inline-block;
    max-width: 180px;
    height: 18px;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
  }

  .dialog-lab-edit {
    margin-left: 10px;
    font-size: 10px;

    &:hover {
      cursor: pointer;
    }
  }

  .underline {
    text-decoration: underline;
  }

  .dialog-content {
    margin-top: 15px;
    position: relative;
    background: rgba(6, 16, 34, 0);
  }

  .DPimage {
    position: absolute;
    width: 816px;
    height: 700px;
    top: 0px;
    right: -33px;
    z-index: 9999;

    .video_title {
      text-align: right;
      position: absolute;
      top: -75px;
      width: 100%;
      height: 75px;
      padding-right: 18px;
      padding-top: 20px;

      i {
        cursor: pointer;
      }
    }
  }

  .timeLine_time {
    color: #00B6FF;
    font-weight: 500;
  }

  ::v-deep.el-timeline {
    padding-left: 15px;
  }

  ::v-deep.el-timeline-item {
    margin-top: -15px;

    .el-timeline-item__content {
      color: #00DEFF;
      font-weight: 400;
      font-family: Source Han Sans CN;

      span {
        margin-right: 10px;
      }
    }
  }

  ::v-deep.el-timeline-item__node--normal {
    width: 9px;
    height: 9px;
  }

  ::v-deep.el-timeline-item__node::after {
    width: 5px;
    height: 5px;
    position: absolute;
    background: rgba(7, 36, 60, 0.51);
    border-radius: 5px;
    border-color: #0BABE7;
    top: 2px;
    left: 2px;
    content: '';
  }

  ::v-deep.el-timeline-item__tail {
    border-left: 3px solid #0A63A8;
    left: 2px;
  }

  .livedialog {
    ::v-deep.el-dialog {
      padding: 0px;
    }
  }

  .bian-content::-webkit-scrollbar-track {
    background: rgba(20, 55, 95, 0.5);
  }

  .bian-content::-webkit-scrollbar {
    background: rgba(6, 16, 34, 0);

  }

  ::-webkit-scrollbar {
    height: 0px;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 10px #0E8EB6;
  }

  ::v-deep.el-dialog {
    border-radius: 4px!important;
    border: 8px solid rgba(141, 221, 255, 0.27) !important;
    background: rgba(6, 16, 34, 0.85) !important;
  }

  ::v-deep.el-dialog__header {
    padding: 20px 25px 0px 30px!important;
    border-bottom-width: 0!important;
    //border-radius: 6px 6px 0px 0px;
    background: linear-gradient(0deg, rgba(0, 71, 98, 0) 0%, rgba(56, 150, 255, 0.4) 100%) !important;
    border-image: linear-gradient(180deg, #000000, #3896FF) 10 10!important;
  }

  ::v-deep.el-dialog .el-dialog__body {
    padding: 0px 25px 20px 30px!important;
  }

  ::v-deep.el-dialog .el-dialog__headerbtn {
    top: 20px;
    z-index: 99!important;
  }
}

.el-table {
  //background: rgba(6, 16, 34, 1)!important;
  padding: 20px;
}
</style>
<style>
.userPop.el-popover {
  border: 1px solid #0c5270 !important;
  background: transparent !important;
}

.userPop {
  max-height: 300px;
  overflow: scroll;
}

.userNum {
  max-height: 300px;
  overflow: scroll;
}

.userPop::-webkit-scrollbar-track {
  background: rgba(20, 55, 95, 0.5);
}

.userPop::-webkit-scrollbar {
  background: rgba(6, 16, 34, 0);

}

.userPop::-webkit-scrollbar {
  height: 0px;
}

.userPop::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 10px #0E8EB6;
}

.deta.el-table {
  background: rgba(6, 16, 34, 1) !important;
}

.userTable:hover > td {
  background-color: #034b76 !important;
}

.userTable > td {
  background: rgba(6, 16, 34, 1) !important;
  border: none;
  color: #00E4FF;
}

.headerUser > th {
  background: rgba(6, 16, 34, 1) !important;
  border: none !important;
  color: #00B6FF;
}

.detailTable > td {
  border: none;
  color: #12191f;
}

.headerDetail > th {
  background: #ffffff !important;
  color: #8994A8;
  border: none !important;
}

.addPop {
  max-height: 400px;
  overflow: scroll;
  position: absolute;
  top: 30px;
}
</style>
