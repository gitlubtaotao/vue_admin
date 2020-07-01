<template>
  <div>
    <el-card shadow="hover" class="" style="margin-bottom: 20px;">
      <div slot="header" class="clearfix">
        <span>{{ label }}</span>
      </div>
      <el-table ref="attachment-list" :key="label" :data="attachmentList" fit max-height="700" border style="width: 100%;">
        <el-table-column prop="name" label="文件名" width="180" />
        <el-table-column prop="type_of" label="文件类型" width="150" />
        <el-table-column prop="size" label="文件大小" width="150" />
        <el-table-column prop="created_at" label="文件上传时间" width="150" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small">预览</el-button>
            <el-button type="primary" size="small">下载</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
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
  }
}
</script>
