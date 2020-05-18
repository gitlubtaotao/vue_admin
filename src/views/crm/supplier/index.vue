<template>
  <div class="app-container">
    <crm-company type="supplier" :company-type-options="companyTypeOptions" :text-map="textMap" />
  </div>
</template>
<script>
import CrmCompany from '../components/CrmCompany'

export default {
  name: 'CrmCustomer',
  components: { CrmCompany },
  data() {
    return {
      companyTypeOptions: [{ label: '供应商', value: 2 }],
      textMap: { update: '编辑供应商信息', create: '新增供应商信息' }
    }
  }
}
</script>
