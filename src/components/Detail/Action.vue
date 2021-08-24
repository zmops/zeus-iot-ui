<!-- 执行动作组件 -->
<template>
  <div class="Action">
    <div v-for="(item, index) in formData" :key="index">
      <el-select v-model="item.deviceId" placeholder="设备列表" size="mini" class="select1 zeus-mr-5" @change="deviceChange">
        <el-option
          v-for="(i, ind) in deviceList"
          :key="ind"
          :label="i.name"
          :value="i.deviceId"
        />
      </el-select>
      <el-select v-model="item.service" placeholder="服务列表" size="mini" class="select2 zeus-mr-5">
        <el-option
          v-for="(i, ind) in serviceList"
          :key="ind"
          :label="i.label"
          :value="i.value"
        />
      </el-select>
      <el-button v-if="formData.length > 1" type="text" icon="el-icon-delete" class=" del" @click="del(index)"></el-button>
      <Variable read :variable-list="item.list" @change="variableChange" />
    </div>
    <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="addAction">增加执行动作</el-button>
  </div>
</template>
<script>
import Variable from '@/components/Detail/Variable'
export default {
  name: 'Action',
  components: {
    Variable
  },
  props: {
    value: {
      type: Array,
      default() {
        return [
          {
            list: [
              {
                tag: '',
                value: '',
                remark: ''
              }
            ]
          }
        ]
      }
    },
    deviceList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      formData: this.value,
      serviceList: []
    }
  },
  watch: {
    formData: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {

  },
  methods: {
    deviceChange(val) {
      // 获取服务列表
    },
    variableChange() {
    },
    del(index) {
      this.formData.splice(index, 1)
    },
    addAction() {
      this.formData.push(
        {
          list: [
            {
              tag: '',
              value: '',
              remark: ''
            }
          ]
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.Action {
  .select1{
    width: 170px;
  }
  .select2{
    width: 180px;
  }

}
</style>
