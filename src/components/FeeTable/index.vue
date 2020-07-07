<template>
  <el-table
    :key="tableKey"
    v-loading="listLoading"
    :data="feeList"
    fit
    border
    stripe
    highlight-current-row
    tooltip-effect="dark"
    style="width: 100%;"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" fixed="left" />
    <el-table-column prop="pay_or_receive" label="收支" width="120">
      <template slot-scope="scope">
        <span>{{ scope.row.pay_or_receive === 'pay' ? '支出' : '收入' }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="费用简称" width="120" />
    <el-table-column prop="name_en" label="费用名称" width="180" />
    <el-table-column prop="name_en" label="费用英文名称" width="180" />
    <el-table-column prop="finance_currency_id" label="币种" width="80" />
    <el-table-column prop="finance_currency_rate" label="币种汇率" />
    <el-table-column prop="quantity" label="数/重量" width="120" />
    <el-table-column prop="unit_price" label="单价" width="120" />
    <el-table-column prop="tax_amount" label="含税金额" width="120" />
    <el-table-column prop="pay_type_id" label="结算方式" />
    <el-table-column prop="type_id" label="费用标签" />
  </el-table>
</template>
<script>
export default {
  name: 'FeeTable',
  props: {
    feeList: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      tableKey: 'fee-table',
      listLoading: false
    }
  },
  watch: {
    feeList: {
      immediate: true,
      handler(newVal) {

      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      const ids = val.map((item) => { return item.id })
      this.$emit('listenFeeIds', ids)
    }
  }
}
</script>
