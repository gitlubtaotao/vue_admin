<template>
  <el-row>
    <el-button type="success" size="small" icon="el-icon-check">保存</el-button>
    <el-button type="primary" size="small" icon="el-icon-edit">编辑订单</el-button>
    <el-button type="primary" size="small" icon="el-icon-date">操作计划</el-button>
    <el-button type="info" size="small" icon="el-icon-copy-document">复制</el-button>
    <el-button type="info" size="small" icon="el-icon-location">货物追踪</el-button>
    <el-button type="warn" size="small" icon="el-icon-remove">移单</el-button>
    <el-button type="warn" size="small" icon="el-icon-lock">锁单</el-button>
    <el-button type="warn" size="small" icon="el-icon-unlock">解锁</el-button>
    <el-button type="danger" size="small" icon="el-icon-info">作废</el-button>
    <el-button type="danger" size="small" icon="el-icon-info">完成</el-button>
  </el-row>
</template>
<script>
export default {
  name: 'ButtonList',
  props: {
    orderMaster: {
      required: true,
      type: Object
    }
  }
}
</script>

