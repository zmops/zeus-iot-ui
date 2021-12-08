<!-- 设备调试页面 -->
<template>
  <div class="debug">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px"/>
      </template>
      <template v-slot:title>设备调试</template>
      <template v-slot:subhead>平台提供设备模拟器，以方便在没有设备时进行调试开发，从而将设备与开发工作解耦，极大提高开发效率。</template>
    </ListHeadTemplate>
    <div class="query zeus-pt-10 zeus-pb-10 zeus-pl-20">
      <el-select
        v-model="form.devId"
        size="mini"
        class="select"
        placeholder="请选择设备"
        clearable
        filterable
        :popper-class="'xlk'"
        @focus="dialogVisible = true"
        @change="changeDev"
      >
        <el-option
          v-for="(item,index) in devList"
          :key="index"
          :label="item.name"
          :value="item.deviceId"
        />
      </el-select>
    </div>
    <div class="main">
<!--      <div class="tabs">-->
<!--        <el-button type="primary" size="mini" round>上报属性</el-button>-->
<!--      </div>-->
      <div class="detail">
        <div v-if="attrList.length" class="detail-l zeus-pr-15 zeus-relative">
          <span>正在模拟设备:</span>
          <div v-if="proName === ''" class="zeus-inline-block">{{ devName }}</div>
          <div v-else class="zeus-inline-block">{{ devName }}【{{ proName }}】</div>
          <div class="hr zeus-pb-15 zeus-mb-15">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
              全选
              <span class="zeus-ml-5">请勾选要上传数据属性</span>
            </el-checkbox>
          </div>
          <el-checkbox-group v-model="checkedAttr" @change="handleCheckedAttrChange">
            <div v-for="(attr, index) in attrList" :key="index" class="zeus-mt-15">
              <el-checkbox :label="attr.attrId">
                {{ attr.attrName }} {{ attr.key }} <span class="type">{{ attr.valueTypeName }}</span>
              </el-checkbox>
              <el-input
                type="textarea"
                autosize
                v-model="attr.deviceAttrValue"
                class="zeus-mt-10"
              >
              </el-input>
            </div>
          </el-checkbox-group>
          <div class="zeus-absolute bottom">
            <el-button size="mini" round @click="attrList = attrList2">重置</el-button>
            <el-button size="mini" round type="primary" class="" @click="reported">上报属性</el-button>
          </div>
        </div>
        <div v-else-if="devName === ''" class="detail-l zeus-pr-15">
          <el-empty description="请先选择上方的设备"></el-empty>
        </div>
        <div v-else class="detail-l zeus-pr-15">
          <el-empty description="所选设备暂无可调试的属性"></el-empty>
        </div>
        <div class="detail-r zeus-pl-15">
          <div class="log-title">
            <span>调试记录</span>
            <div class="el-form-item-tips zeus-inline-block zeus-ml-15">
              <i class="el-icon-info"/>设备调试会直接对线上内容进行操作，请谨慎操作。
            </div>
            <el-button size="mini" round class="zeus-right" @click="logList = []">
              <svg-icon icon-class="clear"/>
              清除
            </el-button>
          </div>
          <div v-if="logList.length" class="log zeus-overflow-style">
            <div v-for="(item, index) in logList" :key="index" class="log-list">
              <el-divider content-position="left"><span class="c-hui">{{ item.name + item.time }}</span></el-divider>
              <el-card class="box-card">
                <div>
                  {{ item.code }}
                </div>
              </el-card>
            </div>
          </div>
          <el-empty v-else description="暂无调试记录"></el-empty>
        </div>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'1234px'"
      :show-close="false"
      append-to-body
      class="device_select_dialog"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="select"/>
          设备选择
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon"/>
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false"/>
        </div>
      </div>
      <div class="dialog-body">
        <DeviceSelect :deviceIds="form.devId" @closeDialog="dialogVisible = false" @checked="checked"></DeviceSelect>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import DeviceSelect from '@/components/Basics/DeviceSelect'
import {getProductList} from '@/api/porductMgr'
import {getDeviceList, getAttrTrapperList, sendData} from '@/api/deviceMgr'
import {ftimestampToData} from '@/utils'

