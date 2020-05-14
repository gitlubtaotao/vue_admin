<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <svg-icon icon-class="star" />
            <span>{{ company.name_nick || company.name_cn }}</span>
            <el-button v-if="company.status_value === 0" style="float: right; margin-right: 10px;" type="success" size="small">转化成合作单位</el-button>
            <el-button style="float: right;margin-right: 10px; " type="warning" size="small">转移</el-button>
          </div>
          <el-row :gutter="10">
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
          <el-row :gutter="10" style="margin-top: 10px">
            <el-col :span="8">
              <span>负责人:</span>
              <span>{{ company.user_create.name }}</span>
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
              <ClueTrack :source-id="parseInt(id)" source-type="crm_clues" :clue-tracks="company.crm_tracks"/>
            </el-tab-pane>
            <el-tab-pane label="基本信息" name="base">
              <el-table :data="companyData" fit style="width: 100%">
                <el-table-column prop="name_nick" label="公司简称" width="180" />
                <el-table-column prop="name_cn" label="公司中文名" width="180" />
                <el-table-column prop="name_en" label="公司英文名" width="180" />
                <el-table-column prop="zh_address" label="中文地址" width="180" />
                <el-table-column prop="en_address" label="英文地址" width="180" />
                <el-table-column prop="email" label="邮箱" width="180" />
                <el-table-column prop="tel" label="公司座机" width="180" />
                <el-table-column prop="remarks" label="备注" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="联系人信息" name="employee">
              <el-table :data="companyData" fit style="width: 100%">
                <el-table-column prop="user_name" label="姓名" width="180" />
                <el-table-column prop="user_email" label="邮箱" width="180" />
                <el-table-column prop="user_tel" label="电话" width="180" />
                <el-table-column prop="wechat_id" label="微信号" width="180" />
                <el-table-column prop="qq_id" label="QQ" width="180" />
                <el-table-column prop="user_remarks" label="备注" width="180" />
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
import ClueTrack from '@/components/ClueTrack'
export default {
  name: 'ShowCompany',
  components: { ClueTrack },
  data() {
    return {
      id: this.$route.params && this.$route.params.id,
      company: {
        user_create: {},
        crm_tracks: [],
        id: 0
      },
      activeTab: 'track',
      companyData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const id = this.$route.params && this.$route.params.id
      getData('/crm/clues/' + id + '/show', {}, 'post').then(response => {
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
