<template>
  <div id="app-container">
    <div>
      <el-card shadow="never">
        <div slot="header">
          <keep-alive>
            <ButtonList :order-master="order_master" @saveData="saveData" />
          </keep-alive>
        </div>
        <el-form :inline="true" :model="order_master" class="demo-form-inline" label-position="top">
          <el-col :span="14" class="left-content">
            <el-form-item label="主单号" size="small">
              <el-input v-model="order_master.order_extend_info.mbl_so" type="text" />
            </el-form-item>
            <el-form-item label="船公司" size="small">
              <el-select v-model="order_master.order_extend_info.carrier_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                <el-option v-for="item in carrierData" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
              </el-select>
            </el-form-item>
            <el-form-item label="截关/截港日期" size="small">
              <el-date-picker
                v-model="order_master.order_extend_info.cut_off_day"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item label="船名" size="small">
              <el-input v-model="order_master.order_extend_info.vessel" type="text" />
            </el-form-item>
            <el-form-item label="航次" size="small">
              <el-input v-model="order_master.order_extend_info.voyage" type="text" />
            </el-form-item>
            <el-form-item label="离港日期" size="small">
              <el-date-picker
                v-model="order_master.order_extend_info.departure"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item label="到港日期" size="small">
              <el-date-picker
                v-model="order_master.order_extend_info.arrival"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" class="middle-content">
            <el-form-item label="包装数量" size="small">
              <el-input v-model="order_master.order_extend_info.number" placeholder="包装数量" type="number" />
            </el-form-item>
            <el-form-item label="包装类型" size="small">
              <el-select v-model="order_master.order_extend_info.package_type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                <el-option v-for="item in packageTypeData" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
              </el-select>
            </el-form-item>
            <el-form-item label="毛重(KGS)" size="small">
              <el-input v-model="order_master.order_extend_info.gross_weight" placeholder="毛重" type="number" />
            </el-form-item>
            <el-form-item label="体积(CBM)" size="small">
              <el-input v-model="order_master.order_extend_info.volume" placeholder="体积(CBM)" type="number" />
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
        </el-form>
      </el-card>
    </div>
    <div style="margin-top: 10px;">
      <el-tabs type="border-card">
        <el-tab-pane label="综合服务" :lazy="true">
          <other-server />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import ButtonList from '../ButtonList'
import OtherServer from './index'
import { getData, createData } from '@/api/index_data'

export default {
  name: 'OtherPage',
  components: { ButtonList, OtherServer },
  data() {
    return {
      getFormerDataUrl: '/order/masters/' + this.$route.params.id,
      carrierData: [],
      packageTypeData: [],
      order_master: {
        order_extend_info: {
          id: undefined,
          order_master_id: undefined,
          carrier_id: undefined,
          number: undefined,
          package_type_id: undefined,
          gross_weight: undefined,
          volume: undefined,
          mbl_so: undefined,
          cut_off_day: undefined,
          departure: undefined,
          arrival: undefined,
          vessel: undefined,
          voyage: undefined
        }
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    saveData() {
      const data = { order_extend_info: this.order_master.order_extend_info }
      createData('/order/masters/' + this.$route.params.id + '/UpdateFormerData?former_type=' + '', data).then((response) => {
        this.$notify({
          title: 'Success',
          message: '保存数据成功',
          type: 'success',
          duration: 5000
        })
      }).catch(reason => {
        console.log(reason)
      })
    },
    initData() {
      getData(this.getFormerDataUrl + '/operation', { }, 'get').then(response => {
        this.order_master = response['order']
        this.$emit('orderInfo', this.order_master)
        this.$store.dispatch('orderMaster/setReceiveClosingUnit', this.order_master.instruction_id)
        this.$store.dispatch('orderMaster/setOrderMasterStatus', this.order_master.status)
        const selectOptions = response['selectOptions']
        this.packageTypeData = selectOptions['PackageType']
        this.carrierData = selectOptions['carrier']
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .demo-form-inline .left-content .el-form-item {
    width: 22%;
  }
</style>
