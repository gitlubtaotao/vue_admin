<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="">
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
            <el-form-item label="代码值" class="">
              <el-input
                v-model="listQuery.name"
                placeholder="代码值"
                class="filter-item"
                size="medium"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="6" :lg="6">
            <el-form-item label="类型" class="">
              <el-select
                v-model="listQuery.code_name"
                filterable
                placeholder="请选择"
                size="medium"
                clearable
                :loading="loading"
              >
                <el-option
                  v-for="item in codeNamesOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
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
      <div slot="header" class="">
        <el-row :gutter="10">
          <keep-alive>
            <unfixed-thead v-model="columnArray" :local-key="columnUrl" :columns="columnArray" />
          </keep-alive>
          <keep-alive>
            <export-excel :multiple-selection="multipleSelection" :local-key="columnUrl" />
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
        <el-form-item label="类型" prop="code_name">
          <el-select
            v-model="temp.code_name"
            style="width:100%"
            filterable
            placeholder="请选择"
            size="medium"
            clearable
            :loading="loading"
          >
            <el-option
              v-for="item in codeNamesOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="代码值" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" type="textarea" />
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
import { getData, createData, updateData, deleteData } from '@/api/index_data'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import UnfixedThead from '@/components/UnfixedThead'
import ExportExcel from '@/components/ExportExcel'
export default {
  name: 'DataCode',
  components: { Pagination, UnfixedThead, ExportExcel },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 1,
      listLoading: false,
      loading: false,
      columnUrl: '/base/codes/column',
      listQuery: {
        page: 1,
        limit: 20,
        code_name: undefined,
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        id: null,
        name: null,
        code_name: null,
        remarks: null
      },
      index: 0,
      rules: {
        name: [{ required: true, message: '代码值', trigger: 'blur' }],
        code_name: [{ required: true, message: '请输入类型', trigger: 'blur' }]
      },
      textMap: {
        update: '编辑基础代码信息',
        create: '新增基础代码信息'
      },
      columnArray: [],
      codeNames: [],
      codeNamesOptions: [],
      multipleSelection: []
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
        name: null,
        code_name: null,
        remarks: null
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        console.log(this.temp)
        if (valid) {
          createData('/base/codes/create', this.temp).then((response) => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建基础代码成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = row
      this.temp.code_name = row['code_name_value']
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
          updateData('/base/codes/' + tempData.id + '/update', tempData).then((response) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新基础代码成功',
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
        deleteData('/base/codes/' + id + '/destroy').then((response) => {
          this.$notify({
            title: 'Success',
            message: '删除基础代码信息成功',
            type: 'success',
            duration: 5000
          })
          this.list.splice(this.index, 1)
        })
      }).catch(() => {
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchColumn() {
      const data = localColumn(this.columnUrl)
      if (data.length === 0) {
        getColumn(this.columnUrl).then(response => {
          console.log(response)
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
      getData('/base/codes/data', this.listQuery).then(response => {
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
        console.log(response)
        this.codeNamesOptions = response.code_level
        setTimeout(() => {
          this.listLoading = false
        }, 200)
      }).catch(error => {
        console.log(error)
      })
    },
    clearFilter() {
      this.listLoading = true
      this.listQuery.name = undefined
      this.listQuery.code_name = undefined
      this.filterTable()
    }
  }
}
</script>
<style scoped="scss">
</style>
