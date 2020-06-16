<template>
  <div>
    <el-row>
      <el-button type="success" size="mini" icon="el-icon-check" :loading="saveLoading" @click="saveDataToService">保存</el-button>
    </el-row>
    <el-divider />
  </div>
</template>
<script>
export default {
  name: 'FormerButton',
  props: {
    orderMaster: {
      required: true,
      type: Object
    },
    saveData: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      saveLoading: false
    }
  },
  methods: {
    saveDataToService() {
      this.saveLoading = true
      this.saveData()
      console.log('22')
      setTimeout(() => {
        this.saveLoading = false
      }, 300)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 10px 0;
  }
</style>

