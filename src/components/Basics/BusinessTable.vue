<!-- 通用列表组件 -->
<template>
  <el-table
    ref="businessTable"
    v-loading="loading"
    :data="tableData"
    :header-cell-class-name="'business-table-header'"
    class="BusinessTable"
    :height="h"
    :class="isRadio ? 'isRadio' : ''"
    @select="handleSelect"
    @select-all="handleSelectAll"
    @row-click="handleRowClick"
    :row-key="getRowKey"
    v-el-table-infinite-scroll="load"
    :infinite-scroll-disabled="!scroll"
  >
    <el-table-column
      v-if="selection"
      :reserve-selection="true"
      header-align="center"
      align="center"
      type="selection"
      width="50"
    />
    <el-table-column
      v-if="serial"
      header-align="center"
      align="left"
      type="index"
      width="50"
      label="序号"
    />
    <el-table-column v-if="icon" width="48">
      <template slot-scope="props">
        <img v-if="props.row.icon" :src="props.row.icon" width="24px">
        <svg-icon v-else :icon-class="icon" style="font-size: 24px" />
      </template>
    </el-table-column>
    <el-table-column v-if="openR" type="expand">
      <template slot-scope="props">
        <pre>{{ props.row.name }}</pre>
      </template>
    </el-table-column>
    <el-table-column
      v-for="(item, index) in newColumns"
      :key="index"
      :header-align="item.column_align ? item.column_align : 'left'"
      :align="item.column_align ? item.column_align : 'left'"
      :label="item.label"
      :width="item.width"
      :min-width="item.minWidth"
      :sortable="item.sort || false"
      :sort-method="sortMethod"
      show-overflow-tooltip
      :fixed="item.fixed"
    >
      <template slot-scope="scope">
        <template v-if="item.prop === 'buttons'">
          <OperationButtons
            :data-id="scope.row[item.idName]"
            :status="scope.row['status']"
            :index="scope.$index"
            :buttons="item.buttons"
          />
        </template>
        <template v-else-if="item.timeFormat">
          <span :class="{weight: item.bold}">
            {{ Number( scope.row[ item.prop ]) ? transTime( Number( scope.row[ item.prop ])) : '-' }}
          </span>
        </template>
        <template v-else-if="item.status">
          <span v-if="scope.row[item.prop] === 'ENABLE'" class="enable">
            已启用
          </span>
          <span v-if="scope.row[item.prop] === 'DISABLE'" class="disable">
            已禁用
          </span>
        </template>
        <template v-else-if="item.prop === 'online'">
          <span v-if="scope.row[item.prop] === '1'">
            <svg-icon icon-class="online" />
            在线
          </span>
          <span v-else-if="scope.row[item.prop] === '0'">
            <svg-icon icon-class="offline" />
            离线
          </span>
          <span v-else>-</span>
        </template>
        <template v-else-if="item.label === '来自产品'">
          <span>
            {{ scope.row[ item.prop ] ? '是' : '否' }}
          </span>
        </template>
        <template v-else-if="item.device">
          <div v-if="scope.row[item.prop] && scope.row[item.prop].length">
            <div v-for="(i, ind) in scope.row[item.prop]" :key="ind" class="event" @click="toDev(i.deviceId)">{{ i.name }}</div>
          </div>
          <div v-else>-</div>
        </template>
        <template v-else-if="scope.row.triggerType === '手动' && item.label === '触发主体'">
          {{ scope.row[item.prop] || '-' }}
        </template>
        <template v-else>
          <span v-if="scope.row[item.prop]" :class="{event: item.event,weight: item.bold}" @click="detail(scope.row,item.event)">
            {{ scope.row[item.prop] }}
            <span v-if="item.unit">{{ item.unit }}</span>
          </span>
          <span v-else>-</span>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import OperationButtons from '@/components/Basics/OperationButtons'
import EventBus from '@/utils/event-bus'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
export default {
  name: 'BusinessTable',
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: {
    OperationButtons
  },
  props: {
    loading: {
      type: Boolean,
      default() {
        return false
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    /* 是否需要选择框 */
    selection: {
      type: Boolean,
      default() {
        return false
      }
    },
    /* 是否需要序号 */
    serial: {
      type: Boolean,
      default() {
        return false
      }
    },
    /* 是否需要展开行 */
    openR: {
      type: Boolean,
      default() {
        return false
      }
    },
    /* 表格高度 */
    h: {
      type: [Number, String],
      default() {
        return 'calc(100% - 242px)'
      }
    },
    icon: {
      type: String,
      default: ''
    },
    isRadio: Boolean,
    scroll: Boolean
  },
  data() {
    return {}
  },
  computed: {
    /* 过滤列表字段 */
    newColumns() {
      return this.columns.filter(item => item.show)
    }
  },
  created() {
    /* 取消选择 */
    EventBus.$on('clearSelection', 'app', () => {
      this.$refs.businessTable.clearSelection()
    })
  },
  methods: {
    /* 优化显示多选框 */
    getRowKey(row) { return row.deviceId },
    /* 滚动加载 */
    load() {
      this.$emit('load')
    },
    /* 排序 */
    sortMethod(a, b) {
      this.$emit('sortMethod', a, b)
    },
    /* 点击事件*/
    detail(item, event) {
      if (event) {
        this.$emit(event, item)
      }
    },
    /* 多选*/
    handleSelect(selection, row) {
      this.$emit('select', selection, row)
    },
    /* 全选*/
    handleSelectAll(selection) {
      this.$emit('select', selection, undefined)
    },
    /* 点击行的点击事件*/
    handleRowClick(r, c, e) {
      this.$emit('rowClick', r, c, e)
    },
    /* 切换状态 */
    switchChange(val) {
      this.$emit('switchChange', val)
    },
    transTime(time, fmt = 'yyyy-MM-dd HH:mm:ss') {
      if (time) {
        const date = new Date(time * 1000)
        const full = (x) => (x < 10 ? '0' + x : x)
        return fmt
          .replace(/yyyy/, date.getFullYear())
          .replace(/MM/, full(date.getMonth() + 1))
          .replace(/dd/, full(date.getDate()))
          .replace(/HH/, full(date.getHours()))
          .replace(/mm/, full(date.getMinutes()))
          .replace(/ss/, full(date.getSeconds()))
      }
      return '-'
    },
    /* 清空多选 */
    clearSelection() {
      this.$refs.businessTable.clearSelection()
    },
    /* 设置表格选中 */
    setSelection(row) {
      this.$refs.businessTable.toggleRowSelection(row)
    },
    /* 跳转到详情页 */
    toDev(id) {
      const url = this.$router.resolve({
        path: '/deviceMgr/device/detail',
        query: { id }
      })
      window.open(url.href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.isRadio ::v-deep.el-table__header-wrapper  .el-checkbox{
  display:none
}
.BusinessTable {
  //min-height: 550px;
  //height: 100%;
  width: 100%;
  padding: 0 12px 12px 12px;

  .event {
    color: #409eff;
    cursor: pointer;
    //text-decoration: underline;
  }
  .weight{
    font-weight: bold;
  }

  .disable{
    color: #f5a623;
  }

  .enable{
    color: #55BC8A;
  }
}
::v-deep.el-table{
  font-size: 12px;
  color: #242e42;
}
::v-deep.el-table th.is-leaf, .el-table td{
  border-bottom: 1px solid #eff4f9;
}
::v-deep.el-table thead{
  color: #79879c;
}

</style>
