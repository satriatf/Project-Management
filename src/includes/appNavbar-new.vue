<template lang="html">
  <nav class="navbar navbar-expand px-4 py-3 border-bottom">
    <div class="logo-login">
      <h4 class="mb-0 fw-bold">Team Management</h4>
    </div>

    <div class="navbar-collapse collapse">
      <div class="ms-auto">
        <!-- User Profile Dropdown only, no search box -->
        <div class="dropdown d-inline-block">
          <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle" 
             id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <div class="avatar-circle-svg me-2">
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#e5e7eb"/>
                <path d="M16 18c-3.314 0-6 2.239-6 5v1h12v-1c0-2.761-2.686-5-6-5zm0-2a4 4 0 100-8 4 4 0 000 8z" fill="#6b7280"/>
              </svg>
            </div>
            <div class="d-none d-md-block">
              <div class="fw-semibold user-name-text" style="font-size: 14px; line-height: 1.2;">{{ userName }}</div>
            </div>
          </a>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
            <li class="px-3 py-3 border-bottom text-center">
              <div class="d-flex flex-column align-items-center">
                <div class="avatar-circle-svg-large mb-2">
                  <svg width="45" height="45" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#e5e7eb"/>
                    <path d="M16 18c-3.314 0-6 2.239-6 5v1h12v-1c0-2.761-2.686-5-6-5zm0-2a4 4 0 100-8 4 4 0 000 8z" fill="#6b7280"/>
                  </svg>
                </div>
                <div class="fw-bold" style="font-size: 14px; color: #000;">{{ userName }}</div>
                <small class="text-muted">{{ userRole }}</small>
              </div>
            </li>
            <li>
              <a class="dropdown-item py-2" href="#" @click.prevent="logout">
                <i class="fa fa-sign-out me-2"></i>Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import JwtService from '@/common/jwt.service'
import userService from '@/common/user.service'
export default {
  name: 'AppNavbar',
  computed: {
    userName() {
      // Use decrypted name from secure session storage
      return userService.getNama() || ''
    },
    userRole() {
      // getRole returns parsed JSON if stored as JSON; normalize to string
      const role = userService.getRole()
      if (Array.isArray(role)) return role.join(', ')
      return role || ''
    },
    userInitialsShort() {
      const name = this.userName?.trim()
      if (!name) return ''
      // use full initials in lowercase (e.g., "stf")
      return name.split(/\s+/).map(p => p[0]).join('').toLowerCase()
    },
    userInitialsFull() {
      const name = this.userName?.trim()
      if (!name) return ''
      return name.split(/\s+/).map(p => p[0]).join('').toLowerCase()
    }
  },
  methods: {
    logout() {
      this.$swal({
        text: "Do you want to logout?",
        icon: 'info',
        width: '300px',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Logout!',
      }).then((result) => {
        if (result && result.isConfirmed) {
          // Clear session and tokens
          sessionStorage.clear()
          JwtService.destroyToken()
          // Navigate to login and force reload to reset app state
          this.$router.push({ name: 'login' }).then(() => {
            window.location.reload()
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.logo-login h4 {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.avatar-circle-svg {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.avatar-circle-svg:hover {
  transform: scale(1.05);
}

.avatar-circle-svg-large {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name-text {
  color: #000000 !important;
  font-weight: 600 !important;
  font-size: 14px;
}

.dropdown-menu {
  min-width: 280px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin-top: 8px;
}

.dropdown-item {
  padding: 10px 16px;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
}

.dropdown-item:hover {
  background-color: #f9fafb;
  color: #000;
}

/* Hide dropdown chevron */
.dropdown-toggle::after {
  display: none !important;
}
</style>
 