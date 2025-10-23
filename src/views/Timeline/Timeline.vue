<template>
  <div class="container-fluid">
    <div class="page-header pt-4 pb-3 d-flex justify-content-between align-items-center">
      <h1 class="h2 mb-0">Project Timeline</h1>
      
      <!-- Year Filter -->
      <div class="d-flex align-items-center gap-3">
        <label for="timeline-year-select" class="mb-0 fw-medium">Select Year:</label>
        <select 
          id="timeline-year-select" 
          v-model="currentYear" 
          @change="handleYearChange"
          class="form-select form-select-sm" 
          style="width: 120px;">
          <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-3">
        <!-- Filter Controls -->
        <div class="filter-container">
          <span class="filter-label">Filter by Task:</span>
          <div class="filter-checkbox-group">
            <input 
              type="checkbox" 
              id="filter-project" 
              v-model="showProject" 
              class="filter-checkbox">
            <label for="filter-project" class="filter-checkbox-label">Project</label>
          </div>
          <div class="filter-checkbox-group">
            <input 
              type="checkbox" 
              id="filter-non-project" 
              v-model="showNonProject" 
              class="filter-checkbox">
            <label for="filter-non-project" class="filter-checkbox-label">Non-Project</label>
          </div>
        </div>

        <!-- Legend -->
        <div class="gantt-legend">
          <div class="gantt-legend-item">
            <div class="gantt-legend-color project"></div>
            <span>Project</span>
          </div>
          <div class="gantt-legend-item">
            <div class="gantt-legend-color non-project"></div>
            <span>Non-Project</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredRows.length === 0" class="gantt-empty">
          <div class="text-center py-5">
            <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;">📅</div>
            <h3 class="text-secondary mb-2">No Tasks Found</h3>
            <p class="text-muted mb-3">No project or non-project tasks found for {{ currentYear }}.</p>
            <p class="text-muted" style="font-size: 0.875rem;">Try selecting a different year or add some projects and tasks.</p>
          </div>
        </div>

        <!-- Gantt Table -->
        <div v-else class="gantt-container">
          <table class="gantt-table">
            <thead>
              <!-- Month Headers -->
              <tr>
                <th class="employee-header" rowspan="2">Employee</th>
                <th 
                  v-for="month in monthsData" 
                  :key="month.index" 
                  :colspan="month.daysCount"
                  class="month-header">
                  {{ month.name }} {{ currentYear }}
                </th>
              </tr>
              <!-- Day Headers -->
              <tr>
                <th 
                  v-for="day in allDays" 
                  :key="day.key" 
                  class="day-header">
                  {{ day.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(row, rowIndex) in filteredRows" :key="row.name">
                <!-- Project Row -->
                <tr v-if="row.showProjectRow">
                  <td 
                    class="employee" 
                    :rowspan="row.rowSpan"
                    v-if="row.showProjectRow && (!row.showNonProjectRow || rowIndex === 0)">
                    {{ row.name }}
                  </td>
                  <td 
                    v-for="day in allDays" 
                    :key="`${row.name}-project-${day.key}`"
                    :class="getCellClass(row.projectTasks, day.date)"
                    @mouseenter="handleCellHover($event, row.projectTasks, day.date)"
                    @mouseleave="hideTooltip"
                    @click="handleCellClick(row.projectTasks, day.date)">
                    {{ getCellContent(row.projectTasks, day.date) }}
                  </td>
                </tr>
                <!-- Non-Project Row -->
                <tr v-if="row.showNonProjectRow">
                  <td 
                    class="employee" 
                    :rowspan="row.rowSpan"
                    v-if="row.showNonProjectRow && !row.showProjectRow">
                    {{ row.name }}
                  </td>
                  <td 
                    v-for="day in allDays" 
                    :key="`${row.name}-nonproject-${day.key}`"
                    :class="getCellClass(row.nonProjectTasks, day.date)"
                    @mouseenter="handleCellHover($event, row.nonProjectTasks, day.date)"
                    @mouseleave="hideTooltip"
                    @click="handleCellClick(row.nonProjectTasks, day.date)">
                    {{ getCellContent(row.nonProjectTasks, day.date) }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <div 
      v-if="tooltip.show" 
      class="gantt-tooltip show"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
      <div class="gantt-tooltip-title">{{ tooltip.title }}</div>
    </div>

    <!-- Detail Popup -->
    <div v-if="popup.show" class="gantt-detail-overlay" @click="closePopup">
      <div class="gantt-detail-card" @click.stop>
        <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">
          {{ popup.tasks.length === 1 ? popup.tasks[0].name : `${popup.tasks.length} Tasks` }}
        </div>
        
        <template v-for="(task, index) in popup.tasks" :key="task.id">
          <hr v-if="index > 0" style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #3b82f6;">
            {{ task.name }}
          </div>
          
          <div style="color: #4b5563; margin-bottom: 10px; font-size: 12px;">
            {{ formatDate(task.startDate) }}
            <span v-if="task.startDate !== task.endDate"> — {{ formatDate(task.endDate) }}</span>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;" cellpadding="6">
            <tr><td style="width: 140px;"><b>Type</b></td><td>{{ task.type === 'project' ? 'Project' : 'Non-Project' }}</td></tr>
            <tr v-if="task.type === 'project'">
              <td><b>Ticket No</b></td><td>{{ task.ticketNo || '—' }}</td>
            </tr>
            <tr v-if="task.type === 'project'">
              <td><b>Status</b></td><td>{{ task.status || '—' }}</td>
            </tr>
            <tr v-if="task.type === 'project'">
              <td><b>PIC</b></td><td>{{ task.pic ? task.pic.join(', ') : '—' }}</td>
            </tr>
            <tr v-if="task.type === 'nonproject'">
              <td><b>Ticket No</b></td><td>{{ task.ticketNo || '—' }}</td>
            </tr>
            <tr v-if="task.type === 'nonproject'">
              <td><b>Application</b></td><td>{{ task.application || '—' }}</td>
            </tr>
            <tr v-if="task.type === 'nonproject'">
              <td><b>Type</b></td><td>{{ task.nonProjectType || '—' }}</td>
            </tr>
            <tr v-if="task.type === 'nonproject'">
              <td><b>Description</b></td><td>{{ task.description || '—' }}</td>
            </tr>
          </table>
        </template>
        
        <div class="gantt-detail-actions">
          <button type="button" class="gantt-btn gantt-btn-gray" @click="closePopup">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProjectTimeline',
  data() {
    return {
      currentYear: new Date().getFullYear(),
      showProject: true,
      showNonProject: true,
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
      employees: 'employees/activeEmployees',
      projects: 'projects/allProjects',
      nonProjects: 'nonProjects/allNonProjects'
    }),
    yearOptions() {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let y = currentYear - 3; y <= currentYear + 5; y++) {
        years.push(y)
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
        
        // Add projects where employee is PIC
        this.projects.forEach(proj => {
          if (proj.pic && proj.pic.includes(emp.name)) {
            const startDate = proj.startDate ? new Date(proj.startDate + 'T00:00:00') : null
            const endDate = proj.endDate ? new Date(proj.endDate + 'T00:00:00') : null
            
            if (startDate && endDate) {
              // Check if project overlaps with current year
              const yearStart = new Date(this.currentYear, 0, 1)
              const yearEnd = new Date(this.currentYear, 11, 31)
              
              if (this.dateRangeOverlaps(startDate, endDate, yearStart, yearEnd)) {
                   projectTasks.push({
                     id: `project-${proj.id}`,
                     name: proj.name,
                     type: 'project',
                     startDate: proj.startDate,
                     endDate: proj.endDate,
                     status: proj.status,
                     ticketNo: proj.ticketNo,
                     pic: proj.pic,
                     technicalLead: proj.technicalLead || '',
                     createdBy: proj.createdBy || ''
                   })
              }
            }
          }
        })
        
        // Add non-projects where employee is resolver
        this.nonProjects.forEach(np => {
          if (np.resolverPic === emp.name) {
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
                   createdBy: np.createdBy || '',
                   resolverPic: np.resolverPic || ''
                 })
            }
          }
        })
        
        return {
          name: emp.name,
          projectTasks,
          nonProjectTasks
        }
      })
    },
    filteredRows() {
      // If both filters are disabled, show all
      const showProj = this.showProject
      const showNonProj = this.showNonProject
      
      return this.employeesWithTasks
        .map(emp => {
          const hasProjectTasks = emp.projectTasks.length > 0
          const hasNonProjectTasks = emp.nonProjectTasks.length > 0
          
          // Determine which rows to show
          let showProjectRow = false
          let showNonProjectRow = false
          
          if (!showProj && !showNonProj) {
            // Both disabled - show all
            showProjectRow = hasProjectTasks
            showNonProjectRow = hasNonProjectTasks
          } else {
            // Apply filters
            showProjectRow = showProj && hasProjectTasks
            showNonProjectRow = showNonProj && hasNonProjectTasks
          }
          
          // Calculate rowspan for employee cell
          let rowSpan = 0
          if (showProjectRow) rowSpan++
          if (showNonProjectRow) rowSpan++
          
          return {
            ...emp,
            showProjectRow,
            showNonProjectRow,
            rowSpan
          }
        })
        .filter(emp => emp.showProjectRow || emp.showNonProjectRow)
    }
  },
  methods: {
    handleYearChange() {
      // Year changed, tooltip and popup will automatically hide
      this.hideTooltip()
      this.closePopup()
    },
    dateRangeOverlaps(aStart, aEnd, bStart, bEnd) {
      return aStart <= bEnd && bStart <= aEnd
    },
    getTasksForDay(tasks, date) {
      return tasks.filter(task => {
        const taskStart = new Date(task.startDate + 'T00:00:00')
        const taskEnd = new Date(task.endDate + 'T00:00:00')
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        
        // Check if task overlaps with this day
        return this.dateRangeOverlaps(taskStart, taskEnd, dayStart, dayEnd)
      })
    },
    getCellClass(tasks, date) {
      const overlappingTasks = this.getTasksForDay(tasks, date)
      if (overlappingTasks.length === 0) return ''
      
      const taskType = overlappingTasks[0].type
      return taskType === 'project' ? 'project' : 'mtc'
    },
    getCellContent(tasks, date) {
      const overlappingTasks = this.getTasksForDay(tasks, date)
      if (overlappingTasks.length === 0) return ''
      if (overlappingTasks.length > 1) return `${overlappingTasks.length}+`
      return ''
    },
    handleCellHover(event, tasks, date) {
      const overlappingTasks = this.getTasksForDay(tasks, date)
      if (overlappingTasks.length === 0) return
      
      const rect = event.target.getBoundingClientRect()
      this.tooltip = {
        show: true,
        x: rect.left + rect.width / 2,
        y: rect.bottom + 5,
        title: overlappingTasks[0].name
      }
    },
    hideTooltip() {
      this.tooltip.show = false
    },
    handleCellClick(tasks, date) {
      const overlappingTasks = this.getTasksForDay(tasks, date)
      if (overlappingTasks.length === 0) return
      
      this.popup = {
        show: true,
        tasks: overlappingTasks
      }
    },
    closePopup() {
      this.popup.show = false
      this.popup.tasks = []
    },
    formatDate(dateStr) {
      if (!dateStr) return '—'
      const date = new Date(dateStr + 'T00:00:00')
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }
  },
  mounted() {
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
/* Gantt Container */
.gantt-container {
  overflow-x: auto;
  background: #ffffff;
}

.gantt-container::-webkit-scrollbar {
  height: 8px;
}

.gantt-container::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.gantt-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.gantt-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Gantt Table */
.gantt-table {
  border-collapse: collapse;
  width: 100%;
  min-width: 1200px;
  font-size: 0.875rem;
  background: #ffffff;
}

.gantt-table th,
.gantt-table td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: center;
  vertical-align: middle;
}

