<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="">
        <el-radio-group v-model="listQuery['transport_type-eq']" size="medium" style="margin-left: 5px;" @change="filterTable">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button v-for="item in transportOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
        </el-radio-group>
        <div style="float: right">
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" size="small" @click="handleCreate('normal')">新增订单</el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" size="small" @click="handleCreate('make_up')">补录订单</el-button>
        </div>
      </div>
      <el-form ref="listQuery" :model="listQuery" label-width="100px">
        <el-row :gutter="12">
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item label="订单号" class="">
              <el-input v-model="listQuery['serial_number-rCount']" placeholder="支持模糊查询" class="filter-item" size="medium" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="委托单位" class="">
              <el-select v-model="listQuery['instruction_id-eq']" filterable placeholder="请选择" size="medium" clearable :loading="loadingInstruction" @focus="getInstruction">
                <el-option v-for="item in companyInstructionOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="订舱代理" class="">
              <el-select v-model="listQuery['supply_agent_id-eq']" filterable placeholder="请选择" size="medium" clearable :loading="loadingSupply" @focus="getSupply">
                <el-option v-for="item in supplyOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="业务员" class="">
              <el-select v-model="listQuery['salesman_id-eq']" filterable remote placeholder="请选择" size="medium" clearable :loading="loadingUser" @focus="getUser">
                <el-option v-for="item in userOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="操作员" class="">
              <el-select v-model="listQuery['operation_id-eq']" filterable remote placeholder="请选择" size="medium" clearable :loading="loadingUser" @focus="getUser()">
                <el-option v-for="item in userOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="主单号" class="">
              <el-input v-model="listQuery['mbl_so-rCount']" placeholder="支持模糊查询" class="filter-item" size="medium" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="So No." class="">
              <el-input v-model="listQuery['so_no-rCount']" placeholder="支持模糊查询" class="filter-item" size="medium" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="应收状态" class="">
              <el-select v-model="listQuery['receivable_status-eq']" filterable placeholder="请选择" size="medium" clearable>
                <el-option v-for="item in ableStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="收款状态" class="">
              <el-select v-model="listQuery['received_status-eq']" filterable placeholder="请选择" size="medium" clearable>
                <el-option v-for="item in edStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="应付状态" class="">
              <el-select v-model="listQuery['payable_status-eq']" filterable placeholder="请选择" size="medium" clearable>
                <el-option v-for="item in ableStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="付款状态" class="">
              <el-select v-model="listQuery['paid_status-eq']" filterable placeholder="请选择" size="medium" clearable>
                <el-option v-for="item in edStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="创建时间" prop="created_at">
              <el-date-picker v-model="tmp_created_at" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="离港日期" prop="created_at">
              <el-date-picker v-model="tmp_departure" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="离港日期" prop="created_at">
              <el-date-picker v-model="tmp_arrival" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-collapse>
          <el-collapse-item v-if="listQuery.transport_type === 1 || listQuery.transport_type === 4 " name="1">
            <template slot="title">
              <el-button type="primary" size="mini">更多</el-button>
            </template>
            <el-row>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="船公司" class="">
                  <el-select v-model="listQuery['carrier_id-eq']" filterable placeholder="船公司" size="medium" clearable>
                    <el-option v-for="item in BoatCompanyOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="起运港" class="">
                  <el-select v-model="listQuery['pol_id-eq']" filterable placeholder="起运港" size="medium" clearable>
                    <el-option v-for="item in SeaPortOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="目的港" class="">
                  <el-select v-model="listQuery['pod_id-eq']" filterable placeholder="目的港" size="medium" clearable>
                    <el-option v-for="item in SeaPortOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12">
                <el-form-item label="截关/截港" prop="created_at">
                  <el-date-picker v-model="tmp_cut_off_day" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item v-if="listQuery.transport_type === 2" name="2">
            <template slot="title">
              <el-button type="primary" size="mini">更多</el-button>
            </template>
            <el-row>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="航空公司" class="">
                  <el-select v-model="listQuery['carrier_id-eq']" filterable placeholder="航空公司" size="medium" clearable>
                    <el-option v-for="item in CodeOfTwoOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="起运港" class="">
                  <el-select v-model="listQuery['pol_id-eq']" filterable placeholder="起运港" size="medium" clearable>
                    <el-option v-for="item in AirPortOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="目的港" class="">
                  <el-select v-model="listQuery['pod_id-eq']" filterable placeholder="目的港" size="medium" clearable>
                    <el-option v-for="item in AirPortOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="航班号" class="">
                  <el-input v-model="listQuery['flight_no-rCount']" placeholder="支持模糊查询" class="filter-item" size="medium" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item v-if="listQuery.transport_type === 5" name="5">
            <template slot="title">
              <el-button type="primary" size="mini">更多</el-button>
            </template>
            <el-row>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="快递公司" class="">
                  <el-select v-model="listQuery['courier_code_id-eq']" filterable placeholder="航空公司" size="medium" clearable>
                    <el-option v-for="item in CourierOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="快递单号" class="">
                  <el-input v-model="listQuery['courier_no-rCount']" placeholder="快递单号" class="filter-item" size="medium" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-row style="margin-top: 10px;">
          <el-col :xs="24" :sm="12" :md="24" :lg="24" style="text-align: center;">
            <el-button v-waves type="primary" icon="el-icon-search" size="medium" @click="filterTable">搜索</el-button>
            <el-button type="danger" icon="el-icon-close" size="medium">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="">
        <el-radio-group v-model="listQuery['status-eq']" size="small" style="margin-left: 5px;" @change="filterTable">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button v-for="item in statusOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
        </el-radio-group>
      </div>
      <keep-alive>
        <master-index :lists="lists" :list-loading="listLoading" @listenToIndex="updateOrder" />
      </keep-alive>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="filterTable" />
    </el-card>
    <keep-alive>
      <master-form :make-up-order="makeUpOrder" :dialog-form-visible="dialogFormVisible" :dialog-status="dialogStatus" :record="record" @listenFormVisible="listenFormVisible" />
    </keep-alive>
  </div>
