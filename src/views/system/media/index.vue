<!-- 告警方式页面 -->
<template>
  <div class="media">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>通知配置</template>
      <template v-slot:subhead>这里是通知配置</template>
    </ListHeadTemplate>
    <div class="head">
      <el-button v-for="(item, index) in list" :key="index" :class="item.id === activity ? 'activity' : ''" type="primary" plain @click="tabsChange(item)">{{ typeList[item.type] || item.type }}</el-button>
    </div>
    <div class="detail zeus-pt-5 zeus-pl-20 zeus-pr-20 zeus-pb-20">
      <el-divider content-position="left" class="zeus-mt-10 zeus-mb-20">告警消息模版</el-divider>
      <json-editor
        ref="jsonEditor"
        class="zeus-mt-10 zeus-mb-20"
        :json="json1"
        @change="handleJsonChange1"
      />
      <el-divider content-position="left" class="zeus-mt-10 zeus-mb-20">告警推送配置</el-divider>
      <json-editor
        ref="jsonEditor"
        class="zeus-mt-10 zeus-mb-20"
        :json="json2"
        @change="handleJsonChange2"
      />
      <el-button round size="mini" type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getMediaTypeList, updateMediaType, getDictListByCode } from '@/api/system'
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import JsonEditor from '@/components/Basics/JsonEditor'

export default {
  name: 'Media',
  components: {
    ListHeadTemplate,
    JsonEditor
  },
  data() {
    return {
      loading: false,
      list: [],
      activity: '',
      json1: '',
      json2: '',
      type: '',
      typeList: {}
    }
  },
  mounted() {
    /* 获取通知类型的字典项 */
    getDictListByCode({ dictTypeCode: 'MEDIA_TYPE' }).then((res) => {
      if (res.code == 200 && res.data.length) {
        const x = res.data.map(i => {
          const obj = {}
          this.$set(obj, i.code, i.name)
          return obj
        })
        let newObj = {}
        x.forEach(i => {
          newObj = { ...newObj, ...i }
        })
        this.typeList = newObj
      }
    })
    this.getList()
    // 刷新jsonEditor
    this.$nextTick(() => {
      this.$refs.jsonEditor.refresh()
    })
  },
  methods: {
    getList() {
      this.loading = true
      getMediaTypeList().then((res) => {
        this.loading = false
        if (res.code == 200 && res.data.length) {
          this.list = res.data
          this.activity = res.data[0].id
          this.json1 = res.data[0].template
          this.json2 = res.data[0].webhooks
          this.type = res.data[0].type
        }
      }).catch(() => {
        this.loading = false
      })
    },
    tabsChange(item) {
      this.activity = item.id
      this.json1 = item.template
      this.json2 = item.webhooks
      this.type = item.type
    },
    /* 提交表单 */
    async submit() {
      updateMediaType({ id: this.activity, type: this.type, template: this.json1, webhooks: this.json2 }).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        }
      })
    },
    handleJsonChange1(val) {
      if (this.json1 !== val) {
        this.json1 = val
      }
    },
    handleJsonChange2(val) {
      if (this.json2 !== val) {
        this.json2 = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.media {
  width: 100%;
  height: calc(100vh - 88px);

  .head {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 14px;
    border-radius: 4px;
    background-color: #242e42;
    margin: 0 0 12px;

    ::v-deep.el-button {
      padding: 8px 20px;
    }

    ::v-deep.el-button--primary {
      background: #242e42;
      border-color: transparent;
      color: #fff;
    }

    .activity::v-deep.el-button--primary {
      background: $themeText;
      color: #fff;
    }
  }

  .detail {
    //width: 500px;
    background-color: #fff;
  }
}
</style>
