<template>
  <el-card shadow="hover" class="operation-fee">
    <div slot="header" class="clearfix">
      <span>{{ showType }}</span>
    </div>
    <el-table :key="payOrReceive" :data="finance_fee_array" fit max-height="500" border style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" fixed="left" />
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item v-if="payOrReceive === 'receive'" label="应收">
              <span>{{ scope.row.receivable }}</span>
            </el-form-item>
            <el-form-item v-else label="应付">
              <span>{{ scope.row.payable }}</span>
            </el-form-item>
            <el-form-item label="不含税金额">
              <span>{{ scope.row.not_tax_amount }}</span>
            </el-form-item>
            <el-form-item label="费用状态">
              <span>{{ scope.row.status }}</span>
            </el-form-item>
            <el-form-item label="D/N">
              <span>{{ scope.row.verify_status }}</span>
            </el-form-item>
            <el-form-item label="币种汇率">
              <span>{{ scope.row.finance_currency_rate }}</span>
            </el-form-item>
            <el-form-item label="账单号">
              <span>{{ scope.row.finance_statement_no }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="费用简称" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.name" filterable placeholder="请选择" size="small" clearable style="width: 100%" @change="financeNameChange($event,scope.$index)">
              <el-option v-for="item in fee_type_options" :key="parseInt(item.id)" :label="item.label" :value="item.name" />
            </el-select>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用名称" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.name_cn" size="small" />
          </template>
          <span v-else>{{ scope.row.name_cn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算方式" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.pay_type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in pay_type_options" :key="parseInt(item.id)" :label="item.name" :value="item.name" />
            </el-select>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="币种" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.finance_currency_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in finance_currency_options" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
            </el-select>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数/重量" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.quantity" size="small" type="number" @change="statisticsTotalAmount($event,scope.$index)" />
          </template>
          <span v-else>{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.unit_price" size="small" type="number" @change="statisticsTotalAmount($event,scope.$index)" />
          </template>
          <span v-else>{{ scope.row.unit_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用标签" width="150">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in financeTagOptions" :key="parseInt(item.id)" :label="item.name" :value="item.name" />
            </el-select>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算单位" width="150">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select
              v-model="scope.row.closing_unit_id"
              filterable
              remote
              placeholder="请选择"
              size="small"
              clearable
              :remote-method="remoteClosing"
              :loading="loadingClosing"
              style="width: 100%"
              @focus="getClosing"
            >
              <el-option
                v-for="item in closingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="税率" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.tax_rate" size="small" type="number" @change="statisticsTotalAmount($event,scope.$index)" />
          </template>
          <span v-else>{{ scope.row.tax_rate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="150">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.remarks" size="small" type="textarea" autosize maxlength="128" show-word-limit />
          </template>
          <span v-else>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column label="含税金额" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.tax_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.edit" type="primary" icon="el-icon-edit" size="mini" @click="editFee(scope.row,scope.$index,true)" />
          <el-button v-if="scope.row.edit" type="danger" icon="el-icon-close" size="mini" @click="editFee(scope.row,scope.$index,false)" />
          <el-button v-if="!scope.row.edit" type="danger" icon="el-icon-delete" size="mini" @click="deleteFee(scope.row,scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="addFee">新增</el-button>
      <el-button size="mini" type="success" icon="el-icon-check" :loading="updateLoading">保存</el-button>
      <el-button size="mini" type="danger" icon="el-icon-delete" :loading="deleteLoading">删除</el-button>
      <el-button size="mini" type="info" icon="el-icon-copy-document">复制</el-button>
      <el-button size="mini" type="info" icon="el-icon-warning">确定对账</el-button>
      <el-button size="mini" type="warning" icon="el-icon-s-check">提交审批</el-button>
      <el-button size="mini" type="warning" icon="el-icon-s-check">提交复核</el-button>
      <el-button size="mini" type="primary" icon="el-icon-share">导出</el-button>
    </el-row>
  </el-card>
</template>
<script>

import { financeFeePayOrReceive } from '@/utils/constant'
import { remoteCompany } from '@/api/select'
export default {
  name: 'OperationFee',
  props: {
    payOrReceive: {
      type: String,
      required: true
    },
    financeFeeArray: {
      type: Array,
      required: true
    },
    feeTypeOptions: {
      type: Array,
      required: true
    },
    financeCurrencyOptions: {
      type: Array,
      required: true
    },
    currencyRateOptions: {
      type: Array,
      required: true
    },
    payTypeOptions: {
      type: Array,
      required: true
    },
    financeTagOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      is_load_fee: false,
      deleteLoading: false,
      updateLoading: false,
      closingOptions: [],
      closing_unit: [],
      loadingClosing: false,
      fee_type_options: [],
      pay_type_options: [],
      finance_currency_options: [],
      currency_rate_options: [],
      multipleSelection: [],
      finance_fee_array: [],
      order_master_id: this.$route.params.id
    }
  },
  computed: {
    showType: function() {
      return financeFeePayOrReceive[this.payOrReceive]
    }
  },
  watch: {
    financeFeeArray: {
      immediate: true,
      handler(newVal) {
        this.initFeeData(newVal)
      }
    },
    feeTypeOptions: {
      immediate: true,
      handler(newVal) {
        if (newVal.length >= 1) {
          this.fee_type_options = newVal
        }
      }
    },
    financeCurrencyOptions: {
      immediate: true,
      handler(newVal) {
        if (newVal.length > 1) {
          this.finance_currency_options = newVal
        }
      }
    },
    payTypeOptions: {
      immediate: true,
      handler(newVal) {
        if (newVal.length > 0) {
          this.pay_type_options = newVal
        }
      }
    },
    financeTagOptions: {
      immediate: true,
      handler(newVal) { }
    },
    currencyRateOptions: {
      immediate: true,
      handler(newVal) {
        if (newVal.length >= 1) {
          this.currency_rate_options = newVal
        }
      }
    }
  },
  methods: {
    inputFee() {
      return {
        id: undefined,
        name: undefined,
        name_cn: undefined,
        name_en: undefined,
        pay_or_receive: undefined,
        pay_type_id: undefined,
        finance_currency_id: undefined,
        finance_currency_rate: undefined,
        quantity: 1,
        unit_price: 0.0,
        tax_rate: 0.0,
        tax_amount: undefined,
        receivable: undefined,
        payable: undefined,
        closing_unit_id: undefined,
        order_master_id: undefined,
        status: 'init',
        verify_status: 'init',
        type_id: undefined,
        not_tax_amount: undefined,
        remarks: undefined,
        finance_statement_no: undefined,
        edit: true
      }
    },
    addFee() {
      this.finance_fee_array.push(this.inputFee())
    },
    deleteFee(row, $index) {
    },
    editFee(row, $index, status) {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getClosing() {
      if (this.closing_unit.length > 0) {
        this.closingOptions = this.closing_unit
        return
      }
      this.remoteClosing('')
    },
    remoteClosing(query) {
      if (query !== '') {
        this.loadingClosing = true
        const result = this.closing_unit.filter(item => {
          return item.label.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
        if (result.length > 0) {
          this.loadingClosing = false
          this.closingOptions = result
          return
        }
      }
      remoteCompany(query, { company_type: [1, 2, 3] }).then((response) => {
        this.closingOptions = response
        if (query === '' || query === null) {
          this.closing_unit = response
        }
        this.loadingClosing = false
      })
    },
    initFeeData(newVal) {
      if (newVal.length >= 1) {
        this.finance_fee_array = newVal
      }
    },
    searchCurrencyRate(finance_currency_id) {
      const data = this.currency_rate_options.filter(item => {
        return item.finance_currency_id === finance_currency_id
      })
      if (data.length <= 0) {
        this.$message.error('未设置正确的币种汇率,请先设置币种汇率')
        return 0
      }
      return data[0].rate
    },
    financeNameChange(val, $index) {
      const data = this.fee_type_options.filter(item => {
        return item.name === val
      })
      if (data.length > 0) {
        const value = data[0]
        this.$set(this.finance_fee_array[$index], 'name_cn', value.name_cn)
        this.$set(this.finance_fee_array[$index], 'name_en', value.name_en)
        this.$set(this.finance_fee_array[$index], 'finance_currency_id', parseInt(value.finance_currency_id))
        this.$set(this.finance_fee_array[$index], 'finance_currency_rate', this.searchCurrencyRate(parseInt(value.finance_currency_id)))
      }
    },
    statisticsTotalAmount(val, $index) {
      const row = this.finance_fee_array[$index]
      const number = parseFloat(row.quantity)
      const unitPrice = parseFloat(row.unit_price)
      const taxRate = parseFloat(row.tax_rate)
      let taxAmount = number * unitPrice
      this.$set(this.finance_fee_array[$index], 'not_tax_amount', taxAmount.toFixed(4))
      if (taxRate > 0.0) {
        taxAmount = taxAmount + taxAmount * taxRate
      }
      taxAmount = taxAmount.toFixed(4)
      console.log(taxAmount)
      this.$set(this.finance_fee_array[$index], 'tax_amount', taxAmount)
      if (this.payOrReceive === 'pay') {
        this.$set(this.finance_fee_array[$index], 'payable', taxAmount)
      } else {
        this.$set(this.finance_fee_array[$index], 'receivable', taxAmount)
      }
    }
  }
}
</script>
<style lang="scss">
  .operation-fee{
    .el-card__header{
      padding: 10px 20px !important;
    }
    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }

</style>
