<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
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
            <el-form-item label="发票抬头" class="">
              <el-input
                v-model="listQuery.name"
                placeholder="发票抬头"
                class="filter-item"
                size="medium"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="6" :lg="6">
            <el-form-item label="发票类型" class="">
              <el-input
                v-model="listQuery.category"
                placeholder="发票类型"
                class="filter-item"
                size="medium"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="6" :lg="6">
            <el-form-item label="所属公司" class="">
              <el-select
                v-model="listQuery.user_company_id"
                filterable
                remote
                placeholder="请选择"
                size="medium"
                clearable
                :remote-method="remoteMethod"
                :loading="loading"
                @focus="getCompany()"
              >
                <el-option
                  v-for="item in user_company_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" style="text-align: center;">
            <el-button v-waves type="primary" icon="el-icon-search" size="medium" @click="filterTable">搜索</el-button>
            <el-button type="danger" icon="el-icon-close" size="medium">取消</el-button>
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
        size="medium"
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="dataForm" :rules="rules" :model="temp" :status-icon="true" label-position="left" label-width="120px" style="width: 500px; margin-left:50px;">
        <el-form-item label="所属公司" prop="user_company_id">
          <el-select
            v-model="temp.user_company_id"
            style="width:100%"
            filterable
            remote
            placeholder="请选择"
            size="medium"
            clearable
            :remote-method="remoteMethod"
            :loading="loading"
            @focus="getCompany()"
          >
            <el-option
              v-for="item in user_company_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发票抬头" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="tax_number">
          <el-input v-model="temp.tax_number" />
        </el-form-item>
        <el-form-item label="银行账号" prop="bank_number">
          <el-input v-model="temp.bank_number" />
        </el-form-item>
        <el-form-item label="开户行" prop="bank_name">
          <el-select
            v-model="temp.bank_name"
            style="width:100%"
            filterable
            allow-create
            placeholder="请选择"
            size="medium"
            clearable
          >
            <el-option
              v-for="item in bank_name_options"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="账户类型" prop="category">
          <el-select
            v-model="temp.category"
            style="width:100%"
            filterable
            placeholder="请选择"
            size="medium"
            clearable
          >
            <el-option
              v-for="item in category_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="银行地址" prop="bank_address">
          <el-input v-model="temp.bank_address" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="银行联系电话" prop="bank_tel">
          <el-input v-model="temp.bank_tel" type="text" />
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
import { createData, updateData, getData, deleteData } from '@/api/index_data'
import { remoteCompany } from '@/api/select'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
export default {
  name: 'Invoice',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      type: 'crm',
      tableKey: 0,
      list: [],
      total: 1,
      listLoading: false,
      loading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      user_company_options: [],
      user_companies: [],
      bank_name_options: [],
      category_options: [
        { label: 'CNY', value: 1 },
        { label: 'USD', value: 2 }],
      listQuery: {
        name: undefined,
        category: undefined,
        user_company_id: undefined,
        limit: 20,
        page: 1
      },
      temp: {
        id: null,
        user_company_id: null,
        bank_name: null,
        bank_number: null,
        name: null,
        tax_number: null,
        category: null,
        bank_address: null,
        bank_tel: null
      },
      index: 0,
      columnArray: [],
      textMap: {
        update: '编辑发票信息',
        create: '新增发票信息'
      },
      rules: {
        user_company_id: [{ required: true, message: '请选择所属公司', trigger: 'blur' }],
        bank_name: [{ required: true, message: '请选择开户行', trigger: 'blur' }],
        name: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }],
        tax_number: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],
        bank_number: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
        category: [{ required: true, message: '请选择账户类型', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchColumn()
    this.filterTable()
  },
  methods: {
    handleCreate() {
      this.getCompany()
      this.clearTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData('/invoices/create', this.temp).then((response) => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建发票信息成功',
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
          const tempData = Object.assign({}, this.temp)
          tempData.updated_at = undefined
          tempData.created_at = undefined
          updateData('/invoices/' + tempData.id + '/update', tempData).then((response) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新发票信息成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        const result = this.user_companies.filter(item => {
          return item.label.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
        if (result.length > 0) {
          this.loading = false
          this.user_company_options = result
        } else {
          remoteCompany(query, this.defaultScope()).then((response) => {
            this.user_company_options = response
            this.loading = false
          })
        }
      }
    },
    defaultScope() {
      if (this.type === 'oa') {
        return { company_type: 4 }
      } else {
        return { company_type: [1, 2, 3] }
      }
    },
    getCompany() {
      if (this.user_companies.length === 0) {
        remoteCompany('', this.defaultScope()).then((response) => {
          this.user_company_options = response
          this.user_companies = response
        })
      } else {
        this.user_company_options = this.user_companies
      }
    },
    handleSelectionChange() {
    },
    handleUpdate(row) {
      this.getCompany()
      this.temp = row
      this.temp.user_company_id = row['user_company_id_value']
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    filterTable() {
      this.listLoading = true
      this.listQuery.type = this.type
      getData('/invoices/data?type=' + this.type, this.listQuery).then(response => {
        this.total = response.total
        let data = response.data
        if (!Array.isArray(data)) {
          data = []
        }
        this.list = data
        setTimeout(() => {
          this.listLoading = false
        }, 200)
      }).catch(error => {
        console.log(error)
      })
    },
    fetchColumn() {
      const url = '/invoices/column?type=' + this.type
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
    handleDelete() {
      const id = this.temp.id
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData('/invoices/' + id + '/delete').then((response) => {
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
    clearTemp() {
      this.temp = {
        id: null,
        user_company_id: null,
        bank_name: null,
        name: null,
        category: null,
        bank_number: null,
        bank_address: null,
        tax_register_number: null,
        user_name: null,
        user_address: null,
        location: null,
        swift_code: null
      }
    }
  }
}
</script>
