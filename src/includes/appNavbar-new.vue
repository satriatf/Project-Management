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
            <div class="avatar-circle-small me-2">
              <span class="avatar-text-small">{{ userInitialsShort }}</span>
            </div>
            <div class="d-none d-md-block">
              <div class="fw-semibold" style="font-size: 14px; line-height: 1.2;">{{ userName }}</div>
            </div>
          </a>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
            <li class="px-3 py-3 border-bottom text-center">
              <div class="d-flex flex-column align-items-center">
                <div class="avatar-circle-medium mb-2">
                  <span class="avatar-text-medium">{{ userInitialsFull }}</span>
                </div>
                <div class="fw-bold" style="font-size: 14px;">{{ userName }}</div>
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
}

.avatar-circle-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text-small {
  color: white;
  font-weight: bold;
  font-size: 13px;
}

.avatar-circle-medium {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text-medium {
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.dropdown-menu {
  min-width: 280px;
  border: 1px solid #e5e7eb;
}

.dropdown-toggle::after {
  margin-left: 0.5rem;
}
</style>
