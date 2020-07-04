<template>
  <div>
    <el-card shadow="hover" style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>拖车单</span>
        <el-button type="primary" size="small" style="float: right;" @click="addOrder">新增</el-button>
      </div>
      <div v-for="(trail_order,order_index) in trailerOrderArray" :key="trail_order.id">
        <el-row>
          <keep-alive><former-save @click="saveData(trail_order, order_index)" /></keep-alive>
          <keep-alive><former-delete @click="deleteData(trail_order, order_index)" /></keep-alive>
        </el-row>
        <el-divider />
        <el-form ref="ruleForm" :inline="true" :model="trail_order" class="form-content-box" label-position="top" style="margin-bottom: 10px;">
          <el-row :gutter="5">
            <el-col :span="6" class="form-content-box-left">
              <el-form-item v-if="transportType === '1'" label="拖车类型" prop="of_way" size="small">
                <el-select v-model="trail_order.of_type" filterable placeholder="请选择" clearable style="width: 100%">
                  <el-option v-for="item in ofTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="发货人" prop="instruction_id" size="small">
                <el-select
                  v-model="trail_order.instruction_id"
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
              <el-form-item label="拖车公司" prop="trailer_company_id" size="small">
                <el-select
                  v-model="trail_order.trailer_company_id"
                  filterable
                  remote
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
              <el-form-item v-if="trail_order.of_type === 0" label="运输方式" prop="of_way" size="small">
                <el-select v-model="trail_order.of_way" filterable placeholder="请选择" clearable style="width: 100%">
                  <el-option v-for="item in ofWayOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item v-else label="运输方式" prop="of_way" size="small">
                <el-select v-model="trail_order.of_way" filterable placeholder="请选择" clearable style="width: 100%">
                  <el-option v-for="item in ofWay2Options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <div v-if="trail_order.of_type === 0">
                <el-form-item label="SO NO." prop="so_no" size="small">
                  <el-select v-model="trail_order.so_no" allow-create filterable clearable placeholder="请选择" style="width: 100%" @focus="getSoInfo">
                    <el-option v-for="item in soNoOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="起运港" prop="pol_id" size="small">
                  <el-select v-model="trail_order.pol_id" filterable clearable placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in portData" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
                  </el-select>
                  <el-form-item label="装货地/卸货地" prop="" size="small">
                    <el-input v-model="trail_order.destination" type="textarea" :rows="3" />
                  </el-form-item>
                </el-form-item>
              </div>
              <div v-else>
                <el-form-item label="出发地" prop="" size="small">
                  <el-input v-model="trail_order.departure" type="textarea" :rows="3" />
                </el-form-item>
                <el-form-item label="目的地" prop="" size="small">
                  <el-input v-model="trail_order.destination" type="textarea" :rows="3" />
                </el-form-item>
              </div>

              <el-form-item label="装货/卸货时间" size="small">
                <el-date-picker
                  v-model="trail_order.loading_date"
                  type="date"
                  placeholder="选择日期"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="18" class="form-content-box-center">
              <el-form-item label="拖车联系人" prop="trailer_contact_name" size="small">
                <el-input v-model="trail_order.trailer_contact_name" type="text" style="width: 100%" />
              </el-form-item>
              <el-form-item label="拖车联系人电话" prop="trailer_contact_name" size="small">
                <el-input v-model="trail_order.trailer_contact_phone" type="text" style="width: 100%" />
              </el-form-item>
              <el-form-item label="车牌号码" prop="trailer_number" size="small">
                <el-input v-model="trail_order.trailer_number" type="text" style="width: 100%" />
              </el-form-item>
              <el-divider />
              <el-form-item label="转关带司机本" size="small" prop="is_declare">
                <el-switch v-model="trail_order.is_driving_license" />
              </el-form-item>
              <el-form-item label="报关单证随车" size="small" prop="is_declare">
                <el-switch v-model="trail_order.is_declare" />
              </el-form-item>
              <el-form-item label="需要过磅" size="small" prop="is_weighing">
                <el-switch v-model="trail_order.is_weighing" />
              </el-form-item>
              <el-form-item label="小柜摆尾" size="small" prop="is_lockers">
                <el-switch v-model="trail_order.is_lockers" />
              </el-form-item>
              <el-divider />
              <div class="box-center-3">
                <el-row v-if="trail_order.of_type === 0" :gutter="5">
                  <el-col v-for="(cap_list, index) in trail_order.sea_cap_lists" :key="index" :span="12">
                    <el-form-item label="柜型" prop="cap_type" size="mini" style="width: 35%;">
                      <el-select v-model="cap_list.cap_type" filterable placeholder="请选择" size="mini" clearable>
                        <el-option v-for="item in capTypeData" :key="item.name" :label="item.name" :value="item.name" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="柜量" prop="number" size="mini" style="width: 35%;">
                      <el-input-number v-model="cap_list.number" :min="1" class="cap-list-number" size="mini" />
                    </el-form-item>
                    <el-form-item style="vertical-align: bottom;" size="mini"><el-button type="danger" size="mini" icon="el-icon-delete" @click.prevent="removeCapList(trail_order, index)" /></el-form-item>
                  </el-col>
                </el-row>
                <div v-if="trail_order.of_type === 0" style="margin-top: 10px;"><el-button type="primary" size="mini" @click.prevent="addCapList(trail_order)">新增</el-button></div>
                <el-divider />
                <el-form-item label="唛头" size="small">
                  <el-input v-model="trail_order.marks" type="textarea" :rows="8" style="width: 100%" />
                </el-form-item>
                <el-form-item label="货物描述" size="small">
                  <el-input
                    v-model="trail_order.description_of_good"
                    type="textarea"
                    :rows="8"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="尺寸" size="small">
                  <el-input v-model="trail_order.size" type="textarea" :rows="8" style="width: 100%" />
                </el-form-item>
                <el-form-item label="备注" size="small">
                  <el-input v-model="trail_order.remarks" type="textarea" :rows="8" style="width: 100%" />
                </el-form-item>
                <div class="pack-number-content">
                  <el-form-item label="数量" size="small">
                    <el-input-number
                      v-model="trail_order.number"
                      :min="1"
                      style="width: 100%"
                    />
                  </el-form-item>
                  <el-form-item label="包装类型" size="small">
                    <el-select
                      v-model="trail_order.package_type_id"
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
                    <el-input v-model="trail_order.gross_weight" style="width: 100%" type="number" />
                  </el-form-item>
                  <el-form-item label="体积(CBM)" size="small">
                    <el-input v-model="trail_order.volume" style="width: 100%" type="number" />
                  </el-form-item>
                  <el-divider />
                  <el-row v-if="trail_order.of_type === 0">
                    <el-col v-for="(trailer_cabinet, index) in trail_order.trailer_cabinet_numbers" :key="index" :span="12">
                      <el-form-item label="柜号" size="mini" prop="cabinet_number" style="width: 35%;">
                        <el-input v-model="trailer_cabinet.cabinet_number" />
                      </el-form-item>
                      <el-form-item label="封条号" size="mini" prop="cabinet_number" style="width: 35%;">
                        <el-input v-model="trailer_cabinet.seal_number" />
                      </el-form-item>
                      <el-form-item size="mini" style="vertical-align: bottom;">
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click.prevent="removeCabinetNumber(trail_order, index)" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div v-if="trail_order.of_type === 0" style="margin-top: 10px;"><el-button type="primary" size="mini" @click.prevent="addCabinetNumber(trail_order)">新增</el-button></div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-divider />
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import FormerSave from '../button/FormerSave'
import FormerDelete from '../button/FormerDelete'
import { getSoNoData } from '@/api/order_master'
import { createData, deleteData } from '@/api/index_data'

