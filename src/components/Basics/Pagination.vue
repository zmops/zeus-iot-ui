<template>
  <div class="pagination-container">
    <div class="level">
      <div class="level-l">
        共{{ total }}个条目
      </div>
      <div class="level-r">
        <el-button size="mini" :disabled="page === 1" @click="pageDown"><svg-icon icon-class="pageicon" style="transform:rotate(180deg);" /></el-button>
        <div class="zeus-inline-block zeus-ml-15 zeus-mr-15">{{ page }}</div>
        <el-button size="mini" :disabled="page === maxPage" @click="pageUp"><svg-icon icon-class="pageicon" /></el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    currentPage: {
      type: Number,
      default() {
        return 1
      }
    },
    size: {
      type: Number,
      default() {
        return 10
      }
    },
    total: {
      type: [Number, String],
      default() {
        return 0
      }
    }
  },
  watch: {
    currentPage: {
      immediate: true,
      handler(val) {
        this.page = val
      }
    }
  },
  data() {
    return {
      page: 1
    }
  },
  computed: {
    /* 计算出最大页数 */
    maxPage() {
      return Math.ceil(Number(this.total) / this.size)
    }
  },
  methods: {
    pageDown() {
      this.page--
      this.handleCurrentChange()
    },
    pageUp() {
      this.page++
      this.handleCurrentChange()
    },
    handleCurrentChange() {
      this.$emit('handleCurrentChange', this.page)
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container{
  height: 52px;
  line-height: 32px;
  position: relative;
  padding: 10px 20px;
  background-color: #f9fbfd;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  font-size: 12px;
  color: #79879c;
  .level {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .level-l{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-basis: auto;
      flex-grow: 0;
      flex-shrink: 0;
    }
    .level-r{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-basis: auto;
      flex-grow: 0;
      flex-shrink: 0;

      ::v-deep.el-button{
        border-color: transparent!important;
      }
      ::v-deep.el-button--mini{
        padding: 6px 20px;
      }
    }
  }
}

</style>