export default {
  name: 'debug',
  components: {
    ListHeadTemplate,
    DeviceSelect
  },
  data() {
    return {
      form: {
        productId: '',
        devId: ''
      },
      proName: '',
      devName: '',
      productList: [],
      devList: [],
      attrList: [],
      attrList2: [],
      attrKeyList: [],
      tabsName: '上报属性',
      dialogVisible: false,
      isIndeterminate: false,
      checkAll: false,
      checkedAttr: [],
      logList: [],
      checkArr: []
    }
  },
  created() {
    getProductList({}).then((res) => {
      if (res.code == 200) {
        this.productList = res.data
      }
    })
    this.changePro('')
  },
  methods: {
    checked(ids) {
      this.form.devId = ids
      this.changeDev(ids)
    },
    changePro(productId) {
      this.form.devId = ''
      this.attrList = []
      this.logList = []
      this.devName = ''
      if (productId === '') {
        this.proName = ''
        getDeviceList({}).then((res) => {
          if (res.code == 200) {
            this.devList = res.data
          }
        })
      } else {
        const i = this.productList.find((item) => {
          return item.productId === productId
        })
        this.proName = i.name
        getDeviceList({productId}).then((res) => {
          if (res.code == 200) {
            this.devList = res.data
          }
        })
      }
    },
    changeDev(prodId) {
      this.logList = []
      this.attrList = []
      this.attrList2 = []
      if (prodId === '') {
        this.devName = ''
        return false
      }
      const i = this.devList.find((item) => {
        return item.deviceId === prodId
      })
      this.devName = i.name
      getAttrTrapperList({prodId}).then((res) => {
        if (res.code == 200) {
          this.attrKeyList = res.data.map((item) => {
            return item.attrId
          })
          const arr = []
          res.data.forEach((item) => {
            if (item.source != '18'){
              arr.push(item)
            }
          })
          this.attrList = arr
          this.attrList2 = JSON.parse(JSON.stringify(arr))
          this.checkedAttr = []
          this.isIndeterminate = false
          this.checkAll = false
          this.logList = []
        }
      })
    },
    handleCheckAllChange(val) {
      this.checkedAttr = val ? this.attrKeyList : []
      this.isIndeterminate = false
    },
    handleCheckedAttrChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.attrList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.attrList.length
    },
    reported() {
      if (this.checkedAttr.length === 0) {
        this.$message({
          message: '请选择要上报的属性',
          type: 'error'
        })
        return false
      }
      const params = this.checkedAttr.map((i) => {
        const obj = this.attrList.find((item) => {
          return item.attrId === i
        })
        if (obj.deviceAttrValue === undefined || obj.deviceAttrValue === '') {
          this.$message({
            message: '请填写要上报的属性值',
            type: 'error'
          })
          return false
        }
        return {
          deviceAttrKey: obj.key,
          deviceAttrValue: obj.deviceAttrValue
        }
      })
      if (JSON.stringify(params).indexOf('false') > 0) {
        return false
      }
      this.logList.push(
        {
          name: '属性上报',
          time: ftimestampToData(new Date().getTime()),
          code: JSON.stringify(params)
        }
      )
      sendData({params, deviceId: this.form.devId}).then((res) => {
        if (res.code == 200) {
          this.logList.push(
            {
              name: '收到平台响应',
              time: ftimestampToData(new Date().getTime()),
              code: '上报成功'
            }
          )
        } else {
          this.logList.push(
            {
              name: '收到平台响应',
              time: ftimestampToData(new Date().getTime()),
              code: '上报失败'
            }
          )
        }
      }).catch(() => {
        this.logList.push(
          {
            name: '收到平台响应',
            time: ftimestampToData(new Date().getTime()),
            code: '上报失败'
          }
        )
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.debug {

  .query {
    width: 100%;
    background-color: #F9FBFD;
    border-radius: 4px 4px 0 0;

    ::v-deep.el-input__inner {
      background: #ffffff;
      border: 1px solid #ABB4BE;
      font-weight: 400;
    }

    ::v-deep.el-input__inner::placeholder {
      color: #5F708A;
    }

    ::v-deep.el-input__inner:focus {
      background: #FFFFFF;
      border: 1px solid #1A84F9 !important;
      box-shadow: 0 0 4px 0 #BADDFF;
    }

    ::v-deep.el-input__inner:hover {
      border: 1px solid #79879C;
    }
  }

  .bottom{
    border-top: #F1F5FA 1px solid;
    bottom: 0;
    left: -20px;
    padding: 11px 20px;
    width: calc(100% + 20px);
    height: 52px;
    background-color: #F9FBFD;
    display: flex;
    justify-content: space-between
  }

  .main {
    width: 100%;
    padding: 17px 20px 0 20px;
    background-color: #fff;
  }

  .select {
    width: 180px;

    ::v-deep.el-input__inner {
      background: #ffffff;
      border: 1px solid #ABB4BE;
      font-weight: 400;
    }

    ::v-deep.el-input__inner::placeholder {
      color: #5F708A;
    }

    ::v-deep.el-input__inner:focus {
      background: #FFFFFF;
      border: 1px solid #1A84F9 !important;
      box-shadow: 0 0 4px 0 #BADDFF;
    }

    ::v-deep.el-input__inner:hover {
      border: 1px solid #79879C;
    }
  }

  .tabs {
    width: 100%;
    padding: 6px 7px;
    background-color: #EFF4F9;
  }

  .detail {
    width: 100%;
    height: calc(100vh - 290px);
    display: flex;

    .detail-l {
      flex: 0.6;
      height: 100%;
      padding-top: 33px;
      position: relative;

      .hr {
        margin-top: 29px;
        border-bottom: 1px #DBE1ED solid;

        span {
          font-size: 12px;
          color: #79879C;
        }
      }

      .type {
        background-color: #EFF4F9;
        padding: 3px 8px;
        color: #242E42;
      }

      ::v-deep.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #1A84F9;
        border-color: #1A84F9;
      }

      ::v-deep.el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #1A84F9;
        border-color: #1A84F9;
      }

      .el-checkbox-group {
        width: 100%;
        height: calc(100% - 140px);
        overflow-y: auto;
      }
    }

    .detail-r {
      flex: 1.4;
      height: 100%;
      border-left: 1px #E4E7ED solid;
      padding-top: 33px;

      .log {
        overflow-y: auto;
        width: 100%;
        height: calc(100% - 30px);
      }

      .log-title {
        height: 30px;

        i {
          color: #5FA9FB;
        }
      }

      .log-list {
        margin-top: 40px;
      }

      .c-hui {
        color: #79879c;
      }
    }
  }
}
</style>
