<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row id="operation-header" type="flex" class="row-bg" justify="center">
        <el-col :offset="2" :span="3" />
        <el-col :span="3"><el-tag>{{ order_master.serial_number }}</el-tag></el-col>
        <el-col :span="4"><el-tag> {{ order_master.instruction_name }}</el-tag></el-col>
        <el-col :span="2"><el-tag>{{ order_master.transport_type_text }}</el-tag></el-col>
        <el-col :span="3"><el-tag type="danger">{{ order_master.status_text }}</el-tag></el-col>
        <el-col :span="3"><el-tag>{{ showCreateAt }}</el-tag></el-col>
        <el-col :offset="2" :span="3" />
      </el-row>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px;">
      <el-tabs @tab-click="tabClick">
        <el-tab-pane label="操作" :lazy="true">
          <keep-alive>
            <sea-page v-if="transport_type === '1' || transport_type === '4'" @orderInfo="getOrderMaster" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="录入费用" :lazy="true">
          <keep-alive>
            <operation-fee pay-or-receive="receive" :finance-fee-array="receive_fee_array" :fee-type-options="fee_type_options" :finance-currency-options="currency_options" :pay-type-options="pay_type_options" :finance-tag-options="finance_tag_options" :currency-rate-options="currency_rate_options" />
          </keep-alive>
          <div style="margin-top: 20px" />
          <keep-alive>
            <operation-fee pay-or-receive="pay" :finance-fee-array="pay_fee_array" :fee-type-options="fee_type_options" :finance-currency-options="currency_options" :pay-type-options="pay_type_options" :finance-tag-options="finance_tag_options" :currency-rate-options="currency_rate_options" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="附件">附件</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>

import { parseTime } from '@/utils'
import SeaPage from '../components/sea/SeaPage'
import OperationFee from '../components/OperationFee'
import { getData } from '@/api/index_data'

export default {
  name: 'OrderOperation',
  components: { SeaPage, OperationFee },
  data() {
    return {
      id: this.$route.params && this.$route.params.id,
      transport_type: this.$route.query.transport_type,
      loadingFee: false,
      receive_fee_array: [],
      pay_fee_array: [],
      fee_type_options: [],
      currency_options: [],
      currency_rate_options: [],
      finance_tag_options: [],
      pay_type_options: [],
      order_master: {
        serial_number: '',
        instruction_name: '',
        transport_type: '',
        status: '',
        created_at: ''
      }
    }
  },
  computed: {
    showCreateAt: function() {
      return parseTime(this.order_master.created_at, '{y}-{m}-{d}')
    }
  },
  methods: {
    // 显示日期
    showDate(time) {
      return parseTime(time, '{y}-{m}-{d}')
    },
    getOrderMaster(val) {
      this.order_master = val
    },
    tabClick(tab) {
      if (tab.index === '1' && !this.loadingFee) {
        this.getFeeData()
      }
    },
    getFeeData() {
      getData('/finance/fees/' + this.id + '/OrderFees', {}, 'get').then((response) => {
        console.log(response)
        if (response.data.length >= 1) {
          const finance_fee_array = response.data
          this.receive_fee_array = finance_fee_array.receive
          this.pay_fee_array = finance_fee_array.pay
        }
        const options = response.options
        this.handleFeeType(options.fee_type_options)
        this.currency_options = options.finance_currency
        this.pay_type_options = options['pay_type_options']
        this.finance_tag_options = options.finance_tag_options
        if (options.currency_rate_options !== null && typeof (options.currency_rate_options) !== "undefined") {
          this.currency_rate_options = options.currency_rate_options
        }
        this.loadingFee = true
      }).catch((reason) => {
        console.log(reason)
      })
    },
    handleFeeType(val) {
      for (let i = 0; i < val.length; i++) {
        const temp = val[i]
        temp['label'] = temp.name + '|' + temp.name_cn + '|' + temp.name_en
        this.fee_type_options.push(temp)
      }
    }
  }
}
</script>
<style lang="scss">
  #operation-header{
    .el-col{
      text-align: center;
    }
  }
  .demo-form-inline{
    .left-content{
      .el-form-item{
        width: 18%;
      }
    }
    .middle-content{
      .el-form-item{
        width: 45%;
      }
      .order-master-remark{
        width: 90%;
      }
    }
    .right-content{
      .el-form-item{
        width: 45%;
      }
    }
    .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
    }
    .el-form-item__label{
      line-height: 20px;
      font-weight: 400;
      padding: 5px 0 5px;
    }
  }
  .form-content-box{
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: auto;
    }
    .el-divider--horizontal{
       margin: 10px 0;
     }
    .el-form-item__label{
      line-height: 15px;
      font-weight: 400;
      padding: 5px 0 5px;
    }
  }
  .form-content-box-left{
    border-right: 1px solid #EBEEF5;
    .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
      width: 98%;
    }
  }
  .form-content-box-center{
    border-right: 1px solid #EBEEF5;
    .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
      width: 24.5%;
    }

  }
  .form-content-box-right{
    .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
      width: 98%;
    }
  }
</style>
