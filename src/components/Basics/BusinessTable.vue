<!-- 通用列表组件 -->
<template>
  <el-table
    ref="businessTable"
    v-loading="loading"
    :data="tableData"
    :header-cell-class-name="'business-table-header'"
    class="BusinessTable"
    style="width: 100%"
    @select="handleSelect"
    @select-all="handleSelectAll"
    @row-click="handleRowClick"
  >
    <el-table-column
      v-if="selection"
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
      <template>
        <svg-icon :icon-class="icon" style="font-size: 24px" />
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
<!--          <span :class="{weight: item.bold}">-->
<!--            {{ item.pro[scope.row[ item.prop ]] }}-->
<!--          </span>-->
          <el-switch
            v-model="scope.row[item.prop]"
            class="zeus-mr-15"
            active-value="ENABLE"
            inactive-value="DISABLE"
            active-color="#55BC8A"
            inactive-color="#AB2F29"
            @change="switchChange(scope.row)"
          >
          </el-switch>
          <span v-if="scope.row[item.prop] === 'ENABLE'">启用中</span>
          <span v-if="scope.row[item.prop] === 'DISABLE'">已禁用</span>
        </template>
        <template v-else-if="item.label === '来自产品'">
          <span>
            {{ scope.row[ item.prop ] ? '是' : '否' }}
          </span>
        </template>
        <template v-else>
          <span :class="{event: item.event,weight: item.bold}" @click="detail(scope.row,item.event)">
            {{ scope.row[item.prop] ? scope.row[item.prop] : '-' }}
            <span v-if="item.unit">{{ item.unit }}</span>
          </span>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import OperationButtons from '@/components/Basics/OperationButtons'
import EventBus from '@/utils/event-bus'
export default {
  name: 'BusinessTable',
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
        return ''
      }
    },
    icon: {
      type: String,
      default: ''
    }
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
    /* 排序 */
    sortMethod(a, b) {
      this.$emit('sortMethod', a, b)
    },
    /* 点击事件*/
    detail(item, event) {
      if (event) {
        this.$emit('detail', item)
      }
    },
    /* 多选*/
    handleSelect(selection) {
      this.$emit('select', selection)
    },
    /* 全选*/
    handleSelectAll(selection) {
      this.$emit('select', selection)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.BusinessTable {
  //min-height: 550px;
  //height: 100%;
  padding: 0 12px 12px 12px;

  .event {
    color: #409eff;
    cursor: pointer;
    //text-decoration: underline;
  }
  .weight{
    font-weight: bold;
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
