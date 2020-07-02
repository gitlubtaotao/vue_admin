<template>
  <div>
    <div slot="header" class="">
      <el-row :gutter="10" style="margin-left: 5px;">
        <keep-alive>
          <unfixed-thead v-model="columnArray" :local-key="columnUrl" :columns="columnArray" />
        </keep-alive>
        <keep-alive>
          <export-excel :multiple-selection="multipleSelection" :local-key="columnUrl" />
        </keep-alive>
      </el-row>
    </div>
    <div class="el-card__body">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="lists"
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
            <router-link :to="'/order/master/operation/'+row.id + '?transport_type=' + row['transport_type_value']">
              <el-button size="mini" type="primary" @click="rowDblclick(row)">操作</el-button>
            </router-link>
            <el-dropdown size="mini" type="primary" @visible-change="handleClick(row,$index)" @command="handleCommand">
              <el-button type="primary" size="mini">
                更多 <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="row['status_value'] === 'processing'" command="update">编辑</el-dropdown-item>
                <el-dropdown-item v-if="row['status_value'] === 'cancel'" command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column type="index" />
        <el-table-column
          v-for="column in columnArray"
          :key="column['data']"
          :prop="column['data']"
          :label="column['title']"
          width="180"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="financeStatus.indexOf(scope.column.property) > -1"
              :type="showTagType(scope)"
              disable-transitions
            >
              {{ showTableValue(scope) }}
            </el-tag>
            <span v-else>{{ showTableValue(scope) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getColumn, localColumn } from '@/api/column'
import { getData } from '@/api/index_data'
import { deleteOrder } from '@/api/order_master'
import UnfixedThead from '@/components/UnfixedThead'
import ExportExcel from '@/components/ExportExcel'

export default {
  name: 'MasterIndex',
  components: { UnfixedThead, ExportExcel },
  props: {
    lists: {
      type: Array,
      required: true
    },
    listLoading: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      financeStatus: ['payable_status', 'paid_status', 'receivable_status', 'received_status'],
      multipleSelection: [],
      tableKey: 1,
      columnArray: [],
      columnUrl: '/order/masters/column',
      temp: {}
    }
  },
  watch: {
    lists: {
      immediate: true, // 这句重要
      handler(val) {
      }
    },
    listLoading: {
      immediate: true,
      handler(val) {
      }
    }
  },
  created() {
    this.filterColumn()
  },
  methods: {
    showTagType(scope) {
      const status = scope.row[scope.column.property]
      if (status === 'finished') {
        return 'success'
      } else if (status === 'part_finished') {
        return 'warning'
      } else {
        return 'danger'
      }
    },
    showTableValue(scope) {
      return scope.row[scope.column.property]
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    rowDblclick(row, column, event) {
      this.$router.push('/order/master/operation/' + row.id + '?transport_type=' + row['transport_type_value'])
    },
    handleUpdate() {
      getData('/order/masters/' + this.temp.id + '/edit', {}, 'get').then(response => {
        this.$emit('listenToIndex', response.data)
      })
    },
    handleDelete() {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder(this.temp.id).then((response) => {
          this.lists.splice(this.index, 1)
          this.$notify({ title: 'Success', message: '删除成功', type: 'success', duration: 5000 })
        })
      }).catch(() => {
      })
    },
    handleClick(row, index) {
      this.temp = row
    },
    handleCommand(command) {
      if (command === 'update') {
        this.handleUpdate()
      } else if (command === 'delete') {
        this.handleDelete()
      }
    },
    filterColumn() {
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
    }
  }
}
</script>
