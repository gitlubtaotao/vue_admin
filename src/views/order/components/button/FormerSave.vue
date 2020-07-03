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
      this.saveLoading = true
      this.$emit('click', evt)
      setTimeout(() => {
        this.saveLoading = false
      }, 300)
    }
  }
}
</script>
