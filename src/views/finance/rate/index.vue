<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <el-button type="primary" size="medium">全部</el-button>
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
          <el-col :xs="8" :sm="6" :md="6" :lg="6">
            <el-form-item label="币种类型" prop="code_name">
              <el-select v-model="listQuery.finance_currency_id" style="width:100%" filterable placeholder="请选择" size="medium" clearable :loading="loading">
                <el-option v-for="item in financeCurrencyOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="6" :lg="6">
            <el-form-item label="操作员" prop="user_id">
              <el-select v-model="listQuery.user_id" filterable remote placeholder="请选择" size="medium" clearable :remote-method="remoteUser" :loading="userLoading" @focus="getUser()">
                <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="6" :lg="6">
            <el-form-item label="所属公司" prop="user_company_id">
              <el-select v-model="listQuery.user_company_id" filterable remote placeholder="请选择" size="medium" clearable :remote-method="remoteCompany" :loading="companyLoading" @focus="getCompany()">
                <el-option v-for="item in userCompanyOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="创建时间" prop="created_at">
              <el-date-picker v-model="tmp_created_at" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" style="text-align: center;">
            <el-button v-waves type="primary" icon="el-icon-search" size="medium" @click="filterTable">搜索</el-button>
            <el-button type="danger" icon="el-icon-close" size="medium" @click="clearFilter">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
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
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column label="操作" width="150" fixed="left">
          <template slot-scope="{row,$index}">
            <el-button
              size="mini"
              type="primary"
              @click="handleUpdate(row)"
            >编辑</el-button>
            <el-dropdown size="mini" type="primary" @visible-change="handleClick(row,$index)" @command="handleCommand">
              <el-button type="primary" size="mini">
                更多<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column type="index" />
        <el-table-column v-for="column in columnArray" :key="column['data']" :prop="column['data']" :label="column['title']" width="180" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="filterTable" />
    </el-card>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" :status-icon="true" label-position="left" label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item label="币种" prop="finance_currency_id">
          <el-select
            v-model="temp.finance_currency_id"
            style="width:100%"
            filterable
            placeholder="请选择"
            size="medium"
            clearable
            :loading="loading"
          >
            <el-option v-for="item in financeCurrencyOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="汇率" prop="rate">
          <el-input v-model="temp.rate" />
        </el-form-item>
        <el-form-item v-if="systemRateSetting === 'month'" label="生效月份" prop="start_month">
          <el-input-number v-model="temp.start_month" :min="1" :max="12" label="生效月份" />
        </el-form-item>
        <el-form-item v-if="systemRateSetting === 'month'" label="失效月份" prop="end_month">
          <el-input-number v-model="temp.end_month" :min="1" :max="12" label="失效月份" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create' ? createData() : updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getColumn, localColumn } from '@/api/column'
import { createData, deleteData, getData, updateData } from '@/api/index_data'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { remoteCompany, remoteEmployee } from '@/api/select'
import { parseTime, dateRangeArrayToStr } from '@/utils'

