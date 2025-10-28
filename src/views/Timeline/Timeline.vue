<template>
  <div class="container-fluid">
    <div class="page-header pt-4 pb-3 d-flex justify-content-between align-items-center">
      <h1 class="h2 mb-0">Project Timeline</h1>
      <div class="d-flex align-items-center gap-3">
        <label for="timeline-year-select" class="mb-0 fw-medium">Select Year:</label>
        <select id="timeline-year-select" v-model="currentYear" @change="handleYearChange" class="form-select form-select-sm" style="width: 120px;">
          <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-3">
        <TimelineControls 
          v-model:showProject="showProject" 
          v-model:showNonProject="showNonProject" />

        <div v-if="filteredRows.length === 0" class="gantt-empty">
          <div class="text-center py-5">
            <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;">📅</div>
            <h3 class="text-secondary mb-2">No Tasks Found</h3>
            <p class="text-muted mb-3">No project or non-project tasks found for {{ currentYear }}.</p>
            <p class="text-muted" style="font-size: 0.875rem;">Try selecting a different year or add some projects and tasks.</p>
          </div>
        </div>

        <TimelineGrid
          v-else
          :year="currentYear"
          :monthsData="monthsData"
          :allDays="allDays"
          :rows="filteredRows"
          :showProject="showProject"
          :showNonProject="showNonProject"
          @cell-hover="showTooltip"
          @cell-leave="hideTooltip"
          @cell-click="openPopup"
        />
      </div>
    </div>

    <TimelineTooltip :show="tooltip.show" :x="tooltip.x" :y="tooltip.y" :title="tooltip.title" />
    <TimelinePopup :show="popup.show" :tasks="popup.tasks" @close="closePopup" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TimelineControls from '@/components/Timeline/TimelineControls.vue'
import TimelineGrid from '@/components/Timeline/TimelineGrid.vue'
import TimelineTooltip from '@/components/Timeline/TimelineTooltip.vue'
import TimelinePopup from '@/components/Timeline/TimelinePopup.vue'

