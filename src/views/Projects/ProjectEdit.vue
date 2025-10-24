<template>
  <div class="container-fluid">
    <div class="page-header pt-4 pb-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-2">
          <li class="breadcrumb-item"><router-link to="/projects">Projects</router-link></li>
          <li class="breadcrumb-item active">Edit</li>
        </ol>
      </nav>
      <h1 class="h2 mb-0">Edit Project</h1>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Project Ticket No<span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                v-model="form.ticketNo"
                placeholder="Enter project ticket number"
                required>
            </div>

            <div class="col-md-6">
              <label class="form-label">Project Name<span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                v-model="form.name"
                placeholder="Enter project name"
                required>
            </div>

            <div class="col-md-6">
              <label class="form-label">Project Status<span class="text-danger">*</span></label>
              <select class="form-select" v-model="form.status" required>
                <option value="">Select</option>
                <option v-for="status in projectStatuses" :key="status.id" :value="status.name">
                  {{ status.name }}
                </option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Technical Lead<span class="text-danger">*</span></label>
              <select class="form-select" v-model="form.technicalLeadId" required>
                <option value="">Select</option>
                <option v-for="emp in shEmployees" :key="emp.sk_user" :value="emp.sk_user">
                  {{ emp.employee_name }}
                </option>
              </select>
            </div>

            <div class="col-md-12">
              <label class="form-label">PIC<span class="text-danger">*</span></label>
              <div class="row g-2 mb-3">
                <div class="col-10">
                  <select class="form-select form-select-sm" v-model="selectedPICCandidate">
                    <option value="">Select</option>
                    <option v-for="emp in availablePICEmployees" :key="emp.sk_user" :value="emp.sk_user">
                      {{ emp.employee_name }}
                    </option>
                  </select>
                </div>
                <div class="col-2">
                  <button type="button" class="btn btn-warning btn-sm w-100" @click="addPIC">Add</button>
                </div>
              </div>
              
              <!-- PIC List dengan nomor urut -->
              <div v-if="form.picIds.length > 0" class="pic-list-container p-3 border rounded bg-light">
                <div class="pic-list">
                  <div v-for="(id, index) in form.picIds" :key="id" class="pic-item d-flex justify-content-between align-items-center mb-2">
                    <span class="pic-name">
                      <strong>{{ index + 1 }}.</strong> {{ employeeNameById(id) }}
                    </span>
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="removePIC(id)" title="Remove">
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-muted small">
                <em>No PICs added yet. Please add at least one PIC.</em>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Start Date<span class="text-danger">*</span></label>
              <input 
                type="date" 
                class="form-control" 
                v-model="form.startDate"
                 lang="en"
                required>
            </div>

            <div class="col-md-6">
              <label class="form-label">End Date<span class="text-danger">*</span></label>
              <input 
                type="date" 
                class="form-control" 
                v-model="form.endDate"
                 lang="en"
                required>
            </div>

            <div class="col-md-6">
              <label class="form-label">Total Days<span class="text-danger">*</span></label>
              <input 
                type="number" 
                class="form-control" 
                v-model.number="form.totalDays"
                placeholder="Enter total days"
                min="0"
                required>
            </div>

            <div class="col-md-6">
              <label class="form-label">Percent Done<span class="text-danger">*</span></label>
              <div class="input-group">
                <input 
                  type="number" 
                  class="form-control" 
                  v-model="form.percentDone" 
                  min="0"
                  max="100"
                  placeholder="0"
                  required>
                <span class="input-group-text">%</span>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <button type="submit" class="btn btn-warning me-2">Update</button>
            <router-link to="/projects" class="btn btn-secondary">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { showSuccessNotification, showErrorNotification, showWarningNotification } from '@/common/notificationService'
import Swal from 'sweetalert2'

