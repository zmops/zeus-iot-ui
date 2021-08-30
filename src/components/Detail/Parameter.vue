<!-- 参数组件 -->
<template>
  <div class="Parameter">
    <div v-for="(item,index) in list" :key="index" class="zeus-list-conten zeus-flex-between">
      <div class="left zeus-flex-default">
        <div class="zeus-list-item">
          <el-input v-model="item.name" size="mini" :disabled="read">
            <template slot="prepend">参数名称</template>
          </el-input>
        </div>
        <div class="zeus-list-item">
          <el-input v-model="item.key" size="mini">
            <template slot="prepend">参数标识符</template>
          </el-input>
        </div>
      </div>
      <i v-if="!read" class="el-icon-delete zeus-icon" @click="del(index)" />
    </div>
    <el-button v-if="!read" class="add-btn" plain icon="el-icon-plus" size="mini" @click="add">增加参数</el-button>
  </div>

</template>

<script>
export default {
  name: 'Parameter',
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
        if (item.name === '' && item.key === '') {
          this.$message({
            message: '请填写完整当前参数的值',
            type: 'warning'
          })
          return false
        }
      }
      this.list.push({
        name: '',
        key: ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Parameter {
  .add-btn{
    width: 100%;
    border-style: dashed;
  }
}
</style>
