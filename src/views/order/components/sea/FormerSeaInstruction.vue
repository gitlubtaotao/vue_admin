<template>
  <el-form :inline="true" :model="former_sea_instruction" class="form-content-box" label-position="top">
    <el-row :gutter="5">
      <el-col :span="4" class="form-content-box-left">
        <el-form-item label="发货人" prop="shipper_id" size="small">
          <el-select v-model="former_sea_instruction.shipper_id" filterable remote placeholder="请选择" size="small" clearable :remote-method="remoteCooperator" :loading="loadingCooperator" style="width: 100%" @focus="getCooperator">
            <el-option v-for="item in cooperatorOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发货人详情" size="small">
          <el-input v-model="former_sea_instruction.shipper_content" type="textarea" :rows="6" style="width: 100%" />
        </el-form-item>
        <el-form-item label="收货人" prop="consignee_id" size="small">
          <el-select v-model="former_sea_instruction.consignee_id" filterable remote placeholder="请选择" size="medium" clearable :remote-method="remoteCooperator" :loading="loadingCooperator" style="width: 100%" @focus="getCooperator">
            <el-option v-for="item in cooperatorOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="收货人详情" size="small">
          <el-input v-model="former_sea_instruction.consignee_content" type="textarea" :rows="6" style="width: 100%" />
        </el-form-item>
        <el-form-item label="通知人" prop="notify_party_id" size="small">
          <el-select v-model="former_sea_instruction.notify_party_id" filterable remote placeholder="请选择" size="medium" clearable :remote-method="remoteCooperator" :loading="loadingCooperator" style="width: 100%" @focus="getCooperator">
            <el-option v-for="item in cooperatorOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知人详情" size="small">
          <el-input v-model="former_sea_instruction.notify_party_content" type="textarea" :rows="6" style="width: 100%" />
        </el-form-item>
        <el-form-item label="目的港代理" prop="pod_agent_id" size="small">
          <el-select v-model="former_sea_instruction.pod_agent_id" filterable remote placeholder="请选择" size="medium" clearable :remote-method="remoteCooperator" :loading="loadingCooperator" style="width: 100%" @focus="getCooperator">
            <el-option v-for="item in cooperatorOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="目的港代理详情" size="small">
          <el-input v-model="former_sea_instruction.pod_agent_content" type="textarea" :rows="6" style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="16" class="form-content-box-center" style="padding-left: 5px;padding-right: 5px; ">
        <div class="box-center-1">
          <el-form-item label="HBL NO." size="small">
            <el-input v-model="former_sea_instruction.hbl_no" style="width: 100%" />
          </el-form-item>
          <el-form-item label="HBL释放时间" size="small">
            <el-date-picker v-model="former_sea_instruction.hbl_no_date" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="运费支付方式" size="small">
            <el-select v-model="former_sea_instruction.ocean_change_pay_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in changePayOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
            </el-select>
          </el-form-item>
          <el-form-item label="其他运费支付方式" size="small">
            <el-select v-model="former_sea_instruction.other_change_pay_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in changePayOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
            </el-select>
          </el-form-item>
          <el-form-item label="校对日期" size="small">
            <el-date-picker v-model="former_sea_instruction.verify_date" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="校对人" size="small">
            <el-select v-model="former_sea_instruction.user_verify_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in userOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
            </el-select>
          </el-form-item>
          <el-form-item label="电放单号" size="small">
            <el-input v-model="former_sea_instruction.tlx_no" style="width: 100%" />
          </el-form-item>
          <el-form-item label="收货人提货时间" size="small">
            <el-date-picker v-model="former_sea_instruction.cargo_received_date" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="签单地点" size="small">
            <el-input v-model="former_sea_instruction.place_of_issue" style="width: 100%" />
          </el-form-item>
          <el-form-item label="签单时间" size="small">
            <el-date-picker v-model="former_sea_instruction.date_of_issue" type="date" placeholder="选择日期" />
          </el-form-item>
        </div>
        <el-divider />
        <div class="box-center-2">
          <el-form-item label="船公司" size="small">
            <el-select v-model="tmp_extend_info.carrier_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in carrierOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
            </el-select>
          </el-form-item>
          <el-form-item label="船名" size="small">
            <el-input v-model="tmp_extend_info.vessel" style="width: 100%" />
          </el-form-item>
          <el-form-item label="航次" size="small">
            <el-input v-model="tmp_extend_info.voyage" style="width: 100%" />
          </el-form-item>
          <el-form-item label="装船日期" size="small">
            <el-date-picker v-model="former_sea_instruction.shaping_on_board_date" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="离港日期" size="small">
            <el-date-picker v-model="tmp_extend_info.departure" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="到港日期" size="small">
            <el-date-picker v-model="tmp_extend_info.arrival" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="截关/截港日期" size="small">
            <el-date-picker v-model="tmp_extend_info.cut_off_day" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="起运港" size="small">
            <el-select v-model="tmp_extend_info.pol_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in portOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
            </el-select>
          </el-form-item>
          <el-form-item label="中转港" size="small">
            <el-select v-model="tmp_extend_info.pot_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in portOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
            </el-select>
          </el-form-item>
          <el-form-item label="目的港" size="small">
            <el-select v-model="tmp_extend_info.pod_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in portOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
            </el-select>
          </el-form-item>
        </div>
        <el-divider />
        <div class="box-center-3">
          <div class="cap-list">
            <el-form-item v-for="(cap_list, index) in sea_cap_lists" :key="index" :label="'柜型/柜量'" size="mini">
              <el-select v-model="cap_list.cap_type" filterable placeholder="请选择" size="mini" clearable>
                <el-option v-for="item in portOptions" :key="parseInt(item.name)" :label="item.name" :value="parseInt(item.name)" />
              </el-select>
              <el-input v-model="cap_list.number" type="number" class="cap-list-number" />
              <el-button type="danger" size="mini" icon="el-icon-delete" @click.prevent="removeCapList(index)" />
            </el-form-item>
          </div>
          <div><el-button type="primary" size="mini" @click.prevent="addCapList">新增</el-button></div>
          <el-form-item label="唛头" size="small">
            <el-input v-model="former_sea_instruction.marks" type="textarea" :rows="8" style="width: 100%" />
          </el-form-item>
          <el-form-item label="货物描述" size="small">
            <el-input v-model="former_sea_instruction.description_of_good" type="textarea" :rows="8" style="width: 100%" />
          </el-form-item>
          <el-form-item label="尺寸" size="small">
            <el-input v-model="former_sea_instruction.size" type="textarea" :rows="8" style="width: 100%" />
          </el-form-item>
          <el-form-item label="HBL 备注" size="small">
            <el-input v-model="former_sea_instruction.hbl_remarks" type="textarea" :rows="8" style="width: 100%" />
          </el-form-item>
          <div class="pack-number-content">
            <el-form-item label="数量" size="small">
              <el-input v-model="former_sea_instruction.number" style="width: 100%" type="number" />
            </el-form-item>
            <el-form-item label="包装类型" size="small">
              <el-select v-model="former_sea_instruction.package_type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                <el-option v-for="item in packageTypeOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
              </el-select>
            </el-form-item>
            <el-form-item label="毛重(KGS)" size="small">
              <el-input v-model="former_sea_instruction.gross_weight" style="width: 100%" type="number" />
            </el-form-item>
            <el-form-item label="体积(CBM)" size="small">
              <el-input v-model="former_sea_instruction.volume" style="width: 100%" type="number" />
            </el-form-item>
          </div>
          <el-form-item label="收货地" size="small">
            <el-input v-model="former_sea_instruction.place_of_delivery" type="textarea" :rows="8" style="width: 100%" />
          </el-form-item>
          <el-form-item label="接货地" size="small">
            <el-input v-model="former_sea_instruction.place_of_receipt" type="textarea" :rows="8" style="width: 100%" />
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="4" class="form-content-box-right" style="padding-left: 5px;padding-right: 5px; ">
        <el-tag type="primary">委托信息</el-tag>
        <el-form-item label="委托类型" size="small">
          <el-select v-model="former_sea_instruction.instruction_type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
            <el-option v-for="item in instructionTypeOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="报关方式" size="small">
          <el-select v-model="former_sea_instruction.ways_of_declaration_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
            <el-option v-for="item in waysOfDeclarationOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="出单方式" size="small">
          <el-select v-model="former_sea_instruction.misc_bill_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
            <el-option v-for="item in miscBillOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="转运类型" size="small">
          <el-select v-model="former_sea_instruction.transshipment_type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
            <el-option v-for="item in transshipmentTypeOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="贸易条款" size="small">
          <el-select v-model="former_sea_instruction.trade_terms_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
            <el-option v-for="item in tradeTermsOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="装运条款" size="small">
          <el-select v-model="former_sea_instruction.shipment_item_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
            <el-option v-for="item in shipmentItemOptions" :key="parseInt(item.id)" :label="item.label" :value="parseInt(item.value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="合同编号" size="small">
          <el-input v-model="former_sea_instruction.contract_no" style="width: 100%" />
        </el-form-item>
        <el-form-item label="商业发票编号" size="small">
          <el-input v-model="former_sea_instruction.invoice_no" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注" size="small">
          <el-input v-model="former_sea_instruction.remarks" style="width: 100%" type="textarea" :rows="8" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { getData } from '@/api/index_data'
