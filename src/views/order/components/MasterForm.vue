<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="localFormVisible" @close="closeDialog">
    <el-form ref="dataForm" :rules="rules" :model="temp" :status-icon="true" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
      <el-form-item label="委托单位" prop="instruction_id">
        <el-select
          v-model="temp.instruction_id"
          filterable
          remote
          placeholder="请选择"
          size="medium"
          clearable
          :remote-method="remoteInstruction"
          :loading="loadingInstruction"
          style="width: 100%"
          @change="instructionChange"
          @focus="getInstruction()"
        >
          <el-option v-for="item in companyInstructionOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="委托联系人" prop="contact_id">
        <el-select v-model="temp.contact_id" filterable remote placeholder="请选择" size="medium" clearable :remote-method="remoteContact" :loading="loadingContact" style="width: 100%" @focus="getContact()">
          <el-option v-for="item in contactOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务员" prop="salesman_id">
        <el-select v-model="temp.salesman_id" filterable placeholder="请选择" size="medium" clearable style="width: 100%" @focus="getSalesman()">
          <el-option v-for="item in salesmanOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作员" prop="operation_id">
        <el-select v-model="temp.operation_id" filterable remote placeholder="请选择" size="medium" clearable style="width: 100%" @focus="getOperation()">
          <el-option v-for="item in operationOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
        </el-select>
      </el-form-item>
      <el-form-item label="运输类型" prop="transport_type">
        <el-radio-group v-model="temp.transport_type">
          <el-radio v-for="item in transportOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="temp.transport_type === 3 " label="主运输类型" prop="main_transport">
        <el-radio-group v-model="temp.main_transport">
          <el-radio v-for="item in mainTransportOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="makeUpOrder" label="订单创建时间" prop="created_at">
        <el-date-picker v-model="temp.created_at" type="date" placeholder="选择日期" format="yyyy-MM-dd" style="width: 100%" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="temp.remarks" type="textarea" />
      </el-form-item>
    </el-form>

    <el-divider />
    <el-row style="margin-bottom: 10px">
      <el-button type="primary" size="small" @click="addEmployee">新增角色</el-button>
    </el-row>
    <el-table key="crm_users" :data="roleArray" fit max-height="500" border style="width: 100%;">
      <el-table-column min-width="100px" label="角色">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.name" filterable placeholder="请选择" size="medium" clearable style="width: 100%">
              <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
          <span v-else>{{ showName(scope.row.name) }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="员工">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.user_id" filterable placeholder="请选择" size="medium" clearable style="width: 100%" @focus="getOperation()" @change="changeUser($event,scope.$index)">
              <el-option v-for="item in operationOptions" :key="parseInt(item.id)" :label="item.name" :value="parseInt(item.id)" />
            </el-select>
          </template>
          <span v-else>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.edit" type="primary" icon="el-icon-edit" size="mini" @click="editEmployee(scope.$index, scope.row,true)" />
          <el-button v-else type="success" icon="el-icon-check" size="mini" @click="saveEmployee(scope.$index,scope.row)" />
          <el-button v-if="scope.row.edit" type="danger" icon="el-icon-close" size="mini" @click="editEmployee(scope.$index,scope.row,false)" />
          <el-button v-if="!scope.row.edit" type="danger" icon="el-icon-delete" size="mini" @click="deleteEmployee(scope.row,scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="localFormVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="dialogStatus==='create' ? createData() : updateData()">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { remoteCompany, remoteContact, getSelectApi } from '@/api/select'
import { createData, updateData } from '@/api/index_data'

export default {
  name: 'MasterForm',
  props: {
    dialogStatus: {
      type: String,
      default: 'create'
    },
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    makeUpOrder: {
      type: Boolean,
      default: false
    },
    record: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: function() {

      }
    }
  },

  data() {
    return {
      temp: {
        instruction_id: undefined,
        contact_id: undefined,
        salesman_id: undefined,
        operation_id: this.$store.getters.userInfo.userInfo.id.toString(),
        transport_type: undefined,
        main_transport: undefined,
        remarks: undefined,
        roles: []
      },
      role: {
        user_id: undefined,
        name: undefined
      },
      roleArray: [],
      textMap: {
        create: '新增订单',
        update: '更新订单'
      },
      rules: {
        instruction_id: [{ required: true, message: '请选择委托单位', trigger: 'blur' }],
        salesman_id: [{ required: true, message: '请选择业务员', trigger: 'blur' }],
        operation_id: [{ required: true, message: '请选择操作员', trigger: 'blur' }],
        transport_type: [{ required: true, message: '请选择运输类型', trigger: 'blur' }]
      },
      loadingInstruction: false,
      loadingContact: false,
      loadingUser: false,
      localFormVisible: false,
      transportOptions: [
        { label: '整箱', value: 1 },
        { label: '拼箱', value: 4 },
        { label: '空运', value: 2 },
        { label: '快递', value: 5 },
        { label: '其他', value: 3 }
      ],
      mainTransportOptions: [
        { label: '整箱', value: 1 },
        { label: '拼箱', value: 4 },
        { label: '空运', value: 2 }
      ],
      operationOptions: [],
      salesmanOptions: [],
      companyArray: [],
      companyInstructionOptions: [],
      contactOptions: [],
      contactArray: [],
      roleOptions: [
        { label: '文件人员', value: 'file' },
        { label: '商务人员', value: 'business' },
        { label: '财务人员', value: 'finance' },
        { label: '客服人员', value: 'customer' }
      ]
    }
  },
  watch: {
    dialogFormVisible: {
      immediate: true, // 这句重要
      handler(val) {
        this.localFormVisible = val
      }
    },
    dialogStatus: {
      immediate: true, // 这句重要
      handler(val) { }
    },
    makeUpOrder: {
      immediate: true,
      handler(val) { }
    },
    record: {
      immediate: true,
      handler(row) {
        this.temp = row
        this.roleArray = row.roles
      }
    }
  },
  created() {
    this.getInstruction()
    this.getSalesman()
    this.getOperation()
  },
  methods: {
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData('/order/masters/create', this.handlerTemp()).then((response) => {
            const order = response.data
            this.localFormVisible = false
            this.$router.push('/order/master/operation/' + order.id.toString() + '?transport_type=' + order.transport_type)
            this.closeDialog()
            this.$notify({
              title: 'Success',
              message: '创建订单成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateData('/order/masters/' + this.temp.id + '/update', this.handlerTemp(), 'patch').then((response) => {
            this.localFormVisible = false
            this.closeDialog()
            this.$notify({
              title: 'Success',
              message: '更新订单信息成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    remoteInstruction(query) {
      if (query === '') {
        return
      }
      this.loadingInstruction = true
      const result = this.companyArray.filter(item => {
        return item.label.toLowerCase()
          .indexOf(query.toLowerCase()) > -1
      })
      if (result.length > 0) {
        this.loadingInstruction = false
        this.companyInstructionOptions = result
      } else {
        remoteCompany(query, this.defaultScope()).then((response) => {
          this.companyInstructionOptions = response
          this.loadingInstruction = false
        })
      }
    },
    getInstruction() {
      if (this.companyArray.length === 0) {
        remoteCompany('', this.defaultScope()).then((response) => {
          this.companyInstructionOptions = response
          this.companyArray = response
        })
      } else {
        this.companyInstructionOptions = this.companyArray
      }
    },
    remoteContact(query) {
      if (query === '') {
        return
      }
      this.loadingContact = true
      const result = this.contactArray.filter(item => {
        return item.label.toLowerCase()
          .indexOf(query.toLowerCase()) > -1
      })
      if (result.length > 0) {
        this.loadingContact = false
        this.contactOptions = result
      } else {
        remoteContact(query, { user_company_id: this.temp.instruction_id }).then((response) => {
          this.contactOptions = response
        })
      }
    },
    getContact() {
      remoteContact('', { user_company_id: this.temp.instruction_id }).then((response) => {
        this.contactArray = response
        this.contactOptions = response
      })
    },
    getOperation() {
      if (this.operationOptions.length === 0) {
        getSelectApi('/select/employee', {}, 'get').then((response) => {
          this.operationOptions = response.data
        })
      }
    },
    getSalesman() {
      if (this.salesmanOptions.length === 0) {
        getSelectApi('/select/employee', {}, 'get').then((response) => {
          this.salesmanOptions = response.data
        })
      }
    },
    defaultScope() {
      return { company_type: [1, 3] }
    },
    instructionChange() {
      this.temp.contact_id = undefined
    },
    closeDialog() {
      this.$emit('listenFormVisible', false)
    },
    handlerTemp() {
      const data = this.temp
      if (data.salesman_id !== undefined && data.salesman_id !== '') {
        data.salesman_id = parseInt(data.salesman_id)
      }
      if (data.operation_id !== undefined && data.operation_id !== '') {
        data.operation_id = parseInt(data.operation_id)
      }
      data.roles = this.roleArray.filter((item) => {
        return !item['edit']
      })
      return data
    },
    addEmployee() {
      const j = { name: null, user_id: null, edit: true }
      this.roleArray.unshift(j)
    },
    editEmployee($index, row, status) {
      this.$set(this.roleArray[$index], 'edit', status)
      if (!status) {
        if (row['id'] === '' || typeof (row['id']) === 'undefined') {
          this.roleArray.splice($index, 1)
        }
      }
    },
    saveEmployee($index, row) {
      if (row.name !== null && row.user_id !== null) {
        this.$set(this.roleArray[$index], 'edit', false)
      } else {
        this.$message.error('角色和员工不能为空')
      }
    },
    deleteEmployee(row, index) {
      this.roleArray.splice(index, 1)
    },
    changeUser(val, $index) {
      const obj = this.operationOptions.find((item) => {
        return parseInt(item.id) === val
      })
      this.$set(this.roleArray[$index], 'user_name', obj.name)
      console.log(this.roleArray)
    },
    showName(val) {
      const obj = this.roleOptions.find((item) => {
        return item.value === val
      })
      console.log(obj)
      return obj.label
      // return obj.label
    }
  }
}
</script>
