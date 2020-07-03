<template>
  <el-button v-if="orderMasterStatus === 'processing'" type="danger" size="mini" icon="el-icon-delete" :loading="saveLoading" @click="saveDataToService">删除</el-button>
</template>

<script>
export default {
  name: 'FormerDelete',
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
