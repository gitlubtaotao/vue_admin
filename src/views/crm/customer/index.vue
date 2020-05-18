<template>
  <div class="app-container">
    <crm-company type="customer" :company-type-options="companyTypeOptions" :text-map="textMap" />
  </div>
</template>
<script>
import CrmCompany from '../components/CrmCompany'
export default {
  name: 'CrmCustomer',
  components: { CrmCompany },
  data() {
    return {
      companyTypeOptions: [{ label: '客户', value: 1 }, { label: '客户&供应商', value: 3 }],
      textMap: { update: '编辑客户信息', create: '新增客户信息' }
    }
  }
}
</script>