export default {
  name: 'FormerSeaInstruction',
  props: {
    orderExtendInfo: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      tmp_extend_info: {},
      former_sea_instruction: {
        instruction_id: undefined,
        shipper_id: undefined,
        shipper_content: undefined,
        consignee_id: undefined,
        consignee_content: undefined,
        notify_party_id: undefined,
        notify_party_content: undefined,
        pod_agent_id: undefined,
        pod_agent_content: undefined,
        hbl_no: undefined,
        ocean_change_pay_id: undefined,
        other_change_pay_id: undefined,
        verify_date: undefined,
        user_verify_id: undefined,
        tlx_no: undefined,
        hbl_no_date: undefined,
        place_of_issue: undefined,
        date_of_issue: undefined,
        cargo_received_date: undefined,
        shaping_on_board_date: undefined,
        marks: undefined,
        description_of_good: undefined,
        size: undefined,
        number: undefined,
        package_type_id: undefined,
        gross_weight: undefined,
        volume: undefined,
        place_of_delivery: undefined,
        place_of_receipt: undefined,
        hbl_remarks: undefined,
        instruction_type_id: undefined,
        ways_of_declaration_id: undefined,
        misc_bill_id: undefined,
        transshipment_type_id: undefined,
        trade_terms_id: undefined,
        shipment_item_id: undefined,
        contract_no: undefined,
        invoice_no: undefined,
        remarks: undefined
      },
      sea_cap_lists: [{ number: 1, cap_type: undefined }],
      changePayOptions: [],
      userOptions: [],
      cooperatorOptions: [],
      cooperator: [],
      loadingCooperator: false,
      carrierOptions: [],
      packageTypeOptions: [],
      portOptions: [],
      instructionTypeOptions: [],
      waysOfDeclarationOptions: [],
      miscBillOptions: [],
      shipmentItemOptions: [],
      tradeTermsOptions: [],
      transshipmentTypeOptions: [],
      CapTypeOptions: []
    }
  },
  watch: {
    orderExtendInfo: {
      immediate: true, // 这句重要
      handler(val) {
        this.orderExtendInfo = val
        this.tmp_extend_info = val
      }
    }
  },
  created() {
    this.tmp_extend_info = this.orderExtendInfo
    this.initData()
  },
  methods: {
    remoteCooperator() { },
    getCooperator() {
      if (this.cooperator.length > 0) {
        this.cooperatorOptions = this.cooperator
      }
    },
    removeCapList(index) {
      this.sea_cap_lists.splice(index, 1)
    },
    addCapList() {
      this.sea_cap_lists.push({ number: 1, cap_type: undefined })
    },
    initData() {
      getData('/order/masters/' + this.$route.params.id + '/getFormerData', { formerType: 'former_sea_instruction' }, 'get').then(response => {
        console.log(response)
        const selectOptions = response.selectOptions
        this.cooperator = selectOptions.crmOptions
        this.cooperatorOptions = selectOptions.crmOptions
        this.former_sea_instruction = response.formerData
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style lang="scss">
  .cap-list{
    .el-form-item{
      .el-select{
        width: 40%;
      }
      .cap-list-number{
        width: 30%;
      }
      .el-button{
        display: inline-block;
      }
    }
  }
</style>
