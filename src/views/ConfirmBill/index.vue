<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-radio-group v-model="listQuery.status" size="medium" style="margin-left: 5px;" @change="filterTable">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button v-for="item in statusList" :key="item.key" :label="item.key">{{ item.value }}</el-radio-button>
        </el-radio-group>
      </div>
      <el-form ref="listQuery" :model="listQuery" label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="结算单位" class="" size="medium">
              <el-select v-model="listQuery.closing_unit_id" filterable placeholder="请选择" size="medium" clearable :loading="loadingClosingUnit" @focus="getClosingUnit">
                <el-option v-for="item in closingUnitOptions" :key="item.value" :label="item.label" :value="parseInt(item.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="订单号" class="" size="medium">
              <el-select v-model="listQuery.order_master_id" filterable remote placeholder="请选择" size="medium" clearable :remote-method="searchOrderMaster" :loading="loadingOrderMaster" @focus="getOrderMaster">
                <el-option v-for="item in orderMasterOptions" :key="item.id" :label="item.serial_number" :value="parseInt(item.id)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="币种" class="" size="medium">
              <el-select v-model="listQuery.finance_currency_id" filterable placeholder="请选择" size="medium" clearable @focus="getFinanceCurrency">
                <el-option v-for="item in financeCurrencyOptions" :key="item.id" :label="item.name" :value="parseInt(item.id)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="业务员" class="" size="medium">
              <el-select v-model="listQuery.salesman_id" filterable placeholder="请选择" size="medium" clearable @focus="getUser">
                <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="操作员" class="" size="medium">
              <el-select v-model="listQuery.operation_id" filterable placeholder="请选择" size="medium" clearable @focus="getUser">
                <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="收支" size="medium">
              <el-select v-model="listQuery.pay_or_receive" filterable placeholder="请选择" size="medium" clearable>
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="主单号" class="" size="medium">
              <el-input v-model="listQuery.mbl_so" type="text" placeholder="支持模糊查询" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="费用简称" class="" size="medium">
              <el-input v-model="listQuery.name" type="text" placeholder="支持模糊查询" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="费用创建时间" prop="created_at">
              <el-date-picker v-model="tmp_created_at" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="订单创建时间" prop="created_at">
              <el-date-picker v-model="tmp_order_master_created_at" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="离港日期" prop="created_at">
              <el-date-picker v-model="tmp_departure" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="到港日期" prop="created_at">
              <el-date-picker v-model="tmp_arrival" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" style="text-align: center;">
            <el-button v-waves type="primary" icon="el-icon-search" size="medium" @click="filterTable">搜索</el-button>
            <el-button type="danger" icon="el-icon-close" size="medium" @click="clearFilter">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="">
        <el-row>
          <el-col :span="8">
            <el-radio-group v-model="listQuery['pay_or_receive_status']" size="small" style="margin-left: 5px;" @change="filterTable">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button v-for="item in payOrReceiveList" :key="item.key" :label="item.key">{{ item.value }}</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="16">
            <div style="float: right;">
              <el-button v-if="listQuery.status === 'init' || listQuery.status === 'dismiss'" type="primary" size="mini" icon="el-icon-s-operation" :loading="loadingChangeStatus" @click="submitVerify">确定对账</el-button>
              <el-button type="warning" size="mini" icon="el-icon-s-operation">导出账单</el-button>
              <el-button type="warning" size="mini" icon="el-icon-s-operation">导出对账单</el-button>
              <el-button v-if="skip_approve === 'false'" type="danger" size="mini" icon="el-icon-s-operation">提交审核</el-button>
              <el-button v-if="skip_audit === 'false'" type="danger" size="mini" icon="el-icon-s-operation">提交复核</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div :gutter="10">
        <keep-alive><unfixed-thead v-model="columnArray" :local-key="columnUrl" :columns="columnArray" /></keep-alive>
        <keep-alive><export-excel :multiple-selection="multipleSelection" :local-key="columnUrl" /></keep-alive>
      </div>
      <el-table
        key="confirm_bill_table"
        v-loading="listLoading"
        :data="lists"
        fit
        max-height="1200"
        border
        stripe
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%;margin-top: 20px;"
        @selection-change="handleSelectionChange"
        @row-dblclick="rowDblclick"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column type="index" />
        <el-table-column v-for="column in columnArray" :key="column['data']" :prop="column['data']" :label="column['title']" width="150" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="filterTable" />
    </el-card>
  </div>
