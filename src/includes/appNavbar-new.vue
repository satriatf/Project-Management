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
             id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="color: #000;">
            <div class="avatar-badge me-2">
              {{ userInitials }}
            </div>
            <div class="d-none d-md-block">
              <div class="fw-bold user-name-text" style="font-size: 14px;">{{ userName }}</div>
            </div>
          </a>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-4" aria-labelledby="userDropdown">
            <li class="px-4 py-3 border-bottom text-center">
              <div class="d-flex flex-column align-items-center">
                <div class="avatar-badge-large mb-2">
                  {{ userInitials }}
                </div>
                <div class="fw-bold" style="font-size: 15px; color: #000;">{{ userName }}</div>
                <small class="text-muted">{{ userRole }}</small>
              </div>
            </li>
            <li class="py-1">
              <a class="dropdown-item py-2 px-4" href="#" @click.prevent="logout">
                <i class="fa fa-sign-out me-2 text-danger"></i>Sign out
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
import '@/assets/css/includes/includes.css'

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
    userInitials() {
      const name = this.userName?.trim()
      if (!name) return 'U'
      const parts = name.split(/\s+/)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return name[0].toUpperCase()
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

