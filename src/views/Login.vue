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

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.login-wrapper {
  min-height: 100vh;
  background: #f5f6f8;
  display: grid;
  grid-template-columns: 80px 1fr;
}

.left-strip {
  background: #f8b400; /* kuning Adira */
}

.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.panel-inner {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  width: 100%;
  max-width: 460px;
  padding: 28px 28px 22px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.04);
}

.logo-top {
  width: 150px;
  display: block;
  margin: 6px auto 12px;
}

.title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 24px;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 14px 16px;
  border-radius: 10px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  border-left: 4px solid #dc2626;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label {
  font-size: 13px;
  color: #6b7280;
}

.form input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  transition: border 0.2s ease;
}

.form input:focus {
  outline: none;
  border-color: #f8b400;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.15);
}

.btn-submit {
  margin-top: 8px;
  width: 100%;
  padding: 10px 14px;
  background: #f8b400;
  border: none;
  border-radius: 4px;
  color: #111827;
  font-weight: 700;
  cursor: pointer;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.footer-note {
  margin-top: 18px;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
}

/* ANIMATIONS */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Simple responsive */
@media (max-width: 768px) {
  .login-wrapper { grid-template-columns: 40px 1fr; }
}
</style>
