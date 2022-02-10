<!-- 变量组件 -->
<template>
  <div class="Variable">
    <div v-for="(item,index) in list" :key="index" class="zeus-list-conten zeus-flex-between">
      <div class="left zeus-flex-default">
        <div class="zeus-list-item">
<!--          <span class="zeus-left-tips tips">{$</span>-->
<!--          <span class="zeus-right-tips tips">}</span>-->
          <el-input v-model="item.key" size="mini" :disabled="read">
            <template slot="prepend">键</template>
          </el-input>
        </div>
        <div class="zeus-list-item">
          <el-input v-model="item.value" size="mini">
            <template slot="prepend">值</template>
          </el-input>
        </div>
        <div class="zeus-list-item">
          <el-input v-model="item.remark" size="mini" :disabled="read">
            <template slot="prepend">描述</template>
          </el-input>
        </div>
      </div>
      <el-button v-if="!read && showBut" type="text" class=" zeus-icon"  @click="del(index)">
        <svg-icon icon-class="but_del"></svg-icon>
      </el-button>
    </div>
    <el-button v-if="!read && showBut" class="add-btn" plain icon="el-icon-plus" size="mini" @click="add">增加{{name}}</el-button>
  </div>
</template>
<script>
export default {
  name: 'Variable',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    name: {
      type: String,
      default: '变量'
    },
    showBut: {
      type: Boolean,
      default: true
    },
    read: Boolean
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        this.list = val
      }
    }
  },
  methods: {
    del(i) {
      this.list.splice(i, 1)
    },
    verification() {
      this.$emit('input', this.list)
      for (const item of this.list) {
        if (item.value === '' || item.key === '') {
          this.$message({
            message: '请填写完整当前的键值',
            type: 'warning'
          })
          return false
        }
      }
      const key = this.list.map((i) => {
        return i.key
      })
      if (new Set(key).size !== key.length) {
        this.$message({
          message: '不能存在相同的键',
          type: 'warning'
        })
        return false
      }
      return true
    },
    add() {
      if (this.verification()) {
        this.list.push({
          key: '',
          value: '',
          remark: ''
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.Variable {
  .add-btn{
    width: 100%;
    border-style: dashed;
    background-color: #F9FBFD;

    &:hover{
      background-color: #EFF4F9;
    }
  }
}
</style>
