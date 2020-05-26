<template>
  <span>
    <el-button :loading="downloadLoading" size="medium" type="primary" icon="el-icon-document" @click="handleDownload">
      导出Excel
    </el-button>
    <el-button :loading="downloadLoadingZip" size="medium" type="primary" icon="el-icon-document" style="margin-left: 0" @click="handleDownloadZip">
      导出Zip
    </el-button>
  </span>
</template>
<script>
import { localColumn } from '@/api/column'
export default {
  name: 'ExportExcel',
  props: {
    multipleSelection: {
      required: true,
      type: Array
    },
    localKey: {
      required: true,
      type: String
    },
    filerName: {
      type: String,
      default: '附件'
    }
  },
  data() {
    return {
      downloadLoading: false,
      downloadLoadingZip: false,
      columnArray: [],
      tHeader: [],
      filterVal: []
    }
  },
  watch: {
    multipleSelection: {
      immediate: true, // 这句重要
      handler(val) {}
    }
  },
  created() {
    console.log(this.localKey, this.multipleSelection)
  },
  methods: {
    handleDownload() {
      if (!this.notRecord()) {
        return false
      }
      this.downloadLoading = true
      const _this = this
      import('@/vendor/Export2Excel').then(excel => {
        _this.columnArray = localColumn(this.localKey)
        _this.handleColumn()
        const data = _this.formatJson()
        excel.export_json_to_excel({
          header: _this.tHeader,
          data,
          filename: _this.filerName,
          autoWidth: true, // Optional
          bookType: 'xlsx' // Optional
        })
        this.downloadLoading = false
      })
    },
    handleDownloadZip() {
      if (!this.notRecord()) {
        return false
      }
      this.downloadLoadingZip = true
      const _this = this
      import('@/vendor/Export2Zip').then(zip => {
        _this.columnArray = localColumn(this.localKey)
        _this.handleColumn()
        const data = _this.formatJson()
        zip.export_txt_to_zip(_this.tHeader, data, this.filerName, this.filerName)
        this.downloadLoadingZip = false
      })
    },
    handleColumn() {
      for (let i = 0; i < this.columnArray.length; i++) {
        this.tHeader.push(this.columnArray[i].title)
        this.filterVal.push(this.columnArray[i].data)
      }
    },
    notRecord() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          message: '清选择要导出的记录',
          type: 'warning'
        })
        return false
      } else {
        return true
      }
    },
    formatJson() {
      return this.multipleSelection.map(v => this.filterVal.map(j => v[j]))
    }
  }
}
</script>
