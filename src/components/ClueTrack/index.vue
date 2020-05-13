<template>
  <div>
    <el-form ref="dataForm" :rules="rules" :model="temp" :status-icon="true" label-position="left" label-width="120px" style="width: 600px;">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="跟进内容" prop="description">
            <el-input v-model="temp.description" size="medium" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="跟进方式" prop="of_way">
            <el-select
              v-model="temp.of_way"
              filterable
              allow-create
              default-first-option
              placeholder="请选择跟进方式"
            >
              <el-option
                v-for="item in OfWayOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contact_name">
            <el-input v-model="temp.contact_name" size="medium" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="联系人电话" prop="contact_tel">
            <el-input v-model="temp.contact_tel" type="tel" size="medium" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人邮箱" prop="contact_email">
            <el-input v-model="temp.contact_email" size="medium" type="email" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="下次跟进时间" prop="next_track_time">
            <el-date-picker
              v-model="temp.next_track_time"
              type="date"
              size="medium"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-button type="primary" @click="createData">
            确定
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-divider />
    <el-table v-if="clueTracks.length>0" :data="clueTracks" fit style="width: 100%">
      <el-table-column prop="description" label="跟进内容" width="280" />
      <el-table-column prop="created_at" label="跟进时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ showDate(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="of_way" label="跟进方式" width="100" />
      <el-table-column prop="contact_name" label="联系人" width="100" />
      <el-table-column prop="contact_tel" label="联系人电话" width="100" />
      <el-table-column prop="contact_email" label="联系人邮箱" width="100" />
      <el-table-column prop="next_track_time" label="下次跟进时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ showDate(scope.row.next_track_time) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { createData } from '@/api/index_data'
import { parseTime } from '@/utils'
export default {
  name: 'ClueTrack',
  props: {
    sourceId: {
      required: true,
      type: Number
    },
    sourceType: {
      required: true,
      type: String
    },
    // eslint-disable-next-line vue/require-prop-types
    clueTracks: {
      required: true,
      default: []
    }
  },
  data() {
    return {
      temp: {
        of_way: null,
        source_id: this.sourceId,
        source_type: this.sourceType,
        next_track_time: null,
        description: null,
        contact_name: null,
        contact_tel: null,
        contact_email: null,
        track_user_id: this.$store.state.user.userInfo.id
      },
      rules: {
        description: [{ required: true, message: '请输入跟进内容', trigger: 'blur' }],
        of_way: [{ required: true, message: '请输入跟进方式', trigger: 'blur' }],
        next_track_time: [{ required: true, message: '请输入下次跟进时间', trigger: 'blur' }]
      },
      OfWayOptions: [{ value: '打电话' }, { value: '发送邮件' }, { value: '微信联系' }, { value: '上门拜访' }]
    }
  },
  created() {
  },
  methods: {
    showDate(date) {
      return parseTime(date,'{y}-{m}-{d}')
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = this.temp
          createData('/crm/tracks/create', data).then((response) => {
            this.clueTracks.unshift(response.data)
            this.$notify({
              title: 'Success',
              message: '跟进记录创建成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    }
  }
}
</script>
