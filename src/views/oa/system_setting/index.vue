<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card shadow="always">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基础设置" name="base">
              <el-form ref="dataBase" :model="temp" :status-icon="true" label-position="left" label-width="200px" style="width: 500px; margin-left:50px;">
                <el-form-item label="数据安全控制" prop="">
                  <el-select
                    v-model="temp.base.data_security_control"
                    filterable
                    placeholder="请选择"
                    size="medium"
                    clearable
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in valueOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="公司logo">
                  <el-button type="primary" icon="el-icon-upload" style="" size="small" @click="toggleShow">
                    上传公司logo
                  </el-button>
                  <my-upload
                    v-model="show"
                    field="filer"
                    value="false"
                    :url="uploadUrl"
                    :headers="headers"
                    :width="100"
                    :height="100"
                    :no-rotate="false"
                    @crop-success="cropSuccess"
                    @crop-upload-success="cropUploadSuccess"
                    @crop-upload-fail="cropUploadFail"
                  />
                </el-form-item>
                <el-form-item label="计费重计算方式" prop="">
                  <el-select
                    v-model="temp.base.conversion_method_calu"
                    filterable
                    placeholder="请选择"
                    size="medium"
                    clearable
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in conversionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="计费重保留小数位数" prop="">
                  <el-input-number v-model="temp.base.conversion_method_remain" :min="1" :max="10" label="" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="loading" @click="onSubmitBase">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="财务设置" name="finance">
              <el-form ref="dataFinance" :model="temp" :status-icon="true" label-position="left" label-width="200px" style="width: 500px; margin-left:50px;">
                <el-form-item label="系统本位币设置" prop="">
                  <el-select
                    v-model="temp.finance.system_finance_currency"
                    filterable
                    placeholder="请选择"
                    size="medium"
                    clearable
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in currencyOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="系统汇率取值设置" prop="">
                  <el-select
                    v-model="temp.finance.system_finance_rate"
                    filterable
                    placeholder="请选择"
                    size="medium"
                    clearable
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in rateOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-tooltip class="item" effect="dark" content="开启设置后，提交应付费用审核/复核时,可不填写客户银行信息" placement="right">
                  <el-form-item label="提交应付跳过银行信息验证" prop="">
                    <el-select
                      v-model="temp.finance.skip_bank_to_payable"
                      filterable
                      placeholder="请选择"
                      size="medium"
                      clearable
                      style="width: 100%;"
                    >
                      <el-option
                        v-for="item in valueOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-tooltip>
                <el-form-item label="跳过财务审批机制" prop="">
                  <el-select v-model="temp.finance.skip_approve" filterable placeholder="请选择" size="medium" clearable style="width: 100%;">
                    <el-option v-for="item in valueOptions" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
                </el-form-item>
                <el-tooltip class="item" effect="dark" content="开启设置后，费用对帐成功后可直接进行销帐和开票处理" placement="right">
                  <el-form-item label="跳过财务复核机制" prop="">
                    <el-select v-model="temp.finance.skip_audit" filterable placeholder="请选择" size="medium" clearable style="width: 100%;">
                      <el-option v-for="item in valueOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="开启设置后，系统会定时抓取中国人民银行汇率" placement="right">
                  <el-form-item label="系统自动更新汇率" prop="">
                    <el-select
                      v-model="temp.finance.auto_update_currency_rate"
                      filterable
                      placeholder="请选择"
                      size="medium"
                      clearable
                      style="width: 100%;"
                    >
                      <el-option
                        v-for="item in valueOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="开启设置后，可以为合作单位设置不同的汇率" placement="right">
                  <el-form-item label="合作单位汇率偏好设置" prop="">
                    <el-select
                      v-model="temp.finance.manage_customer_rate"
                      filterable
                      placeholder="请选择"
                      size="medium"
                      clearable
                      style="width: 100%;"
                    >
                      <el-option
                        v-for="item in valueOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-tooltip>
                <el-form-item>
                  <el-button type="primary" :loading="loading" @click="onSubmitFinance">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import myUpload from 'vue-image-crop-upload'
