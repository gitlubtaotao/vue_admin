<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-radio-group v-model="listQuery.status" size="medium" style="margin-left: 5px;" @change="filterTable">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="0">未转化</el-radio-button>
          <el-radio-button label="1">已转化</el-radio-button>
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
            <el-form-item label="公司座机" class="">
              <el-input
                v-model="listQuery.tel"
                placeholder="公司座机"
                class="filter-item"
                size="medium"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="6" :lg="6">
            <el-form-item label="公司类型" class="">
              <el-select
                v-model="listQuery.company_type"
                filterable
                placeholder="请选择"
                size="medium"
                clearable
              >
                <el-option
                  v-for="item in companyTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="联系人" class="">
              <el-input
                v-model="listQuery.user_name"
                placeholder="请输入联系人"
                class="filter-item"
                size="medium"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="联系人电话" class="">
              <el-input
                v-model="listQuery.user_tel"
                placeholder="联系人电话"
                class="filter-item"
                size="medium"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="6" :lg="6">
            <el-form-item label="业务员" class="">
              <el-select
                v-model="listQuery.create_id"
                filterable
                remote
                placeholder="请选择"
                size="medium"
                clearable
                :remote-method="remoteMethod"
                :loading="loading"
                @focus="getUser()"
              >
                <el-option
                  v-for="item in usersOptions"
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
      <div slot="header" class="">
        <div>
          <keep-alive><unfixed-thead v-model="columnArray" :local-key="columnUrl" :columns="columnArray" /></keep-alive>
          <keep-alive><export-excel :multiple-selection="multipleSelection" :local-key="columnUrl" /></keep-alive>
        </div>
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
            <el-button
              size="mini"
              type="primary"
              @click="handleUpdate(row)"
            >编辑</el-button>
            <el-dropdown size="mini" type="primary" @visible-change="handleClick(row,$index)" @command="handleCommand">
              <el-button type="primary" size="mini">
                更多 <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <router-link :to="'/crm/clue/show/'+row.id">
                  <el-dropdown-item>详情</el-dropdown-item>
                </router-link>
                <el-dropdown-item command="tracks">跟进记录</el-dropdown-item>
                <el-dropdown-item command="transfer">转移</el-dropdown-item>
                <el-dropdown-item command="transfer_crm">转化成合作单位</el-dropdown-item>
                <el-dropdown-item command="delete" :divided="true">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column type="index" />
        <el-table-column v-for="column in columnArray" :key="column['data']" :prop="column['data']" :label="column['title']" width="180" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="filterTable" />
    </el-card>
    <el-dialog title="跟进记录" :visible.sync="dialogTracksVisible" width="50%">
      <keep-alive>
        <ClueTrack :source-id="parseInt(temp.id)" source-type="crm_clues" :clue-tracks="temp.crm_tracks" />
      </keep-alive>
    </el-dialog>
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
              <el-select
                v-model="temp.company_type"
                filterable
                placeholder="请选择"
                size="medium"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in companyTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="业务类型" prop="source" style="">
              <el-select
                v-model="temp.source"
                filterable
                placeholder="请选择"
                size="medium"
                style="width: 100%"
                clearable
                allow-create
                multiple
              >
                <el-option
                  v-for="item in sourceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司座机" prop="tel" style="">
              <el-input v-model="temp.tel" type="tel" size="medium" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="公司邮箱" prop="email" style="">
              <el-input v-model="temp.email" type="email" size="medium" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司中文地址" prop="address">
              <el-input v-model="temp.zh_address" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="公司英文地址" prop="address2">
              <el-input v-model="temp.en_address" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="temp.remark" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="联系人" prop="user_name">
              <el-input v-model="temp.user_name" size="medium" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人电话" prop="user_tel">
              <el-input v-model="temp.user_tel" size="medium" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="联系人邮箱" prop="user_email">
              <el-input v-model="temp.user_email" size="medium" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人微信" prop="wechat_id">
              <el-input v-model="temp.wechat_id" size="medium" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="联系人QQ" prop="qq_id">
              <el-input v-model="temp.qq_id" size="medium" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人备注" prop="user_remarks">
              <el-input v-model="temp.user_remarks" type="textarea" rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
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
import { remoteEmployee } from '@/api/select'
import ClueTrack from '@/components/ClueTrack'
import UnfixedThead from '@/components/UnfixedThead'
import ExportExcel from '@/components/ExportExcel'
export default {
  name: 'CrmClue',
  components: { ClueTrack, Pagination, UnfixedThead, ExportExcel },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 2,
      listLoading: false,
      columnUrl: '/crm/clues/column',
      companyTypeOptions: [{ label: '客户', value: 1 },
        { label: '供应商', value: 2 }, { label: '客户&供应商', value: 3 }],
      sourceOptions: [],
      users: [],
      usersOptions: [],
      loading: false,
      listQuery: {
        page: 1,
        limit: 20,
        name_nick: undefined,
        email: undefined,
        tel: undefined,
        create_id: undefined,
        user_name: undefined,
        user_tel: undefined,
        company_type: undefined,
        status: ''
      },
      dialogFormVisible: false,
      dialogTracksVisible: false,
      dialogStatus: '',
      temp: {
        id: null,
        name_nick: null,
        name_cn: null,
        name_en: null,
        company_type: 1,
        source: [],
        tel: null,
        email: null,
        zh_address: null,
        en_address: null,
        remarks: null,
        user_name: null,
        user_tel: null,
        user_email: null,
        wechat_id: null,
        qq_id: null,
        user_remarks: null
      },
      index: 0,
      rules: {
        name_nick: [{ required: true, message: '请输入公司简称', trigger: 'blur' }],
        name_cn: [{ required: true, message: '请输入公司中文名', trigger: 'blur' }],
        company_type: [{ required: true, message: '请输入公司类型', trigger: 'blur' }],
        tel: [{ required: true, message: '请输入公司座机', trigger: 'blur' }],
        email: [{ required: true, type: 'email', message: '请输入公司邮箱', trigger: 'blur' }]
      },
      textMap: {
        update: '编辑线索信息',
        create: '新增线索信息'
      },
      columnArray: [],
      multipleSelection: []
    }
  },
  created() {
    this.fetchColumn()
    this.filterTable()
  },
  methods: {
    remoteMethod(query) {
      this.loading = true
      const result = this.users.filter(item => {
        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
      })
      if (result.length > 0) {
        this.loading = false
        this.usersOptions = result
      } else {
        this.remoteGetUser(query)
      }
    },
    getUser() {
      if (this.users.length === 0) {
        remoteEmployee('').then((response) => {
          this.users = response
          this.usersOptions = response
        })
      } else {
        this.usersOptions = this.users
      }
    },
    remoteGetUser(query) {
      this.loading = true
      const result = this.users.filter(item => {
        return item.label.toLowerCase()
          .indexOf(query.toLowerCase()) > -1
      })
      if (result.length > 0) {
        this.loading = false
        this.usersOptions = result
        return
      }
      remoteEmployee(query).then((response) => {
        this.usersOptions = response
        this.loading = false
      })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.clearTemp()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = this.temp
          if (data.source !== '' && typeof (data.source) !== 'undefined' && Array.isArray(data.source)) {
            data.source = data.source.join(',')
          }
          createData('/crm/clues/create', data).then((response) => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '线索信息创建成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      editData('/crm/clues/' + row.id + '/edit', 'get').then((response) => {
        const data = response.data
        if (data.source !== '') {
          data.source = data.source.split(',')
        }
        this.temp = data
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
          if (tempData.source !== '' && typeof (tempData.source) !== 'undefined') {
            tempData.source = tempData.source.join(',')
          }
          updateData('/crm/clues/' + tempData.id + '/update', tempData, 'patch').then((response) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新线索信息成功',
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
      } else if (command === 'tracks') {
        this.handleTracks()
      }
    },
    handleTracks() {
      this.dialogTracksVisible = true
    },
    handleDelete() {
      const id = this.temp.id
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData('/crm/clues' + id + '/delete', 'delete').then((response) => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
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
      this.$router.push('/crm/clue/show/' + row.id)
    },
    filterTable() {
      this.listLoading = true
      getData('/crm/clues/data', this.listQuery).then(response => {
        let total = response.total
        if (typeof (total) === 'undefined') {
          total = 0
        }
        let data = response.data
        if (!Array.isArray(data)) {
          data = []
        }
        this.list = data
        this.total = total
        setTimeout(() => {
          this.listLoading = false
        }, 200)
      }).catch(error => {
        console.log(error)
      })
    },
    clearFilter() {
      this.listQuery = {
        page: 1,
        limit: 20,
        name_nick: undefined,
        email: undefined,
        tel: undefined,
        create_id: undefined,
        user_name: undefined,
        user_tel: undefined,
        company_type: undefined
      }
      this.filterTable()
    },
    clearTemp() {
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
    }

  }
}
</script>
<style scoped="scss">
</style>
