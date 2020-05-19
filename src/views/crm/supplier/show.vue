<template>
  <div class="app-container">
    <keep-alive>
      <show-crm-company type="supply" />
    </keep-alive>
  </div>
</template>
<script>
import ShowCrmCompany from '../components/ShowCrmCompany'
export default {
  name: 'ShowCrmSupply',
  components: { ShowCrmCompany }
}
</script>
