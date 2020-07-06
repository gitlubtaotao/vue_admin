<template>
  <div>
    <el-card shadow="hover" style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>报关服务</span>
        <el-button v-if="orderMasterStatus === 'processing'" type="primary" size="small" style="float: right;" @click="addOrder">新增</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'CustomsClearance',
  computed: {
    orderMasterStatus: function() {
      return this.$store.state.orderMaster.orderMasterStatus
    },
    transportType: function() {
      return this.$route.query.transport_type
    }
  },
  methods: {
    addOrder() {

    }
  }
}
</script>