import { getData, createData } from '@/api/index_data'
export default {
  name: 'SystemSetting',
  components: {
    'my-upload': myUpload
  },
  data() {
    return {
      loading: false,
      activeTab: 'base',
      uploadUrl: process.env.VUE_APP_BASE_API + '/upload',
      headers: {
        Authorization: 'Bearer ' + this.$store.state.user.token
      },
      show: false,
      temp: {
        base: {
          data_security_control: 'false',
          company_logo: '',
          conversion_method_calu: 'division',
          conversion_method_remain: 1,
        },
        finance: {
          system_finance_currency: undefined,
          system_finance_rate: undefined,
          skip_bank_to_payable: undefined,
          skip_audit: 'false',
          skip_approve: 'false',
          auto_update_currency_rate: undefined,
          manage_customer_rate: undefined
        }
      },
      data: {},
      valueOptions: [
        { label: '开', value: 'true' },
        { label: '关', value: 'false' }
      ],
      conversionOptions: [{ label: '乘法', value: 'multiply' }, { label: '除法', value: 'division' }],
      rateOptions: [{ label: '按照当月汇率取值', value: 'month' }, { label: '按照实时汇率取值', value: 'now' }],
      currencyOptions: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getData('/setting/data?key=system', {}).then(response => {
        const base = {}
        const finance = {}
        this.currencyOptions = response.currencyOptions
        for (let i = 0; i < response.data.length; i++) {
          const result = response.data[i]
          if (result.key === 'base') {
            base[result.field] = result.value
          } else if (result.key === 'finance') {
            finance[result.field] = result.value
          }
        }
        this.temp.base = base
        this.temp.finance = finance
      }).catch(error => {
        console.log(error)
      })
    },
    onSubmitBase() {
      this.loading = true
      const data = [
        { key: 'base', field: 'company_logo', value: this.temp.base.company_logo },
        { key: 'base', field: 'data_security_control', value: this.temp.base.data_security_control },
        { key: 'base', field: 'conversion_method_calu', value: this.temp.base.conversion_method_calu },
        { key: 'base', field: 'conversion_method_remain', value: this.temp.base.conversion_method_remain.toString() }
      ]
      this.$refs['dataBase'].validate((valid) => {
        if (valid) {
          createData('/setting/update_system?key=base', data).then((response) => {
            this.$notify({
              title: 'Success',
              message: '保存系统设置成功',
              type: 'success',
              duration: 5000
            })
            this.loading = false
          })
        }
      })
    },
    onSubmitFinance() {
      this.loading = true
      const data = [
        { key: 'finance', field: 'system_finance_currency', value: this.temp.finance.system_finance_currency.toString() },
        { key: 'finance', field: 'system_finance_rate', value: this.temp.finance.system_finance_rate },
        { key: 'finance', field: 'skip_bank_to_payable', value: this.temp.finance.skip_bank_to_payable },
        { key: 'finance', field: 'skip_audit', value: this.temp.finance.skip_audit },
        { key: 'finance', field: 'skip_approve', value: this.temp.finance.skip_approve },
        { key: 'finance', field: 'auto_update_currency_rate', value: this.temp.finance.auto_update_currency_rate },
        { key: 'finance', field: 'manage_customer_rate', value: this.temp.finance.manage_customer_rate }
      ]
      this.$refs['dataFinance'].validate((valid) => {
        if (valid) {
          createData('/setting/update_system?key=finance', data).then((response) => {
            this.$notify({
              title: 'Success',
              message: '保存系统设置成功',
              type: 'success',
              duration: 5000
            })
            this.loading = false
          })
        }
      })
    },
    toggleShow() {
      this.show = !this.show
    },
    cropSuccess(imgDataUrl, field) {
    },
    cropUploadSuccess(jsonData, field) {
      this.temp.base.company_logo = jsonData.data.key
    },
    cropUploadFail(status, field) {
    }
  }
}
</script>
