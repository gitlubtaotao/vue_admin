<template>
  <div class="">
    <el-card class="box-card">
      <div slot="header" class="">
        <el-radio-group v-model="listQuery.status" size="medium" style="margin-left: 5px;" @change="filterTable">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button v-for="item in statusOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
        </el-radio-group>
        <div style="float: right">
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="handleCreate"
          >新增
          </el-button>
        </div>
      </div>
      <el-form ref="listQuery" :model="listQuery" label-width="100px">
        <el-row :gutter="12">
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item label="公司名称" class="">
              <el-input v-model="listQuery.name_nick" placeholder="公司名称" class="filter-item" size="medium" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="公司邮箱" class="">
              <el-input v-model="listQuery.email" placeholder="公司邮箱" class="filter-item" size="medium" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="公司座机" class="">
              <el-input v-model="listQuery.telephone" placeholder="公司座机" class="filter-item" size="medium" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="账期">
              <el-select v-model="listQuery.account_period" filterable placeholder="请选择" size="medium" clearable>
                <el-option v-for="item in accountPeriodOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="业务员" class="">
              <el-select v-model="listQuery.user_salesman_id" filterable placeholder="请选择" size="medium" clearable :loading="loading" @focus="getUser()">
                <el-option v-for="item in usersOptions" :key="item.id" :label="item.name" :value="parseInt(item.id)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="所属公司" class="">
              <el-select v-model="listQuery.parent_id" filterable placeholder="请选择" size="medium" clearable :loading="loading" @focus="getCompany()">
                <el-option v-for="item in userCompanyOptions" :key="parseInt(item.id)" :label="item.name_nick" :value="parseInt(item.id)" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="24" :lg="24" style="text-align: center;">
            <el-button v-waves type="primary" icon="el-icon-search" size="medium" @click="filterTable">搜索</el-button>
            <el-button type="danger" icon="el-icon-close" size="medium" @click="clearFilter">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="">
        <el-row :gutter="10">
          <keep-alive>
            <unfixed-thead v-model="columnArray" :local-key="columnUrl+'?type='+type" :columns="columnArray" />
          </keep-alive>
          <keep-alive>
            <export-excel :multiple-selection="multipleSelection" :local-key="columnUrl+'?type='+type" />
          </keep-alive>
        </el-row>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        fit
        max-height="1200"
        border
        stripe
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        @row-dblclick="rowDblclick"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column label="操作" width="150" fixed="left">
          <template slot-scope="{row,$index}">
            <router-link :to="showUrl(row.id)">
              <el-button
                size="mini"
                type="primary"
              >详情</el-button>
            </router-link>
            <el-dropdown v-if="row.status_value !== 'cancel'" type="primary" @visible-change="handleClick(row,$index)" @command="handleCommand">
              <el-button type="primary" size="mini">
                更多 <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item v-if="row.status_value === 'approving' || row.status_value === 'rejected'" command="approved">审核通过</el-dropdown-item>
                <el-dropdown-item v-if="row.status_value === 'approving' || row.status_value === 'rejected'" command="rejected">审核失败</el-dropdown-item>
                <el-dropdown-item v-if="type ==='customer'" command="changeSuppler">转化成供应商</el-dropdown-item>
                <el-dropdown-item v-if="type === 'supplier' && row.company_type_value === 2 " command="changeCustomer" :divided="true">转化为客户&供应商</el-dropdown-item>
                <el-dropdown-item command="cancel" :divided="true">作废</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button v-else size="mini" type="danger" @click="handlerDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <el-table :data="row.roles" :fit="false" size="medium">
              <el-table-column key="name" label="角色" prop="name" width="280" />
              <el-table-column key="user_name" label="姓名" prop="user_name" width="280" />
              <el-table-column width="180px" align="center" label="创建时间">
                <template slot-scope="props">
                  <span>{{ showDate(props.row.created_at ) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" />

        <el-table-column v-for="column in columnArray" :key="column['data']" :prop="column['data']" :label="column['title']" width="180" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="filterTable" />
    </el-card>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :rules="rules" :model="temp" :status-icon="true" label-position="left" label-width="100px" style="width: 100%;padding: 0 20px;">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="公司简称" prop="name_nick">
              <el-input v-model="temp.name_nick" size="medium" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司中文名" prop="name_cn">
              <el-input v-model="temp.name_cn" size="medium" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="公司英文名" prop="name_en">
              <el-input v-model="temp.name_en" size="medium" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司类型" prop="company_type" style="">
              <el-select v-model="temp.company_type" filterable placeholder="请选择" size="medium" style="width: 100%" clearable>
                <el-option v-for="item in companyTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="业务类型" prop="business_type_name" style="">
              <el-select v-model="temp.business_type_name" filterable placeholder="请选择" size="medium" style="width: 100%" clearable allow-create multiple>
                <el-option v-for="item in businessOptions" :key="item.label" :label="item.label" :value="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源" prop="source" style="">
              <el-select v-model="temp.source" filterable placeholder="请选择" size="medium" style="width: 100%" clearable allow-create multiple>
                <el-option v-for="item in sourceOptions" :key="item.label" :label="item.label" :value="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col v-if="type ==='customer' " :span="12">
            <el-form-item label="业务员" class="" prop="user_salesman_id">
              <el-select v-model="temp.user_salesman_id" filterable placeholder="请选择" size="medium" clearable :loading="loading" style="width: 100%;" @focus="getUser()">
                <el-option v-for="item in usersOptions" :key="item.id" :label="item.name" :value="parseInt(item.id)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核员" class="" prop="user_audit_id">
              <el-select v-model="temp.user_audit_id" filterable placeholder="请选择" size="medium" clearable :loading="loading" style="width: 100%;" @focus="getUser()">
                <el-option v-for="item in usersOptions" :key="item.id" :label="item.name" :value="parseInt(item.id)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="dialogStatus === 'update' " :span="12">
            <el-form-item label="创建者" class="" prop="user_create_id">
              <el-select v-model="temp.user_create_id" filterable placeholder="请选择" size="medium" clearable :loading="loading" style="width: 100%;" @focus="getUser()">
                <el-option v-for="item in usersOptions" :key="item.id" :label="item.name" :value="parseInt(item.id)" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="公司座机" prop="tel" style="">
              <el-input v-model="temp.telephone" type="tel" size="medium" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司邮箱" prop="email" style="">
              <el-input v-model="temp.email" type="email" size="medium" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="公司中文地址" prop="address">
              <el-input v-model="temp.zh_address" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司英文地址" prop="address2">
              <el-input v-model="temp.en_address" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="账期" prop="account_period">
              <el-select v-model="temp.account_period" filterable placeholder="请选择" size="medium" clearable style="width:100%">
                <el-option v-for="item in accountPeriodOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账龄(月)" prop="age">
              <el-input v-model="temp.age" type="number" :min="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="账额(CNY)" prop="amount">
              <el-input v-model="temp.amount" type="number" :min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传真" prop="fax">
              <el-input v-model="temp.fax" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="公司代码" prop="code" style="">
              <el-input v-model="temp.code" type="" size="medium" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="temp.remark" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if=" dialogStatus === 'create'">
        <el-divider />
        <el-row style="margin-bottom: 10px">
          <el-button type="primary" size="small" @click="addCrmUser">新增联系人</el-button>
        </el-row>
        <el-table key="crm_contacts" :data="crmUserLists" fit max-height="1200" border style="width: 100%;">
          <el-table-column min-width="100px" label="姓名">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.name" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" label="邮箱">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.email" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" label="电话">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.phone" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" label="性别">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-select v-model="row.sex" style="width:100%" filterable placeholder="请选择" size="small" clearable>
                  <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
              <span v-else>{{ row.sex }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" label="关键联系人">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-switch v-model="row.is_key_contact" style="display: block;height:100%" active-color="#13ce66" inactive-color="#ff4949" />
              </template>
              <span v-else>{{ row.is_key_contact }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="200px" label="联系地址">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.address" type="textarea" />
              </template>
              <span v-else>{{ row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="200px" label="备注">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.remarks" type="textarea" />
              </template>
              <span v-else>{{ row.remarks }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="{row,$index}">
              <el-button v-if="row.edit" type="danger" icon="el-icon-delete" size="small" @click="deleteCrmUser(row,$index)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="转化成客户&供应商" :visible.sync="dialogChangeVisible" width="30%">
      <el-form ref="dataForm" :rules="rules" :model="temp" :status-icon="true" label-position="left" label-width="100px" style="width: 100%;padding: 0 20px;">
        <el-form-item label="业务员" class="" prop="user_salesman_id">
          <el-select v-model="temp.user_salesman_id" filterable placeholder="请选择" size="medium" clearable :loading="loading" style="width: 100%;" @focus="getUser()">
            <el-option v-for="item in usersOptions" :key="item.id" :label="item.name" :value="parseInt(item.id)" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateChange()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getColumn, localColumn } from '@/api/column'
import { getData, createData, updateData, editData, deleteData } from '@/api/index_data'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getSelectApi } from '@/api/select'
import UnfixedThead from '@/components/UnfixedThead'
import { parseTime } from '@/utils'
import ExportExcel from '@/components/ExportExcel'
const sexOptions = [{ label: '男', value: 1 },
  { label: '女', value: 2 }]

export default {
  name: 'CrmCompany',
  components: { Pagination, UnfixedThead, ExportExcel },
  directives: { waves },
  props: {
    type: {
      required: true,
      type: String
    },
    companyTypeOptions: {
      required: true,
      type: Array
    },
    textMap: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 2,
      listLoading: false,
      loading: false,
      columnUrl: '/crm/companies/column',
      listQuery: {
        page: 1,
        limit: 20,
        name_nick: undefined,
        email: undefined,
        telephone: undefined,
        user_salesman_id: undefined,
        parent_id: undefined,
        account_period: undefined,
        status: ''
      },
      dialogFormVisible: false,
      dialogChangeVisible: false,
      dialogStatus: '',
      sexOptions,
      temp: {
        id: null,
        name_nick: null,
        name_cn: null,
        name_en: null,
        telephone: null,
        email: null,
        zh_address: null,
        en_address: null,
        remark: null,
        website: null,
        fax: null,
        parent_id: null,
        account_period: null,
        age: null,
        amount: null,
        business_type_name: null,
        company_type: 1,
        user_salesman_id: null,
        user_create_id: null,
        user_audit_id: null,
        roles: [],
        code: null,
        source: null
      },
      index: 0,
      rules: {
        name_nick: [{ required: true, message: '请输入公司简称', trigger: 'blur' }],
        name_cn: [{ required: true, message: '请输入公司中文名', trigger: 'blur' }],
        name_en: [{ required: true, message: '请输入公司英文名称', trigger: 'blur' }],
        telephone: [{ required: true, message: '请输入公司座机', trigger: 'blur' }],
        email: [{ required: true, type: 'email', message: '请输入公司邮箱', trigger: 'blur' }],
        user_salesman_id: [{ required: this.type === 'customer', message: '请输入业务员', trigger: 'blur' }],
        user_audit_id: [{ required: true, message: '请输入审核员', trigger: 'blur' }]
      },
      columnArray: [],
      statusOptions: [
        { value: 'approving', label: '待审核' },
        { value: 'approved', label: '已审核' },
        { value: 'rejected', label: '未通过' },
        { value: 'cancel', label: '已作废' }
      ],
      accountPeriodOptions: [{ value: 'month', label: '月结' }, { value: 'ticket', label: '票结' }],
      users: [],
      usersOptions: [],
      userCompanies: [],
      userCompanyOptions: [],
      sourceOptions: [],
      businessOptions: [],
      crmUserLists: [],
      crm_contacts: {
        id: null,
        name: null,
        phone: null,
        email: null,
        user_company_id: null,
        sex: null,
        is_key_contact: false,
        address: null,
        remarks: null
      },
      multipleSelection: []
    }
  },
  created() {
    this.fetchColumn()
    this.filterTable()
  },
  methods: {
    showUrl(id) {
      if (this.type === 'customer') {
        return '/crm/customer/show/' + id.toString()
      } else {
        return '/crm/supply/show/' + id.toString()
      }
    },
    addCrmUser() {
      const j = { name: null, phone: null, email: null, sex: 1, is_key_contact: false, address: null, remarks: null, edit: true }
      this.crmUserLists.unshift(j)
    },
    deleteCrmUser(row, index) {
      this.crmUserLists.splice(index, 1)
    },
    showDate(date) {
      return parseTime(date, '{y}-{m}-{d}')
    },
    handleCreate() {
      this.getUser()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp = {
        id: null,
        name_nick: null,
        name_cn: null,
        name_en: null,
        telephone: null,
        email: null,
        zh_address: null,
        en_address: null,
        remark: null,
        fax: null
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = this.temp
          data.business_type_name = this.handleBusiness()
          data.roles = this.handleRoles()
          data.age = parseInt(data.age)
          data.amount = parseInt(data.amount)
          if (this.crmUserLists.length > 0) {
            data.crm_contacts = this.crmUserLists
          }
          createData('/crm/companies/create', data).then((response) => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建合作单位信息成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.getUser()
      editData('/crm/companies/' + row.id + '/edit', 'get').then((response) => {
        this.temp = response.data
        this.temp.user_salesman_id = searchRole(this.temp, 'salesman')
        this.temp.user_audit_id = searchRole(this.temp, 'audit')
        this.temp.user_create_id = searchRole(this.temp, 'created')
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      function searchRole(temp, role) {
        if (!Array.isArray(temp.roles)) {
          return undefined
        }
        const results = temp.roles.filter(item => {
          return item.name.indexOf(role) > -1
        })
        if (results.length >= 1) {
          return results[0]['user_id']
        }
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.business_type_name = this.handleBusiness()
          tempData.roles = this.handleRoles()
          tempData.age = parseInt(tempData.age)
          tempData.amount = parseInt(tempData.amount)
          tempData.created_at = undefined
          tempData.updated_at = undefined
          updateData('/crm/companies/' + tempData.id + '/update', tempData, 'patch').then((response) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    handlerDelete(row) {
      const id = row.id
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData('/crm/companies/' + id + '/delete').then((response) => {
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 5000
          })
          this.list.splice(this.index, 1)
        })
      }).catch(() => {
      })
    },
    handleClick(row, index) {
      this.temp = row
      this.index = index
    },
    handleCommand(command) {
      if (command === 'edit') {
        this.handleUpdate(this.temp)
      } else if (command === 'changeCustomer') {
        this.changeCustomer()
      } else if (command === 'changeSuppler') {
        this.changeSuppler()
      } else {
        this.moreUpdate('/crm/companies/' + this.temp.id + '/changeStatus?status=' + command)
      }
    },
    changeCustomer() {
      this.getUser()
      this.dialogChangeVisible = true
    },
    changeSuppler() {
      this.updateChange(2)
    },
    updateChange(company_type = 3) {
      const id = this.temp.id
      this.moreUpdate('/crm/companies/' + id + '/changeType?company_type=' + company_type + '&user_salesman_id=' + this.temp.user_salesman_id)
    },
    moreUpdate(url) {
      this.$confirm('是否继续执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateData(url, {}, 'patch').then((response) => {
          this.$notify({
            title: 'Success',
            message: '操作成功',
            type: 'success',
            duration: 5000
          })
          this.dialogChangeVisible = false
          // this.filterTable()
        })
      }).catch(() => {
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchColumn() {
      let url = this.columnUrl
      url += ('?type=' + this.type)
      const data = localColumn(url)
      if (data.length === 0) {
        getColumn(url).then(response => {
          this.columnArray = response
        }).catch(error => {
          this.$message({ showClose: true, message: error, type: 'error' })
        })
      } else {
        this.columnArray = data
      }
    },
    rowDblclick(row, column, event) {
      this.$router.push(this.showUrl(row.id))
    },
    async filterTable() {
      this.listLoading = true
      getData('/crm/companies/data?type=' + this.type, this.listQuery).then(response => {
        let total = response.total
        let data = response.data
        if (!Array.isArray(data)) {
          data = []
        }
        if (typeof (total) === 'undefined') {
          total = 0
        }
        this.total = total
        this.list = data
        setTimeout(() => {
          this.listLoading = false
        }, 200)
      }).catch(error => {
        console.log(error)
      })
    },
    clearFilter() {
      this.listQuery = {
        name_nick: undefined,
        email: undefined,
        telephone: undefined,
        user_salesman_id: undefined,
        parent_id: undefined,
        account_period: undefined
      }
      this.filterTable()
    },
    getUser() {
      if (this.usersOptions.length === 0) {
        getSelectApi('/select/employee', {}, 'get').then((response) => {
          this.usersOptions = response.data
        })
      }
    },
    getCompany() {
      if (this.userCompanyOptions.length === 0) {
        getSelectApi('/select/owner_company', {}, 'get').then((response) => {
          this.userCompanyOptions = response.data
        })
      }
    },
    handleBusiness() {
      const value = this.temp.business_type_name
      if (value !== '' && typeof (value) !== 'undefined' && Array.isArray(value)) {
        return value.join(',')
      }
      return value
    },
    handleRoles() {
      const roles = [
        { user_id: this.temp.user_audit_id, name: 'audit' }
      ]
      if (this.type === 'customer') {
        roles.push({ user_id: this.temp.user_salesman_id, name: 'salesman' })
      }
      if (this.dialogStatus === 'update') {
        roles.push({ user_id: this.temp.user_create_id, name: 'created' })
      }
      return roles
    }
  }
}
</script>
<style scoped="scss">
</style>
