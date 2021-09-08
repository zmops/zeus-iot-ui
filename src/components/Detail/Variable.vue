<!-- 变量组件 -->
<template>
  <div class="Variable">
    <div v-for="(item,index) in list" :key="index" class="zeus-list-conten zeus-flex-between">
      <div class="left zeus-flex-default">
        <div class="zeus-list-item">
          <el-input v-model="item.remark" size="mini" :disabled="read">
            <template slot="prepend">描述</template>
          </el-input>
        </div>
        <div class="zeus-list-item">
<!--          <span class="zeus-left-tips tips">{$</span>-->
<!--          <span class="zeus-right-tips tips">}</span>-->
          <el-input v-model="item.tag" size="mini" :disabled="read">
            <template slot="prepend">键</template>
          </el-input>
        </div>
        <div class="zeus-list-item">
          <el-input v-model="item.value" size="mini">
            <template slot="prepend">值</template>
          </el-input>
        </div>
      </div>
      <i v-if="!read" class="el-icon-delete zeus-icon" @click="del(index)" />
    </div>
    <el-button v-if="!read" class="add-btn" plain icon="el-icon-plus" size="mini" @click="add">增加变量</el-button>
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
    read: Boolean
  },
  data() {
    return {
      list: JSON.parse(JSON.stringify(this.value))
    }
  },
  watch: {
    list: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    del(i) {
      this.list.splice(i, 1)
    },
    add() {
      for (const item of this.list) {
        if (item.tag === '' || item.value === '') {
          this.$message({
            message: '请填写完整当前变量的键值',
            type: 'warning'
          })
          return false
        }
      }
      const key = this.list.map((i) => {
        return i.tag
      })
      if (new Set(key).size !== key.length) {
        this.$message({
          message: '不能存在相同的键',
          type: 'warning'
        })
        return false
      }
      this.list.push({
        tag: '',
        value: '',
        remark: ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Variable {
  .add-btn{
    width: 100%;
    border-style: dashed;
  }
}
</style>
