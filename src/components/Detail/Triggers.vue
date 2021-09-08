<!-- 触发条件组件 -->
<template>
  <div class="Triggers">
    <div>
      满足下列
      <el-select v-model="formData.condition" placeholder="" size="mini" class="select-w50">
        <el-option label="任意" value="||" />
        <el-option label="所有" value="&&" />
      </el-select>
      条件时,触发告警
    </div>
    <div v-for="(item, index) in formData.triggerList" :key="index" class="trigger-item zeus-relative">
      <el-select v-model="item.deviceId" placeholder="请选择设备" size="mini" class="select1 zeus-mr-5" @change="deviceChange">
        <el-option
          v-for="(i, ind) in deviceList"
          :key="ind"
          :label="i.name"
          :value="i.deviceId"
        />
      </el-select>
      <el-select v-model="item.type" size="mini" class="select3 zeus-mr-5">
        <el-option label="属性" value="属性"/>
        <el-option label="事件" value="事件"/>
      </el-select>
      <el-select v-if="item.type === '属性'" v-model="item.attr" placeholder="请选择设备属性" size="mini" class="select2 zeus-mr-5">
        <el-option
          v-for="(i, ind) in deviceAttribute"
          :key="ind"
          :label="i.label"
          :value="i.value"
        />
      </el-select>
      <el-select v-if="item.type === '事件'" v-model="item.incident" placeholder="请选择事件" size="mini" class="select2 zeus-mr-5">
        <el-option
          v-for="(i, ind) in incidentList"
          :key="ind"
          :label="i.label"
          :value="i.value"
        />
      </el-select>
      <el-select v-model="item.judge" size="mini" class="select3 zeus-mr-5">
        <el-option
          v-for="(i, ind) in judgeList"
          :key="ind"
          :label="i.label"
          :value="i.value"
        />
      </el-select>
      <el-input v-model="item.value" size="mini" class="input zeus-mr-10" />
      <span>{{ '单位' }}</span>
      <el-button v-if="formData.triggerList.length > 1" type="text" icon="el-icon-delete" class="zeus-absolute del" @click="del(index)"></el-button>
    </div>
    <el-button class="add-btn" plain icon="el-icon-plus" size="mini" @click="addTrigger">增加触发条件</el-button>
  </div>
</template>

<script>
export default {
  name: 'Triggers',
  props: {
    value: {
      type: Object,
      default() {
        return {
          condition: '||',
          triggerList: [
            {
              judge: '=',
              type: '属性'
            }
          ]
        }
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
      incidentList: [],
      deviceAttribute: [],
      id: '',
      judgeList: [
        { label: '=', value: '=' },
        { label: '>', value: '>' },
        { label: '<', value: '<' },
        { label: '<>', value: '<>' },
        { label: '>=', value: '>=' },
        { label: '<=', value: '<=' }
      ]
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
    if (this.$route.query.id) {
      this.id = '' + this.$route.query.id
      this.formData.triggerList[0].deviceId = this.id
    }
  },
  methods: {
    addTrigger() {
      this.formData.triggerList.push({
        deviceId: this.id,
        type: '属性'
      })
    },
    deviceChange(val) {
      console.log(val)
      // 获取事件列表

      // 设备属性列表
    },
    del(index) {
      this.formData.triggerList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.Triggers {
  .select-w50{
    width: 50px;

    //::v-deep.el-input--mini .el-input__inner{
    //  height: 24px!important;
    //}
  }

  .trigger-item{
    margin-top: 6px;

    //::v-deep.el-input--mini .el-input__inner{
    //  height: 26px!important;
    //}
    .select1{
      width: 130px;
    }
    .select2{
      width: 130px;
    }
    .select3{
      width: 60px;
    }
    .input{
      width: 120px;
    }
    .del{
      right: 0;
      top: -2px;
    }
  }
}
</style>
