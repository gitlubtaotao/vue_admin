<template>
</template>
<script>
import { getData } from '@/api/index_data'
export default {
  name: 'OrderOperation',
  data() {
    return {
      id: this.$route.params && this.$route.params.id,
      transport_type: this.$route.query.transport_type,
      order_master: {
        order_extend_info: {
        }
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getData('/order/masters/' + this.id + '/edit', {}, 'get').then(response => {
        this.order_master = response.data
      })
    }
  }
}
</script>
