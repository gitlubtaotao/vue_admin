<template>
  <div id="app-container">
    <el-col :span="24">
      <el-card shadow="never">
        <div slot="header">
          <keep-alive>
            <ButtonList :order-master="order_master" :save-data="saveData" />
          </keep-alive>
        </div>
        <div>
          <el-form :inline="true" :model="order_master" class="demo-form-inline" label-position="top">
            <el-row :gutter="5">
              <el-col :span="14" class="left-content">
                <el-form-item label="MBL NO." size="small">
                  <el-input :value="order_master.order_extend_info.mbl_so" disabled />
                </el-form-item>
                <el-form-item label="HBL NO." size="small">
                  <el-input :value="order_master.order_extend_info.hbl_so" disabled />
                </el-form-item>
                <el-form-item label="船公司." size="small">
                  <el-input :value="showCarrier(order_master.order_extend_info.carrier_id)" disabled />
                </el-form-item>
                <el-form-item label="截关/截港日期" size="small">
                  <el-input :value="showDate(order_master.order_extend_info.cut_off_day)" disabled />
                </el-form-item>
                <el-form-item label="截放行条时间" size="small">
                  <el-input :value="order_master.order_extend_info.carrier_name" disabled />
                </el-form-item>
                <el-form-item label="起运港." size="small">
                  <el-input :value="showPort(order_master.order_extend_info.pol_id)" disabled />
                </el-form-item>
                <el-form-item label="目的港" size="small">
                  <el-input :value="showPort(order_master.order_extend_info.pod_id)" disabled />
                </el-form-item>
                <el-form-item label="船名" size="small">
                  <el-input :value="order_master.order_extend_info.vessel" disabled />
                </el-form-item>
                <el-form-item label="航次" size="small">
                  <el-input :value="order_master.order_extend_info.voyage" disabled />
                </el-form-item>
                <el-form-item label="VGM截止时间" size="small">
                  <el-input :value="order_master.order_extend_info.carrier_name" placeholder="HBL NO." disabled />
                </el-form-item>
                <el-form-item label="SO NO." size="small">
                  <el-input :value="order_master.order_extend_info.mbl_so" placeholder="MBL NO." disabled />
                </el-form-item>
                <el-form-item label="货量" size="small">
                  <el-input :value="order_master.order_extend_info.number" placeholder="" disabled />
                </el-form-item>
                <el-form-item label="离港日期" size="small">
                  <el-input :value="showDate(order_master.order_extend_info.departure)" disabled />
                </el-form-item>
                <el-form-item label="到港日期" size="small">
                  <el-input :value="showDate(order_master.order_extend_info.arrival)" disabled />
                </el-form-item>
                <el-form-item label="截补料时间" size="small">
                  <el-input :value="order_master.order_extend_info.carrier_name" placeholder="HBL NO." disabled />
                </el-form-item>
              </el-col>
              <el-col :span="4" class="middle-content">
                <el-form-item label="包装数量" size="small">
                  <el-input :value="order_master.order_extend_info.number" placeholder="包装数量" disabled />
                </el-form-item>
                <el-form-item label="包装类型" size="small">
                  <el-input :value="showPackType()" placeholder="包装类型" disabled />
                </el-form-item>
                <el-form-item label="毛重(KGS)" size="small">
                  <el-input :value="order_master.order_extend_info.gross_weight" placeholder="毛重" disabled />
                </el-form-item>
                <el-form-item label="体积(CBM)" size="small">
                  <el-input :value="order_master.order_extend_info.volume" placeholder="体积(CBM)" disabled />
                </el-form-item>
                <el-form-item label="订单备注" size="small" class="order-master-remark">
                  <el-input :value="order_master.remarks" placeholder="HBL NO." disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6" class="right-content">
                <el-form-item label="操作员" size="small" class="order-master-remark">
                  <el-input v-model="order_master.operation_name" placeholder="" disabled />
                </el-form-item>
                <el-form-item label="业务员" size="small" class="order-master-remark">
                  <el-input v-model="order_master.salesman_name" placeholder="" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top: 10px;">
      <el-tabs v-model="activeName" type="border-card" :before-leave="dataIsSave" @tab-click="changeNabType">
        <el-tab-pane name="former_sea_instruction" :lazy="true">
          <div slot="label">
            <span>委托单(HBL)</span>
            <el-dropdown>
              <span class="el-dropdown-link"><i class="el-icon-arrow-down el-icon--right" /></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <keep-alive>
            <former-button :order-master="order_master" :save-data="saveData" />
          </keep-alive>
          <el-form :inline="true" :model="former_sea_instruction" class="form-content-box" label-position="top">
            <el-row :gutter="5">
              <el-col :span="4" class="form-content-box-left">
                <el-form-item label="发货人" prop="shipper_id" size="small">
                  <el-select
                    v-model="former_sea_instruction.shipper_id"
                    filterable
                    remote
                    placeholder="请选择"
                    size="small"
                    clearable
                    :remote-method="remoteCooperator"
                    :loading="loadingCooperator"
                    style="width: 100%"
                    @change="getCompanyDetail($event,'shipper_content')"
                    @focus="getCooperator"
                  >
                    <el-option v-for="item in cooperatorOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="发货人详情" size="small">
                  <el-input v-model="former_sea_instruction.shipper_content" type="textarea" :rows="6" style="width: 100%" />
                </el-form-item>
                <el-form-item label="收货人" prop="consignee_id" size="small">
                  <el-select
                    v-model="former_sea_instruction.consignee_id"
                    filterable
                    remote
                    placeholder="请选择"
                    size="medium"
                    clearable
                    :remote-method="remoteCooperator"
                    :loading="loadingCooperator"
                    style="width: 100%"
                    @change="getCompanyDetail($event,'consignee_content')"
                    @focus="getCooperator"
                  >
                    <el-option v-for="item in cooperatorOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="收货人详情" size="small">
                  <el-input v-model="former_sea_instruction.consignee_content" type="textarea" :rows="6" style="width: 100%" />
                </el-form-item>
                <el-form-item label="通知人" prop="notify_party_id" size="small">
                  <el-select
                    v-model="former_sea_instruction.notify_party_id"
                    filterable
                    remote
                    placeholder="请选择"
                    size="medium"
                    clearable
                    :remote-method="remoteCooperator"
                    :loading="loadingCooperator"
                    style="width: 100%"
                    @change="getCompanyDetail($event,'notify_party_content')"
                    @focus="getCooperator"
                  >
                    <el-option v-for="item in cooperatorOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="通知人详情" size="small">
                  <el-input v-model="former_sea_instruction.notify_party_content" type="textarea" :rows="6" style="width: 100%" />
                </el-form-item>
                <el-form-item label="目的港代理" prop="pod_agent_id" size="small">
                  <el-select
                    v-model="former_sea_instruction.pod_agent_id"
                    filterable
                    remote
                    placeholder="请选择"
                    size="medium"
                    clearable
                    :remote-method="remoteCooperator"
                    :loading="loadingCooperator"
                    style="width: 100%"
                    @change="getCompanyDetail($event,'pod_agent_content')"
                    @focus="getCooperator"
                  >
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
                    <el-input v-model="former_sea_instruction.hbl_no" style="width: 100%" @change="syncExtendInfo($event,'hbl_so')" />
                  </el-form-item>
                  <el-form-item label="HBL释放时间" size="small">
                    <el-date-picker v-model="former_sea_instruction.hbl_no_date" type="date" placeholder="选择日期" />
                  </el-form-item>
                  <el-form-item label="运费支付方式" size="small">
                    <el-select v-model="former_sea_instruction.ocean_change_pay_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in changePayOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="其他运费支付方式" size="small">
                    <el-select v-model="former_sea_instruction.other_change_pay_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in changePayOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="校对日期" size="small">
                    <el-date-picker v-model="former_sea_instruction.verify_date" type="date" placeholder="选择日期" />
                  </el-form-item>
                  <el-form-item label="校对人" size="small">
                    <el-select v-model="former_sea_instruction.user_verify_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in userOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
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
                    <el-select v-model="order_master.order_extend_info.carrier_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in carrierOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="船名" size="small">
                    <el-input v-model="order_master.order_extend_info.vessel" style="width: 100%" />
                  </el-form-item>
                  <el-form-item label="航次" size="small">
                    <el-input v-model="order_master.order_extend_info.voyage" style="width: 100%" />
                  </el-form-item>
                  <el-form-item label="装船日期" size="small">
                    <el-date-picker v-model="former_sea_instruction.shaping_on_board_date" type="date" placeholder="选择日期" />
                  </el-form-item>
                  <el-form-item label="离港日期" size="small">
                    <el-date-picker v-model="order_master.order_extend_info.departure" type="date" placeholder="选择日期" :value="22" />
                  </el-form-item>
                  <el-form-item label="到港日期" size="small">
                    <el-date-picker v-model="order_master.order_extend_info.arrival" type="date" placeholder="选择日期" />
                  </el-form-item>
                  <el-form-item label="截关/截港日期" size="small">
                    <el-date-picker v-model="order_master.order_extend_info.cut_off_day" type="date" placeholder="选择日期" />
                  </el-form-item>
                  <el-form-item label="起运港" size="small">
                    <el-select v-model="order_master.order_extend_info.pol_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in portOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="中转港" size="small">
                    <el-select v-model="order_master.order_extend_info.pot_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in portOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="目的港" size="small">
                    <el-select v-model="order_master.order_extend_info.pod_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in portOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                </div>
                <el-divider />
                <div class="box-center-3">
                  <div class="cap-list">
                    <el-form-item v-for="(cap_list, index) in former_sea_instruction.sea_cap_lists" :key="index" :label="'柜型/柜量'" size="mini">
                      <el-select v-model="cap_list.cap_type" filterable placeholder="请选择" size="mini" clearable>
                        <el-option v-for="item in CapTypeOptions" :key="item.name" :label="item.name" :value="item.name" />
                      </el-select>
                      <el-input-number v-model="cap_list.number" :min="1" class="cap-list-number" size="mini" />
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
                      <el-input-number v-model="former_sea_instruction.number" :min="1" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="包装类型" size="small">
                      <el-select v-model="former_sea_instruction.package_type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                        <el-option v-for="item in packageTypeOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
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
                    <el-option v-for="item in instructionTypeOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                  </el-select>
                </el-form-item>
                <el-form-item label="报关方式" size="small">
                  <el-select v-model="former_sea_instruction.ways_of_declaration_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                    <el-option v-for="item in waysOfDeclarationOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                  </el-select>
                </el-form-item>
                <el-form-item label="出单方式" size="small">
                  <el-select v-model="former_sea_instruction.misc_bill_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                    <el-option v-for="item in miscBillOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                  </el-select>
                </el-form-item>
                <el-form-item label="转运类型" size="small">
                  <el-select v-model="former_sea_instruction.transshipment_type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                    <el-option v-for="item in transshipmentTypeOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                  </el-select>
                </el-form-item>
                <el-form-item label="贸易条款" size="small">
                  <el-select v-model="former_sea_instruction.trade_terms_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                    <el-option v-for="item in tradeTermsOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                  </el-select>
                </el-form-item>
                <el-form-item label="装运条款" size="small">
                  <el-select v-model="former_sea_instruction.shipment_item_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                    <el-option v-for="item in shipmentItemOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
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
        </el-tab-pane>
        <el-tab-pane label="订舱单(MBL)" name="former_sea_book" :lazy="true">
          <keep-alive>
            <former-button :order-master="order_master" :save-data="saveData" />
          </keep-alive>
          <el-form :inline="true" :model="former_sea_book" class="form-content-box" label-position="top">
            <el-row :gutter="5">
              <el-col :span="4" class="form-content-box-left">
                <el-form-item label="发货人" prop="shipper_id" size="small">
                  <el-select
                    v-model="former_sea_book.shipper_id"
                    filterable
                    remote
                    placeholder="请选择"
                    size="small"
                    clearable
                    :remote-method="remoteCooperator"
                    :loading="loadingCooperator"
                    style="width: 100%"
                    @change="getCompanyDetail($event,'shipper_content')"
                    @focus="getCooperator"
                  >
                    <el-option v-for="item in cooperatorOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="发货人详情" size="small">
                  <el-input v-model="former_sea_book.shipper_content" type="textarea" :rows="6" style="width: 100%" />
                </el-form-item>
                <el-form-item label="收货人" prop="consignee_id" size="small">
                  <el-select
                    v-model="former_sea_book.consignee_id"
                    filterable
                    remote
                    placeholder="请选择"
                    size="medium"
                    clearable
                    :remote-method="remoteCooperator"
                    :loading="loadingCooperator"
                    style="width: 100%"
                    @change="getCompanyDetail($event,'consignee_content')"
                    @focus="getCooperator"
                  >
                    <el-option v-for="item in cooperatorOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="收货人详情" size="small">
                  <el-input v-model="former_sea_book.consignee_content" type="textarea" :rows="6" style="width: 100%" />
                </el-form-item>
                <el-form-item label="通知人" prop="notify_party_id" size="small">
                  <el-select
                    v-model="former_sea_book.notify_party_id"
                    filterable
                    remote
                    placeholder="请选择"
                    size="medium"
                    clearable
                    :remote-method="remoteCooperator"
                    :loading="loadingCooperator"
                    style="width: 100%"
                    @change="getCompanyDetail($event,'notify_party_content')"
                    @focus="getCooperator"
                  >
                    <el-option v-for="item in cooperatorOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="通知人详情" size="small">
                  <el-input v-model="former_sea_book.notify_party_content" type="textarea" :rows="6" style="width: 100%" />
                </el-form-item>
                <el-form-item label="目的港代理" prop="pod_agent_id" size="small">
                  <el-select
                    v-model="former_sea_book.pod_agent_id"
                    filterable
                    remote
                    placeholder="请选择"
                    size="medium"
                    clearable
                    :remote-method="remoteCooperator"
                    :loading="loadingCooperator"
                    style="width: 100%"
                    @change="getCompanyDetail($event,'pod_agent_content')"
                    @focus="getCooperator"
                  >
                    <el-option v-for="item in cooperatorOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="目的港代理详情" size="small">
                  <el-input v-model="former_sea_book.pod_agent_content" type="textarea" :rows="6" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="16" class="form-content-box-center" style="padding-left: 5px;padding-right: 5px; ">
                <div class="box-center-1">
                  <el-form-item label="MBL NO." size="small">
                    <el-input v-model="former_sea_book.mbl_no" style="width: 100%" @change="syncExtendInfo($event,'mbl_so')" />
                  </el-form-item>
                  <el-form-item label="MBL释放时间" size="small">
                    <el-date-picker v-model="former_sea_book.mbl_no_date" type="date" placeholder="选择日期" />
                  </el-form-item>
                  <el-form-item label="运费支付方式" size="small">
                    <el-select v-model="former_sea_book.ocean_change_pay_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in changePayOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="其他运费支付方式" size="small">
                    <el-select v-model="former_sea_book.other_change_pay_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in changePayOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="运费支付地" size="small">
                    <el-select v-model="former_sea_book.pay_pol_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in portOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="校对日期" size="small">
                    <el-date-picker v-model="former_sea_book.verify_date" type="date" placeholder="选择日期" />
                  </el-form-item>
                  <el-form-item label="校对人" size="small">
                    <el-select v-model="former_sea_book.user_verify_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in userOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="电放单号" size="small">
                    <el-input v-model="former_sea_book.tlx_no" style="width: 100%" />
                  </el-form-item>
                  <el-form-item label="收货人提货时间" size="small">
                    <el-date-picker v-model="former_sea_book.cargo_received_date" type="date" placeholder="选择日期" />
                  </el-form-item>
                  <el-form-item label="签单地点" size="small">
                    <el-input v-model="former_sea_book.place_of_issue" style="width: 100%" />
                  </el-form-item>
                  <el-form-item label="签单时间" size="small">
                    <el-date-picker v-model="former_sea_book.date_of_issue" type="date" placeholder="选择日期" />
                  </el-form-item>
                </div>
                <el-divider />
                <div class="box-center-2">
                  <el-form-item label="船公司" size="small">
                    <el-select v-model="order_master.order_extend_info.carrier_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in carrierOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="船名" size="small">
                    <el-input v-model="order_master.order_extend_info.vessel" style="width: 100%" />
                  </el-form-item>
                  <el-form-item label="航次" size="small">
                    <el-input v-model="order_master.order_extend_info.voyage" style="width: 100%" />
                  </el-form-item>
                  <el-form-item label="装船日期" size="small">
                    <el-date-picker v-model="former_sea_instruction.shaping_on_board_date" type="date" placeholder="选择日期" />
                  </el-form-item>
                  <el-form-item label="离港日期" size="small">
                    <el-date-picker v-model="order_master.order_extend_info.departure" type="date" placeholder="选择日期" :value="22" />
                  </el-form-item>
                  <el-form-item label="到港日期" size="small">
                    <el-date-picker v-model="order_master.order_extend_info.arrival" type="date" placeholder="选择日期" />
                  </el-form-item>
                  <el-form-item label="截关/截港日期" size="small">
                    <el-date-picker v-model="order_master.order_extend_info.cut_off_day" type="date" placeholder="选择日期" />
                  </el-form-item>
                  <el-form-item label="起运港" size="small">
                    <el-select v-model="order_master.order_extend_info.pol_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in portOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="中转港" size="small">
                    <el-select v-model="order_master.order_extend_info.pot_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in portOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="目的港" size="small">
                    <el-select v-model="order_master.order_extend_info.pod_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                      <el-option v-for="item in portOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                    </el-select>
                  </el-form-item>
                </div>
                <el-divider />
                <div class="box-center-3">
                  <div class="cap-list">
                    <el-form-item v-for="(cap_list, index) in former_sea_book.sea_cap_lists" :key="index" :label="'柜型/柜量'" size="mini">
                      <el-select v-model="cap_list.cap_type" filterable placeholder="请选择" size="mini" clearable>
                        <el-option v-for="item in CapTypeOptions" :key="item.name" :label="item.name" :value="item.name" />
                      </el-select>
                      <el-input-number v-model="cap_list.number" :min="1" class="cap-list-number" size="mini" />
                      <el-button type="danger" size="mini" icon="el-icon-delete" @click.prevent="removeCapList(index)" />
                    </el-form-item>
                  </div>
                  <div><el-button type="primary" size="mini" @click.prevent="addCapList">新增</el-button></div>
                  <el-form-item label="唛头" size="small">
                    <el-input v-model="former_sea_book.marks" type="textarea" :rows="8" style="width: 100%" />
                  </el-form-item>
                  <el-form-item label="货物描述" size="small">
                    <el-input v-model="former_sea_book.description_of_good" type="textarea" :rows="8" style="width: 100%" />
                  </el-form-item>
                  <el-form-item label="尺寸" size="small">
                    <el-input v-model="former_sea_book.size" type="textarea" :rows="8" style="width: 100%" />
                  </el-form-item>
                  <el-form-item label="MBL 备注" size="small">
                    <el-input v-model="former_sea_book.mbl_remarks" type="textarea" :rows="8" style="width: 100%" />
                  </el-form-item>
                  <div class="pack-number-content">
                    <el-form-item label="数量" size="small">
                      <el-input-number v-model="former_sea_book.number" :min="1" style="width: 100%" @change="syncExtendInfo($event,'number')" />
                    </el-form-item>
                    <el-form-item label="包装类型" size="small">
                      <el-select v-model="former_sea_book.package_type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%" @change="syncExtendInfo($event,'package_type_id')">
                        <el-option v-for="item in packageTypeOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="毛重(KGS)" size="small">
                      <el-input v-model="former_sea_book.gross_weight" style="width: 100%" type="number" @change="syncExtendInfo($event,'gross_weight')" />
                    </el-form-item>
                    <el-form-item label="体积(CBM)" size="small">
                      <el-input v-model="former_sea_book.volume" style="width: 100%" type="number" @change="syncExtendInfo($event,'volume')" />
                    </el-form-item>
                  </div>
                  <el-form-item label="收货地" size="small">
                    <el-input v-model="former_sea_book.place_of_delivery" type="textarea" :rows="8" style="width: 100%" />
                  </el-form-item>
                  <el-form-item label="接货地" size="small">
                    <el-input v-model="former_sea_book.place_of_receipt" type="textarea" :rows="8" style="width: 100%" />
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="4" class="form-content-box-right" style="padding-left: 5px;padding-right: 5px; ">
                <el-tag type="primary">订舱信息</el-tag>
                <el-form-item label="订舱代理" size="small">
                  <el-select v-model="former_sea_book.supply_agent_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                    <el-option v-for="item in miscBillOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                  </el-select>
                </el-form-item>
                <el-form-item label="出单方式" size="small">
                  <el-select v-model="former_sea_book.misc_bill_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                    <el-option v-for="item in miscBillOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                  </el-select>
                </el-form-item>
                <el-form-item label="贸易条款" size="small">
                  <el-select v-model="former_sea_book.trade_terms_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                    <el-option v-for="item in tradeTermsOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                  </el-select>
                </el-form-item>
                <el-form-item label="装运条款" size="small">
                  <el-select v-model="former_sea_book.shipment_item_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                    <el-option v-for="item in shipmentItemOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                  </el-select>
                </el-form-item>
                <el-form-item label="费用描述" size="small">
                  <el-input v-model="former_sea_book.charge_description" style="width: 100%" type="textarea" :rows="8" />
                </el-form-item>
                <el-form-item label="备注" size="small">
                  <el-input v-model="former_sea_book.remarks" style="width: 100%" type="textarea" :rows="8" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="SO NO." name="former_sea_so_no">角色管理</el-tab-pane>
        <el-tab-pane label="综合服务" name="service">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-col>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import { getData, createData } from '@/api/index_data'
