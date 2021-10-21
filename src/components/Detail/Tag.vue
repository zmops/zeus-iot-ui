<!-- 标签组件 -->
<template>
  <div class="Tag">
    <div v-for="(item,index) in list" :key="index" class="zeus-list-conten zeus-flex-between">
      <div class="left zeus-flex-default">
        <div class="zeus-list-item">
          <el-input v-model="item.tag" size="mini">
            <template slot="prepend">键</template>
          </el-input>
        </div>
        <div class="zeus-list-item">
          <el-input v-model="item.value" size="mini">
            <template slot="prepend">值</template>
          </el-input>
        </div>
      </div>
      <el-button type="text" class=" zeus-icon"  @click="del(index)">
        <svg-icon icon-class="but_del"></svg-icon>
      </el-button>
    </div>
    <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="add">增加标签</el-button>
  </div>
</template>

<script>
export default {
  name: 'Tag',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.list = val
      }
    }
    // list: {
    //   deep: true,
    //   handler(val) {
    //     this.$emit('input', val)
    //   }
    // }
  },
  methods: {
    del(i) {
      this.list.splice(i, 1)
    },
    verification() {
      this.$emit('input', this.list)
      for (const item of this.list) {
        if (item.tag === '') {
          this.$message({
            message: '请填写完整当前标签的键',
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
      return true
    },
    add() {
      if (this.verification()) {
        this.list.push({
          tag: '',
          value: ''
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.Tag {
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