.gantt-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  position: sticky;
  top: 0;
  z-index: 100;
}

.gantt-table th.employee-header {
  background: #f3f4f6;
  position: sticky;
  left: 0;
  z-index: 200;
  min-width: 250px;
  text-align: left;
}

.gantt-table th.month-header {
  font-weight: 700;
  color: #1f2937;
  background: #f9fafb;
}

.gantt-table th.day-header {
  font-weight: 500;
  color: #6b7280;
  background: #f9fafb;
  font-size: 0.75rem;
  min-width: 20px;
}

.gantt-table td.employee {
  background: #ffffff;
  position: sticky;
  left: 0;
  z-index: 50;
  text-align: left;
  font-weight: 500;
  color: #374151;
  min-width: 250px;
  border-right: 2px solid #d1d5db;
  vertical-align: middle;
}

.gantt-table tbody tr:nth-child(odd) td.employee {
  background: #ffffff;
}

.gantt-table tbody tr:nth-child(even) td.employee {
  background: #f9fafb;
}

.gantt-table tbody tr:nth-child(odd) td:not(.employee) {
  background: #ffffff;
}

.gantt-table tbody tr:nth-child(even) td:not(.employee) {
  background: #f9fafb;
}

.gantt-table td {
  height: 28px;
  width: 20px;
  padding: 0;
  background: #ffffff;
  transition: background-color 0.2s;
  min-width: 20px;
  text-align: center;
}

