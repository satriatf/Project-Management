<template>
  <div class="container-fluid">
    <!-- Page title -->
    <div class="page-header pt-4 pb-2">
      <h1 class="h2 mb-0">Dashboard</h1>
    </div>

    <!-- Welcome section -->
    <div class="welcome-section pb-4">
      <div class="row">
        <div class="col-12">
          <div class="welcome-card p-4 rounded-4 shadow-sm bg-white d-flex align-items-center">
            <div class="avatar-circle-large me-4">
              <span class="avatar-text-large">{{ userInitials }}</span>
            </div>
            <div>
              <div class="welcome-label text-muted small fw-bold">Welcome</div>
              <h4 class="user-name mb-0 fw-bold">{{ userName }}</h4>
              <div class="user-role text-muted fw-medium">{{ userPosition }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Summary Cards Column -->
      <div class="col-lg-7">
        <div class="row g-4 pb-4">
          <!-- Row 1 -->
          <div class="col-md-6">
            <div class="dashboard-card p-4 rounded-4 shadow-sm bg-white h-100 d-flex justify-content-between align-items-center">
              <div>
                <div class="card-label mb-1">Employees</div>
                <h2 class="mb-0 count-text">{{ employeeCount }}</h2>
              </div>
              <div class="card-icon-wrapper icon-blue">
                <i class="bi bi-people-fill"></i>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="dashboard-card p-4 rounded-4 shadow-sm bg-white h-100 d-flex justify-content-between align-items-center">
              <div>
                <div class="card-label mb-1">Projects</div>
                <h2 class="mb-0 count-text">{{ projectCount }}</h2>
              </div>
              <div class="card-icon-wrapper icon-green">
                <i class="bi bi-briefcase-fill"></i>
              </div>
            </div>
          </div>
          <!-- Row 2 -->
          <div class="col-md-6">
            <div class="dashboard-card p-4 rounded-4 shadow-sm bg-white h-100 d-flex justify-content-between align-items-center">
              <div>
                <div class="card-label mb-1">Non-Projects</div>
                <h2 class="mb-0 count-text">{{ nonProjectCount }}</h2>
              </div>
              <div class="card-icon-wrapper icon-orange">
                <i class="bi bi-journal-text"></i>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="dashboard-card p-4 rounded-4 shadow-sm bg-white h-100 d-flex justify-content-between align-items-center">
              <div>
                <div class="card-label mb-1">On Leaves</div>
                <h2 class="mb-0 count-text">{{ onLeavesCount }}</h2>
              </div>
              <div class="card-icon-wrapper icon-purple">
                <i class="bi bi-person-x-fill"></i>
              </div>
            </div>
          </div>
          <!-- Row 3 -->
          <div class="col-md-6">
            <div class="dashboard-card p-4 rounded-4 shadow-sm bg-white h-100 d-flex justify-content-between align-items-center">
              <div>
                <div class="card-label mb-1">Applications</div>
                <h2 class="mb-0 count-text">{{ applicationCount }}</h2>
              </div>
              <div class="card-icon-wrapper icon-cyan">
                <i class="bi bi-window-stack"></i>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="dashboard-card p-4 rounded-4 shadow-sm bg-white h-100 d-flex justify-content-between align-items-center">
              <div>
                <div class="card-label mb-1">Holidays</div>
                <h2 class="mb-0 count-text">{{ holidayCount }}</h2>
              </div>
              <div class="card-icon-wrapper icon-red">
                <i class="bi bi-calendar2-week-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks Overview Chart Column -->
      <div class="col-lg-5">
        <div class="chart-container-card p-4 rounded-4 shadow-sm bg-white h-100 pb-3">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center">
              <h5 class="mb-0 fw-bold me-2">Tasks Overview</h5>
              <div class="custom-tooltip-container">
                <i class="bi bi-info-circle-fill text-primary small cursor-pointer"></i>
                <div class="custom-tooltip">
                  <span class="tooltip-title">Overview Tahun {{ selectedYear }}</span>
                  <div class="tooltip-row">
                    <span>Total Projects:</span>
                    <span class="tooltip-value">{{ projectCount }}</span>
                  </div>
                  <div class="tooltip-row">
                    <span>Total Non-Projects:</span>
                    <span class="tooltip-value">{{ nonProjectCount }}</span>
                  </div>
                </div>
              </div>
            </div>
            <select v-model="selectedYear" class="year-filter-select">
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          
          <div class="chart-wrapper">
            <!-- Y-Axis Labels -->
            <div class="chart-y-axis">
              <span>50</span>
              <span>40</span>
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>

            <!-- Main Chart Area -->
            <div class="chart-main">
              <!-- Grid Lines -->
              <div class="chart-grid-rules">
                <div class="grid-line"></div>
                <div class="grid-line"></div>
                <div class="grid-line"></div>
                <div class="grid-line"></div>
                <div class="grid-line"></div>
                <div class="grid-line" style="border-top-style: solid; border-top-color: #e5e7eb;"></div>
              </div>

              <!-- Bars -->
              <div class="d-flex justify-content-around align-items-end h-100 px-4">
                <!-- Bar for Projects -->
                <div class="bar-group text-center">
                  <div class="bar bar-projects" :style="{ height: projectBarHeight + '%' }"></div>
                  <div class="mt-2 small text-muted" style="position: absolute; bottom: -30px; width: 100%;">Tasks</div>
                </div>
                <!-- Bar for Non-Projects -->
                <div class="bar-group text-center">
                  <div class="bar bar-nonproblems" :style="{ height: nonProjectBarHeight + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="chart-legend d-flex justify-content-center mt-5 pt-3 border-top gap-4">
            <div class="legend-item d-flex align-items-center">
              <span class="legend-dot bar-projects me-2"></span>
              <span class="small fw-medium">Projects ({{ projectCount }})</span>
            </div>
            <div class="legend-item d-flex align-items-center">
              <span class="legend-dot bar-nonproblems me-2"></span>
              <span class="small fw-medium">Non-Projects ({{ nonProjectCount }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userService from '@/common/user.service'
import '@/assets/css/views/dashboard.css'

export default {
  name: 'DashboardView',
  data() {
    return {
      selectedYear: new Date().getFullYear()
    }
  },
  computed: {
    ...mapGetters({
      employees: 'employees/allEmployees',
      projects: 'projects/allProjects',
      nonProjects: 'nonProjects/allNonProjects',
      applications: 'master/activeApplications',
      holidays: 'master/activeHolidays'
    }),
    availableYears() {
      return [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]
    },
    employeeCount() {
      return this.employees.length
    },
    projectCount() {
      return this.projects.filter(p => {
        if (!p.start_date) return false
        const year = new Date(p.start_date).getFullYear()
        return year === this.selectedYear
      }).length
    },
    nonProjectCount() {
      return this.nonProjects.filter(np => {
        if (!np.date) return false
        const year = new Date(np.date).getFullYear()
        return year === this.selectedYear
      }).length
    },
    applicationCount() {
      return this.applications.length
    },
    holidayCount() {
      return this.holidays.length
    },
    onLeavesCount() {
      // Dummy data for now as matched in reference image
      return 1
    },
    userName() {
      return userService.getNama() || 'User'
    },
    userPosition() {
      const pos = userService.getUserPosition()
      return pos && typeof pos === 'string' ? pos : 'Intern'
    },
    userInitials() {
      const name = this.userName?.trim()
      if (!name) return 'U'
      const parts = name.split(/\s+/)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return name[0].toUpperCase()
    },
    projectBarHeight() {
      // Scale relative to fixed max of 50
      const max = 50
      return Math.min(Math.round((this.projectCount / max) * 100), 100)
    },
    nonProjectBarHeight() {
      // Scale relative to fixed max of 50
      const max = 50
      return Math.min(Math.round((this.nonProjectCount / max) * 100), 100)
    }
  },
  mounted() {
    this.$store.dispatch('employees/fetchEmployees')
    this.$store.dispatch('projects/fetchProjects')
    this.$store.dispatch('nonProjects/fetchNonProjects')
    this.$store.dispatch('master/fetchApplications')
    this.$store.dispatch('master/fetchHolidays')
  }
}
</script>

