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
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item label="公司名称" class="">
              <el-input
                v-model="listQuery.name_nick"
                placeholder="公司名称"
                class="filter-item"
                size="medium"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="公司邮箱" class="">
              <el-input
                v-model="listQuery.email"
                placeholder="公司邮箱"
                class="filter-item"
                size="medium"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" >
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
        @row-dblclick="rowDblclick"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column label="操作" width="150" fixed="left">
          <template slot-scope="{row,$index}">
            <el-button
              size="mini"
              type="primary"
              @click="handleUpdate(row)"
            >编辑</el-button>
            <el-dropdown size="mini"  type="primary" @visible-change="handleClick(row,$index)" @command="handleCommand">
              <el-button type="primary" size="mini">
                更多 <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <router-link :to="'/oa/company/show/'+row.id">
                  <el-dropdown-item>详情</el-dropdown-item>
                </router-link>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column type="index" />
        <el-table-column v-for="column in columnArray" v-if="showColumn(column)" :prop="column['data']" :label="column['title']" width="180" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="filterTable" />
    </el-card>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" :status-icon="true" label-position="left" label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item label="公司简称" prop="name_nick">
          <el-input v-model="temp.name_nick" />
        </el-form-item>
        <el-form-item label="公司中文名" prop="name_cn">
          <el-input v-model="temp.name_cn" />
        </el-form-item>
        <el-form-item label="公司英文名" prop="name_en">
          <el-input v-model="temp.name_en" />
        </el-form-item>
        <el-form-item label="公司座机" prop="telephone">
          <el-input v-model="temp.telephone" />
        </el-form-item>
        <el-form-item label="公司邮箱" prop="email">
          <el-input v-model="temp.email" type="email" />
        </el-form-item>
        <el-form-item label="公司网站" prop="website">
          <el-input v-model="temp.website" type="url" />
        </el-form-item>
        <el-form-item label="公司传真" prop="website">
          <el-input v-model="temp.fax" type="text" />
        </el-form-item>
        <el-form-item label="公司中文地址" prop="address">
          <el-input v-model="temp.zh_address" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="公司英文地址" prop="address2">
          <el-input v-model="temp.en_address" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" type="textarea" :rows="2" />
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
import { getData, createData, updateData, editData, deleteData } from '@/api/index_data'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
export default {
  name: 'Company',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 2,
      listLoading: false,
      columnUrl: '/companies/column',
      listQuery: {
        page: 1,
        limit: 20,
        name_nick: undefined,
        email: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
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
        fax: null
      },
      index: 0,
      rules: {
        name_nick: [{ required: true, message: '请输入公司简称', trigger: 'blur' }],
        name_cn: [{ required: true, message: '请输入公司中文名', trigger: 'blur' }],
        name_en: [{ required: true, message: '请输入公司英文名称', trigger: 'blur' }],
        telephone: [{ required: true, message: '请输入公司座机', trigger: 'blur' }],
        email: [{ required: true, type: 'email', message: '请输入公司邮箱', trigger: 'blur' }]
      },
      textMap: {
        update: '编辑公司信息',
        create: '新增公司信息'
      },
      colmnArray: []
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
        website: null,
        fax: null
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData('/companies/create', this.temp).then((response) => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建公司信息成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      editData('/companies/' + row.id + '/edit',).then((response) => {
        this.temp = response.data
      })
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
          console.log('/companies/' + tempData.id + '/update')
          updateData('/companies/' + tempData.id + '/update', tempData).then((response) => {
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
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData('/companies/' + id + '/delete').then((response) => {
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
    rowDblclick(row, column, event) {
      this.$router.push('/oa/company/show/' + row.id)
    },
    filterTable() {
      this.listLoading = true
      getData('/companies/data', this.listQuery).then(response => {
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
