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
            <el-form-item label="合作单位" class="">
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
        <el-form-item label="合作单位" prop="user_company_id">
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="phone">
          <el-input v-model="temp.email" type="email" />
        </el-form-item>
        <el-form-item label="主要联系人" prop="is_key_contact">
          <el-switch v-model="temp.is_key_contact" style="display: block" active-color="#13ce66" inactive-color="#ff4949" active-text="ON" inactive-text="OFF" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
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
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="temp.address" type="textarea" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" type="textarea" />
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
import { remoteCompany } from '@/api/select'
import { getData, createData, updateData, deleteData } from '@/api/index_data'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
export default {
  name: 'CrmContact',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 1,
      listLoading: false,
      loading: false,
      columnUrl: '/crm/users/column',
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        phone: undefined,
        email: undefined,
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
        sex: null,
        is_key_contact: false,
        address: null,
        remarks: null
      },
      index: 0,
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'change' }],
        user_company_id: [{ required: true, message: '请选择合作单位', trigger: 'blur' }]
      },
      textMap: {
        update: '编辑联系人信息',
        create: '新增联系人信息'
      },
      columnArray: [],
      user_companies: [],
      user_company_options: [],
      sex_options: [{ label: '男', value: 1 },
        { label: '女', value: 2 }]
    }
  },
  created() {
    this.fetchColumn()
    this.filterTable()
  },
  methods: {
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
        user_no: null,
        address: null,
        remark: null
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData('/crm/users/create', this.temp).then((response) => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建联系人信息成功',
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
      this.temp.user_company_id = row['user_company_id_value']
      this.temp.is_key_contact = row['is_key_contact_value']
      this.temp.sex = row['sex_value']
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
          updateData('/crm/users/' + tempData.id + '/update', tempData).then((response) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新联系人信息成功',
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
          remoteCompany(query, { company_type: [1, 2, 3] }).then((response) => {
            this.user_company_options = response
            this.loading = false
          })
        }
      }
    },
    getCompany() {
      if (this.user_companies.length === 0) {
        remoteCompany('', { company_type: [1, 2, 3] }).then((response) => {
          this.user_company_options = response
          this.user_companies = response
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
        deleteData('crm/users/' + id + '/delete').then((response) => {
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
      getData('/crm/users/data', this.listQuery).then(response => {
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
