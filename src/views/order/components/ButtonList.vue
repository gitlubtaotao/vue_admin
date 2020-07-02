<template>
  <div>
    <el-row>
      <el-button v-if="orderMasterStatus === 'processing'" type="primary" size="small" icon="el-icon-edit" @click="editOrder">编辑订单</el-button>
      <el-button type="primary" size="small" icon="el-icon-date">操作计划</el-button>
      <el-button v-if="orderMasterStatus !== 'cancel'" type="info" size="small" icon="el-icon-copy-document">复制</el-button>
      <el-button type="info" size="small" icon="el-icon-location">货物追踪</el-button>
      <el-button v-if="orderMasterStatus === 'processing'" type="warn" size="small" icon="el-icon-remove">移单</el-button>
      <el-button v-if="orderMasterStatus === 'unaudited'" type="primary" size="small" icon="el-icon-success" @click="auditOrder">审核通过</el-button>
      <el-button v-if="orderMasterStatus === 'unprocessed'" type="primary" size="small" icon="el-icon-success" @click="takeOrder">接单</el-button>
      <el-button v-if="orderMasterStatus === 'processing'" type="warn" size="small" icon="el-icon-lock" @click="lockOrder">锁单</el-button>
      <el-button v-if="orderMasterStatus === 'locked'" type="warn" size="small" icon="el-icon-unlock" @click="unLockOrder">解锁</el-button>
      <el-button v-if="['processing','locked'].indexOf(orderMasterStatus) > -1" type="danger" size="small" icon="el-icon-info" @click="cancelOrder">作废</el-button>
      <el-button v-if="['processing','locked'].indexOf(orderMasterStatus) > -1" type="danger" size="small" icon="el-icon-info" @click="finishedOrder">完成</el-button>
      <el-button v-if="orderMasterStatus === 'cancel' " type="primary" size="small" icon="el-icon-info" @click="rollbackOrder">回退</el-button>
      <el-button v-if="orderMasterStatus === 'cancel'" type="danger" size="small" icon="el-icon-delete" @click="deleteOrder">删除</el-button>
    </el-row>
    <keep-alive>
      <master-form :dialog-form-visible="dialogFormVisible" :dialog-status="dialogStatus" :record="orderMaster" @listenFormVisible="listenFormVisible" />
    </keep-alive>
  </div>
</template>
<script>
import MasterForm from '../components/MasterForm'
import { deleteOrder } from '@/api/order_master'
export default {
  name: 'ButtonList',
  components: { MasterForm },
  props: {
    orderMaster: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: 'update',
      order_master_id: this.$route.params.id
    }
  },
  computed: {
    orderMasterStatus: function() {
      return this.$store.state.orderMaster.orderMasterStatus
    }
  },
  methods: {
    listenFormVisible(val) {
      this.dialogFormVisible = val
    },
    beforeCheck(callback) {
      this.$confirm('是否继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        callback(this.order_master_id)
      }).catch(() => {
      })
    },
    auditOrder() {
      const _this = this
      this.beforeCheck(function(id) {
        _this.$store.dispatch('orderMaster/setOrderMasterAudit', id)
      })
    },
    takeOrder() {
      const _this = this
      this.beforeCheck(function(id) {
        _this.$store.dispatch('orderMaster/setOrderMasterTakeOrder', id)
      })
    },
    lockOrder() {
      const _this = this
      this.beforeCheck(function(id) {
        _this.$store.dispatch('orderMaster/setOrderMasterLocked', id)
      })
    },
    unLockOrder() {
      const _this = this
      this.beforeCheck(function(id) {
        _this.$store.dispatch('orderMaster/setOrderMasterUnlocked', id)
      })
    },
    cancelOrder() {
      const _this = this
      this.beforeCheck(function(id) {
        _this.$store.dispatch('orderMaster/setOrderMasterCancel', id)
      })
    },
    finishedOrder() {
      const _this = this
      this.beforeCheck(function(id) {
        _this.$store.dispatch('orderMaster/setOrderMasterFinished', id)
      })
    },
    rollbackOrder() {
      const _this = this
      this.beforeCheck(function(id) {
        _this.$store.dispatch('orderMaster/setOrderMasterRollback', id)
      })
    },
    deleteOrder() {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder(this.order_master_id).then((response) => {
          this.$notify({ title: 'Success', message: '删除成功', type: 'success', duration: 5000 })
        })
        this.$router.push('/order/master/')
      }).catch(() => {
      })
    },
    // 编辑订单
    editOrder() {
      this.dialogFormVisible = true
    }
  }
}
</script>

