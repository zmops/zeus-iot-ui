<!-- 详情页面插槽 -->
<template>
  <div class="detail-template">
    <div class="detail-template-left">
      <div class="detail-template-left-title">
        <span class="zeus-cursor-pointer zeus-inline-block back" @click="goBack">
          <i class="el-icon-arrow-left zeus-cursor-pointer zeus-bold" />
          {{ up }}
        </span>
        <div class="title">
          <svg-icon :icon-class="icon" style="font-size: 20px;margin-right: 16px;" />
          {{ title }}
        </div>
        <div class="zeus-f12">{{ subhead }}</div>
      </div>
      <div class="detail-template-left-detail">
        <div class="detail-title">{{ up }}详情</div>
        <div v-for="(item, index) in detailList" :key="index" class="detail-list zeus-flex-default">
          <div class="detail-list-l">{{ item.key + '：' }}</div>
          <div v-if="item.link" class="detail-list-r">
            <router-link :to="item.link" class="link">
              {{ item.value || '-' }}
            </router-link>
          </div>
          <div v-else-if="item.tag" class="detail-list-r">
            <div v-for="(i, ind) in item.tag" :key="ind" class="tag-item zeus-inline-block">
              <span class="tag-item-l zeus-inline-block">{{ i.tag }}</span>
              <span class="tag-item-r zeus-inline-block">{{ i.value }}</span>
            </div>
          </div>
          <div v-else class="detail-list-r">{{ item.value || '-' }}</div>
        </div>
      </div>
    </div>
    <div class="detail-template-right">
      <div class="detail-template-head">
        <el-button v-for="(item, index) in tabs" :key="index" :class="item.name === activity ? 'activity' : ''" class="but" type="primary" plain @click="change(item.name)">{{ item.label }}</el-button>
      </div>
      <div class="detail-template-main">
        <slot name="main" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailTemplate',
  props: {
    to: {
      type: String,
      default: ''
    },
    up: {
      type: String,
      default: '上一页'
    },
    icon: {
      type: String,
      default: 'asset-04'
    },
    title: {
      type: String,
      default: 'ks-controller-manager'
    },
    subhead: {
      type: String,
      default: 'ks-controller-manager'
    },
    detailList: {
      type: Array,
      default() {
        return []
      }
    },
    tabs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      activity: this.tabs.length ? this.tabs[0].name : null
    }
  },
  created() {
    if (this.$route.query.tabsName) {
      this.activity = this.$route.query.tabsName
    }
  },
  methods: {
    /* 返回上一页 */
    goBack() {
      if (this.to) {
        this.$router.push({ path: this.to })
      } else {
        this.$router.go(-1)
      }
    },
    /* 点击按钮修改tabs */
    change(name) {
      this.activity = name
      this.$emit('changeTabs', name)
      const { path, query } = this.$route
      this.$router.replace({
        path,
        query: {
          ...query,
          tabsName: name
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.detail-template {
  width: 100%;
  height: calc(100vh - 90px);
  padding: 20px;
  background-color: #EFF4F9;
  display: flex;

  .detail-template-left {
    width: 348px;
    margin-right: 20px;
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 4px 8px 0 rgba(36, 46, 66, 0.06);

    .detail-template-left-title {
      width: 100%;
      min-height: 100px;
      padding: 12px;
      background-color: #f9fbfd;
      background-image: url('../../assets/detail-info.png');
      background-repeat: no-repeat;
      background-size: 100% auto;
      border-radius: 4px 4px 0 0;

      .back {
        width: 100px;
        padding: 0 14px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        font-weight: 500;
        font-style: normal;
        font-stretch: normal;
        margin-bottom: 12px;
        background: #ffffff;
        border-radius: 16px;

        &:hover {
          color: $themeText;
        }

        i {
          color: $themeText;
          font-weight: bold;
        }
      }

      .title {
        height: 28px;
        margin-bottom: 4px;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
        overflow: hidden;
        font-size: 20px;
        line-height: 1.4;
        font-family: Roboto, PingFang SC, Lantinghei SC, Helvetica Neue, Helvetica, Arial, Microsoft YaHei, 微软雅黑, STHeitiSC-Light, simsun, 宋体, WenQuanYi Zen Hei, WenQuanYi Micro Hei, sans-serif;
        font-style: normal;
        font-stretch: normal;
        letter-spacing: normal;
        font-weight: 600;
        color: #36435c;
        margin-bottom: 12px;
      }
      .zeus-f12{
        font-size: 12px;
        color: #79879C;
      }
    }

    .detail-template-left-detail {
      padding: 12px;
      height: calc(100% - 100px);
      overflow-y: auto;

      .detail-title {
        margin-bottom: 12px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 600;
        font-style: normal;
        color: #242e42;
        text-shadow: 0 4px 8px rgba(36, 46, 66, 0.1);
      }

      .detail-list {
        padding: 6px 0;
        font-size: 12px;

        .detail-list-l {
          // float: left;
          width: 108px;
          padding: 0 5px 0 0;
          color: #79879C;
          vertical-align: top;
          //word-break: break-all;
          //white-space: normal;
          line-height: 20px;
        }

        .detail-list-r {
          width: calc(100% - 108px);
          vertical-align: top;
          line-height: 20px;
          display: block;
          word-wrap:break-word;
          // margin-left: 111px;
          color: #242e42;
          //word-break: break-all;
          //white-space: pre-wrap;

          .link{
            color: #1A84F9;
          }

          .tag-item{
            font-size: 12px;
            line-height: 12px!important;
            background-color: #E3E9EF;
            border-radius: 2px;
            margin-right: 10px;
            margin-bottom: 3px;
            margin-top: 3px;

            .tag-item-l{
              background-color: #3C435B;
              color: #fff;
              padding: 4px 8px;
              margin-left: 2px;
              border-radius: 2px;
            }

            .tag-item-r{
              padding: 6px;
              color: #242E42;
            }
          }
        }
      }
    }
  }

  .detail-template-right {
    width: calc(100% - 368px);

    .detail-template-head {
      display: flex;
      align-items: center;
      height: 48px;
      padding: 0 14px;
      border-radius: 4px;
      background-color: #242e42;
      margin: 0 0 12px;

      ::v-deep.el-button{
        padding: 8px 0;
        width: 96px;
        margin: 0 6px;
        box-sizing: content-box;
      }

      ::v-deep.el-button--primary {
        background: #242e42;
        border-color: transparent;
        color: #fff;
      }

      .activity{
        box-shadow: 0 0 10px #1a84f94d;
        &::v-deep.el-button--primary {
          background: $themeText!important;
          color: #fff!important;
        }
      }
      .but{
        &:hover{
          background-color: #35415A;
          color: #1A84F9;
        }
      }
    }
  }
}
</style>
