<template>
  <div id="app-container">
    <el-col :span="24">
      <el-card shadow="never">
        <div>
          <el-form :inline="true" :model="orderMaster" class="demo-form-inline" label-position="top">
            <el-row :gutter="5">
              <el-col :span="14" class="left-content">
                <el-form-item label="MBL NO." size="small">
                  <el-input v-model="orderMaster.order_extend_info.mbl_so" disabled />
                </el-form-item>
                <el-form-item label="HBL NO." size="small">
                  <el-input v-model="orderMaster.order_extend_info.hbl_so" disabled />
                </el-form-item>
                <el-form-item label="船公司." size="small">
                  <el-input v-model="orderMaster.order_extend_info.carrier_name" disabled />
                </el-form-item>
                <el-form-item label="截关/截港日期" size="small">
                  <el-input v-model="orderMaster.order_extend_info.cut_off_day" disabled />
                </el-form-item>
                <el-form-item label="截放行条时间" size="small">
                  <el-input v-model="orderMaster.order_extend_info.carrier_name" disabled />
                </el-form-item>
                <el-form-item label="起运港." size="small">
                  <el-input v-model="orderMaster.order_extend_info.mbl_so" disabled />
                </el-form-item>
                <el-form-item label="目的港" size="small">
                  <el-input v-model="orderMaster.order_extend_info.hbl_so" disabled />
                </el-form-item>
                <el-form-item label="船名" size="small">
                  <el-input v-model="orderMaster.order_extend_info.vessel" disabled />
                </el-form-item>
                <el-form-item label="航次" size="small">
                  <el-input v-model="orderMaster.order_extend_info.voyage" disabled />
                </el-form-item>
                <el-form-item label="VGM截止时间" size="small">
                  <el-input v-model="orderMaster.order_extend_info.carrier_name" placeholder="HBL NO." disabled />
                </el-form-item>
                <el-form-item label="SO NO." size="small">
                  <el-input v-model="orderMaster.order_extend_info.mbl_so" placeholder="MBL NO." disabled />
                </el-form-item>
                <el-form-item label="货量" size="small">
                  <el-input v-model="orderMaster.order_extend_info.number" placeholder="" disabled />
                </el-form-item>
                <el-form-item label="离港日期" size="small">
                  <el-input v-model="orderMaster.order_extend_info.departure" disabled />
                </el-form-item>
                <el-form-item label="到港日期" size="small">
                  <el-input v-model="orderMaster.order_extend_info.arrival" disabled />
                </el-form-item>
                <el-form-item label="截补料时间" size="small">
                  <el-input v-model="orderMaster.order_extend_info.carrier_name" placeholder="HBL NO." disabled />
                </el-form-item>
              </el-col>
              <el-col :span="4" class="middle-content">
                <el-form-item label="包装数量" size="small">
                  <el-input v-model="orderMaster.order_extend_info.number" placeholder="包装数量" disabled />
                </el-form-item>
                <el-form-item label="包装类型" size="small">
                  <el-input v-model="orderMaster.order_extend_info.carrier_name" placeholder="HBL NO." disabled />
                </el-form-item>
                <el-form-item label="毛重(KGS)" size="small">
                  <el-input v-model="orderMaster.order_extend_info.gross_weight" placeholder="HBL NO." disabled />
                </el-form-item>
                <el-form-item label="体积(CBM)" size="small">
                  <el-input v-model="orderMaster.order_extend_info.volume" placeholder="HBL NO." disabled />
                </el-form-item>
                <el-form-item label="订单备注" size="small" class="order-master-remark">
                  <el-input v-model="orderMaster.remarks" placeholder="HBL NO." disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6" class="right-content">
                <el-form-item label="操作员" size="small" class="order-master-remark">
                  <el-input v-model="orderMaster.operation_name" placeholder="" disabled />
                </el-form-item>
                <el-form-item label="业务员" size="small" class="order-master-remark">
                  <el-input v-model="orderMaster.salesman_name" placeholder="" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top: 10px;">
      <el-tabs type="border-card">
        <el-tab-pane>
          <div slot="label">
            <span>委托单(HBL)</span>
            <el-dropdown>
              <span class="el-dropdown-link"><i class="el-icon-arrow-down el-icon--right" /></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <former-sea-instruction :order-extend-info="orderMaster.order_extend_info" />
        </el-tab-pane>
        <el-tab-pane label="订舱单(MBL)">配置管理</el-tab-pane>
        <el-tab-pane label="SO NO.">角色管理</el-tab-pane>
        <el-tab-pane label="综合服务">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-col>
  </div>
</template>
<script>
import FormerSeaInstruction from './FormerSeaInstruction'
export default {
  name: 'SeaPage',
  components: { FormerSeaInstruction },
  props: {
    orderMaster: {
      required: true,
      type: Object
    }
  },
  watch: {
    orderMaster: {
      immediate: true, // 这句重要
      handler(val) {
        this.orderMaster = val
      }
    }
  },
  created() { }
}
</script>