export default {
  name: 'ProjectEdit',
  data() {
    return {
      form: {
        id: null,
        ticketNo: '',
        name: '',
        status: '',
        technicalLeadId: null,
        picIds: [],
        startDate: '',
        endDate: '',
        totalDays: 0,
        percentDone: 0
      },
      selectedPICCandidate: null
    }
  },
  computed: {
    ...mapGetters({
      projectStatuses: 'master/activeProjectStatuses',
      employees: 'employees/allEmployees',
      getProjectById: 'projects/projectById'
    }),
    shEmployees() {
      return this.employees.filter(emp => emp.level === 'SH' && emp.is_active === 'Active')
    },
    staffEmployees() {
      return this.employees.filter(emp => emp.level === 'Staff' && emp.is_active === 'Active')
    },
    availablePICEmployees() {
      return this.staffEmployees.filter(emp => !this.form.picIds.includes(emp.sk_user))
    }
  },
  methods: {
    employeeNameById(id) {
      const emp = this.employees.find(e => e.sk_user === id)
      return emp ? emp.employee_name : id
    },
    employeeIdByName(name) {
      const emp = this.employees.find(e => e.employee_name === name)
      return emp ? emp.sk_user : null
    },
    addPIC() {
      const id = this.selectedPICCandidate
      if (!id) return
      if (!this.form.picIds.includes(id)) {
        this.form.picIds.push(id)
      }
      this.selectedPICCandidate = null
    },
    removePIC(id) {
      this.form.picIds = this.form.picIds.filter(x => x !== id)
    },
    calculateTotalDays() {
      if (this.form.startDate && this.form.endDate) {
        const start = new Date(this.form.startDate)
        const end = new Date(this.form.endDate)
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        this.form.totalDays = diffDays
      }
    },
    async handleSubmit() {
      // Validation
      if (!this.form.technicalLeadId) {
        showWarningNotification('Please select a Technical Lead', 'Technical Lead Required')
        return
      }
      if (this.form.picIds.length === 0) {
        showWarningNotification('Please select at least one PIC', 'PIC Required')
        return
      }

      try {
        // Backend expects technical lead as NAME (string) and PICs as JSON array of NAMES
        const technicalLeadName = this.employeeNameById(this.form.technicalLeadId)
        const picNames = this.form.picIds.map(id => this.employeeNameById(id))
        
        // Prepare payload with proper field names matching backend
        const payload = {
          sk_project: this.form.id,
          project_ticket_no: this.form.ticketNo,
          project_name: this.form.name,
          project_status: this.form.status,
          technical_lead: technicalLeadName, // Send name, not ID
          pics_json: JSON.stringify(picNames), // Send names as JSON array
          start_date: this.form.startDate,
          end_date: this.form.endDate,
          total_day: this.form.totalDays,
          percent_done: this.form.percentDone
        }
        
        await this.$store.dispatch('projects/updateProject', payload)
        showSuccessNotification(`Project "${this.form.name}" has been updated successfully`)
        this.$router.push({ name: 'project-list' })
      } catch (error) {
        const errorMsg = error?.response?.data?.message || 'Failed to update project'
        showErrorNotification(errorMsg)
      }
    },
    loadProject() {
      // Project ID is UUID, not integer
      const projectId = this.$route.params.id
      const project = this.getProjectById(projectId)
      
      if (project) {
        // Convert names to IDs for the new UI pattern
        let technicalLeadId = project.technical_lead
        
        // If technical_lead is a name string, convert to ID
        if (typeof technicalLeadId === 'string') {
          technicalLeadId = this.employeeIdByName(technicalLeadId)
        }
        
        // Handle PICs - can be JSON string or array
        let picIds = []
        if (project.pics_json) {
          try {
            const picsArray = typeof project.pics_json === 'string' 
              ? JSON.parse(project.pics_json) 
              : project.pics_json
            
            picIds = Array.isArray(picsArray)
              ? picsArray.map(nameOrId => {
                  // If it's a name (string), convert to ID
                  if (typeof nameOrId === 'string') {
                    return this.employeeIdByName(nameOrId)
                  }
                  // If it's already an ID (number), use it
                  return nameOrId
                }).filter(id => id !== null)
              : []
          } catch (e) {
            console.error('Error parsing pics_json:', e)
          }
        }
        
        this.form = { 
          id: project.sk_project,
          ticketNo: project.project_ticket_no || '',
          name: project.project_name || '',
          status: project.project_status || '',
          technicalLeadId: technicalLeadId || null,
          picIds: picIds,
          startDate: project.start_date || '',
          endDate: project.end_date || '',
          totalDays: project.total_day || 0,
          percentDone: project.percent_done || 0
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Project not found'
        })
        this.$router.push({ name: 'project-list' })
      }
    }
  },
  mounted() {
    // Load required data
    this.$store.dispatch('employees/fetchEmployees')
    this.$store.dispatch('master/fetchProjectStatuses')
    this.$store.dispatch('projects/fetchProjects').then(() => {
      this.loadProject()
    })
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #e9ecef;
}

.text-danger {
  color: #dc3545 !important;
}

/* PIC List Styling */
.pic-list-container {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
}

.pic-list {
  width: 100%;
}

.pic-item {
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.pic-item:hover {
  background-color: #f8f9fa;
  border-color: #ffc107;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.pic-name {
  font-size: 0.95rem;
  color: #495057;
}

.pic-name strong {
  color: #ffc107;
  margin-right: 8px;
  min-width: 25px;
  display: inline-block;
}

.btn-outline-danger {
  padding: 2px 8px;
  font-size: 0.875rem;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
}
</style>
