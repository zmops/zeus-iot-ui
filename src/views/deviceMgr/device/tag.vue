<template>
  <div v-if="!dialogVisible" class="tag zeus-relative">
    <div v-for="(item, index) in viewList" :key="index" class="tag-item zeus-inline-block">
      <span class="tag-item-l zeus-inline-block">{{ item.tag }}</span>
      <span class="tag-item-r zeus-inline-block">{{ item.value }}</span>
    </div>
    <el-button size="mini" round class="zeus-right zeus-absolute edit" @click="edit">
      <svg-icon icon-class="dialog_edit" style="margin-right: 5px"/>
      编辑
    </el-button>
  </div>
  <div v-else class="tag zeus-relative">
    <FormTemplate :up="'标签列表'" :state="'编辑标签'" :width="0" :but-loading="butLoading" @submit="handleSubmit" @cancel="dialogVisible = false">
      <template v-slot:main>
        <Tag ref="tag" v-model="tagList" />
      </template>
    </FormTemplate>
  </div>
</template>

<script>
import Tag from '@/components/Detail/Tag'
import FormTemplate from '@/components/Slots/FormTemplate'
import { getDeviceTag, updateDevTag } from '@/api/deviceMgr'
import { getProdTagList, updateProdTag } from '@/api/porductMgr'
export default {
  components: {
    Tag,
    FormTemplate
  },
  props: {
    isDev: Boolean
  },
  data() {
    return {
      prodId: '',
      tagList: [],
      viewList: [],
      dialogVisible: false,
      butLoading: false
    }
  },
  async created() {
    if (this.$route.query.id) {
      this.prodId = this.$route.query.id
      await this.getTagList()
    }
  },
  methods: {
    getTagList() {
      if (this.isDev) {
        getDeviceTag({ deviceId: this.prodId }).then(res => {
          if (res.code == 200) {
            this.tagList = res.data
            this.viewList = JSON.parse(JSON.stringify(res.data))
          }
        })
      } else {
        getProdTagList({ productId: this.prodId }).then(res => {
          if (res.code == 200) {
            this.tagList = res.data
            this.viewList = JSON.parse(JSON.stringify(res.data))
          }
        })
      }
    },
    // change(list) {
    //   this.tagList = list
    // },
    edit() {
      this.dialogVisible = true
      this.tagList = JSON.parse(JSON.stringify(this.viewList))
    },
    handleSubmit() {
      if (this.$refs.tag.verification()) {
        this.butLoading = true
        if (this.isDev) {
          updateDevTag({ productId: this.prodId, productTag: this.tagList }).then(res => {
            if (res.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getTagList()
              this.$emit('updata')
              this.dialogVisible = false
            }
            this.butLoading = false
          }).catch(() => {
            this.butLoading = false
          })
        } else {
          updateProdTag({ productId: this.prodId, productTag: this.tagList }).then(res => {
            if (res.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getTagList()
              this.$emit('updata')
              this.dialogVisible = false
            }
            this.butLoading = false
          }).catch(() => {
            this.butLoading = false
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tag {
  width: 100%;
  min-height: 70px;
  background-color: #fff;
  padding: 17px 16px 4px 16px;
  box-shadow: 6px 8px 16px #E2EAF2;

  .tag-item{
    font-size: 12px;
    background-color: #E3E9EF;
    border-radius: 2px;
    margin-right: 40px;
    margin-bottom: 12px;

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

  .edit{
    right:18px ;
    top: 30px;
    transform: translateY(-50%);
    padding: 5px 9px;
    border: 1px solid #EFF4F9;
    background: #EFF4F9;
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