</template>
<script>
import { getData, createData } from '@/api/index_data'
import { getColumn, localColumn } from '@/api/column'
import waves from '@/directive/waves' // waves directive
import UnfixedThead from '@/components/UnfixedThead'
import ExportExcel from '@/components/ExportExcel'
import Pagination from '@/components/Pagination'
import { dateRangeArrayToStr, payOrReceiveOptions } from '@/utils'

import { remoteCompany, remoteOrderMaster, remoteEmployee, remoteBaseCode } from '@/api/select'
export default {
  name: 'ConfirmBill',
  components: { UnfixedThead, ExportExcel, Pagination },
  directives: { waves },
  data() {
    return {
      typeOptions: payOrReceiveOptions,
      loadingChangeStatus: false,
      total: 0,
      page: 1,
      limit: 20,
      listLoading: false,
      lists: [],
      columnArray: [],
      columnUrl: '/finance/fees/column',
      multipleSelection: [],
      skip_audit: this.$store.state.user.systemSetting['system_finance_audit'],
      skip_approve: this.$store.state.user.systemSetting['system_finance_approve'],
      tmp_created_at: '',
      tmp_departure: '',
      tmp_arrival: '',
      tmp_order_master_created_at: '',
      listQuery: {
        status: '',
        created_at: undefined,
        departure: undefined,
        arrival: undefined,
        order_masters_created_at: undefined,
        pay_or_receive_status: '',
        closing_unit_id: undefined,
        order_master_id: undefined,
        finance_currency_id: undefined,
        salesman_id: undefined,
        operation_id: undefined,
        pay_or_receive: undefined,
        mbl_so: undefined,
        name: undefined
      },
      closingUnitOptions: [],
      orderMasterOptions: [],
      orderMasterData: [],
      financeCurrencyOptions: [],
      userOptions: [],
      loadingClosingUnit: false,
      loadingOrderMaster: false
    }
  },
  computed: {
    statusList: function() {
      return [
        { key: 'init', value: '未对账' },
        { key: 'dismiss', value: '已驳回' },
        { key: 'verify', value: '已对账' }
      ]
    },
    payOrReceiveList: function() {
      return [
        { key: 'receivable', value: '未收' },
        { key: 'payable', value: '未付' },
        { key: 'received', value: '实收' },
        { key: 'paid', value: '实付' }
      ]
    }
  },
  created() {
    this.fetchColumn()
    this.filterTable()
  },
  methods: {
    fetchColumn() {
      const data = localColumn(this.columnUrl)
      if (data.length === 0) {
        getColumn(this.columnUrl).then(response => {
          this.columnArray = response
        }).catch(error => {
          this.$message({ showClose: true, message: error, type: 'error' })
        })
      } else {
        this.columnArray = data
      }
    },
    filterTable() {
      this.listLoading = true
      this.listQuery['created_at'] = dateRangeArrayToStr(this.tmp_created_at)
      this.listQuery['departure'] = dateRangeArrayToStr(this.tmp_departure)
      this.listQuery['arrival'] = dateRangeArrayToStr(this.tmp_arrival)
      if (this.listQuery.closing_unit_id === '') {
        this.listQuery.closing_unit_id = undefined
      }
      if (this.listQuery.order_master_id === '') {
        this.listQuery.order_master_id = undefined
      }
      if (this.listQuery.salesman_id === '') {
        this.listQuery.salesman_id = undefined
      }
      if (this.listQuery.operation_id === '') {
        this.listQuery.operation_id = undefined
      }
      if (this.listQuery.finance_currency_id === '') {
        this.listQuery.finance_currency_id = undefined
      }
      this.listQuery['order_masters_created_at'] = dateRangeArrayToStr(this.tmp_order_master_created_at)
      const searchQuery = JSON.parse(JSON.stringify(this.listQuery))
      getData('/finance/fees/GetConfirmBillList', { page: this.page, limit: this.limit }, 'post', searchQuery).then(response => {
        let total = response.total
        let data = response.data
        if (!Array.isArray(data)) { data = [] }
        if (typeof (total) === 'undefined') { total = 0 }
        this.total = total
        this.lists = data
        setTimeout(() => {
          this.listLoading = false
        }, 200)
      }).catch(error => {
        console.log(error)
      })
    },
    getClosingUnit() {
      if (this.closingUnitOptions.length > 0) {
        return
      }
      this.loadingClosingUnit = true
      remoteCompany('', { company_type: [1, 2, 3] }).then((response) => {
        this.closingUnitOptions = response
        this.loadingClosingUnit = false
      }).catch((reason) => {
        console.log(reason)
      })
    },
    getOrderMaster() {
      if (this.orderMasterData.length >= 1) {
        this.orderMasterOptions = this.orderMasterData
        return
      }
      this.searchOrderMaster('')
    },
    searchOrderMaster(query) {
      if (query !== '') {
        this.loadingOrderMaster = true
        const result = this.orderMasterData.filter(item => {
          return item.serial_number.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
        if (result.length > 0) {
          this.loadingOrderMaster = false
          this.orderMasterOptions = result
          return
        }
      }
      remoteOrderMaster(query).then((response) => {
        this.orderMasterOptions = response
        if (query === '' || query === null) {
          this.orderMasterData = response
        }
        this.loadingOrderMaster = false
      }).catch((reason) => {
        console.log(reason)
      })
    },
    getFinanceCurrency() {
      if (this.financeCurrencyOptions.length > 0) {
        return
      }
      remoteBaseCode().then((response) => {
        this.financeCurrencyOptions = response
        console.log(response)
      }).catch((reason) => {
      })
    },
    getUser() {
      if (this.userOptions.length > 0) {
        return
      }
      remoteEmployee('', { }).then((response) => {
        this.userOptions = response
      }).catch((reason) => {
        console.log(reason)
      })
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    rowDblclick() {
    },
    clearFilter() {
      this.tmp_created_at = ''
      this.tmp_departure = ''
      this.tmp_arrival = ''
      this.tmp_order_master_created_at = ''
      this.listQuery = {
        status: '',
        created_at: undefined,
        departure: undefined,
        arrival: undefined,
        order_masters_created_at: undefined,
        pay_or_receive_status: '',
        closing_unit_id: undefined,
        order_master_id: undefined,
        finance_currency_id: undefined,
        salesman_id: undefined,
        operation_id: undefined,
        pay_or_receive: undefined,
        mbl_so: undefined,
        name: undefined
      }
      this.filterTable()
    },
    submitVerify() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('未选择要提交的记录')
        return
      }
      if (!(['init', 'dismiss'].indexOf(this.listQuery.status) > -1)) {
        this.$message.error('只能对未提交和已驳回的费用进行提交对账')
        return
      }
      const ids = this.multipleSelection.map((item) => { return item.id })
      this.loadingChangeStatus = true
      createData('/finance/fees/ChangeStatus?status=verify', { ids: ids }).then(response => {
        this.$notify({
          title: 'Success',
          message: '操作成功',
          type: 'success',
          duration: 5000
        })
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.lists.splice(this.lists.findIndex(item => item.id === this.multipleSelection[i].id), 1)
        }
        this.loadingChangeStatus = false
      }).catch(reason => {
        this.loadingChangeStatus = false
      })
    }
  }
}
</script>
