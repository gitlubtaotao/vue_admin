<template>
  <div>
    <el-row>
      <el-button v-if="orderMasterStatus === 'processing'" type="success" size="mini" icon="el-icon-check" :loading="saveLoading" @click="saveDataToService">保存</el-button>
    </el-row>
    <el-divider />
  </div>
</template>
<script>
export default {
  name: 'FormerButton',
  props: {
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
  computed: {
    orderMasterStatus: function() {
      return this.$store.state.orderMaster.orderMasterStatus
    }
  },
  methods: {
    saveDataToService() {
      this.saveLoading = true
      this.saveData()
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