</template>
<script>
import MasterForm from '../components/MasterForm'
import MasterIndex from '../components/MasterIndex'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getData } from '@/api/index_data'
import { transportTypeOptions } from '@/api/order_master'
import { dateRangeArrayToStr } from '@/utils'
import { remoteCompany, getSelectApi } from '@/api/select'
export default {
  name: 'OrderMaster',
  components: { MasterIndex, MasterForm, Pagination },
  directives: { waves },
  data() {
    return {
      tmp_created_at: '',
      tmp_departure: '',
      tmp_arrival: '',
      tmp_cut_off_day: '',
      total: 0,
      limit: 20,
      page: 1,
      listQuery: {
        'status-eq': '',
        'transport_type-eq': '',
        'serial_number-rCount': undefined,
        'instruction_id-eq': undefined,
        'supply_agent_id-eq': undefined,
        'salesman_id-eq': undefined,
        'operation_id-eq': undefined,
        'mbl_so-rCount': undefined,
        'so_no-rCount': undefined,
        'payable_status-eq': undefined,
        'paid_status-eq': undefined,
        'receivable_status-eq': undefined,
        'received_status-eq': undefined,
        departure: undefined,
        arrival: undefined,
        created_at: undefined,
        'carrier_id-eq': undefined,
        'pol_id-eq': undefined,
        'pod_id-eq': undefined,
        cut_off_day: undefined,
        'courier_code_id-eq': undefined,
        'flight_no-rCount': undefined,
        'courier_no-rCount': undefined
      },
      makeUpOrder: false,
      dialogStatus: 'create',
      dialogFormVisible: false,
      loadingInstruction: false,
      loadingSupply: false,
      loadingUser: false,
      transportOptions: transportTypeOptions(),
      mainTransportOptions: [
        { label: '整箱', value: 1 },
        { label: '拼箱', value: 4 },
        { label: '空运', value: 2 }
      ],
      userOptions: [],
      companyInstructionOptions: [],
      supplyOptions: [],
      SeaPortOptions: [],
      AirPortOptions: [],
      BoatCompanyOptions: [],
      CodeOfTwoOptions: [],
      CourierOptions: [],
      ableStatusOptions: [
        { value: 'unfinished', label: '未完成' },
        { value: 'finished', label: '已完成' }
      ],
      edStatusOptions: [
        { value: 'unfinished', label: '未完成' },
        { value: 'part_finished', label: '部分完成' },
        { value: 'finished', label: '已完成' }
      ],
      lists: [],
      listLoading: false,
      record: {
        instruction_id: undefined,
        contact_id: undefined,
        salesman_id: undefined,
        operation_id: this.$store.getters.userInfo.userInfo.id,
        transport_type: undefined,
        main_transport: undefined,
        created_at: undefined,
        remarks: undefined,
        roles: []
      }
    }
  },
  computed: {
    statusOptions: function() {
      const status = [
        { label: '处理中', value: 'processing' },
        { label: '已锁定', value: 'locked' },
        { label: '已完成', value: 'finished' },
        { label: '已作废', value: 'cancel' }
      ]
      if (this.$store.state.user.systemSetting.order_audit_mechanism === 'true') {
        return [{ label: '待审核', value: 'unaudited' },
          { label: '待接单', value: 'unprocessed' }].concat(status)
      } else {
        return status
      }
    }
  },
  created() {
    this.filterTable()
  },
  methods: {
    filterTable() {
      this.listLoading = true
      this.listQuery.created_at = dateRangeArrayToStr(this.tmp_created_at)
      this.listQuery.departure = dateRangeArrayToStr(this.tmp_departure)
      this.listQuery.arrival = dateRangeArrayToStr(this.tmp_arrival)
      this.listQuery.cut_off_day = dateRangeArrayToStr(this.tmp_cut_off_day)
      console.log(this.listQuery)
      getData('/order/masters/data', { page: this.page, limit: this.limit }, 'post', this.listQuery).then(response => {
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
    handleCreate(createType) {
      this.makeUpOrder = createType === 'make_up'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.record = {
        instruction_id: undefined,
        contact_id: undefined,
        salesman_id: undefined,
        operation_id: this.$store.getters.userInfo.userInfo.id,
        transport_type: undefined,
        main_transport: undefined,
        remarks: undefined,
        roles: []
      }
    },
    getInstruction() {
      if (this.companyInstructionOptions.length <= 0) {
        this.loadingInstruction = true
        remoteCompany('', { company_type: [1, 3] }).then((response) => {
          this.companyInstructionOptions = response
          this.loadingInstruction = false
        })
      }
    },
    getSupply() {
      if (this.supplyOptions.length <= 0) {
        this.loadingSupply = true
        remoteCompany('', { company_type: [2, 3] }).then((response) => {
          this.supplyOptions = response
          this.loadingSupply = false
        })
      }
    },
    getUser() {
      if (this.userOptions.length === 0) {
        getSelectApi('/select/employee', {}, 'get').then((response) => {
          this.userOptions = response.data
        })
      }
    },
    listenFormVisible(val) {
      this.dialogFormVisible = val
    },
    updateOrder(val) {
      this.record = val
      this.dialogStatus = 'update'
      this.listenFormVisible(true)
    }
  }
}
</script>
