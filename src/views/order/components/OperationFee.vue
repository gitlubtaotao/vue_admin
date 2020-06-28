<template>
  <el-card shadow="hover" class="operation-fee">
    <div slot="header" class="clearfix">
      <span>{{ showType }}</span>
    </div>
    <el-table ref="multipleTable" :key="payOrReceive" :data="finance_fee_array" fit max-height="500" border style="width: 100%;" @selection-change="handleSelectionChange">
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
              <span>{{ showStatus(scope.row.status) }}</span>
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
              <el-option v-for="item in pay_type_options" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
            </el-select>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="币种" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.finance_currency_id" filterable placeholder="请选择" size="small" clearable style="width: 100%" @change="financeCurrencyChange($event,scope.$index)">
              <el-option v-for="item in finance_currency_options" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
            </el-select>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数/重量" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.quantity" size="small" type="number" :min="0" @change="statisticsTotalAmount($event,scope.$index)" />
          </template>
          <span v-else>{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.unit_price" size="small" type="number" :min="0" @change="statisticsTotalAmount($event,scope.$index)" />
          </template>
          <span v-else>{{ scope.row.unit_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用标签" width="150">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in financeTagOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
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
      <el-table-column label="含税金额" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.tax_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 'init' || scope.row.status === 'dismiss' ">
            <el-button v-if="!scope.row.edit" type="primary" icon="el-icon-edit" size="mini" @click="editFee(scope.row,scope.$index,true)" />
            <el-button v-if="scope.row.edit" type="danger" icon="el-icon-close" size="mini" @click="editFee(scope.row,scope.$index,false)" />
            <el-button v-if="!scope.row.edit" type="danger" icon="el-icon-delete" size="mini" @click="deleteFee(scope.row,scope.$index)" />
          </div>
          <div v-else style="text-align: center;">
            <i class="el-icon-lock" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="addFee">新增</el-button>
      <el-button size="mini" type="success" icon="el-icon-check" :loading="updateLoading" @click="saveFee('',true)">保存</el-button>
      <el-button size="mini" type="danger" icon="el-icon-delete" :loading="deleteLoading" @click="deleteFee('','')">删除</el-button>
      <el-dropdown size="mini" type="info" @command="handleCommand">
        <el-button size="mini" type="info">
          <i class="el-icon-copy-document" /> 复制
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="payOrReceive === 'receive'" command="copyFee">复制到支出</el-dropdown-item>
          <el-dropdown-item v-else command="copyFee">复制到收入</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button size="mini" type="info" icon="el-icon-warning" @click="submitVerify">确定对账</el-button>
      <el-button v-if="$store.state.orderMaster.systemFinanceApprove === 'false'" size="mini" type="warning" icon="el-icon-s-check">提交审批</el-button>
      <el-button v-if="$store.state.orderMaster.systemFinanceAudit === 'false'" size="mini" type="warning" icon="el-icon-s-check">提交复核</el-button>
      <el-button size="mini" type="primary" icon="el-icon-share">导出</el-button>
    </el-row>
  </el-card>
</template>
<script>

import { financeFeePayOrReceive, financeFeeStatus } from '@/utils/constant'
import { remoteCompany } from '@/api/select'
import { createData } from '@/api/index_data'

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
    },
    closingUnitOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      system_standard_currency: this.$store.getters.systemSetting.system_standard_currency,
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
      order_master_id: parseInt(this.$route.params.id)
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
    },
    closingUnitOptions: {
      immediate: true,
      handler(newVal) {
        if (newVal.length >= 1) {
          this.closingOptions = newVal
          this.closing_unit = newVal
        }
      }
    }
  },
  methods: {
    showStatus(status) {
      return financeFeeStatus[status]
    },
    inputFee() {
      return {
        id: 0,
        name: undefined,
        name_cn: undefined,
        name_en: undefined,
        pay_or_receive: this.payOrReceive,
        pay_type_id: 0,
        finance_currency_id: undefined,
        finance_currency_rate: undefined,
        quantity: 1,
        unit_price: 0.0,
        tax_rate: 0.0,
        tax_amount: 0.0,
        receivable: 0.0,
        payable: 0.0,
        closing_unit_id: undefined,
        order_master_id: parseInt(this.$route.params.id),
        status: 'init',
        type_id: 0,
        not_tax_amount: 0.0,
        remarks: undefined,
        finance_statement_no: undefined,
        edit: true
      }
    },
    addFee() {
      const temp = this.inputFee()
      temp.pay_or_receive = this.payOrReceive
      if (this.payOrReceive === 'receive') {
        temp.closing_unit_id = parseInt(this.$store.state.orderMaster.receiveClosingUnitId)
      } else {
        temp.closing_unit_id = parseInt(this.$store.state.orderMaster.payClosingUnitId)
      }
      this.finance_fee_array.unshift(temp)
      this.toggleSelection([temp])
    },
    saveFee(data, callback) {
      const saveData = []
      if (data === '') {
        data = this.multipleSelection
      }
      if (data.length < 1) {
        this.$message.error('请选择要提交的记录')
        return
      }
      for (let index = 0; index < data.length; index++) {
        const item = data[index]
        if (item.name === '' || typeof (item.name) === 'undefined') {
          this.$message.error('行' + index.toString() + '费用简称不能为空')
          return
        }
        item.quantity = parseFloat(item.quantity)
        if (item.quantity < 0 || typeof (item.quantity) === 'undefined') {
          this.$message.error('行' + index.toString() + '数/重量不能小于0')
          return
        }
        item.unit_price = parseFloat(item.unit_price)
        item.tax_amount = parseFloat(item.tax_amount)
        item.not_tax_amount = parseFloat(item.not_tax_amount)
        item.payable = parseFloat(item.payable)
        item.receivable = parseFloat(item.receivable)
        item.tax_rate = parseFloat(item.tax_rate)
        if (item.unit_price < 0 || typeof (item.unit_price) === 'undefined') {
          this.$message.error('行' + index.toString() + '单价不能小于0')
          return false
        }
        if (item.finance_currency_id === 0 || typeof (item.finance_currency_id) === 'undefined') {
          this.$message.error('行' + index.toString() + '币种不能为空')
          return false
        }
        if (item.closing_unit_id === 0 || typeof (item.closing_unit_id) === 'undefined') {
          this.$message.error('行' + index.toString() + '结算单位不能为空')
          return false
        }
        if (item.finance_currency_rate === 0) {
          this.$message.error('行' + index.toString() + '币种汇率不能为空')
          return false
        }
        saveData.push(item)
      }
      this.updateLoading = true
      createData('/finance/fees/create', saveData, 'post').then((response) => {
        this.$notify({
          title: 'Success',
          message: '保存数据成功',
          type: 'success',
          duration: 5000
        })
        if (callback) {
          this.handleUpdateData(response.data)
        } else {
          this.dynamicHandlerData(data)
        }
        this.updateLoading = false
      }).then((reason) => {
        this.updateLoading = false
      })
      this.multipleSelection.forEach(a => {
        if (a.id !== 0) {
          a.edit = false
        }
      })
    },
    deleteFee(row, $index) {
      const self = this
      let rows = []
      if (row === '') {
        rows = this.multipleSelection
      } else {
        rows = [row]
      }
      this.beforeCheck(rows, function(rows) {
        self.deleteLoading = true
        const ids = []
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].status !== 'init' && rows[i].status !== 'pending') {
            self.$message.error('只能删除未提交或者已驳回的费用')
            return false
          }
          self.finance_fee_array.splice(self.finance_fee_array.indexOf(rows[i]), 1)
          ids.push(rows[i].id)
        }
        if (ids.length >= 1) {
          createData('/finance/fees/DeleteFee', { ids: ids }, 'post').then((response) => {
            console.log(self)
            self.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 5000
            })
            self.deleteLoading = false
          }).catch(reason => {
            console.log(reason)
          })
        }
      })
    },
    submitVerify() {
      const self = this
      this.beforeCheck(this.multipleSelection, function(rows) {
        const ids = []
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].status !== 'init' && rows[i].status !== 'dismiss') {
            self.$message.error('只能对未提交或者已驳回的费用进行确认对账')
            return
          }
          self.$set(self.finance_fee_array[i], 'status', 'verify')
          ids.push(rows[i].id)
        }
        if (ids.length >= 1) {
          createData('/finance/fees/ChangeStatus?status=verify', { ids: ids }, 'post').then((response) => {
            self.$notify({
              title: 'Success',
              message: '更新状态成功',
              type: 'success',
              duration: 5000
            })
            self.deleteLoading = false
          }).catch(reason => {
            console.log(reason)
          })
        }
      })
    },
    beforeCheck(rows, callback) {
      if (rows.length <= 0) {
        this.$message.warning('请先未勾选记录')
        return
      }
      this.$confirm('是否继续执行此操作, ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        callback(rows)
      }).catch(() => {
      })
    },
    editFee(row, $index, status) {
      if (!status) {
        if (row['id'] === '' || typeof (row['id']) === 'undefined' || row['id'] === 0) {
          this.finance_fee_array.splice($index, 1)
        } else {
          this.$set(this.finance_fee_array[$index], 'edit', status)
        }
      } else {
        this.$set(this.finance_fee_array[$index], 'edit', status)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleUpdateData(data) {
      const result = this.finance_fee_array.filter(function(el) {
        return el.id !== 0
      })
      if (data !== null && typeof (data) !== 'undefined') {
        this.finance_fee_array = result.concat(data)
      }
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
      }).catch((reason) => {
        console.log(reason)
      })
    },
    initFeeData(newVal) {
      if (newVal.length >= 1) {
        this.finance_fee_array = newVal
      }
    },
    searchCurrencyRate(finance_currency_id) {
      if (parseInt(this.system_standard_currency) === finance_currency_id) {
        return 1
      }
      const data = this.currency_rate_options.filter(item => {
        return item.finance_currency_id === finance_currency_id
      })
      if (data.length <= 0) {
        this.$message.error('未设置正确的币种汇率,请先设置币种汇率')
        return 0
      }
      return data[0].rate
    },
    financeCurrencyChange(val, $index) {
      this.$set(this.finance_fee_array[$index], 'finance_currency_rate', this.searchCurrencyRate(parseInt(val)))
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
      this.$set(this.finance_fee_array[$index], 'tax_amount', taxAmount)
      if (this.payOrReceive === 'pay') {
        this.$set(this.finance_fee_array[$index], 'payable', taxAmount)
      } else {
        this.$set(this.finance_fee_array[$index], 'receivable', taxAmount)
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleCommand(command) {
      if (command === 'copyFee') {
        this.copyFee()
      }
    },
    copyFee() {
      const copyData = []
      if (this.multipleSelection.length === 0) {
        this.$message.error('未选择记录')
        return false
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].id === 0) {
          this.$message.error('请先保存记录')
          return false
        }
        copyData.push(this.handleCopyFee(this.multipleSelection[i]))
      }
      this.saveFee(copyData, false)
    },
    dynamicHandlerData(data) {
      this.$emit('changeFeeArray', data, this.payOrReceive)
    },
    handleCopyFee(data) {
      return {
        id: 0,
        name: data.name,
        name_cn: data.name_cn,
        name_en: data.name_en,
        pay_or_receive: (this.payOrReceive === 'pay' ? 'receive' : 'pay'),
        pay_type_id: data.pay_type_id,
        finance_currency_id: data.finance_currency_id,
        finance_currency_rate: data.finance_currency_rate,
        quantity: data.quantity,
        unit_price: data.unit_price,
        tax_rate: data.tax_rate,
        tax_amount: data.tax_amount,
        receivable: (this.payOrReceive === 'pay' ? data.payable : 0),
        payable: (this.payOrReceive === 'receive' ? data.receivable : 0),
        closing_unit_id: data.closing_unit_id,
        order_master_id: parseInt(this.$route.params.id),
        status: 'init',
        type_id: data.type_id,
        not_tax_amount: data.not_tax_amount,
        remarks: data.remarks,
        finance_statement_no: undefined
      }
    }
  }
}
</script>
<style lang="scss">
  .operation-fee{
    .el-dropdown{
      margin: 0 10px;
    }
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
