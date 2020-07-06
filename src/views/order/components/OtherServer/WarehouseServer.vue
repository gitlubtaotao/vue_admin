<template>
  <div>
    <el-card shadow="hover" style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>仓库/场装服务</span>
        <el-button v-if="orderMasterStatus === 'processing'" type="primary" size="small" style="float: right;" @click="addOrder">新增</el-button>
      </div>
      <div v-for="(order,order_index) in warehouseServerArray" :key="order.id">
        <el-row>
          <keep-alive><former-save @click="saveData(order, order_index)" /></keep-alive>
          <keep-alive><former-delete @click="deleteData(order, order_index)" /></keep-alive>
        </el-row>
        <el-divider />
        <el-form ref="ruleForm" :inline="true" :model="order" class="form-content-box" label-position="top" style="margin-bottom: 10px;">
          <el-row :gutter="5">
            <el-col :span="6" class="form-content-box-left">
              <el-form-item label="委托单位" prop="instruction_id" size="small">
                <el-select v-model="order.instruction_id" filterable remote placeholder="请选择" size="small" clearable style="width: 100%">
                  <el-option v-for="item in customerData" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="入仓单号" prop="warehouse_no" size="small">
                <el-input v-model="order.warehouse_no" type="text" maxlength="16" show-word-limit />
              </el-form-item>
              <el-form-item label="入仓时间" size="small" prop="warehouse_date">
                <el-date-picker v-model="order.warehouse_date" type="date" placeholder="选择日期" style="width:100%" />
              </el-form-item>
              <el-form-item label="仓库名称" prop="仓库名称" size="small">
                <el-select v-model="order.warehouse_name" filterable remote placeholder="请选择" size="small" clearable style="width: 100%" @focus="getWarehouseData" @change="setOtherWarehouseData($event,order)">
                  <el-option v-for="item in warehouseOptions" :key="item.name" :label="item.name" :value="item.name" />
                </el-select>
              </el-form-item>
              <el-form-item label="仓库地址" prop="warehouse_address" size="small">
                <el-input v-model="order.warehouse_address" type="textarea" maxlength="256" show-word-limit />
              </el-form-item>
              <el-form-item label="仓库联系人" prop="warehouse_contact" size="small">
                <el-input v-model="order.warehouse_contact" type="text" maxlength="32" show-word-limit />
              </el-form-item>
              <el-form-item label="仓库联系人电话" prop="warehouse_contact_phone" size="small">
                <el-input v-model="order.warehouse_contact_phone" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="18" class="form-content-box-center">
              <el-form-item label="唛头" size="small">
                <el-input v-model="order.marks" type="textarea" :rows="8" style="width: 100%" />
              </el-form-item>
              <el-form-item label="货物描述" size="small">
                <el-input v-model="order.description_of_good" type="textarea" :rows="8" style="width: 100%" />
              </el-form-item>
              <el-form-item label="尺寸" size="small">
                <el-input v-model="order.size" type="textarea" :rows="8" style="width: 100%" />
              </el-form-item>
              <div class="pack-number-content">
                <el-form-item label="数量" size="small">
                  <el-input-number
                    v-model="order.number"
                    :min="1"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="包装类型" size="small">
                  <el-select
                    v-model="order.package_type_id"
                    filterable
                    placeholder="请选择"
                    size="small"
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in packageData"
                      :key="parseInt(item.id)"
                      :label="item.name"
                      :value="parseInt(item.id)"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="毛重(KGS)" size="small">
                  <el-input v-model="order.gross_weight" style="width: 100%" type="number" />
                </el-form-item>
                <el-form-item label="体积(CBM)" size="small">
                  <el-input v-model="order.volume" style="width: 100%" type="number" />
                </el-form-item>
              </div>
              <el-divider />
              <el-form-item label="送货说明" prop="delivery_remarks" size="small">
                <el-input v-model="order.delivery_remarks" type="textarea" :rows="5" maxlength="256" show-word-limit />
              </el-form-item>
              <el-form-item label="配货原因" prop="distribution_remarks" size="small">
                <el-input v-model="order.distribution_remarks" type="textarea" :rows="5" maxlength="256" show-word-limit />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import FormerDelete from '../button/FormerDelete'
import FormerSave from '../button/FormerSave'
import { getWarehouseAddress } from '@/api/select'

import { createData, deleteData } from '@/api/index_data'

export default {
  name: 'WarehouseServer',
  components: { FormerDelete, FormerSave },
  props: {
    orderList: {
      required: true,
      type: Array
    },
    customerData: {
      required: true,
      type: Array
    },
    packageData: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      warehouseServerArray: [],
      warehouseOptions: []
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
          this.warehouseServerArray = newVal
        }
      }
    },
    customerData: {
      immediate: true,
      handler(newVal) {
      }
    },
    packageData: {
      immediate: true,
      handler(newVal) {
      }
    }
  },
  methods: {
    saveData(order, order_index) {
      this.$refs['ruleForm'][order_index].validate((valid) => {
        if (valid) {
          createData('/order/masters/SaveOtherServer?former_type=former_warehouse_service', { former_warehouse_service: order }).then((response) => {
            this.$notify({ title: 'Success', message: '保存数据成功', type: 'success', duration: 5000 })
            order.id = response.id
          })
        } else {
          return false
        }
      })
    },
    deleteData(order, order_index) {
      if (typeof (order.id) === 'undefined' || order.id === null) {
        this.warehouseServerArray.splice(order_index, 1)
        return
      }
      this.$confirm('是否继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData('/order/masters/' + order.id + '/DeleteOtherServer?former_type=former_warehouse_service').then((response) => {
          this.warehouseServerArray.splice(order_index, 1)
          this.$notify({ title: 'Success', message: '删除数据成功', type: 'success', duration: 5000 })
        })
      }).catch(() => {
      })
    },
    addOrder() {
      this.warehouseServerArray.push({
        order_master_id: parseInt(this.$route.params.id),
        instruction_id: this.$store.state.orderMaster.receiveClosingUnitId,
        warehouse_no: undefined,
        warehouse_date: undefined,
        warehouse_name: undefined,
        warehouse_address: undefined,
        warehouse_contact: undefined,
        warehouse_contact_phone: undefined,
        marks: undefined,
        description_of_good: undefined,
        size: undefined,
        number: undefined,
        package_type_id: undefined,
        gross_weight: undefined,
        volume: undefined,
        delivery_remarks: undefined,
        distribution_remarks: undefined
      })
    },
    getWarehouseData() {
      console.log(this.warehouseOptions.length)
      if (this.warehouseOptions.length <= 0) {
        getWarehouseAddress('').then(response => {
          this.warehouseOptions = response
        }).catch((reason) => {
          console.log(reason)
        })
      }
    },
    setOtherWarehouseData(val, order) {
      const result = this.warehouseOptions.filter(item => {
        return item.name === val
      })
      if (result.length <= 0) {
        return
      }
      order.warehouse_contact_phone = result[0].contact_tel
      order.warehouse_contact = result[0].contact_name
      order.warehouse_address = result[0].detail
    }
  }
}
</script>
