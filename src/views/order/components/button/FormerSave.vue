<template>
  <el-button v-if="orderMasterStatus === 'processing'" type="success" size="mini" icon="el-icon-check" :loading="saveLoading" @click="saveDataToService">保存</el-button>
</template>

<script>
export default {
  name: 'FormerSave',
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
    saveDataToService(evt) {
      this.$confirm('是否继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveLoading = true
        this.$emit('click', evt)
      }).catch(() => {
      })
      setTimeout(() => {
        this.saveLoading = false
      }, 2000)
    }
  }
}
</script>
