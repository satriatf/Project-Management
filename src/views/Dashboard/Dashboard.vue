<template>
  <div class="container-fluid">
    <!-- Page title styled like Timeline -->
    <div class="page-header pt-4 pb-3 d-flex justify-content-between align-items-center">
      <h1 class="h2 mb-0">Dashboard</h1>
      <div></div>
    </div>

    <!-- Welcome card -->
    <div class="welcome-section pb-3">
      <div class="row">
        <div class="col-12">
          <div class="welcome-card p-4 rounded shadow-sm bg-white d-flex align-items-center">
            <div class="avatar-circle me-3">
              <span class="avatar-text">{{ userInitialsFull }}</span>
            </div>
            <div>
              <div class="fw-bold" style="color:#111;">Welcome to</div>
              <small class="text-muted">{{ userName }}</small>
            </div>
            <div class="ms-auto">
              <button @click="signOut" class="btn btn-outline-secondary">
                <i class="fa fa-sign-out me-2"></i>Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Cards -->
    <div class="row g-4 pb-4">
      <div class="col-md-6 col-lg-4 col-xl">
        <div class="dashboard-card p-4 rounded shadow-sm bg-white h-100">
          <div class="d-flex align-items-center mb-2">
            <svg class="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20 8V14" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 11H17" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-muted">Employees</span>
          </div>
          <h2 class="mb-0">{{ employeeCount }}</h2>
        </div>
      </div>

      <div class="col-md-6 col-lg-4 col-xl">
        <div class="dashboard-card p-4 rounded shadow-sm bg-white h-100">
          <div class="d-flex align-items-center mb-2">
            <svg class="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-muted">Projects</span>
          </div>
          <h2 class="mb-0">{{ projectCount }}</h2>
        </div>
      </div>

      <div class="col-md-6 col-lg-4 col-xl">
        <div class="dashboard-card p-4 rounded shadow-sm bg-white h-100">
          <div class="d-flex align-items-center mb-2">
            <svg class="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-muted">Non-Projects</span>
          </div>
          <h2 class="mb-0">{{ nonProjectCount }}</h2>
        </div>
      </div>

      <div class="col-md-6 col-lg-4 col-xl">
        <div class="dashboard-card p-4 rounded shadow-sm bg-white h-100">
          <div class="d-flex align-items-center mb-2">
            <svg class="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-muted">Applications</span>
          </div>
          <h2 class="mb-0">{{ applicationCount }}</h2>
        </div>
      </div>

      <div class="col-md-6 col-lg-4 col-xl">
        <div class="dashboard-card p-4 rounded shadow-sm bg-white h-100">
          <div class="d-flex align-items-center mb-2">
            <svg class="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-muted">Holidays</span>
          </div>
          <h2 class="mb-0">{{ holidayCount }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userService from '@/common/user.service'

export default {
  name: 'DashboardView',
  computed: {
    ...mapGetters({
      employees: 'employees/allEmployees',
      projects: 'projects/allProjects',
      nonProjects: 'nonProjects/allNonProjects',
      applications: 'master/activeApplications',
      holidays: 'master/activeHolidays'
    }),
    employeeCount() {
      return this.employees.length
    },
    projectCount() {
      return this.projects.length
    },
    nonProjectCount() {
      return this.nonProjects.length
    },
    applicationCount() {
      return this.applications.length
    },
    holidayCount() {
      return this.holidays.length
    },
    userName() {
      // Ambil nama yang tersimpan terenkripsi dari sessionStorage dan dekripsi via userService
      return userService.getNama() || ''
    },
    userInitialsFull() {
      const name = this.userName?.trim()
      if (!name) return ''
      // show full initials in lowercase, e.g. "Satria Tri Ferdiansyah" => "stf"
      return name.split(/\s+/).map(p => p[0]).join('').toLowerCase()
    }
  },
  methods: {
    signOut() {
      // Clear sessionStorage dan redirect
      sessionStorage.clear()
      this.$router.push({ name: 'login' }).then(() => {
        window.location.reload()
      })
    }
  },
  mounted() {
    // Load data from API when component mounted
    this.$store.dispatch('employees/fetchEmployees')
    this.$store.dispatch('projects/fetchProjects')
    this.$store.dispatch('nonProjects/fetchNonProjects')
    this.$store.dispatch('master/fetchApplications')
    this.$store.dispatch('master/fetchHolidays')
  }
}
</script>

<style scoped>
.welcome-card {
  border: 1px solid #e9ecef;
}

.avatar-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.dashboard-card {
  border: 1px solid #e9ecef;
  transition: transform 0.2s;
  cursor: pointer;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.dashboard-card h2 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #212529;
}
</style>
