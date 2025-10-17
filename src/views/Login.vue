<template>
  <div class="login-wrapper-yellow">
    <div class="login-container-yellow">
      <div class="row g-0 h-100">
        <div class="col-12 d-flex align-items-center justify-content-center" style="min-height: 100vh;">
          <div class="login-form-wrapper-yellow">
            <div class="text-center mb-4">
              <img src="/src/assets/img/log_hitam.png" alt="Adira Finance Logo" style="max-width: 120px;">
              <h2 class="fw-bold mt-3 mb-1" style="color:#fbbf24;">Team Management</h2>
            </div>
            <div class="login-header-yellow text-center mb-4">
              <h3 class="fw-bold mb-2" style="color:#222;">Sign In</h3>
              <p class="text-muted">Enter your email and password</p>
            </div>
            <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="fa fa-exclamation-circle me-2"></i>
              {{ errorMessage }}
              <button type="button" class="btn-close" @click="closedErrorModal" aria-label="Close"></button>
            </div>
            <Form :validation-schema="loginSchema" @submit="login">
              <div class="mb-3">
                <label for="email" class="form-label fw-semibold">
                  <i class="fa fa-envelope me-2 text-muted"></i>Email
                </label>
                <Field 
                  name="email" 
                  type="email" 
                  class="form-control form-control-lg" 
                  v-model="formData.email"
                  placeholder="Email" />
                <ErrorMessage name="email" class="text-danger small mt-1" />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label fw-semibold">
                  <i class="fa fa-lock me-2 text-muted"></i>Password
                </label>
                <div class="input-group">
                  <Field 
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control form-control-lg" 
                    v-model="formData.password"
                    name="password"
                    placeholder="Password" />
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button" 
                    @click="togglePasswordVisibility">
                    <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                  </button>
                </div>
                <ErrorMessage name="password" class="text-danger small mt-1" />
              </div>
              <button 
                type="submit" 
                class="btn btn-warning btn-lg w-100 fw-semibold" 
                :disabled="isLoading">
                <span v-if="isLoading">
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </span>
                <span v-else>
                  <i class="fa fa-sign-in me-2"></i>Sign In
                </span>
              </button>
            </Form>
            <div class="login-footer-yellow text-center mt-4">
              <p class="text-muted small mb-0">
                © 2024 IT Adira Finance. All rights reserved.
              </p>
              <p class="text-muted small">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LOGIN } from '@/store/actions.type';
import { Form, Field, ErrorMessage } from 'vee-validate';
import axios from 'axios'
import errorMessages from '@/assets/Response/responseError.json';
import translations from '@/translations/translations.json'
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      button: translations.button,
      formName: translations.form,
      newMenu: [],
      formData: {
        email: '',
        password: ''
      },
      isLoading: false,
      showPassword: false,
      error: false,
      errorMessage: '',
      loginSchema: {
        email(value) {
          if (!value) {
            return 'Email is required';
          }
          // Simple email regex
          const re = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
          if (!re.test(value)) {
            return 'Email is invalid';
          }
          return true;
        },
        password(value) {
          if (!value) {
            return 'Password is required';
          }
          return true;
        },
      }
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    getErrorMessage(status) {
      return errorMessages[status] || 'Terjadi kesalahan yang tidak diketahui.';
    },

    login() {
      this.isLoading = true;
      this.$store.dispatch(LOGIN, {
        body: {
          email: this.formData.email,
          password: this.formData.password
        },
        url: import.meta.env.VITE_BASE_URL_LOGIN + import.meta.env.VITE_AUTH_LOGIN,
      }).then(response => {
        // Simpan user ke localStorage
        const email = this.formData.email || ''
        const localPart = email.split('@')[0] || ''
        // remove separators, drop leading single-letter prefixes like 'v.'
        const rawParts = localPart.split(/[._-]+/).filter(Boolean)
        const parts = rawParts.length > 1 && rawParts[0].length === 1 ? rawParts.slice(1) : rawParts
        const name = parts.join(' ').trim()
        const role = 'Staff'
        localStorage.setItem('user', JSON.stringify({
          email,
          name,
          role
        }))
  this.$router.push({ name: 'dashboard' })
      }).catch(error => {
        // Jika gagal, simpan data dummy ke localStorage dan redirect
        const email = this.formData.email || ''
        const localPart = email.split('@')[0] || ''
        const rawParts = localPart.split(/[._-]+/).filter(Boolean)
        const parts = rawParts.length > 1 && rawParts[0].length === 1 ? rawParts.slice(1) : rawParts
        const name = parts.join(' ').trim()
        const role = 'Staff'
        localStorage.setItem('user', JSON.stringify({
          email,
          name,
          role
        }))
  this.$router.push({ name: 'dashboard' })
        // Optional: tampilkan pesan offline
        this.errorMessage = 'Sistem Sedang offline. dimohon menuggu beberapa saat lagi!';
        this.isLoading = false;
        this.error = true;
      })
    },
    transformMenu(menu) {
      return menu.map(item => {
        let newItem = {
          id: `Mnu${item.parentMenu.replace(/_/g, '')}`,
          name: item.parentMenu.replace(/_/g, ' '),
          icon: `fa fa-${item.parentMenu.toLowerCase().replace(/_/g, '-')}`
        };

        if (item.subMenu) {
          newItem.subMenus = item.subMenu.map(sub => ({
            id: `Mnu${sub.replace(/_/g, '')}`,
            name: sub.replace(/_/g, ' ')
          }));
        }

        return newItem;
      });
    },
    closedErrorModal() {
      this.error = false;
    },
  },
};
</script>

<style scoped>
/* Login Wrapper */
/* Yellow Login Theme */
.login-wrapper-yellow {
  min-height: 100vh;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container-yellow {
  width: 100%;
  max-width: 500px;
  background: #fffbe7;
  border-radius: 18px;
  box-shadow: 0 10px 40px rgba(245, 158, 11, 0.15);
  overflow: hidden;
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form-wrapper-yellow {
  width: 100%;
  max-width: 370px;
  margin: 0 auto;
  background: transparent;
  padding: 32px 0 24px 0;
}

.login-header-yellow h3 {
  color: #222;
  font-size: 26px;
}

.login-header-yellow p {
  color: #6b7280;
  font-size: 14px;
}

.form-label {
  color: #222;
  font-size: 14px;
  margin-bottom: 8px;
}

.form-control-lg {
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  background: #fff;
}

.form-control-lg:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.12);
}

.input-group .btn-outline-secondary {
  border: 1px solid #fbbf24;
  border-left: none;
  background: #fffbe7;
  color: #f59e0b;
  border-radius: 0 8px 8px 0;
}

.input-group .btn-outline-secondary:hover {
  background: #fbbf24;
  color: #fff;
}

.input-group .form-control-lg {
  border-right: none;
  border-radius: 8px 0 0 8px;
}

.input-group .form-control-lg:focus + .btn-outline-secondary {
  border-color: #f59e0b;
}

.btn-warning {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.18);
}

.btn-warning:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.22);
}

.btn-warning:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert-danger {
  background-color: #fff3cd;
  border: 1px solid #ffe69c;
  color: #b45309;
  border-radius: 8px;
  font-size: 14px;
}

.login-footer-yellow {
  padding-top: 20px;
  border-top: 1px solid #ffe69c;
}

.login-footer-yellow p {
  font-size: 13px;
  line-height: 1.5;
}

@media (max-width: 575.98px) {
  .login-container-yellow {
    border-radius: 10px;
    min-height: auto;
    padding: 0 8px;
  }
  .login-form-wrapper-yellow {
    padding: 18px 0 10px 0;
  }
}
</style>
