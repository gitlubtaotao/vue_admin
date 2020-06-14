<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row id="operation-header" type="flex" class="row-bg" justify="center">
        <el-col :offset="2" :span="3" />
        <el-col :span="3"><el-tag>{{ order_master.serial_number }}</el-tag></el-col>
        <el-col :span="4"><el-tag> {{ order_master.instruction_name }}</el-tag></el-col>
        <el-col :span="2"><el-tag>{{ order_master.transport_type }}</el-tag></el-col>
        <el-col v-if="order_master.order_extend_info.pol_id" :span="4"><el-tag> {{ showPolInfo() }}</el-tag></el-col>
        <el-col v-if="order_master.order_extend_info.carrier_id" :span="3"><el-tag>{{ showCarrierInfo() }}</el-tag></el-col>
        <el-col :span="3"><el-tag type="danger">{{ order_master.status }}</el-tag></el-col>
        <el-col :span="3"><el-tag>{{ showDate(order_master.created_at) }}</el-tag></el-col>
        <el-col :offset="2" :span="3" />
      </el-row>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px;">
      <div slot="header">
        <ButtonList :order-master="order_master" />
      </div>
      <el-tabs>
        <el-tab-pane label="操作">
          <sea-page v-if="transport_type === '1' || transport_type === '4'" :order-master="order_master" />
        </el-tab-pane>
        <el-tab-pane label="录入费用">
          <operation-fee />
        </el-tab-pane>
        <el-tab-pane label="附件">附件</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import { getData } from '@/api/index_data'
import { parseTime } from '@/utils'
import SeaPage from '../components/sea/SeaPage'
import OperationFee from '../components/OperationFee'
import ButtonList from '../components/ButtonList'
export default {
  name: 'OrderOperation',
  components: { SeaPage, OperationFee, ButtonList },
  data() {
    return {
      id: this.$route.params && this.$route.params.id,
      transport_type: this.$route.query.transport_type,
      order_master: {
        serial_number: '',
        instruction_name: '',
        transport_type: '',
        pol_info: '',
        pod_info: '',
        carrier_info: '',
        status: '',
        create_at: '',
        order_extend_info: {
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
          flight_no: undefined,
          charged_weight: undefined,
          courier_code_id: undefined,
          courier_no: undefined,
          shipper_id: undefined
        }
      },
      polOptions: [],
      carrierOptions: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 显示日期
    showDate(time) {
      return parseTime(time, '{y}-{m}-{d}')
    },
    showPolInfo() { return '' },
    showCarrierInfo() { return '' },
    initData() {
      getData('/order/masters/' + this.id + '/operation', {}, 'get').then(response => {
        this.order_master = response.data
        this.polOptions = response.polOptions
        this.carrierOptions = response.carrierOptions
      })
    }
  }
}
</script>
<style lang="scss">
  #operation-header{
    .el-col{
      text-align: center;
    }
  }
  .demo-form-inline{
    .left-content{
      .el-form-item{
        width: 18%;
      }
    }
    .middle-content{
      .el-form-item{
        width: 45%;
      }
      .order-master-remark{
        width: 90%;
      }
    }
    .right-content{
      .el-form-item{
        width: 45%;
      }
    }
    .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
    }
    .el-form-item__label{
      line-height: 20px;
      font-weight: 400;
      padding: 5px 0 5px;
    }
  }
  .form-content-box{
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: auto;
    }
    .el-divider--horizontal{
       margin: 10px 0;
     }
    .el-form-item__label{
      line-height: 15px;
      font-weight: 400;
      padding: 5px 0 5px;
    }
  }
  .form-content-box-left{
    border-right: 1px solid #EBEEF5;
    .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
      width: 98%;
    }
  }
  .form-content-box-center{
    border-right: 1px solid #EBEEF5;
    .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
      width: 24.5%;
    }
  }
  .form-content-box-right{
    .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
      width: 98%;
    }
  }
</style>
