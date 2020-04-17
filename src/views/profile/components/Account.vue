<template>
  <el-form ref="userInfo" :rules="rules" :model="userInfo">
    <el-form-item label="名字" prop="name" required>
      <el-input v-model.trim="userInfo.name" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email" required>
      <el-input v-model.trim="userInfo.email" />
    </el-form-item>
    <el-form-item label="手机" prop="phone" required>
      <el-input v-model.trim="userInfo.phone" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model.trim="userInfo.password" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirm_password">
      <el-input v-model.trim="userInfo.confirm_password" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="家庭住址">
      <el-input v-model.trim="userInfo.address" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button :loading="loading" type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {
          show: false,
          name: '',
          email: '',
          phone: '',
          password: '',
          confirm_password: '',
          address: ''
        }
      }
    }
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (this.userInfo.password !== '') {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.userInfo.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      loading: false,
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        confirm_password: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      console.log(this.userInfo)
      this.$refs.userInfo.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/updateUser', this.userInfo).then(() => {
            this.loading = false
            if (this.userInfo.password !== ''){
              this.$router.push({ path:  `/login?redirect=${this.$route.fullPath}` })
            }
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
