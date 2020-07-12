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
              <el-select v-model="listQuery['closing_unit_id-eq']" filterable placeholder="请选择" size="medium" clearable @focus="getClosingUnit">
                <el-option v-for="item in closingUnitOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="订单号" class="" size="medium">
              <el-select v-model="listQuery['order_master-id-eq']" filterable remote placeholder="请选择" size="medium" clearable :loading="loadingOrderMaster" @focus="getOrderMaster">
                <el-option v-for="item in orderMasterOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="币种" class="" size="medium">
              <el-select v-model="listQuery['finance_currency_id-eq']" filterable placeholder="请选择" size="medium" clearable @focus="getFinanceCurrency">
                <el-option v-for="item in financeCurrencyOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="业务员" class="" size="medium">
              <el-select v-model="listQuery['salesman_id-eq']" filterable placeholder="请选择" size="medium" clearable @focus="getUser">
                <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="操作员" class="" size="medium">
              <el-select v-model="listQuery['operation_id-eq']" filterable placeholder="请选择" size="medium" clearable @focus="getUser">
                <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="收支" size="medium">
              <el-select v-model="listQuery['pay_or_receive-eq']" filterable placeholder="请选择" size="medium" clearable>
                <el-option v-for="item in payOrReceiveOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="主单号" class="" size="medium">
              <el-input v-model="listQuery['mbl_so-rCount']" type="text" placeholder="支持模糊查询" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="费用简称" class="" size="medium">
              <el-input v-model="listQuery['name-rCount']" type="text" placeholder="支持模糊查询" />
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
              <el-date-picker v-model="tmp_arrival" type="daterange" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" style="text-align: center;">
            <el-button v-waves type="primary" icon="el-icon-search" size="medium" @click="filterTable">搜索</el-button>
            <el-button type="danger" icon="el-icon-close" size="medium">取消</el-button>
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
              <el-button type="primary" size="mini" icon="el-icon-s-operation">确定对账</el-button>
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
import { getData } from '@/api/index_data'
import { getColumn, localColumn } from '@/api/column'
import waves from '@/directive/waves' // waves directive
import UnfixedThead from '@/components/UnfixedThead'
import ExportExcel from '@/components/ExportExcel'
import Pagination from '@/components/Pagination'
import { dateRangeArrayToStr } from '@/utils'
export default {
  name: 'ConfirmBill',
  components: { UnfixedThead, ExportExcel, Pagination },
  directives: { waves },
  data() {
    return {
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
        'finance_fees.created_at': undefined,
        'order_extend_infos.departure': undefined,
        'order_extend_infos.arrival': undefined,
        'order_masters.created_at': undefined,
        pay_or_receive_status: '',
        'closing_unit_id-eq': undefined,
        'order_master-id-eq': undefined,
        'finance_currency_id-eq': undefined,
        'salesman_id-eq': undefined,
        'operation_id-eq': undefined,
        'pay_or_receive-eq': undefined,
        'mbl_so-rCount': undefined,
        'name-rCount': undefined
      },
      closingUnitOptions: [],
      orderMasterOptions: [],
      financeCurrencyOptions: [],
      userOptions: [],
      payOrReceiveOptions: [],
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
      console.log(this.listQuery)
      this.listQuery['finance_fees.created_at'] = dateRangeArrayToStr(this.tmp_created_at)
      this.listQuery['order_extend_infos.departure'] = dateRangeArrayToStr(this.tmp_departure)
      this.listQuery['order_extend_infos.arrival'] = dateRangeArrayToStr(this.tmp_arrival)
      this.listQuery['order_masters.created_at'] = dateRangeArrayToStr(this.tmp_order_master_created_at)
      getData('/finance/fees/GetConfirmBillList', { page: this.page, limit: this.limit }, 'post', this.listQuery).then(response => {
        console.log(response)
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
    getClosingUnit() { },
    getOrderMaster() { },
    getFinanceCurrency() { },
    getUser() { },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    rowDblclick() {
    }
  }
}
</script>
