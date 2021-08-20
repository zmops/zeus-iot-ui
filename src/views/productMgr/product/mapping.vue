<template>
  <div>
    <el-form ref="mapForm" label-width="80px" label-position="top" class="dialog-form">
      <el-form-item label="值映射方案">
        <div v-for="(item,index) in mapList" :key="index" class="zeus-list-conten zeus-flex-between">
          <div class="left zeus-flex-default" @click="edit(item)">
            <div class="zeus-list-item">
              <div class="zeus-map zeus-flex-default">
                <div class="zeus-map_prepend">方案名</div>
                <div class="zeus-map_content">{{ item.name }}</div>
              </div>
            </div>
            <div class="zeus-list-item">
              <div class="zeus-map zeus-map-value zeus-flex-default">
                <div class="zeus-map_prepend">值</div>
                <div class="zeus-map_content">
                  <div v-for="(map,index) in item.mappings" :key="'m'+index">{{ map.val }}</div>
                </div>
              </div>
            </div>
          </div>
          <i class="el-icon-delete zeus-icon" @click="del(item.valuemapid)" />
        </div>
        <div class="zeus-mapping-con">
          <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="add">增加值映射方案</el-button>
          <div class="el-form-item-tips">
            <i class="el-icon-info" />供产品内的属性选用。若属性上进行了配置，则实际保存的依然是原始值。只是让展现数据的可读性更好。
          </div>
          <MapForm v-if="showMap" :item="mapItem" @handleCancle="handleCancle" />
        </div>
      </el-form-item>
    </el-form>
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
    >
      <div slot="title" class="dialog-title">
        <svg-icon icon-class="dialog_edit" />
        更新值映射
      </div>
      <div class="zeus-mapping-con zeus-mapping-body">
        <MapForm :item="mapItem" @handleCancle="handleCancle" />
      </div>

    </el-dialog>
  </div>
</template>

<script>
import MapForm from '@/components/productMgr/product/mapForm.vue'
import { getValueMapList, deleteValuemap } from '@/api/porductMgr'
export default {
  components: {
    MapForm
  },
  data() {
    return {
      prodId: '',
      mapItem: {},
      showMap: false,
      dialogVisible: false,
      mapList: []
    }
  },
  async created() {
    if (this.$route.query.id) {
      this.prodId = this.$route.query.id
      await this.getMapList()
    }
  },
  methods: {
    getMapList() {
      getValueMapList({ prodId: this.prodId }).then(res => {
        if (res.code == 200) {
          for (const item of res.data) {
            for (const map of item.mappings) {
              map.val = '=' + map.value + '=>' + map.newvalue
            }
          }
          this.mapList = res.data
        }
      })
    },
    add() {
      this.mapItem = {
        productId: this.prodId,
        valueMapName: '',
        valueMaps: [{
          value: '',
          newvalue: ''
        }],
        valuemapid: ''
      }
      this.showMap = true
    },
    edit(item) {
      this.mapItem = {
        productId: this.prodId,
        valueMapName: item.name,
        valueMaps: item.mappings,
        valuemapid: item.valuemapid
      }
      this.dialogVisible = true
    },
    del(i) {
      this.$confirm('是否确认删除当前数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteValuemap({ valuemapid: i }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getMapList()
          }
        })
      })
    },
    async handleCancle() {
      await this.getMapList()
      this.showMap = false
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/pubilc/mapping";
</style>
