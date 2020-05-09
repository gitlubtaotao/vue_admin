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
          <el-col :xs="12" :sm="8" :md="6" :lg="6">
            <el-button v-waves type="primary" icon="el-icon-search" size="medium" @click="filterTable">搜索</el-button>
            <el-button type="danger" icon="el-icon-close" size="medium" @click="clearFilter">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-divider />
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
        medium="medium"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column label="操作" width="150" fixed="left">
          <template slot-scope="{row,$index}">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(row)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" />
        <el-table-column v-for="column in columnArray" :prop="column['data']" :label="column['title']" width="180" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="filterTable" />
    </el-card>

    <el-dialog title="新增流水号规则设置" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="dataForm" :inline="false" :rules="rules" :model="temp" :status-icon="true" label-position="left" label-width="120px" style="width: 80%; margin-left:50px;">
        <el-form-item label="所属公司" prop="user_company_id">
          <el-select
            v-model="temp.user_company_id"
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
        <el-form-item label="用途" prop="application_no">
          <el-select
            v-model="temp.application_no"
            filterable
            placeholder="请选择"
            size="medium"
            clearable
          >
            <el-option
              v-for="item in applicationNoOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="前缀" prop="prefix">
          <el-input v-model="temp.prefix" size="medium" />
        </el-form-item>
        <el-form-item label="流水号长度" prop="length">
          <el-input-number v-model="temp.length" size="medium" :min="1" :max="10"/>
        </el-form-item>
        <el-form-item label="年规则" prop="year_rule">
          <el-radio v-model="temp.year_rule" label="1">4位年</el-radio>
          <el-radio v-model="temp.year_rule" label="2">2位年</el-radio>
          <el-radio v-model="temp.year_rule" label="0">不用年</el-radio>
        </el-form-item>
        <el-form-item label="特殊字符" prop="special">
          <el-input v-model="temp.special" size="medium" />
        </el-form-item>
        <el-form-item label="开始流水号" prop="default_number">
          <el-input-number v-model="temp.default_number" size="medium" :min="1" :max="10"/>
        </el-form-item>
        <el-form-item label="排序规则" prop="">
          <el-checkbox-group v-model="ruleList">
            <el-checkbox label="year">年</el-checkbox>
            <el-checkbox label="month">月</el-checkbox>
            <el-checkbox label="day">日</el-checkbox>
            <el-checkbox label="length">流水号长度</el-checkbox>
            <el-checkbox label="special">特殊字符</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="归零规则" prop="clear_rule">
          <el-select
            v-model="temp.clear_rule"
            filterable
            placeholder="请选择"
            size="medium"
            clearable
          >
            <el-option
              v-for="item in clearRuleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生成的规则" prop="default_rule">
          <el-input v-model="temp.default_rule" size="medium" disabled="disabled" />
        </el-form-item>
      </el-form>
      <el-divider />
      <el-form :inline="true" :model="test" :status-icon="true" label-position="left" label-width="100px" style="width: 80%; margin-left:50px;">
        <el-form-item label="模拟序号" prop="">
          <el-input-number v-model="test.length" size="medium" :min="1" :max="10"/>
        </el-form-item>
        <el-form-item label="模拟效果" prop="">
          <el-input v-model="test.result" size="medium" disabled="disabled" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>
<script>
import { getColumn, localColumn } from '@/api/column'
import getSelectApi from '@/api/select'
import { getData, createData, deleteData } from '@/api/index_data'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
export default {
  name: 'NumberSetting',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 1,
      listLoading: false,
      loading: false,
      columnUrl: '/number_settings/column',
      listQuery: {
        page: 1,
        limit: 20,
        user_company_id: undefined
      },
      dialogFormVisible: false,
      temp: {
        user_company_id: null,
        prefix: '',
        length: 1,
        year_rule: '',
        special: '',
        default_number: 1,
        clear_rule: '',
        day_rule: '',
        month_rule: '',
        default_rule: '',
        application_no: ''
      },
      test: {
        length: 1,
        result: null
      },
      ruleList: [],
      index: 0,
      rules: {
        prefix: [{ required: true, message: '请输入前缀', trigger: 'blur' }],
        application_no: [{ required: true, message: '请输入用途', trigger: 'blur' }],
        length: [{ required: true, message: '请输入流水号长度', trigger: 'blur' }],
        year_rule: [{ required: true, message: '请选择年规则', trigger: 'blur' }],
        user_company_id: [{ required: true, message: '请选择所属公司', trigger: 'blur' }]
      },
      columnArray: [],
      user_companies: [],
      user_company_options: [],
      clearRuleOptions: [],
      applicationNoOptions: [{ label: '订单号', value: 'order_serial_number' }]
    }
  },
  created() {
    this.fetchColumn()
    this.filterTable()
  },
  methods: {
    handleCreate() {
      this.getCompany()
      this.dialogFormVisible = true
      this.temp = {
        id: null,
        name_cn: null,
        name_en: null,
        user_company_id: null
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData('/number_settings/create', this.temp).then((response) => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建部门信息成功',
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
        deleteData('/number_settings/' + id + '/delete').then((response) => {
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
      getData('/number_settings/data', this.listQuery).then(response => {
        // this.total = response.data.total
        // let data = response.data.data
        // if (!Array.isArray(data)) {
        //   data = []
        // }
        // console.log(data)
        // this.list = data
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      }).catch(error => {
        console.log(error)
      })
    },
    clearFilter() {
      this.filterTable()
    }
  }
}
</script>
<style scoped="scss">
  .el-select{
    width: 100%;
  }
</style>
