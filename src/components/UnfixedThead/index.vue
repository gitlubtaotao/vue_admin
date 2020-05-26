<template>
  <el-dropdown :hide-on-click="false" placement="bottom">
    <el-button type="primary" size="medium" icon="el-icon-arrow-down">
      列设置
    </el-button>
    <el-dropdown-menu slot="dropdown" style="width: 200px;margin-left: 30px;max-height:300px;overflow-y: auto;">
      <el-checkbox-group v-model="localColumns">
        <el-dropdown-item v-for="record in tableColumns" :key="record.data">
          <el-checkbox :label="record.data">{{ record.title }}
          </el-checkbox>
        </el-dropdown-item>
      </el-checkbox-group>
      <el-divider />
      <el-row :gutter="5" style="text-align: center;">
        <el-button type="success" size="small" @click="saveColumns">保存</el-button>
      </el-row>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import { getTableColumn, saveCustomerColumn } from '@/api/column'
export default {
  name: 'UnfixedThead',
  props: {
    localKey: {
      required: true,
      type: String
    },
    columns: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      localColumns: [],
      tableColumns: []
    }
  },
  created() {
    this.getTableColumns()
    for (let i = 0; i < this.columns.length; i++) {
      this.localColumns.push(this.columns[i].data)
    }
  },
  methods: {
    saveColumns() {
      const saveValue = []
      for (let i = 0; i < this.localColumns.length; i++) {
        const tmp = this.searchTitle(this.localColumns[i])
        if (tmp.length === 1) {
          saveValue.push(tmp[0])
        }
      }
      saveCustomerColumn(this.localKey, saveValue)
      this.$notify({ title: 'Success', message: '列设置保存成功', type: 'success', duration: 5000 })
      this.$emit('input', saveValue)
    },
    searchTitle(data) {
      return this.tableColumns.filter(function(item) {
        return item.data === data
      })
    },
    getTableColumns() {
      if (this.tableColumns.length === 0) {
        getTableColumn(this.localKey).then(response => {
          console.log(response)
          this.tableColumns = response
        }).catch(error => {
          this.$message({ showClose: true, message: error, type: 'error' })
        })
      }
    }
  }
}
</script>
