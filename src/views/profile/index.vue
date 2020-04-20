<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" :uploadUrl="uploadUrl" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Account" name="account">
                <account :user-info="user" />
              </el-tab-pane>
              <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Account, Activity, Timeline },
  data() {
    return {
      user: {},
      activeTab: 'account',
      uploadUrl: process.env.VUE_APP_BASE_API + '/user/upload' + '?token=' + this.$store.state.user.token
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'userInfo'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.userInfo.userInfo.name,
        role: this.userInfo.userInfo.roles.join(' | '),
        email: this.userInfo.userInfo.email,
        avatar: this.userInfo.userInfo.avatar,
        phone: this.userInfo.userInfo.phone,
        address: this.userInfo.userInfo.address,
        userInfo: this.userInfo.userInfo,
        password: '',
        confirm_password: ''
      }
    }
  }
}
</script>