.gantt-table td.project {
  background: #3b82f6 !important;
  color: #ffffff !important;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.75rem;
}

.gantt-table td.project:hover {
  background: #2563eb !important;
}

.gantt-table td.mtc {
  background: #f59e0b !important;
  color: #1f2937 !important;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.75rem;
}

.gantt-table td.mtc:hover {
  background: #d97706 !important;
}

/* Filter Container */
.filter-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-checkbox {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.filter-checkbox-label {
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  user-select: none;
}

/* Legend */
.gantt-legend {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.gantt-legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.gantt-legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.gantt-legend-color.project {
  background: #3b82f6;
}

.gantt-legend-color.non-project {
  background: #f59e0b;
}

/* Empty State */
.gantt-empty {
  background: #ffffff;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  margin: 1rem 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* Tooltip */
.gantt-tooltip {
  position: fixed;
  background: #1f2937;
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  z-index: 10000;
  max-width: 200px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  transform: translateX(-50%);
}

.gantt-tooltip.show {
  opacity: 1;
}

.gantt-tooltip-title {
  font-weight: 600;
  color: #fbbf24;
}

/* Detail Popup */
.gantt-detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gantt-detail-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: min(860px, 92vw);
  max-height: 80vh;
  overflow: auto;
  padding: 18px 20px;
  color: #111827;
  font-size: 14px;
  line-height: 1.5;
}

.gantt-detail-actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.gantt-btn {
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.gantt-btn-gray {
  background: #e5e7eb;
  color: #111827;
}

.gantt-btn-gray:hover {
  background: #d1d5db;
}

/* Card */
.card {
  border: 1px solid #e9ecef;
}

/* Responsive */
@media (max-width: 768px) {
  .gantt-table {
    font-size: 0.75rem;
  }
  
  .gantt-table th.employee-header,
  .gantt-table td.employee {
    min-width: 200px;
  }
  
  .filter-container {
    flex-wrap: wrap;
  }
}
</style>
