<template>
  <div class="app-container">
    <keep-alive>
      <show-crm-company type="customer" />
    </keep-alive>
  </div>
</template>
<script>
import ShowCrmCompany from '../components/ShowCrmCompany'
export default {
  name: 'CrmShowCustomer',
  components: { ShowCrmCompany }
}
</script>
