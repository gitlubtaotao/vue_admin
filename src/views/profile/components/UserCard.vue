<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>
    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          {{ user.name }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <el-button type="primary" icon="el-icon-upload" style="" size="small" @click="toggleShow">
          设置头像
        </el-button>
      </div>
      <my-upload
        v-model="show"
        field="avatar"
        value="false"
        :url="uploadUrl"
        :width="300"
        :height="300"
        :no-rotate="false"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
      />
      <div class="box-center">
        <div class="user-name text-center">{{ user.userInfo.name }}</div>
        <div class="user-role text-center text-muted">{{ user.role }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="email" />
          <span>邮箱</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.userInfo.email }}
          </div>
        </div>
      </div>
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="telephone" />
          <span>手机</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.userInfo.phone }}
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="list" />
          <span>其他</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <div class="text-muted">
              <span>当前登录次数</span>
              <span>{{ user.userInfo.count }}</span>
            </div>
          </div>
          <div class="progress-item">
            <div class="text-muted">
              <span>当前登录时间</span>
              <span>{{ user.userInfo.current_sign_in_at }}</span>
            </div>
          </div>
          <div class="progress-item">
            <span class="text-muted">上次登录时间</span>
            <span>{{ user.userInfo.last_sign_in_at }}</span>
          </div>
          <div class="progress-item">
            <span class="text-muted">当前登录IP</span>
            <span>{{ user.userInfo.current_sign_in_ip }}</span>
          </div>
          <div class="progress-item">
            <span class="text-muted">上传登录IP</span>
            <span>{{ user.userInfo.last_sign_in_ip }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import myUpload from 'vue-image-crop-upload'
export default {
  components: {
    PanThumb,
    'my-upload': myUpload
  },
  props: {
    uploadUrl: {
      type: String,
      required: true
    },
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    }
  },
  data: function() {
    return {
      show: false,
      imgDataUrl: ''
    }
  },
  methods: {
    toggleShow() {
      this.show = !this.show
    },
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------')
      this.imgDataUrl = imgDataUrl
    },
    cropUploadSuccess(jsonData, field) {
      this.user.avatar = jsonData.data.url
      console.log('-------- upload success --------')
      console.log('field: ' + field)
    },
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-center {
    margin: 0 auto;
    display: table;
  }

  .text-muted {
    color: #777;
  }

  .user-profile {
    .user-name {
      font-weight: bold;
    }
    .box-center {
      padding-top: 10px;
    }

    .user-role {
      padding-top: 10px;
      font-weight: 400;
      font-size: 14px;
    }

    .box-social {
      padding-top: 30px;

      .el-table {
        border-top: 1px solid #dfe6ec;
      }
    }
    .user-follow {
      padding-top: 20px;
    }
  }

  .user-bio {
    margin-top: 20px;
    color: #606266;
    span {
      padding-left: 4px;
    }

    .user-bio-section {
      font-size: 14px;
      padding: 15px 0;
      .user-bio-section-header {
        border-bottom: 1px solid #dfe6ec;
        padding-bottom: 10px;
        margin-bottom: 10px;
        font-weight: bold;
      }
    }
  }
  .user-bio-section-body{
    .progress-item{
      margin-bottom: 10px;
    }
  }
</style>
