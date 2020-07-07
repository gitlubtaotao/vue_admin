<template>
  <div>
    <keep-alive><upload-attachment label="internal" :attachment-list="internalFile" /></keep-alive>
    <keep-alive><upload-attachment label="external" :attachment-list="externalFile" /></keep-alive>
  </div>
</template>
<script>
import UploadAttachment from './UploadAttachment'
import { getData } from '@/api/index_data'
export default {
  name: 'OrderAttachment',
  components: { UploadAttachment },
  data() {
    return {
      loadingFile: false,
      internalFile: [],
      externalFile: []
    }
  },
  computed: {
    orderMasterId: function() {
      return this.$route.params.id
    }
  },
  created() {
    this.getFileData()
  },
  methods: {
    getFileData() {
      getData('/attachments/' + this.orderMasterId + '/GetOrderFile', {}, 'get').then((response) => {
        this.externalFile = response['external']
        this.internalFile = response['internal']
        this.loadingFile = true
      }).catch((reason) => {
        console.log(reason)
      })
    }
  }
}
</script>
