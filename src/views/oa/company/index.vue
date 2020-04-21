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
          <el-col :xs="8" :sm="6" :md="6" :lg="6">
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
        border
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column v-for="column in columnArray" v-if="showColumn(column)" :prop="column['data']" :label="column['title']">
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="filterTable" />
    </el-card>
  </div>
</template>
<script>
import { getColumn, localColumn } from '@/api/column'
import { getData } from "@/api/index_data"
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
export default {
  name: 'CompanyTable',
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
      columnArray: []
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
      getData('/companies/data', this.listQuery).then(response => {
        this.total = response.total
        let data = response.data
        if (!Array.isArray(data)) {
          data = []
        }
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
