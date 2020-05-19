<template>
  <div class="">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card shadow="always">
          <div slot="header" class="">
            <svg-icon icon-class="star" />
            <span>{{ company.name_nick || company.name_cn }}</span>
            <el-button-group v-if="company['status_value'] ==='approving'" style="float: right;">
              <el-button type="success" size="small" :loading="passLoading" @click="passRecord">审核通过</el-button>
              <el-button type="warning" size="small" :loading="failLoading" @click="failRecord">审核失败</el-button>
            </el-button-group>
            <el-button-group v-else-if="company['status_value'] ==='approved'" style="float: right;">
              <el-button type="danger" size="small" :loading="cancelLoading" @click="cancelRecord">作废</el-button>
            </el-button-group>
            <el-button-group v-else-if="company['status_value'] === 'cancel'" style="float: right">
              <el-button type="danger" size="small" :loading="deleteLoading" @click="deleteRecord">删除</el-button>
            </el-button-group>
            <el-button-group v-else-if="company['status_value'] === 'rejected'">
              <el-button type="success" size="small" :loading="passLoading" @click="passRecord">审核通过</el-button>
              <el-button type="danger" size="small" :loading="cancelLoading" @click="cancelRecord">作废</el-button>
            </el-button-group>
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
              <span>{{ company.company_type }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24" style="margin-top: 10px;">
            <el-col :span="8">
              <span>业务类型:</span>
              <span>{{ company.business_type_name }}</span>
            </el-col>
            <el-col :span="8">
              <span>来源:</span>
              <span>{{ company.source }}</span>
            </el-col>
            <el-col :span="8">
              <span>状态:</span>
              <span>{{ company.status }}</span>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="margin-top: 10px" />
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card shadow="always">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="跟进记录" name="track">
              <keep-alive>
                <ClueTrack :source-id="parseInt(id)" source-type="user_companies" :clue-tracks="Array.isArray(company.crm_tracks) ? company.crm_tracks : []" />
              </keep-alive>
            </el-tab-pane>
            <el-tab-pane label="基本信息" name="base">
              <el-table :data="companyData" fit style="width: 100%">
                <el-table-column prop="name_nick" label="公司简称" width="180" />
                <el-table-column prop="name_cn" label="公司中文名" width="180" />
                <el-table-column prop="name_en" label="公司英文名" width="180" />
                <el-table-column prop="zh_address" label="中文地址" width="180" />
                <el-table-column prop="en_address" label="英文地址" width="180" />
                <el-table-column prop="email" label="邮箱" width="180" />
                <el-table-column prop="phone" label="公司座机" width="180" />
                <el-table-column prop="remark" label="备注" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="审核信息" name="roles">
              <el-table :data="company.roles" fit style="width: 100%">
                <el-table-column prop="name" label="角色" width="180" />
                <el-table-column prop="user_name" label="姓名" width="180" />
                <el-table-column prop="created" label="创建时间" width="180">
                  <template slot-scope="props">
                    <span>{{ showDate(props.row.created_at ) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="联系人信息" name="crm_users">
              <el-table :data="company.crm_users" fit style="width: 100%">
                <el-table-column prop="name" label="姓名" width="180" />
                <el-table-column prop="email" label="邮箱" width="180" />
                <el-table-column prop="phone" label="电话" width="180" />
                <el-table-column prop="sex" label="性别" width="180" />
                <el-table-column prop="is_key_contact" label="是否为关键联系人" width="180" />
                <el-table-column prop="address" label="联系地址" width="180" />
                <el-table-column prop="remarks" label="备注" width="180" />
                <el-table-column prop="created" label="创建时间" width="180">
                  <template slot-scope="props">
                    <span>{{ showDate(props.row.created_at ) }}</span>
                  </template>
                </el-table-column>
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
                <el-table-column prop="created" label="创建时间" width="180">
                  <template slot-scope="props">
                    <span>{{ showDate(props.row.created_at ) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="发票信息" name="invoices">
              <el-table :data="company.invoices" fit style="width: 100%">
                <el-table-column prop="name" label="发票抬头" width="180" />
                <el-table-column prop="tax_number" label="纳税人识别号" width="180" />
                <el-table-column prop="bank_name" label="开户行" width="180" />
                <el-table-column prop="bank_number" label="账号" width="180" />
                <el-table-column prop="bank_address" label="银行地址" width="180" />
                <el-table-column prop="bank_tel" label="银行联系电话" />
                <el-table-column prop="created" label="创建时间" width="180">
                  <template slot-scope="props">
                    <span>{{ showDate(props.row.created_at ) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="邮寄地址" name="address">
              <el-table :data="company.address" fit style="width: 100%">
                <el-table-column prop="user_name" label="收件人姓名" width="180" />
                <el-table-column prop="user_tel" label="收件人电话" width="180" />
                <el-table-column prop="user_address" label="收件人地址" width="180" />
                <el-table-column prop="code" label="邮政编码" width="180" />
                <el-table-column prop="created" label="创建时间" width="180">
                  <template slot-scope="props">
                    <span>{{ showDate(props.row.created_at ) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getData, updateData, deleteData } from '@/api/index_data'
import { parseTime } from '@/utils'
import ClueTrack from '@/components/ClueTrack'
export default {
  name: 'ShowCrmCompany',
  components: { ClueTrack },
  props: {
    type: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      id: this.$route.params && this.$route.params.id,
      company: {},
      activeTab: 'track',
      companyData: [],
      deleteLoading: false,
      passLoading: false,
      failLoading: false,
      cancelLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    showDate(date) {
      return parseTime(date, '{y}-{m}-{d}')
    },
    fetchData() {
      const id = this.$route.params && this.$route.params.id
      getData('/crm/companies/' + id + '/show', {}, 'post').then(response => {
        this.company = response.data
        this.companyData.push(this.company)
        console.log(this.company)
      }).catch(error => {
        console.log(error)
      })
    },
    deleteRecord() {
      this.deleteLoading = true
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData('/crm/companies/' + this.company.id + '/delete').then((response) => {
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 5000
          })
          if (this.type === 'customer') {
            this.$router.push('/crm/customer')
          } else {
            this.$route.push('/crm/supply')
          }
        })
      }).catch(() => {
      })
    },
    passRecord() {
      this.passLoading = true
      this.moreUpdate('approved')
    },
    failRecord() {
      this.failLoading = true
      this.moreUpdate('rejected')
    },
    cancelRecord() {
      this.cancelLoading = true
      this.moreUpdate('cancel')
    },
    moreUpdate(status) {
      const url = '/crm/companies/' + this.company.id + '/changeStatus?status=' + status
      this.$confirm('是否继续执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateData(url).then((response) => {
          this.$notify({
            title: 'Success',
            message: '操作成功',
            type: 'success',
            duration: 5000
          })
          this.failLoading = false
          this.cancelLoading = false
          this.passLoading = false
        })
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
