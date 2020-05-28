<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="">
        <el-radio-group v-model="listQuery.transport_type" size="medium" style="margin-left: 5px;" @change="filterTable">
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
              <el-input v-model="listQuery.serial_number" placeholder="支持模糊查询" class="filter-item" size="medium" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="委托单位" class="">
              <el-select v-model="listQuery.instruction_id" filterable remote placeholder="请选择" size="medium" clearable :remote-method="remoteInstruction" :loading="loadingInstruction" @focus="getInstruction()">
                <el-option v-for="item in companyInstructionOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="订舱代理" class="">
              <el-select v-model="listQuery.supply_agent_id" filterable remote placeholder="请选择" size="medium" clearable :remote-method="remoteInstruction" :loading="loadingInstruction" @focus="getInstruction()">
                <el-option v-for="item in supplyOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="所属公司" class="">
              <el-select v-model="listQuery.company_id" filterable remote placeholder="请选择" size="medium" clearable :remote-method="remoteInstruction" :loading="loadingInstruction" @focus="getInstruction()">
                <el-option v-for="item in ownerCompanyOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="业务员" class="">
              <el-select v-model="listQuery.salesman_id" filterable remote placeholder="请选择" size="medium" clearable :remote-method="remoteInstruction" :loading="loadingInstruction" @focus="getInstruction()">
                <el-option v-for="item in salesmanOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="操作员" class="">
              <el-select v-model="listQuery.operation_id" filterable remote placeholder="请选择" size="medium" clearable :remote-method="remoteInstruction" :loading="loadingInstruction" @focus="getInstruction()">
                <el-option v-for="item in operationOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="主单号" class="">
              <el-input v-model="listQuery.mbl_so" placeholder="支持模糊查询" class="filter-item" size="medium" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="So No." class="">
              <el-input v-model="listQuery.so_no" placeholder="支持模糊查询" class="filter-item" size="medium" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="应收状态" class="">
              <el-select v-model="listQuery.receivable_status" filterable placeholder="请选择" size="medium" clearable>
                <el-option v-for="item in ableStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="收款状态" class="">
              <el-select v-model="listQuery.received_status" filterable placeholder="请选择" size="medium" clearable>
                <el-option v-for="item in edStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="应付状态" class="">
              <el-select v-model="listQuery.payable_status" filterable placeholder="请选择" size="medium" clearable>
                <el-option v-for="item in ableStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="付款状态" class="">
              <el-select v-model="listQuery.paid_status" filterable placeholder="请选择" size="medium" clearable>
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
                  <el-select v-model="listQuery.carrier_id" filterable placeholder="船公司" size="medium" clearable>
                    <el-option v-for="item in BoatCompanyOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="起运港" class="">
                  <el-select v-model="listQuery.pol_id" filterable placeholder="起运港" size="medium" clearable>
                    <el-option v-for="item in SeaPortOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="目的港" class="">
                  <el-select v-model="listQuery.pod_id" filterable placeholder="目的港" size="medium" clearable>
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
                  <el-select v-model="listQuery.carrier_id" filterable placeholder="航空公司" size="medium" clearable>
                    <el-option v-for="item in CodeOfTwoOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="起运港" class="">
                  <el-select v-model="listQuery.pol_id" filterable placeholder="起运港" size="medium" clearable>
                    <el-option v-for="item in AirPortOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="目的港" class="">
                  <el-select v-model="listQuery.pod_id" filterable placeholder="目的港" size="medium" clearable>
                    <el-option v-for="item in AirPortOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="航班号" class="">
                  <el-input v-model="listQuery.flight_no" placeholder="支持模糊查询" class="filter-item" size="medium" clearable />
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
                  <el-select v-model="listQuery.courier_code_id" filterable placeholder="航空公司" size="medium" clearable>
                    <el-option v-for="item in CourierOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-form-item label="快递单号" class="">
                  <el-input v-model="listQuery.courier_no" placeholder="快递单号" class="filter-item" size="medium" clearable />
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
    <keep-alive>
      <master-form :make-up-order="makeUpOrder" :dialog-form-visible="dialogFormVisible" :dialog-status="dialogStatus" @listenFormVisible="listenFormVisible" />
    </keep-alive>
  </div>
</template>
<script>
import MasterForm from '../components/MasterForm'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'OrderMaster',
  components: { MasterForm },
  directives: { waves },
  data() {
    return {
      tmp_created_at: '',
      tmp_departure: '',
      tmp_arrival: '',
      tmp_cut_off_day: '',
      listQuery: {
        transport_type: '',
        serial_number: undefined,
        instruction_id: undefined,
        supply_agent_id: undefined,
        company_id: undefined,
        salesman_id: undefined,
        operation_id: undefined,
        mbl_so: undefined,
        so_no: undefined,
        payable_status: undefined,
        paid_status: undefined,
        receivable_status: undefined,
        received_status: undefined,
        departure: undefined,
        arrival: undefined,
        created_at: undefined,
        carrier_id: undefined,
        pol_id: undefined,
        pod_id: undefined,
        cut_off_day: undefined,
        courier_code_id: undefined,
        flight_no: undefined,
        courier_no: undefined
      },
      makeUpOrder: false,
      dialogStatus: 'create',
      dialogFormVisible: false,
      loadingInstruction: false,
      transportOptions: [
        { label: '整箱', value: 1 },
        { label: '拼箱', value: 4 },
        { label: '空运', value: 2 },
        { label: '快递', value: 5 },
        { label: '其他', value: 3 }
      ],
      mainTransportOptions: [
        { label: '整箱', value: 1 },
        { label: '拼箱', value: 4 },
        { label: '空运', value: 2 }
      ],
      userArray: [],
      operationOptions: [],
      salesmanOptions: [],
      companyArray: [],
      companyInstructionOptions: [],
      supplyArray: [],
      supplyOptions: [],
      ownerCompanyArray: [],
      ownerCompanyOptions: [],
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
        { value: '', label: '部分完成' },
        { value: 'finished', label: '已完成' }
      ]
    }
  },
  methods: {
    filterTable() { console.log('333') },
    handleCreate(createType) {
      this.makeUpOrder = createType === 'make_up'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    getInstruction() { },
    remoteInstruction() { },
    listenFormVisible(val) {
      this.dialogFormVisible = val
    }
  }
}
</script>
