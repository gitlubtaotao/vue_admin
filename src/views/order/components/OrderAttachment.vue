<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-upload
          ref="upload"
          class="upload-demo"
          :action="uploadUrl"
          :data="otherParams"
          :headers="headersParams"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="fileList"
          :limit="5"
          :on-exceed="handleExceed"
          :on-error="handleError"
          :multiple="true"
          style="margin-bottom: 20px;margin-top: 10px;"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <el-card shadow="hover" class="" style="margin-bottom: 20px;">
      <div slot="header" class="clearfix">
        <span>{{ showLabel }}</span>
      </div>
      <el-table ref="attachment-list" :key="label" :data="fileArray" fit max-height="700" border style="width: 100%;">
        <el-table-column prop="name" label="文件名" width="300" />
        <el-table-column prop="size" label="文件大小" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.size.toString() + 'KB' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="文件上传时间" width="300">
          <template slot-scope="scope">
            <span>{{ showDate(scope.row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" :href="scope.row.url" target="_blank">下载</el-link>
            <el-link type="danger" size="small" @click="deleteFile(scope.row,scope.$index)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'
import { deleteData } from '@/api/index_data'
export default {
  name: 'OrderAttachment',
  props: {
    label: {
      required: true,
      type: String
    },
    attachmentList: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      fileArray: [],
      fileList: [],
      otherParams: { label: this.label, source_id: this.$route.params.id },
      headersParams: { Authorization: 'Bearer ' + getToken() }
    }
  },
  computed: {
    showLabel: function() {
      if (this.label === 'external') {
        return '外部附件'
      }
      return '内部附件'
    },
    uploadUrl: function() {
      return process.env.VUE_APP_BASE_API + '/attachments/UploadOrder'
    }
  },
  watch: {
    attachmentList: {
      immediate: true,
      handler(newVal) {
        if (newVal.length >= 1) {
          this.fileArray = newVal
        }
      }
    }
  },
  methods: {
    showDate(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleError(err, file, fileList) {
      console.log(err)
    },
    handleSuccess(response, file, fileList) {
      this.fileArray.push(response.data)
    },
    handleExceed(file, fileList) {
      this.$message.error('每次上传文件数量不能超过5个')
    },
    // 下载附件
    deleteFile(row, $index) {
      this.$confirm('是否继续执行此操作, ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData('/attachments/' + row.id + '/delete').then(response => {
          this.fileArray.splice($index, 1)
          this.$notify.success('删除成功')
        })
      }).catch(() => {
      })
    }
  }
}
</script>
