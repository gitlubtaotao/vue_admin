<template>
  <div>
    <keep-alive>
      <entry-fee
        pay-or-receive="receive"
        :finance-fee-array="receive_fee_array"
        :fee-type-options="fee_type_options"
        :finance-currency-options="currency_options"
        :pay-type-options="pay_type_options"
        :finance-tag-options="finance_tag_options"
        :currency-rate-options="currency_rate_options"
        :closing-unit-options="closing_unit_options"
        @changeFeeArray="changeFeeArray"
      />
    </keep-alive>
    <keep-alive>
      <entry-fee
        pay-or-receive="pay"
        :finance-fee-array="pay_fee_array"
        :fee-type-options="fee_type_options"
        :finance-currency-options="currency_options"
        :pay-type-options="pay_type_options"
        :finance-tag-options="finance_tag_options"
        :currency-rate-options="currency_rate_options"
        :closing-unit-options="closing_unit_options"
        @changeFeeArray="changeFeeArray"
      />
    </keep-alive>
  </div>
</template>
<script>
import EntryFee from './EntryFee'
import { getData } from '@/api/index_data'
export default {
  name: 'OperationFee',
  components: { EntryFee },
  data() {
    return {
      loadingFee: false,
      receive_fee_array: [],
      pay_fee_array: [],
      fee_type_options: [],
      currency_options: [],
      currency_rate_options: [],
      finance_tag_options: [],
      pay_type_options: [],
      closing_unit_options: []
    }
  },
  computed: {
    orderMasterId: function() {
      return this.$route.params.id
    }
  },
  created() {
    this.getFeeData()
  },
  methods: {
    changeFeeArray(data, payOrReceive) {
      if (payOrReceive === 'receive') {
        this.pay_fee_array = this.pay_fee_array.concat(data)
      } else {
        this.receive_fee_array = this.receive_fee_array.concat(data)
      }
    },
    handleFeeType(val) {
      for (let i = 0; i < val.length; i++) {
        const temp = val[i]
        temp['label'] = temp.name + '|' + temp.name_cn + '|' + temp.name_en
        this.fee_type_options.push(temp)
      }
    },
    getFeeData() {
      getData('/finance/fees/' + this.orderMasterId + '/OrderFees', {}, 'get').then((response) => {
        console.log(response)
        const finance_fee_array = response.data
        if (finance_fee_array.receive !== null && finance_fee_array.receive.length >= 1) {
          this.receive_fee_array = finance_fee_array.receive
        }
        if (finance_fee_array.pay !== null && finance_fee_array.receive.length >= 1) {
          this.pay_fee_array = finance_fee_array.pay
        }
        this.closing_unit_options = response['closing_unit_options']
        const options = response['options']
        this.setStateOperation(options)
        this.handleFeeType(options.fee_type_options)
        this.currency_options = options['finance_currency']
        this.pay_type_options = options['pay_type_options']
        this.finance_tag_options = options.finance_tag_options
        if (options.currency_rate_options !== null && typeof (options.currency_rate_options) !== 'undefined') {
          this.currency_rate_options = options.currency_rate_options
        }
        this.loadingFee = true
      }).catch((reason) => {
        console.log(reason)
      })
    },
    setStateOperation(data) {
      this.$store.dispatch('orderMaster/setFinanceApprove', data['system_finance_approve'])
      this.$store.dispatch('orderMaster/setFinanceAudit', data['system_finance_audit'])
    }
  }
}
</script>