export default {
  name: 'ProjectTimeline',
  components: { TimelineControls, TimelineGrid, TimelineTooltip, TimelinePopup },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      showProject: true,
      showNonProject: true,
      lastActiveFilter: 'project',
      tooltip: {
        show: false,
        x: 0,
        y: 0,
        title: ''
      },
      popup: {
        show: false,
        tasks: []
      }
    }
  },
  computed: {
    ...mapGetters({
      employees: 'employees/allEmployees',
      projects: 'projects/allProjects',
      nonProjects: 'nonProjects/allNonProjects'
    }),
    yearOptions() {
      const years = []
      for (let y = 2023; y <= 2030; y++) {
        years.push(y)
      }
      // Ensure currentYear stays within options (in case of future years)
      if (!years.includes(this.currentYear)) {
        this.currentYear = 2025 // default within range
      }
      return years
    },
    monthsData() {
      const months = []
      for (let i = 0; i < 12; i++) {
        const daysCount = new Date(this.currentYear, i + 1, 0).getDate()
        months.push({
          index: i,
          name: new Date(this.currentYear, i, 1).toLocaleString('en-US', { month: 'long' }),
          daysCount
        })
      }
      return months
    },
    allDays() {
      const days = []
      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(this.currentYear, month + 1, 0).getDate()
        for (let day = 1; day <= daysInMonth; day++) {
          days.push({
            date: new Date(this.currentYear, month, day),
            label: day.toString(),
            key: `${month}-${day}`
          })
        }
      }
      return days
    },
    employeesWithTasks() {
      return this.employees.map(emp => {
        const projectTasks = []
        const nonProjectTasks = []
        
        // Add projects where employee is PIC or Technical Lead
        this.projects.forEach(proj => {
          let pics = []
          
          // Parse PICs JSON
          if (proj.pics_json) {
            try {
              pics = typeof proj.pics_json === 'string' ? JSON.parse(proj.pics_json) : proj.pics_json
              if (!Array.isArray(pics)) pics = []
            } catch (e) {
              pics = []
            }
          }
          
          // Check if employee is in PICs list or Technical Lead
          const isPIC = pics.includes(emp.employee_name)
          const isTechnicalLead = proj.technical_lead === emp.employee_name
          
          if (isPIC || isTechnicalLead) {
            const startDate = proj.start_date ? new Date(proj.start_date + 'T00:00:00') : null
            const endDate = proj.end_date ? new Date(proj.end_date + 'T00:00:00') : null
            
            if (startDate && endDate) {
              // Check if project overlaps with current year
              const yearStart = new Date(this.currentYear, 0, 1)
              const yearEnd = new Date(this.currentYear, 11, 31)
              
              if (this.dateRangeOverlaps(startDate, endDate, yearStart, yearEnd)) {
                projectTasks.push({
                  id: `project-${proj.sk_project}`,
                  name: proj.project_name,
                  type: 'project',
                  startDate: proj.start_date,
                  endDate: proj.end_date,
                  status: proj.project_status,
                  ticketNo: proj.project_ticket_no,
                  pic: pics,
                  technicalLead: proj.technical_lead || '—'
                })
              }
            }
          }
        })
        
        // Add non-projects where employee is Created By or Resolver PIC
        this.nonProjects.forEach(np => {
          // Get employee names by IDs
          const createdByEmployee = this.employees.find(e => e.sk_user === np.createdBy)
          const resolverEmployee = this.employees.find(e => e.sk_user === np.resolverPic)
          
          const createdByName = createdByEmployee ? createdByEmployee.employee_name : ''
          const resolverName = resolverEmployee ? resolverEmployee.employee_name : ''
          
          // Check if current employee is created by or resolver
          const isCreatedBy = createdByName === emp.employee_name
          const isResolver = resolverName === emp.employee_name
          
          if (isCreatedBy || isResolver) {
            const date = np.date ? new Date(np.date + 'T00:00:00') : null
            
            if (date && date.getFullYear() === this.currentYear) {
              nonProjectTasks.push({
                id: `nonproject-${np.id}`,
                name: np.description,
                type: 'nonproject',
                startDate: np.date,
                endDate: np.date,
                ticketNo: np.ticketNo,
                application: np.application,
                nonProjectType: np.type,
                description: np.description,
                createdBy: createdByName,
                resolverPic: resolverName
              })
            }
          }
        })
        
        return {
          name: emp.employee_name,
          projectTasks,
          nonProjectTasks
        }
      })
    },
    filteredRows() {
      // Respect filter toggles:
      // - both on: show anyone having either task type
      // - project only: show only employees with project tasks
      // - non-project only: show only employees with non-project tasks
      // - both off: show none
      return this.employeesWithTasks.filter(emp => {
        const hasProject = emp.projectTasks.length > 0
        const hasNonProject = emp.nonProjectTasks.length > 0

        if (this.showProject && this.showNonProject) return hasProject || hasNonProject
        if (this.showProject && !this.showNonProject) return hasProject
        if (!this.showProject && this.showNonProject) return hasNonProject
        return false
      })
    }
  },
  watch: {
    showProject(newVal, oldVal) {
      // Prevent both checkboxes from being unchecked
      if (!newVal && !this.showNonProject) {
        // Force this checkbox back to checked
        this.$nextTick(() => {
          this.showProject = true
        })
        return
      }
      this.hideTooltip()
      this.closePopup()
    },
    showNonProject(newVal, oldVal) {
      // Prevent both checkboxes from being unchecked
      if (!newVal && !this.showProject) {
        // Force this checkbox back to checked
        this.$nextTick(() => {
          this.showNonProject = true
        })
        return
      }
      this.hideTooltip()
      this.closePopup()
    }
  },
  methods: {
    handleYearChange() {
      // Year changed, tooltip and popup will automatically hide
      this.hideTooltip()
      this.closePopup()
    },
    // Used by employeesWithTasks() to check project overlapping current year
    dateRangeOverlaps(aStart, aEnd, bStart, bEnd) {
      return aStart <= bEnd && bStart <= aEnd
    },
    showTooltip({ x, y, title }) {
      this.tooltip = { show: true, x, y, title }
    },
    hideTooltip() {
      this.tooltip.show = false
    },
    openPopup(tasks) {
      if (!tasks || !tasks.length) return
      this.popup = { show: true, tasks }
    },
    closePopup() {
      this.popup.show = false
      this.popup.tasks = []
    },
    
  },
  mounted() {
    // Load data
    this.$store.dispatch('employees/fetchEmployees')
    this.$store.dispatch('projects/fetchProjects')
    this.$store.dispatch('nonProjects/fetchNonProjects')
    
    // Close popup on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.popup.show) {
        this.closePopup()
      }
    })
  }
}
</script>

<style scoped>
/* Empty State */
.gantt-empty {
  background: #ffffff;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  margin: 1rem 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* Card */
.card { border: 1px solid #e9ecef; }

/* Responsive */
@media (max-width: 768px) { }
</style>