export default {
  name: 'TrailerOrder',
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
    },
    portData: {
      type: Array,
      required: true
    },
    packageData: {
      type: Array,
      required: true
    },
    capTypeData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loadingCooperator: false,
      trailerOrderArray: [],
      ofWayOption: [{ value: 0, label: '出口拖车' }, { value: 1, label: '进口拖车' }],
      ofWay2Options: [{ value: 0, label: '整车运输' }, { value: 1, label: '零担运输' }],
      ofTypeOptions: [{ value: 0, label: '码头拖车' }, { value: 1, label: '内陆运输拖车' }],
      soNoOptions: []
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
          this.trailerOrderArray = newVal
        }
      }
    },
    portData: {
      immediate: true,
      handler(newVal) {
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
    },
    packageData: {
      immediate: true,
      handler(newVal) {
      }
    },
    capTypeData: {
      immediate: true,
      handler(newVal) {
      }
    }
  },
  methods: {
    getSoInfo() {
      if (this.soNoOptions.length <= 0) {
        getSoNoData(this.$route.params.id).then((response) => {
          this.soNoOptions = response
        })
      }
    },
    saveData(trailer_order, index) {
      this.$refs['ruleForm'][index].validate((valid) => {
        if (valid) {
          createData('/order/masters/SaveOtherServer?former_type=former_trailer_order', { former_trailer_order: trailer_order }).then((response) => {
            this.$notify({ title: 'Success', message: '保存数据成功', type: 'success', duration: 5000 })
            trailer_order.id = response.id
          })
        } else {
          return false
        }
      })
    },
    deleteData(trailer_order, index) {
      if (typeof (trailer_order.id) === 'undefined' || trailer_order.id === null) {
        this.trailerOrderArray.splice(index, 1)
        return
      }
      this.$confirm('是否继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData('/order/masters/' + trailer_order.id + '/DeleteOtherServer?former_type=former_trailer_order').then((response) => {
          this.trailerOrderArray.splice(index, 1)
          this.$notify({ title: 'Success', message: '删除数据成功', type: 'success', duration: 5000 })
        })
      }).catch(() => {
      })
    },
    removeCapList(trailer_order, index) {
      trailer_order.sea_cap_lists.splice(index, 1)
    },
    addCapList(trailer_order) {
      trailer_order.sea_cap_lists.push({ cap_type: undefined, number: 1 })
    },
    addCabinetNumber(trailer_order) {
      trailer_order.trailer_cabinet_numbers.push({ cabinet_number: undefined, seal_number: undefined })
    },
    removeCabinetNumber(trailer_order, index) {
      trailer_order.trailer_cabinet_numbers.splice(index, 1)
    },
    addOrder() {
      this.trailerOrderArray.push(this.inputOrder())
    },
    inputOrder() {
      return {
        id: undefined,
        order_master_id: parseInt(this.$route.params.id),
        instruction_id: this.$store.state.orderMaster.receiveClosingUnitId,
        trailer_company_id: undefined,
        trailer_contact_name: undefined,
        trailer_contact_phone: undefined,
        trailer_number: undefined,
        of_way: undefined,
        so_no: undefined,
        loading_date: undefined,
        pol_id: undefined,
        is_driving_license: undefined,
        is_declare: undefined,
        is_weighing: undefined,
        is_lockers: undefined,
        marks: undefined,
        description_of_good: undefined,
        size: undefined,
        number: undefined,
        package_type_id: undefined,
        gross_weight: undefined,
        volume: undefined,
        remarks: undefined,
        of_type: this.transportType === '1' ? 0 : 1,
        departure: undefined,
        destination: undefined,
        sea_cap_lists: [],
        trailer_cabinet_numbers: []
      }
    }
  }
}
</script>
