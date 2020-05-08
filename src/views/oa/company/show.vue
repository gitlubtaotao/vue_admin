<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <svg-icon icon-class="star" />
            <span>{{ company.name_nick || company.name_cn }}</span>
          </div>
          <el-row :gutter="24">
            <el-col :span="8">
              <span>创建时间:</span>
              <span>{{ company.created_at }}</span>
            </el-col>
            <el-col :span="8">
              <span>最近更新时间:</span>
              <span>{{ company.updated_at }}</span>
            </el-col>
            <el-col :span="8">
              <span>公司类型:</span>
              <span>{{ company.IsHeadOffice ? '总公司' : '分公司' }}</span>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="margin-top: 10px"/>
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card shadow="always">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本信息" name="base">
              <el-table :data="companyData" fit style="width: 100%">
                <el-table-column prop="name_nick" label="公司简称" width="180" />
                <el-table-column prop="name_cn" label="公司中文名" width="180" />
                <el-table-column prop="name_en" label="公司英文名" width="180" />
                <el-table-column prop="zh_address" label="中文地址" width="180" />
                <el-table-column prop="en_address" label="英文地址" width="180" />
                <el-table-column prop="email" label="邮箱" width="180" />
                <el-table-column prop="phone" label="公司座机" width="180" />
                <el-table-column prop="remark" label="备注"  />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="部门信息" name="department">
              <el-table :data="company.departments" fit style="width: 100%">
                <el-table-column prop="name_cn" label="部门中文名" width="280" />
                <el-table-column prop="name_en" label="部门英文名"  />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="员工信息" name="employee">
              <el-table :data="company.employees" fit style="width: 100%">
                <el-table-column prop="name" label="姓名" width="180" />
                <el-table-column prop="email" label="邮箱" width="180" />
                <el-table-column prop="phone" label="电话" width="180" />
                <el-table-column prop="user_no" label="工号" width="180" />
                <el-table-column prop="department_id" label="部门" width="180" />
                <el-table-column prop="last_sign_in_ip" label="最近登录IP" width="180" />
                <el-table-column prop="last_sign_in_at" label="最近登录时间" width="180" />
                <el-table-column prop="address" label="联系地址" width="180" />
                <el-table-column prop="remarks" label="备注" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="银行账户信息" name="account">
              <el-table :data="company.accounts" fit style="width: 100%">
                <el-table-column prop="name" label="账户简称" width="180" />
                <el-table-column prop="category" label="账户类型" width="180" />
                <el-table-column prop="tax_register_number" label="税务登记号" width="180" />
                <el-table-column prop="bank_name" label="开户行" width="180" />
                <el-table-column prop="bank_number" label="账号" width="180" />
                <el-table-column prop="bank_address" label="银行地址" width="180" />
                <el-table-column prop="user_name" label="开户人" width="180" />
                <el-table-column prop="user_address" label="开户人地址" width="180" />
                <el-table-column prop="location" label="开户人位置" width="180" />
                <el-table-column prop="swift_code" label="Swift Code" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getData } from '@/api/index_data'
export default {
  name: 'ShowCompany',
  data() {
    return {
      company: {},
      activeTab: 'base',
      companyData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const id = this.$route.params && this.$route.params.id
      getData('/companies/' + id + '/show', {}, 'post').then(response => {
        this.company = response.data
        this.companyData.push(this.company)
        console.log(this.company)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
