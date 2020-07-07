<template>
  <div>
    <keep-alive>
      <integrated-order
        :order-list="formerOtherServers"
        :supply-data="supplyOptions"
        :customer-data="customerOptions"
        style="margin-bottom: 10px;"
        class="other-server-class"
      />
    </keep-alive>
    <keep-alive>
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
    </keep-alive>
    <keep-alive>
      <customs-clearance
        :order-list="formerCustomsClearance"
        :customer-data="customerOptions"
        :supply-data="supplyOptions"
        :port-data="portOptions"
        :custom-type-data="customTypeOptions"
        :trans-type-data="transTypeOptions"
        :currency-data="currencyOptions"
        style="margin-bottom: 10px;"
        class="other-server-class"
      />
    </keep-alive>
    <keep-alive>
      <warehouse-server
        :customer-data="customerOptions"
        :order-list="formerWarehouseOrders"
        :package-data="packageOptions"
        style="margin-bottom: 10px;"
        class="other-server-class"
      />
    </keep-alive>
  </div>
</template>
<script>
import IntegratedOrder from './IntegratedOrder'
import TrailerOrder from './TrailerOrder'
import CustomsClearance from './CustomsClearance'
import WarehouseServer from './WarehouseServer'
import { getData } from '@/api/index_data'

export default {
  name: 'OtherServer',
  components: { WarehouseServer, CustomsClearance, IntegratedOrder, TrailerOrder },
  data() {
    return {
      formerOtherServers: [],
      formerTrailerOrders: [],
      formerWarehouseOrders: [],
      formerCustomsClearance: [],
      customerOptions: [],
      supplyOptions: [],
      portOptions: [],
      packageOptions: [],
      capTypeOptions: [],
      transTypeOptions: [],
      customTypeOptions: [],
      currencyOptions: []
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
        const formerData = response['formerData']
        this.formerOtherServers = formerData.formerOtherServers
        this.formerTrailerOrders = formerData.formerTrailerOrders
        this.formerWarehouseOrders = formerData['formerWarehouseServices']
        this.formerCustomsClearance = formerData['formerCustomClearances']
        const selectOptions = response['selectOptions']
        this.portOptions = selectOptions.portOptions
        this.packageOptions = selectOptions.packageOptions
        this.capTypeOptions = selectOptions.capTypeOptions
        this.customTypeOptions = selectOptions.customTypeOptions
        this.transTypeOptions = selectOptions.transTypeOptions
        this.currencyOptions = selectOptions.currencyOptions
        const crmOptions = response['crmOptions']
        this.supplyOptions = crmOptions.supplyOptions
        this.customerOptions = crmOptions.customerOptions
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
