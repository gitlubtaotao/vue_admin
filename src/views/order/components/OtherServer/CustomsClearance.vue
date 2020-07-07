<template>
  <div>
    <el-card shadow="hover" style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>报关服务</span>
        <el-button v-if="orderMasterStatus === 'processing'" type="primary" size="small" style="float: right;" @click="addOrder">新增</el-button>
      </div>
      <div v-for="(former,order_index) in formerCustomsClearance" :key="former.id">
        <el-row>
          <keep-alive><former-save @click="saveData(former, order_index)" /></keep-alive>
          <keep-alive><former-delete @click="deleteData(former, order_index)" /></keep-alive>
          <keep-alive><former-clone @click="copyData(former,order_index)" /></keep-alive>
        </el-row>
        <el-divider />
        <el-form ref="ruleForm" :inline="true" :model="former" class="form-content-box" label-position="top" style="margin-bottom: 10px;">
          <el-row :gutter="5">
            <el-col :span="6" class="form-content-box-left">
              <el-form-item label="委托单位" prop="instruction_id" size="small">
                <el-select
                  v-model="former.instruction_id"
                  filterable
                  placeholder="请选择"
                  size="small"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in customerData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="报关代理" prop="customs_broker_id" size="small">
                <el-select
                  v-model="former.customs_broker_id"
                  filterable
                  placeholder="请选择"
                  size="small"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in supplyData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="原产国" prop="origin_country_id" size="small">
                <el-select v-model="former.origin_country_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                  <el-option v-for="item in countryData" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="商品编码" prop="hs_code" size="small">
                <el-input v-model="former.hs_code" type="text" />
              </el-form-item>
              <el-form-item label="许可证号" prop="licence_no" size="small">
                <el-input v-model="former.licence_no" type="text" />
              </el-form-item>
              <el-form-item label="商检编号" prop="inspect_no" size="small">
                <el-input v-model="former.inspect_no" type="text" />
              </el-form-item>
              <el-form-item label="起运港" prop="port_id" size="small">
                <el-select v-model="former.port_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                  <el-option v-for="item in portData" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="18" class="form-content-box-center">
              <el-form-item label="报关单号" prop="custom_no" size="small">
                <el-input v-model="former.custom_no" type="text" />
              </el-form-item>
              <el-form-item label="报关日期" prop="custom_date" size="small">
                <el-date-picker v-model="former.custom_date" type="date" placeholder="选择日期" style="width:100%" />
              </el-form-item>
              <el-form-item label="报关方式" prop="custom_type_id" size="small">
                <el-select v-model="former.custom_type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                  <el-option v-for="item in customTypeData" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                </el-select>
              </el-form-item>
              <el-form-item label="申报货币" prop="currency_id" size="small">
                <el-select v-model="former.currency_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                  <el-option v-for="item in currencyData" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                </el-select>
              </el-form-item>
              <el-form-item label="确认日期" prop="submit_date" size="small">
                <el-date-picker v-model="former.submit_date" type="date" placeholder="选择日期" style="width:100%" />
              </el-form-item>
              <el-divider />
              <el-form-item label="起运国" prop="departure_country_id" size="small">
                <el-select v-model="former.departure_country_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                  <el-option v-for="item in countryData" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                </el-select>
              </el-form-item>
              <el-form-item label="目的国" prop="destination_country_id" size="small">
                <el-select v-model="former.destination_country_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                  <el-option v-for="item in countryData" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                </el-select>
              </el-form-item>
              <el-form-item label="运输方式" prop="of_transport_id" size="small">
                <el-select v-model="former.of_transport_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
                  <el-option v-for="item in transTypeData" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                </el-select>
              </el-form-item>
              <el-form-item label="需要退税" size="small" prop="is_weighing">
                <el-switch v-model="former.has_drawback" />
              </el-form-item>
              <el-form-item label="退税地址" size="small" prop="drawback_address">
                <el-input v-model="former.drawback_address" type="textarea" :rows="8" maxlength="256" show-word-limit style="width: 100%" />
              </el-form-item>
              <el-form-item label="报关资料送至地址" size="small" prop="file_deliver_address">
                <el-input v-model="former.file_deliver_address" type="textarea" :rows="8" maxlength="256" show-word-limit style="width: 100%" />
              </el-form-item>
              <el-form-item label="备注" size="small" prop="remarks">
                <el-input v-model="former.remarks" type="textarea" :rows="8" maxlength="256" show-word-limit style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import FormerClone from '../button/FormerClone'
