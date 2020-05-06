<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" size="small">全部</el-button>
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
            <el-form-item label="姓名" class="">
              <el-input
                v-model="listQuery.name"
                placeholder="姓名"
                class="filter-item"
                size="medium"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="6" :lg="6">
            <el-form-item label="电话" class="">
              <el-input
                v-model="listQuery.phone"
                placeholder="电话"
                class="filter-item"
                size="medium"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="6" :lg="6">
            <el-form-item label="邮箱" class="">
              <el-input
                v-model="listQuery.email"
                placeholder="邮箱"
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
                @change="chooseDepartment"
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
          <el-col :xs="8" :sm="6" :md="6" :lg="6">
            <el-form-item label="所在部门" class="">
              <el-select
                v-model="listQuery.department_id"
                filterable
                remote
                placeholder="请选择"
                size="medium"
                clearable
                :loading="loading"
              >
                <el-option
                  v-for="item in department_options"
                  :key="item.id"
                  :label="item.name_cn"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="8" :md="6" :lg="6">
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
        <el-table-column v-for="column in columnArray" v-if="showColumn(column)" :prop="column['data']" :label="column['title']" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="filterTable" />
    </el-card>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" :status-icon="true" label-position="left" label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="phone">
          <el-input v-model="temp.email" type="email" />
        </el-form-item>
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
            @change="chooseDepartment"
          >
            <el-option
              v-for="item in user_company_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所在部门" prop="department_id">
          <el-select
            v-model="temp.department_id"
            style="width:100%"
            filterable
            remote
            placeholder="请选择"
            size="medium"
            clearable
            :loading="loading"
          >
            <el-option
              v-for="item in department_options"
              :key="item.id"
              :label="item.name_cn"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input v-model="temp.confirm_password" type="password" />
        </el-form-item>
        <el-form-item label="性别" prop="department_id">
          <el-select
            v-model="temp.sex"
            style="width:100%"
            filterable
            remote
            placeholder="请选择"
            size="medium"
            clearable
            :loading="loading"
          >
            <el-option
              v-for="item in sex_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="user_no">
          <el-input v-model="temp.user_no"/>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="temp.address" type="textarea"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>
<script>
import { getColumn, localColumn } from '@/api/column'
import getSelectApi from '@/api/select'
import { getData, createData, updateData, editData, deleteData } from '@/api/index_data'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
export default {
  name: 'Employee',
  components: { Pagination },
  directives: { waves },
  data() {
    var validatePass2 = (rule, value, callback) => {
      console.log(this.temp)
      if (this.temp.password !== '') {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.temp.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: [],
      total: 1,
      listLoading: false,
      loading: false,
      columnUrl: '/employees/column',
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        phone: undefined,
        email: undefined,
        department_id: undefined,
        user_company_id: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        id: null,
        name: null,
        phone: null,
        email: null,
        user_company_id: null,
        department_id: null,
        password: null,
        confirm_password: null,
        sex: null,
        user_no: null,
        address: null,
        remark: null,
      },
      index: 0,
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        user_company_id: [{ required: true, message: '请选择所属公司', trigger: 'blur' }],
        confirm_password: [{ validator: validatePass2, trigger: 'blur' }]
      },
      textMap: {
        update: '编辑员工信息',
        create: '新增员工信息'
      },
      columnArray: [],
      user_companies: [],
      user_company_options: [],
      departments: [],
      department_options: [],
      sex_options: [{ label: '男', value: 1 },
        { label: '女', value: 2 }]
    }
  },
  created() {
    this.fetchColumn()
    this.filterTable()
  },
  methods: {
    showColumn(column) {
      return column.title !== ''
    },
    handleCreate() {
      this.getCompany()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp = {
        id: null,
        name: null,
        phone: null,
        email: null,
        user_company_id: null,
        department_id: null,
        password: null,
        confirm_password: null,
        sex: null,
        user_no: null,
        address: null,
        remark: null,
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData('/employees/create', this.temp).then((response) => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建员工信息成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.getCompany()
      this.temp = row
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
          updateData('/employees/' + tempData.id + '/update', tempData).then((response) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新员工成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    chooseDepartment(company_id) {
      if (company_id !== ''){
        this.department_options = this.departments.filter(item => {
          return item.user_company_id === parseInt(company_id)
        })
      }else {
        this.department_options = this.departments
      }
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
          getSelectApi('/select/companies', { value: query }).then((response) => {
            console.log(response.data)
            this.loading = false
            this.user_company_options = response.data
          })
        }
      }
    },
    getCompany() {
      if (this.user_companies.length === 0) {
        getSelectApi('/select/companies', {}).then((response) => {
          this.user_companies = response.data
          this.user_company_options = response.data
        })
      } else {
        this.user_company_options = this.user_companies
      }
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
        deleteData('/department/' + id + '/delete').then((response) => {
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
    handleSelectionChange() {
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
      getData('/employees/data', this.listQuery).then(response => {
        this.total = response.data.total
        let data = response.data.data

        if (!Array.isArray(data)) {
          data = []
        }
        this.list = data
        this.departments = response.data.departments
        this.department_options = this.departments
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      }).catch(error => {
        console.log(error)
      })
    },
    clearFilter() {
      this.listLoading = true
      this.listQuery.email = undefined
      this.listQuery.name_nick = undefined
      this.filterTable()
    }
  }
}
</script>
<style scoped="scss">
</style>
