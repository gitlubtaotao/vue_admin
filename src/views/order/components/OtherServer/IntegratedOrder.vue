<template>
  <div>
    <el-card shadow="hover" style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>其他服务</span>
        <el-button type="primary" size="small" style="float: right;" @click="addOrder">新增</el-button>
      </div>
      鼠标悬浮时显示
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'IntegratedOrder',
  props: {
    orderList: {
      type: Array,
      required: true
    }
  },
  methods: {
    addOrder() {

    }
  }
}
</script>