export default {
  name: 'FinanceRate',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 1,
      listLoading: false,
      loading: false,
      columnUrl: '/finance/rates/column',
      listQuery: {
        page: 1,
        limit: 20,
        finance_currency_id: undefined,
        user_id: undefined,
        company_id: null,
        created_at: ''
      },
      tmp_created_at: '',
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        id: null,
        finance_currency_id: null,
        rate: null,
        user_id: null,
        start_month: null,
        end_month: null,
        company_id: null
      },
      index: 0,
      rules: {
        finance_currency_id: [{ required: true, message: '币种', trigger: 'blur' }],
        rate: [{ required: true, message: '请输入汇率', trigger: 'blur' }]
      },
      textMap: {
        create: '新增汇率信息'
      },
      columnArray: [],
      financeCurrencyOptions: [],
      users: [],
      companies: [],
      userOptions: [],
      userCompanyOptions: [],
      userCompanies: [],
      companyLoading: false,
      userLoading: false,
      systemRateSetting: 'month',
      systemStandard: 'CNY'
    }
  },
  created() {
    this.fetchColumn()
    this.filterTable()
  },
  methods: {
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp = {
        id: null,
        finance_currency_id: null,
        rate: null,
        user_id: null,
        start_month: this.showMonth(),
        end_month: parseInt(this.showMonth()) + 1,
        company_id: null
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    showMonth() {
      return parseTime(new Date(), '{m}')
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData('/finance/rates/create', this.handlerData()).then((response) => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建币种汇率成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = row
      this.temp.type = row['type_value']
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.updated_at = undefined
          tempData.created_at = undefined
          updateData('/base/ports/' + tempData.id + '/update', tempData).then((response) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新港口信息成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    handleClick(row, index) {
      this.temp = row
      this.index = index
    },
    handleCommand(command) {
      if (command === 'delete') {
        this.handleDelete()
      }
    },
    handleDelete() {
      const id = this.temp.id
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData('/finance/rates/' + id + '/delete').then((response) => {
          this.$notify({
            title: 'Success',
            message: '删除汇率信息成功',
            type: 'success',
            duration: 5000
          })
          this.list.splice(this.index, 1)
        })
      }).catch(() => {
      })
    },
    handleSelectionChange() {
    },
    remoteCompany(query) {
      this.companyLoading = true
      const result = this.userCompanies.filter(item => {
        return item.label.toLowerCase()
          .indexOf(query.toLowerCase()) > -1
      })
      if (result.length > 0) {
        this.companyLoading = false
        this.userCompanyOptions = result
      } else {
        remoteCompany(query).then((response) => {
          this.userCompanyOptions = response
          this.companyLoading = false
        })
      }
    },
    remoteUser(query) {
      this.userLoading = true
      const result = this.users.filter(item => {
        return item.label.toLowerCase()
          .indexOf(query.toLowerCase()) > -1
      })
      if (result.length > 0) {
        this.loading = false
        this.userOptions = result
        return
      }
      remoteEmployee(query).then((response) => {
        this.userOptions = response
        this.userLoading = false
      })
    },
    getUser() {
      if (this.users.length === 0) {
        remoteEmployee('').then((response) => {
          this.users = response
          this.userOptions = response
        })
      } else {
        this.userOptions = this.users
      }
    },
    getCompany() {
      if (this.userCompanies.length === 0) {
        remoteCompany('').then((response) => {
          this.userCompanyOptions = response
          this.userCompanies = response
        })
      } else {
        this.userCompanyOptions = this.userCompanies
      }
    },
    fetchColumn() {
      const data = localColumn(this.columnUrl)
      if (data.length === 0) {
        getColumn(this.columnUrl).then(response => {
          this.columnArray = response
        }).catch(error => {
          this.$message({ showClose: true, message: error, type: 'error' })
        })
      } else {
        this.columnArray = data
      }
    },
    filterTable() {
      this.listLoading = true
      getData('/finance/rates/data', this.handleParams()).then(response => {
        let data = response.data
        let total = response.total
        if (!Array.isArray(data)) {
          data = []
        }
        if (typeof (total) === 'undefined') {
          total = 0
        }
        this.list = data
        this.total = total
        this.systemStandard = response.systemStandardCurrency
        this.systemRateSetting = response.systemFinanceRate
        this.filterCurrency(response.currencyOptions)
        setTimeout(() => {
          this.listLoading = false
        }, 200)
      }).catch(error => {
        console.log(error)
      })
    },
    clearFilter() {
      this.listLoading = true
      this.listQuery.finance_currency_id = undefined
      this.listQuery.user_id = undefined
      this.listQuery.company_id = undefined
      this.listQuery.created_at = ''
      this.tmp_created_at = ''
      this.filterTable()
    },
    filterCurrency(currencyOptions) {
      const _this = this
      this.financeCurrencyOptions = currencyOptions.filter(function(el, index) {
        return el.name !== _this.systemStandard
      })
    },
    handlerData() {
      const temp = this.temp
      temp.rate = parseFloat(this.temp.rate)
      temp.finance_currency_id = parseInt(this.temp.finance_currency_id)
      return temp
    },
    handleParams() {
      this.listQuery.created_at = dateRangeArrayToStr(this.tmp_created_at)
      console.log(this.listQuery.created_at)
      return this.listQuery
    }
  }
}
</script>
<style scoped="scss">
</style>
