<template>
  <div>
    <former-button :save-data="saveData" />
    <el-form :inline="true" :model="former_sea_so_no" class="form-content-box" label-position="top">
      <el-row :gutter="5" class="so-array">
        <el-col v-for="(cap_list, index) in soNoArray" :key="index" :span="4">
          <el-form-item :label="'So No.'" size="mini">
            <el-input v-model="cap_list.value" />
            <el-button type="danger" size="mini" icon="el-icon-delete" @click.prevent="removeSoInfo(index)" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row><el-button type="primary" size="mini" @click.prevent="addSoInfo">新增</el-button></el-row>
      <el-row :gutter="5">
        <el-col :span="6">
          <el-form-item label="开仓时间" size="small">
            <el-date-picker v-model="former_sea_so_no.cy_open_date" type="date" placeholder="选择日期" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="截放行条时间" size="small">
            <el-date-picker v-model="former_sea_so_no.voucher_cut_off" type="date" placeholder="选择日期" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="VGM截止时间" size="small">
            <el-date-picker v-model="former_sea_so_no.vgm_submission_deadline" type="date" placeholder="选择日期" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="截补料时间" size="small">
            <el-date-picker v-model="former_sea_so_no.si_cut_off" type="date" placeholder="选择日期" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import FormerButton from './FormerButton'
import { getData, createData } from '@/api/index_data'
export default {
  name: 'FormerSoNo',
  components: { FormerButton },
  props: {
    getFormerDataUrl: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      order_master_id: this.$route.params.id,
      loadData: false,
      isDataChange: 0,
      soNoArray: [{ value: undefined }],
      former_sea_so_no: {
        created_at: undefined,
        id: undefined,
        so_no: undefined,
        cy_open_date: undefined,
        voucher_cut_off: undefined,
        vgm_submission_deadline: undefined,
        si_cut_off: undefined,
        order_master_id: this.$route.params.id
      }
    }
  },
  watch: {
    former_sea_so_no: {
      handler(newName, oldName) {
        this.isDataChange++
      },
      deep: true,
      immediate: false
    },
    soNoArray: {
      handler(newName, oldName) {
        this.isDataChange++
      },
      deep: true,
      immediate: false
    }
  },
  created() {
    if (!this.loadData) {
      this.initData()
    }
  },
  methods: {
    saveData() {
      if (this.isDataChange <= 1) {
        this.$notify.error({
          title: '错误',
          message: '当前数据未发生改变,不允许进行保存',
          duration: 5000
        })
        return
      }
      let soNoInfo = ''
      for (let i = 0; i < this.soNoArray.length; i++) {
        soNoInfo += this.soNoArray[i].value
        if (i < this.soNoArray.length) {
          soNoInfo += ','
        }
      }
      this.former_sea_so_no.so_no = soNoInfo
      createData(
        '/order/masters/' + this.$route.params.id + '/UpdateFormerData?former_type=' + 'former_sea_so_no',
        { former_sea_so_no: this.former_sea_so_no }).then((response) => {
        this.$notify({
          title: 'Success',
          message: '保存数据成功',
          type: 'success',
          duration: 5000
        })
        this.isDataChange = 0
      }).catch(reason => {
        console.log(reason)
      })
    },
    addSoInfo() {
      if (this.soNoArray.length >= 6) {
        this.$message.error('SO NO.不能超过6个')
        return
      }
      console.log(this.soNoArray)
      this.soNoArray.push({ value: undefined })
    },
    removeSoInfo(index) {
      this.soNoArray.splice(index, 1)
    },
    initData() {
      getData(this.getFormerDataUrl + '/getFormerData', { formerType: 'former_sea_so_no' }, 'get').then(response => {
        this.former_sea_so_no = response['formerData']
        const soNo = response['formerData']['so_no'].split(',')
        if (soNo.length >= 1) {
          this.soNoArray = []
        }
        for (let i = 0; i < soNo.length; i++) {
          if (soNo[i] !== '') {
            this.soNoArray.push({ value: soNo[i] })
          }
        }
        this.loadData = true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .so-array{
    .el-input{
      width: 80% !important;
    }
  }
</style>