import FormerDelete from '../button/FormerDelete'
import FormerSave from '../button/FormerSave'
import { createData, deleteData } from '@/api/index_data'
export default {
  name: 'CustomsClearance',
  components: { FormerClone, FormerDelete, FormerSave },
  props: {
    orderList: {
      required: true,
      type: Array
    },
    customerData: {
      required: true,
      type: Array
    },
    supplyData: {
      required: true,
      type: Array
    },
    portData: {
      required: true,
      type: Array
    },
    customTypeData: {
      required: true,
      type: Array
    },
    transTypeData: {
      required: true,
      type: Array
    },
    currencyData: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      countryData: [],
      formerCustomsClearance: []
    }
  },
  computed: {
    orderMasterStatus: function() {
      return this.$store.state.orderMaster.orderMasterStatus
    },
    transportType: function() {
      return this.$route.query.transport_type
    }
  },
  watch: {
    orderList: {
      immediate: true,
      handler(newVal) {
        if (newVal.length > 0) {
          this.formerCustomsClearance = newVal
        }
      }
    },
    customerData: {
      immediate: true,
      handler(newVal) {
      }
    },
    supplyData: {
      immediate: true,
      handler(newVal) {
      }
    },
    portData: {
      immediate: true,
      handler(newVal) {
      }
    },
    customTypeData: {
      immediate: true,
      handler(newVal) {
      }
    },
    transTypeData: {
      immediate: true,
      handler(newVal) {
      }
    },
    currencyData: {
      immediate: true,
      handler(newVal) {
      }
    }
  },
  methods: {
    saveData(order, order_index) {
      createData('/order/masters/SaveOtherServer?former_type=former_custom_clearance', { former_custom_clearance: order }).then((response) => {
        this.$notify({ title: 'Success', message: '保存数据成功', type: 'success', duration: 5000 })
        order.id = response.id
      }).catch(reason => { console.log(reason) })
    },
    deleteData(order, order_index) {
      if (typeof (order.id) === 'undefined' || order.id === null) {
        this.formerCustomsClearance.splice(order_index, 1)
        return
      }
      deleteData('/order/masters/' + order.id + '/DeleteOtherServer?former_type=former_custom_clearance').then((response) => {
        this.formerCustomsClearance.splice(order_index, 1)
        this.$notify({ title: 'Success', message: '删除数据成功', type: 'success', duration: 5000 })
      })
    },
    copyData(order, order_index) {
      const data = this.formerCustomsClearance[this.formerCustomsClearance.length - 1]
      const result = JSON.parse(JSON.stringify(data))
      result.id = undefined
      this.formerCustomsClearance.push(result)
      this.saveData(result, this.formerCustomsClearance.length - 1)
    },
    addOrder() {
      this.formerCustomsClearance.push({
        order_master_id: parseInt(this.$route.params.id),
        instruction_id: this.$store.state.orderMaster.receiveClosingUnitId,
        customs_broker_id: undefined,
        origin_country_id: undefined,
        hs_code: undefined,
        licence_no: undefined,
        custom_no: undefined,
        custom_date: undefined,
        custom_type_id: undefined,
        currency_id: undefined,
        submit_date: undefined,
        inspect_no: undefined,
        port_id: undefined,
        departure_country_id: undefined,
        destination_country_id: undefined,
        has_drawback: undefined,
        drawback_address: undefined,
        file_deliver_address: undefined,
        of_transport_id: undefined,
        remarks: undefined
      })
      this.$notify({ title: 'Success', message: '新增成功', type: 'success', duration: 5000 })
    }
  }
}
</script>
