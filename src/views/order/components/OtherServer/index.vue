<template>
  <div>
    <integrated-order
      :order-list="formerOtherServers"
      :supply-data="supplyOptions"
      :customer-data="customerOptions"
      style="margin-bottom: 10px;"
      class="other-server-class"
    />
    <trailer-order
      :order-list="formerTrailerOrders"
      :port-data="portOptions"
      :supply-data="supplyOptions"
      :customer-data="customerOptions"
      :cap-type-data="capTypeOptions"
      :package-data="packageOptions"
      style="margin-bottom: 10px;"
      class="other-server-class"
    />
  </div>
</template>
<script>
import IntegratedOrder from './IntegratedOrder'
import TrailerOrder from './TrailerOrder'
import { getData } from '@/api/index_data'

export default {
  name: 'OtherServer',
  components: { IntegratedOrder, TrailerOrder },
  data() {
    return {
      formerOtherServers: [],
      formerTrailerOrders: [],
      customerOptions: [],
      supplyOptions: [],
      portOptions: [],
      packageOptions: [],
      capTypeOptions: []
    }
  },
  computed: {
    transportType: function() {
      return this.$route.query.transport_type
    },
    orderMasterId: function() {
      return this.$route.params.id
    },
    getDataUrl: function() {
      return '/order/masters/' + this.orderMasterId + '/getOtherServer?transport_type=' + this.transportType
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getData(this.getDataUrl, {}, 'get').then((response) => {
        console.log(response)
        this.formerOtherServers = response.formerData.formerOtherServers
        this.formerTrailerOrders = response.formerData.formerTrailerOrders
        this.portOptions = response.selectOptions.portOptions
        this.packageOptions = response.selectOptions.packageOptions
        this.capTypeOptions = response.selectOptions.capTypeOptions
        this.supplyOptions = response.crmOptions.supplyOptions
        this.customerOptions = response.crmOptions.customerOptions
      }).catch(reason => {
        console.log(reason)
      })
    }
  }
}
</script>

<style lang="scss">
  .other-server-class{
    .el-card__header{
      padding: 10px 20px !important;
    }
  }
</style>
