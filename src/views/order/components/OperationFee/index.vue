<template>
  <div>
    <el-row style="margin-bottom: 20px">
      <el-button size="small" type="danger" @click="handlerHistoryFee">历史费用导入</el-button>
      <el-button size="small" type="info">导出费用结算清单</el-button>
      <el-button size="small" type="primary">从操作计划导入收入</el-button>
      <el-button size="small" type="primary">从操作计划导入支出</el-button>
    </el-row>
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
    <el-dialog title="历史费用导入" :visible.sync="centerDialogVisible" width="60%">
      <el-card shadow="never">
        <el-form ref="form" :model="searchParam" :inline="true">
          <el-form-item label="结算单位" size="small">
            <el-select v-model="searchParam.closing_unit_id" filterable placeholder="请选择" style="width: 100%">
              <el-option v-for="item in closing_unit_options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围" size="small">
            <el-select v-model="searchParam.date_range" filterable placeholder="请选择" style="width: 100%">
              <el-option v-for="item in dateRange" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" size="small">
            <el-select v-model="searchParam.pay_or_receive" style="width: 100%">
              <el-option v-for="item in payOrReceive" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-row>
            <el-button type="primary" size="small" :loading="loadingFee" @click="searchHistoryFee">查询</el-button>
          </el-row>
        </el-form>
      </el-card>
      <keep-alive><fee-table :fee-list="historyFeeList" style="margin: 10px 0 10px 0" @listenFeeIds="getSelectIds" /></keep-alive>
      <el-card shadow="never">
        <el-form ref="form" :model="exportParam" :inline="true">
          <el-form-item label="导出费用到" size="small">
            <el-select v-model="exportParam.pay_or_receive" filterable placeholder="请选择" style="width: 100%">
              <el-option v-for="item in payOrReceive" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="结算单位" size="small">
            <el-select v-model="exportParam.closing_unit_id" filterable placeholder="请选择" style="width: 100%">
              <el-option v-for="item in closing_unit_options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="loadingCopyFee" @click="copyFee">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import EntryFee from './EntryFee'
import FeeTable from '@/components/FeeTable'
import { getData, createData } from '@/api/index_data'
export default {
  name: 'OperationFee',
  components: { EntryFee, FeeTable },
  data() {
    return {
      searchParam: {
        closing_unit_id: this.$store.state.orderMaster.receiveClosingUnitId,
        date_range: 1,
        pay_or_receive: 'receive'
      },
      exportParam: {
        fee_ids: [],
        pay_or_receive: 'receive',
        closing_unit_id: this.$store.state.orderMaster.receiveClosingUnitId
      },
      historyFeeList: [],
      dateRange: [{ value: 1, label: '最近一个月' }, { value: 3, label: '最近三个月' }, { value: 6, label: '最近六个月' }],
      payOrReceive: [{ value: 'receive', label: '收入' }, { value: 'pay', label: '支出' }],
      centerDialogVisible: false,
      loadingFee: false,
      loadingCopyFee: false,
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
    getSelectIds(val) {
      this.exportParam.fee_ids = val
    },
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
        const finance_fee_array = response.data
        if (finance_fee_array.receive !== null && finance_fee_array.receive.length >= 1) {
          this.receive_fee_array = finance_fee_array.receive
        }
        if (finance_fee_array.pay !== null && finance_fee_array.receive.length >= 1) {
          this.pay_fee_array = finance_fee_array.pay
        }
        this.closing_unit_options = response['closing_unit_options']
        const options = response['options']
        this.handleFeeType(options.fee_type_options)
        this.currency_options = options['finance_currency']
        this.pay_type_options = options['pay_type_options']
        this.finance_tag_options = options.finance_tag_options
        if (options.currency_rate_options !== null && typeof (options.currency_rate_options) !== 'undefined') {
          this.currency_rate_options = options.currency_rate_options
        }
      }).catch((reason) => {
        console.log(reason)
      })
    },
    handlerHistoryFee() {
      this.centerDialogVisible = true
      if (this.historyFeeList.length <= 0) {
        this.searchHistoryFee()
      }
    },
    searchHistoryFee() {
      this.loadingFee = true
      getData('/finance/fees/GetHistoryFee', this.searchParam, 'get').then(response => {
        if (response.data !== null && typeof (response.data) !== 'undefined') {
          this.historyFeeList = response.data
        } else {
          this.historyFeeList = []
        }
        this.loadingFee = false
      })
    },
    copyFee() {
      if (this.exportParam.fee_ids.length <= 0) {
        this.$message.error('未选择记录')
        return
      }
      createData('/finance/fees/' + this.orderMasterId + '/BulkHistoryFee', this.exportParam).then(response => {
        if (this.exportParam.pay_or_receive === 'pay') {
          this.pay_fee_array = this.pay_fee_array.concat(response.data)
        } else {
          this.receive_fee_array = this.receive_fee_array.concat(response.data)
        }
        this.$notify({ title: 'Success', message: '从历史费用导入成功', type: 'success', duration: 5000 })
        this.centerDialogVisible = false
      }).catch(reason => {
        console.log(reason)
      })
      this.loadingCopyFee = true
    }
  }
}
</script>
