<template>
  <div>
    <el-card shadow="hover" style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>其他服务</span>
        <el-button v-if="orderMasterStatus === 'processing'" type="primary" size="small" style="float: right;" @click="addOrder">新增</el-button>
      </div>
      <div v-for="(former,order_index) in order_server_array" :key="former.id">
        <el-row>
          <keep-alive><former-save @click="saveData(former, order_index)" /></keep-alive>
          <keep-alive><former-delete @click="deleteData(former, order_index)" /></keep-alive>
        </el-row>
        <el-divider />
        <el-form ref="ruleForm" :inline="true" :model="former" class="form-content-box" label-position="top" style="margin-bottom: 10px;">
          <el-row :gutter="5">
            <el-col :span="6" class="form-content-box-left">
              <el-form-item label="委托单位" prop="instruction_id" size="small">
                <el-select
                  v-model="former.instruction_id"
                  filterable
                  remote
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
              <el-form-item prop="remarks" label="备注" size="small">
                <el-input v-model="former.remarks" type="textarea" :rows="5" maxlength="256" show-word-limit />
              </el-form-item>
            </el-col>
            <el-col :span="18" class="form-content-box-center">
              <el-form-item v-for="(list) in supplyList" :key="list.key" :label="list.value" :prop="list.key" size="small">
                <el-select
                  v-model="former[list.key]"
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
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import FormerSave from '../button/FormerSave'
import FormerDelete from '../button/FormerDelete'
import { createData, deleteData } from '@/api/index_data'

export default {
  name: 'IntegratedOrder',
  components: { FormerSave, FormerDelete },
  props: {
    orderList: {
      type: Array,
      required: true
    },
    customerData: {
      type: Array,
      required: true
    },
    supplyData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      order_server_array: [],
      supplyList: [
        { key: 'fumigation_company_id', value: '熏蒸公司' },
        { key: 'trader_company_id', value: '贸易商' },
        { key: 'commodity_inspection_id', value: '商检机构' },
        { key: 'magnetic_inspection_id', value: '磁检机构' },
        { key: 'accreditation_company_id', value: '鉴定机构' },
        { key: 'insurance_company_id', value: '保险公司' }
      ]
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
          this.order_server_array = newVal
        }
      }
    },
    supplyData: {
      immediate: true,
      handler(newVal) {
      }
    },
    customerData: {
      immediate: true,
      handler(newVal) {
      }
    }
  },
  methods: {
    saveData(former, index) {
      this.$refs['ruleForm'][index].validate((valid) => {
        if (valid) {
          createData('/order/masters/SaveOtherServer?former_type=former_other_service', { former_other_service: former }).then((response) => {
            this.$notify({ title: 'Success', message: '保存数据成功', type: 'success', duration: 5000 })
            former.id = response.id
          })
        } else {
          return false
        }
      })
    },
    deleteData(former, index) {
      if (typeof (former.id) === 'undefined' || former.id === null) {
        this.order_server_array.splice(index, 1)
        return
      }
      this.$confirm('是否继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData('/order/masters/' + former.id + '/DeleteOtherServer?former_type=former_other_service').then((response) => {
          this.order_server_array.splice(index, 1)
          this.$notify({ title: 'Success', message: '删除数据成功', type: 'success', duration: 5000 })
        })
      }).catch(() => {
      })
    },
    addOrder() {
      this.order_server_array.push({
        instruction_id: this.$store.state.orderMaster.receiveClosingUnitId,
        fumigation_company_id: undefined,
        trader_company_id: undefined,
        commodity_inspection_id: undefined,
        magnetic_inspection_id: undefined,
        accreditation_company_id: undefined,
        insurance_company_id: undefined,
        remarks: undefined,
        order_master_id: parseInt(this.$route.params.id)
      })
    }
  }
}
</script>
