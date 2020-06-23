<template>
  <el-card shadow="hover" class="operation-fee">
    <div slot="header" class="clearfix">
      <span>{{ showType }}</span>
    </div>
    <el-table :key="payOrReceive" :data="finance_fee_array" fit max-height="500" border style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" fixed="left" />
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item v-if="payOrReceive === 'receive'" label="应收">
              <span>{{ scope.row.receivable }}</span>
            </el-form-item>
            <el-form-item v-else label="应付">
              <span>{{ scope.row.payable }}</span>
            </el-form-item>
            <el-form-item label="费用状态">
              <span>{{ scope.row.status }}</span>
            </el-form-item>
            <el-form-item label="D/N">
              <span>{{ scope.row.verify_status }}</span>
            </el-form-item>
            <el-form-item label="币种汇率">
              <span>{{ scope.row.finance_currency_rate }}</span>
            </el-form-item>
            <el-form-item label="账单号">
              <span>{{ scope.row.finance_statement_no }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="费用简称" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.name" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in fee_type_options" :key="parseInt(item.id)" :label="item.name" :value="item.name" />
            </el-select>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用名称" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.name_cn" size="small" />
          </template>
          <span v-else>{{ scope.row.name_cn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算方式" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.pay_type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in pay_type_options" :key="parseInt(item.id)" :label="item.name" :value="item.name" />
            </el-select>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="币种" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.finance_currency_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in finance_currency_options" :key="parseInt(item.id)" :label="item.name" :value="item.name" />
            </el-select>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数/重量" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.quantity" size="small" type="number" />
          </template>
          <span v-else>{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" width="80">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.unit_price" size="small" type="number" />
          </template>
          <span v-else>{{ scope.row.unit_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="税率" width="80">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.tax_rate" size="small" type="number" />
          </template>
          <span v-else>{{ scope.row.tax_rate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用标签" width="150">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.type_id" filterable placeholder="请选择" size="small" clearable style="width: 100%">
              <el-option v-for="item in account_type_options" :key="parseInt(item.id)" :label="item.name" :value="item.name" />
            </el-select>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算单位" width="150">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select
              v-model="scope.row.closing_unit_id"
              filterable
              remote
              placeholder="请选择"
              size="small"
              clearable
              :remote-method="remoteClosing"
              :loading="loadingClosing"
              style="width: 100%"
              @focus="getClosing"
            >
              <el-option
                v-for="item in closingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="150">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.remarks" size="small" type="textarea" autosize maxlength="128" show-word-limit />
          </template>
          <span v-else>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column label="含税金额" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.tax_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.edit" type="primary" icon="el-icon-edit" size="mini" @click="editFee(scope.row,scope.$index,true)" />
          <el-button v-if="scope.row.edit" type="danger" icon="el-icon-close" size="mini" @click="editFee(scope.row,scope.$index,false)" />
          <el-button v-if="!scope.row.edit" type="danger" icon="el-icon-delete" size="mini" @click="deleteFee(scope.row,scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="addFee">新增</el-button>
      <el-button size="mini" type="success" icon="el-icon-check" :loading="updateLoading">保存</el-button>
      <el-button size="mini" type="danger" icon="el-icon-delete" :loading="deleteLoading">删除</el-button>
      <el-button size="mini" type="info" icon="el-icon-copy-document">复制</el-button>
      <el-button size="mini" type="info" icon="el-icon-warning">确定对账</el-button>
      <el-button size="mini" type="warning" icon="el-icon-s-check">提交审批</el-button>
      <el-button size="mini" type="warning" icon="el-icon-s-check">提交复核</el-button>
      <el-button size="mini" type="primary" icon="el-icon-share">导出</el-button>
    </el-row>
  </el-card>
</template>
<script>
export default {
  name: 'OperationFee',
  props: {
    payOrReceive: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      deleteLoading: false,
      updateLoading: false,
      closingOptions: [],
      closing_unit: [],
      loadingClosing: false,
      fee_type_options: [],
      pay_type_options: [],
      account_type_options: [],
      finance_currency_options: [],
      multipleSelection: [],
      finance_fee_array: [],
      order_master_id: this.$route.params.id
    }
  },
  computed: {
    showType: function() {
      if (this.payOrReceive === 'pay') {
        return '支出'
      } else {
        return '收入'
      }
    }
  },
  methods: {
    inputFee() {
      return {
        id: undefined,
        name: undefined,
        name_cn: undefined,
        name_en: undefined,
        pay_or_receive: undefined,
        pay_type_id: undefined,
        finance_currency_id: undefined,
        finance_currency_rate: undefined,
        quantity: undefined,
        unit_price: undefined,
        tax_rate: undefined,
        tax_amount: undefined,
        receivable: undefined,
        payable: undefined,
        closing_unit_id: undefined,
        order_master_id: undefined,
        status: 'init',
        verify_status: 'init',
        type_id: undefined,
        not_tax_amount: undefined,
        remarks: undefined,
        finance_statement_no: undefined,
        edit: true
      }
    },
    addFee() {
      this.finance_fee_array.push(this.inputFee())
    },
    deleteFee(row, $index) {
    },
    editFee(row, $index, status) {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getClosing() { },
    remoteClosing(query) { }
  }
}
</script>
<style lang="scss">
  .operation-fee{
    .el-card__header{
      padding: 10px 20px !important;
    }
    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }

</style>
