<template>
  <div class="login-wrapper">
    <!-- Left yellow strip to mimic Service Desk layout -->
    <div class="left-strip"></div>

    <!-- Login panel -->
    <div class="login-panel">
      <div class="panel-inner">
  <img src="@/assets/img/adira_logo_hitam.png" alt="Adira" class="logo-top" />
  <h1 class="title">Team Management System</h1>

        <div v-if="errorMsg" class="error-message">
          <i class="fa fa-exclamation-circle"></i>
          {{ errorMsg }}
        </div>

        <form @submit.prevent="doLogin" class="form">
          <label class="label" for="email">User name</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="name@adira.co.id"
            required
            autocomplete="email"
          />

          <label class="label" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="********"
            required
            autocomplete="current-password"
          />

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="!loading">Login</span>
            <span v-else><i class="fa fa-spinner fa-spin"></i> Loading...</span>
          </button>
        </form>

        <div class="footer-note">&copy; 2025 Adira Finance</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { SET_AUTH } from '@/store/mutations.type'
import JwtService from '@/common/jwt.service'
import userService from '@/common/user.service'
import '@/assets/css/views/login.css'

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMsg: '',
      loading: false
    }
  },
  methods: {
    async doLogin() {
      this.loading = true
      this.errorMsg = ''
      // Clear stale session info before new login
      sessionStorage.clear()
      
      try {
        const res = await axios.post('http://localhost:8080/api/auth/login', {
          email: this.email,
          password: this.password
        })
        
        if (res.data.status === 'success') {
          const { token, user } = res.data
          
          // Save token FIRST (this will update axios header)
          JwtService.saveToken(token)
          
          // Save user data to sessionStorage (encrypted + token plain for axios)
          sessionStorage.setItem('token', token)
          userService.saveId(user.id)
          userService.saveNama(user.employeeName)
          userService.saveNik(String(user.employeeNik))
          userService.saveRole(user.level)
          
          // Commit to Vuex store (will NOT overwrite sessionStorage anymore)
          this.$store.commit(SET_AUTH, {
            data: {
              accessToken: token,
              refreshToken: null,
              nama: user.employeeName,
              nik: String(user.employeeNik),
              role: user.level,
              email: user.employeeEmail,
              id: user.id
            }
          })
          
          this.$swal({
            icon: 'success',
            title: 'Login Berhasil!',
            text: `Selamat datang, ${user.employeeName}!`,
            timer: 1200
          })
          
          setTimeout(() => this.$router.push('/dashboard'), 1500)
        }
      } catch (err) {
        console.error('Login error:', err)
        this.errorMsg = 'Email atau password salah!'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

