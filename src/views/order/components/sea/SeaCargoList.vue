<template>
  <div style="margin-top: 20px;">
    <el-table key="crm_users" :data="sea_cargo_array" fit max-height="500" border style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" fixed="left" />
      <el-table-column label="柜型" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.cap_type" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in capTypeOptions" :key="parseInt(item.id)" :label="item.name" :value="item.name" />
            </el-select>
          </template>
          <span v-else>{{ scope.row.cap_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="柜号" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.container_no" size="small" />
          </template>
          <span v-else>{{ scope.row.container_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封条号" withd="120">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.seal_no" size="small" />
          </template>
          <span v-else>{{ scope.row.seal_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="包装数量" width="140px">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input-number v-model="scope.row.number" size="small" controls-position="right" :min="1" :max="10" />
          </template>
          <span v-else>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="包装类型" width="120px">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.package_type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in packageTypeOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
            </el-select>
          </template>
          <span v-else>{{ showPackType(scope.row.package_type_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SO NO." width="130px">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.so_no" filterable allow-create default-first-option placeholder="请选择" size="small" @focus="getSoNoOptions">
              <el-option v-for="item in SoNoOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
          <span v-else>{{ scope.row.so_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="体积" width="100px">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.volume" size="small" />
          </template>
          <span v-else>{{ scope.row.volume }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毛重" width="100px">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.gross_weight" :min="1" size="small" />
          </template>
          <span v-else>{{ scope.row.gross_weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重量单位" width="120px">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.gross_unit" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in gross_unit_array" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
          <span v-else>{{ showUnit(scope.row.gross_unit) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="称重方式" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.include_container" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in include_container_array" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
          <span v-else>{{ showContainer(scope.row.include_container) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="柜重" width="100px">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.container_weight" size="small" type="number" />
          </template>
          <span v-else>{{ scope.row.container_weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="净重" width="100px">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.verified_gross_mass" size="small" type="number" />
          </template>
          <span v-else>{{ scope.row.verified_gross_mass }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VGM重量" width="100px">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.vgm_weight" size="small" type="number" />
          </template>
          <span v-else>{{ scope.row.vgm_weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货物描述" width="200px;">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.description_of_good" size="small" />
          </template>
          <span v-else>{{ scope.row.description_of_good }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.edit" type="primary" icon="el-icon-edit" size="mini" @click="editCargoInfo(scope.row,scope.$index,true)" />
          <el-button v-if="scope.row.edit" type="danger" icon="el-icon-close" size="mini" @click="editCargoInfo(scope.row,scope.$index,false)" />
          <el-button v-if="!scope.row.edit" type="danger" icon="el-icon-delete" size="mini" @click="deleteCargoInfo(scope.row,scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
    <el-row v-if="orderMasterStatus === 'processing'" style="margin-top: 10px">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="addCargoInfo">新增</el-button>
      <el-button size="mini" type="success" icon="el-icon-check" :loading="updateLoading" @click="saveCargoInfo()">保存</el-button>
      <el-button size="mini" type="danger" icon="el-icon-delete" :loading="deleteLoading" @click="deleteCargoInfo('','')">删除</el-button>
      <el-button size="mini" type="info" icon="el-icon-copy-document" @click="copyData">复制</el-button>
    </el-row>
  </div>
</template>
<script>
import { createData } from '@/api/index_data'
import { getSoNoData } from '@/api/order_master'
export default {
  name: 'SeaCargoList',
  props: {
    cargoInfo: {
      required: true,
      type: Array
    },
    sourceId: {
      required: true,
      type: Number
    },
    sourceType: {
      required: true,
      type: String
    },
    packageTypeOptions: {
      type: Array,
      required: true
    },
    capTypeOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      deleteLoading: false,
      updateLoading: false,
      multipleSelection: [],
      include_container_array: [{ value: 0, label: '整体称重法' }, { value: 1, label: '累加法' }],
      gross_unit_array: [{ value: 0, label: '(克)KGS' }, { value: 1, label: '(磅)LBS' }],
      sea_cargo_array: [],
      SoNoOptions: [],
      sea_cargo_info: {
        id: 0,
        source_id: this.sourceId,
        source_type: this.sourceType,
        order_master_id: this.$route.params.id,
        so_no: undefined,
        container_no: undefined,
        seal_no: undefined,
        verified_gross_mass: undefined,
        include_container: undefined,
        gross_unit: undefined,
        gross_weight: undefined,
        container_weight: undefined,
        vgm_weight: undefined,
        volume: undefined,
        number: undefined,
        package_type_id: undefined,
        cap_type_id: undefined,
        description_of_good: undefined,
        edit: true
      }
    }
  },
  computed: {
    orderMasterStatus: function() {
      return this.$store.state.orderMaster.orderMasterStatus
    }
  },
  watch: {
    sourceId: {
      immediate: true, // 这句重要
      handler(val) {
      }
    },
    cargoInfo: {
      immediate: true, // 这句重要
      handler(val) {
        if (val.length >= 1) {
          this.sea_cargo_array = val
        }
      }
    }
  },
  methods: {
    showPackType(val) {
      if (val === '' || val === undefined || typeof (val) === 'undefined') {
        return ''
      }
      const value = this.packageTypeOptions.filter(item => item.id === val.toString())
      if (value.length > 0) {
        return value[0].name
      }
    },
    showUnit(val) {
      if (val === '' || val === undefined || typeof (val) === 'undefined') {
        return ''
      }
      const value = this.gross_unit_array.filter(item => item.id === val.toString())
      if (value.length > 0) {
        return value[0].name
      }
    },
    showContainer(val) {
      if (val === '' || val === undefined || typeof (val) === 'undefined') {
        return ''
      }
      const value = this.include_container_array.filter(item => item.id === val.toString())
      if (value.length > 0) {
        return value[0].name
      }
    },
    addCargoInfo() {
      this.sea_cargo_array.push(this.returnTemp())
    },
    deleteCargoInfo(row, index) {
      let rows = []
      if (row === '') {
        rows = this.multipleSelection
        if (rows.length <= 0) {
          this.$message.warning('未选择记录')
          return
        }
      } else {
        rows = [row]
      }
      this.$confirm('确定执行删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteLoading = true
        const ids = rows.map(item => item.id)
        createData('/order/masters/DeleteCargoInfo?former_type=sea_cargo_info', { ids: ids }, 'post').then((response) => {
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 5000
          })
          rows.forEach((a) => {
            this.sea_cargo_array.splice(this.sea_cargo_array.indexOf(a), 1)
          })
          this.deleteLoading = false
        }).catch(reason => {
          console.log(reason)
        })
      }).catch(() => {
      })
    },
    editCargoInfo(row, $index, status) {
      if (!status) {
        if (row['id'] === '' || typeof (row['id']) === 'undefined' || row['id'] === 0) {
          this.sea_cargo_array.splice($index, 1)
        } else {
          this.$set(this.sea_cargo_array[$index], 'edit', status)
        }
      } else {
        this.$set(this.sea_cargo_array[$index], 'edit', status)
      }
    },
    saveCargoInfo(data) {
      if (data === undefined) {
        data = this.multipleSelection
      }
      console.log(data)
      if (data.length <= 0) {
        this.$message.warning('未选择记录,不允许保存')
        return
      }
      for (let i = 0; i < data.length; i++) {
        const cap_type = data[i].cap_type
        if (cap_type === '' || typeof (cap_type) === 'undefined') {
          this.$message.warning('柜型不能为空')
          return
        }
        const so_no = data[i].so_no
        if (so_no === '' || typeof (so_no) === 'undefined') {
          this.$message.warning('SO No.不能为空')
          return
        }
      }
      this.updateLoading = true
      createData('/order/masters/' + this.$route.params.id + '/UpdateCargoInfo?former_type=' + 'sea_cargo_info', { sea_cargo_info: data }).then((response) => {
        this.$notify({
          title: 'Success',
          message: '保存数据成功',
          type: 'success',
          duration: 5000
        })
        this.handleUpdateData(response.data)
        this.updateLoading = false
      }).catch(reason => {
        console.log(reason)
      })
      this.multipleSelection.forEach(a => {
        if (a.id !== 0) {
          a.edit = false
        }
      })
    },
    handleUpdateData(data) {
      const result = this.sea_cargo_array.filter(function(el) {
        return el.id !== 0
      })
      if (data !== null && typeof (data) !== 'undefined') {
        this.sea_cargo_array = result.concat(data)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    copyData() {
      if (this.multipleSelection.length <= 0) {
        this.$message.warning('没有选择记录')
        return false
      }
      const data = this.multipleSelection
      data.forEach((a) => {
        if (a.id === 0) {
          this.$message.warning('请先进行数据保存')
          return false
        }
        a.id = 0
      })
      this.saveCargoInfo(data)
    },
    getSoNoOptions() {
      if (this.SoNoOptions.length > 0) {
        return
      }
      getSoNoData(this.$route.params.id).then((response) => {
        this.SoNoOptions = response
      })
    },
    returnTemp() {
      return {
        id: 0,
        source_id: this.sourceId,
        source_type: this.sourceType,
        order_master_id: this.$route.params.id,
        so_no: undefined,
        container_no: undefined,
        seal_no: undefined,
        verified_gross_mass: undefined,
        include_container: undefined,
        gross_unit: undefined,
        gross_weight: 1,
        container_weight: undefined,
        vgm_weight: undefined,
        volume: 1,
        number: 1,
        package_type_id: undefined,
        cap_type: undefined,
        description_of_good: undefined,
        edit: true
      }
    }
  }
}
</script>
