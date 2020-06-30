<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-row>
        <el-col :span="12">
          <el-input v-model="serial_number" placeholder="可根据订单号模糊查询" class="filter-item" size="medium" clearable />
        </el-col>
      </el-row>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="orderMasters"
      fit
      max-height="600"
      border
      stripe
      highlight-current-row
      tooltip-effect="dark"
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" fixed="left" />
      <el-table-column prop="serial_number" label="订单号" width="120" />
      <el-table-column prop="transport_type" label="运输方式" width="120" />
      <el-table-column prop="instruction_id" label="委托单位" width="120" />
      <el-table-column prop="operation_id" label="操作员" width="120" />
      <el-table-column prop="salesman_id" label="业务员" width="120" />
      <el-table-column prop="supply_agent_id" label="订舱代理" width="120" />
      <el-table-column prop="carrier" label="承运方" width="120" />
      <el-table-column prop="pol_id" label="起运港" width="120" />
      <el-table-column prop="pod_id" label="目的港" width="120" />
      <el-table-column prop="start_date" label="离港日期" width="120" />
      <el-table-column prop="end_date" label="到港日期" width="120" />
      <el-table-column prop="cap_list" label="货量信息" width="120" />
    </el-table>
  </el-card>
</template>
<script>
import { getData } from '@/api/index_data'
export default {
  name: 'OrderTable',
  props: {
    searchParams: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      orderMasters: [],
      listLoading: false,
      tableKey: 'order_master',
      serial_number: undefined,
      listQuery: []
    }
  },
  created() {
    this.listQuery = this.searchParams
    this.initData()
    console.log(this.searchParams)
  },
  methods: {
    initData() {
      if (typeof (this.serial_number !== 'undefined') && this.serial_number !== '') {
        this.listQuery['serial_number'] = this.serial_number
      }
      getData('/order/masters/data', this.listQuery).then(response => {
        this.orderMasters = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 200)
      }).catch(error => {
        console.log(error)
      })
    },
    handleSelectionChange(val) {
      const ids = val.map((item) => { return item.id })
      this.$emit('listenOrderIds', ids)
    }
  }
}
</script>