import ButtonList from '../ButtonList'
import FormerButton from './FormerButton'
export default {
  name: 'SeaPage',
  components: { ButtonList, FormerButton },
  data() {
    return {
      order_master: {
        order_extend_info: {
          id: undefined,
          order_master_id: undefined,
          pol_id: undefined,
          carrier_id: undefined,
          number: undefined,
          package_type_id: undefined,
          gross_weight: undefined,
          volume: undefined,
          mbl_so: undefined,
          hbl_so: undefined,
          so_no: undefined,
          pod_id: undefined,
          pot_id: undefined,
          cut_off_day: undefined,
          departure: undefined,
          arrival: undefined,
          vessel: undefined,
          voyage: undefined,
          shipper_id: undefined
        }
      },
      former_sea_instruction: {
        id: undefined,
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
        user_verify_id: this.$store.state.user.userInfo.id,
        tlx_no: undefined,
        hbl_no_date: undefined,
        place_of_issue: undefined,
        date_of_issue: undefined,
        cargo_received_date: undefined,
        shaping_on_board_date: null,
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
        remarks: undefined,
        sea_cap_lists: [{ number: 1, cap_type: undefined }]
      },
      former_sea_book: {
        id: undefined,
        instruction_id: undefined,
        shipper_id: undefined,
        shipper_content: undefined,
        consignee_id: undefined,
        consignee_content: undefined,
        notify_party_id: undefined,
        notify_party_content: undefined,
        pod_agent_id: undefined,
        pod_agent_content: undefined,
        mbl_no: undefined,
        ocean_change_pay_id: undefined,
        other_change_pay_id: undefined,
        pay_pol_id: undefined,
        verify_date: undefined,
        user_verify_id: this.$store.state.user.userInfo.id,
        tlx_no: undefined,
        mbl_no_date: undefined,
        place_of_issue: undefined,
        date_of_issue: undefined,
        cargo_received_date: undefined,
        shaping_on_board_date: null,
        marks: undefined,
        description_of_good: undefined,
        size: undefined,
        number: undefined,
        package_type_id: undefined,
        gross_weight: undefined,
        volume: undefined,
        place_of_delivery: undefined,
        place_of_receipt: undefined,
        mbl_remarks: undefined,
        supply_agent_id: undefined,
        misc_bill_id: undefined,
        trade_terms_id: undefined,
        shipment_item_id: undefined,
        charge_description: undefined,
        remarks: undefined,
        sea_cap_lists: [{ number: 1, cap_type: undefined }]
      },
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
      CapTypeOptions: [],
      activeName: 'former_sea_instruction',
      isDataChange: 0,
      isLoadingBookingData: false,
      getFormerDataUrl: '/order/masters/' + this.$route.params.id
    }
  },
  watch: {
    former_sea_instruction: {
      handler(newName, oldName) {
        this.isDataChange++
      },
      deep: true,
      immediate: false
    },
    former_sea_book: {
      handler(newName, oldName) {
        this.isDataChange++
      },
      deep: true,
      immediate: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    showDate(time) {
      if (time === '' || time === null || typeof (time) === 'undefined') {
        return ''
      }
      return parseTime(time, '{y}-{m}-{d}')
    },
    getCompanyDetail(val, field) {
      if (val === '' || val === null || typeof (val) === 'undefined') {
        this.former_sea_instruction[field] = ''
        return
      }
      getData('/crm/companies/' + val + '/operationInfo', { }, 'get').then(response => {
        this.former_sea_instruction[field] = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    initData() {
      getData(this.getFormerDataUrl + '/operation', { formerType: 'former_sea_instruction' }, 'get').then(response => {
        const selectOptions = response['selectOptions']
        this.cooperator = selectOptions['crmOptions']
        this.cooperatorOptions = selectOptions['crmOptions']
        this.changePayOptions = selectOptions['PayType']
        this.userOptions = selectOptions['userInfo']
        this.carrierOptions = selectOptions['carrier']
        this.portOptions = selectOptions['port']
        this.CapTypeOptions = selectOptions['CapType']
        this.packageTypeOptions = selectOptions['PackageType']
        this.instructionTypeOptions = selectOptions['InstructionType']
        this.miscBillOptions = selectOptions['BillProduceType']
        this.transshipmentTypeOptions = selectOptions['Transshipment']
        this.waysOfDeclarationOptions = selectOptions['CustomType']
        this.tradeTermsOptions = selectOptions['TradeTerms']
        this.shipmentItemOptions = selectOptions['ShippingTerms']
        this.former_sea_instruction = response['formerData']
        if (this.former_sea_instruction.sea_cap_lists === null) {
          this.former_sea_instruction.sea_cap_lists = [{ number: 1, cap_type: undefined, order_master_id: parseInt(this.$route.params.id) }]
        }
        this.order_master = response['order']
        this.$emit('orderInfo', this.order_master)
      }).catch(error => {
        console.log(error)
      })
    },
    addCapList() {
      this[this.activeName].sea_cap_lists.push({ number: 1, cap_type: undefined, order_master_id: parseInt(this.$route.params.id) })
    },
    removeCapList(index) {
      this[this.activeName].sea_cap_lists.splice(index, 1)
    },
    getCooperator() {
      if (this.cooperator.length > 0) {
        this.cooperatorOptions = this.cooperator
      }
    },
    remoteCooperator() { },
    showPackType() {
      const val = this.order_master.order_extend_info.package_type_id
      if (val === '' || val === undefined || typeof (val) === 'undefined') {
        return ''
      }
      const value = this.packageTypeOptions.filter(item => item.id === val.toString())
      if (value.length > 0) {
        return value[0].name
      }
    },
    showCarrier(val) {
      if (val === '' || val === undefined || typeof (val) === 'undefined') {
        return ''
      }
      const value = this.carrierOptions.filter(item => item.id === val.toString())
      if (value.length > 0) {
        return value[0].name
      }
    },
    showPort(val) {
      if (val === '' || val === undefined || typeof (val) === 'undefined') {
        return ''
      }
      const value = this.portOptions.filter(item => item.id === val.toString())
      if (value.length > 0) {
        return value[0].name
      }
    },
    changeNabType(tab, event) {
      if (this.activeName === 'former_sea_book') {
        this.initBookingData()
      }
    },
    initBookingData() {
      if (this.isLoadingBookingData) {
        return false
      }
      getData(this.getFormerDataUrl + '/getFormerData', { formerType: 'former_sea_book' }, 'get').then(response => {
        this.former_sea_book = response['formerData']
        if (this.former_sea_book.sea_cap_lists === null) {
          this.former_sea_book.sea_cap_lists = [{ number: 1, cap_type: undefined, order_master_id: parseInt(this.$route.params.id) }]
        }
        this.isLoadingBookingData = true
      })
    },
    syncExtendInfo(val, field) {
      this.order_master.order_extend_info[field] = val
    },
    dataIsSave(activeName, oldActiveName) {
      if (this.isDataChange > 1) {
        this.$notify.warning({
          title: '警告',
          message: '当前数据发生改变,没有进行保存',
          duration: 5000
        })
        return false
      }
      this.isDataChange = 0
      return true
    },
    saveData() {
      let data = {}
      if (this.isDataChange <= 1) {
        this.$notify.error({
          title: '错误',
          message: '当前数据未发生改变,不允许进行保存',
          duration: 5000
        })
        return
      }
      if (this.activeName === 'former_sea_instruction') {
        data = { former_sea_instruction: this.former_sea_instruction, order_extend_info: this.order_master.order_extend_info }
      } else if (this.activeName === 'former_sea_book') {
        data = { former_sea_book: this.former_sea_book, order_extend_info: this.order_master.order_extend_info }
      }
      console.log(data)
      createData('/order/masters/' + this.$route.params.id + '/UpdateFormerData?former_type=' + this.activeName, data).then((response) => {
        this.$notify({
          title: 'Success',
          message: '保存数据成功',
          type: 'success',
          duration: 5000
        })
        this.isDataChange = 0
      }).catch(reason => {
        console.log(reason)
      })
    }
  }
}
</script>

<style lang="scss">
  .cap-list{
    .el-form-item{
      width: 30% !important;
      .el-select{
        width: 33%;
      }
      .cap-list-number{
        width: 40%;
      }
      .el-button{
        display: inline-block;
      }
    }
  }
</style>

