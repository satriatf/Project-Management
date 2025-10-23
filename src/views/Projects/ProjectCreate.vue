<template>
  <div class="container-fluid">
    <div class="page-header pt-4 pb-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-2">
          <li class="breadcrumb-item"><router-link to="/projects">Projects</router-link></li>
          <li class="breadcrumb-item active">Create</li>
        </ol>
      </nav>
      <h1 class="h2 mb-0">Create Project</h1>
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
              <select class="form-select" v-model.number="form.technicalLeadId" required>
                <option :value="null">Select</option>
                <option v-for="emp in shEmployees" :key="emp.sk_user" :value="emp.sk_user">
                  {{ emp.employee_name }}
                </option>
              </select>
            </div>

            <div class="col-md-12">
              <label class="form-label">PIC<span class="text-danger">*</span></label>
              <div class="row g-2 mb-2">
                <div class="col-10">
                  <select class="form-select form-select-sm" v-model.number="selectedPICCandidate">
                    <option :value="null">Select</option>
                    <option v-for="emp in availablePICEmployees" :key="emp.sk_user" :value="emp.sk_user">
                      {{ emp.employee_name }}
                    </option>
                  </select>
                </div>
                <div class="col-2">
                  <button type="button" class="btn btn-warning btn-sm w-100" @click="addPIC">Add</button>
                </div>
              </div>
              <div v-if="form.picIds.length > 0">
                <span v-for="id in form.picIds" :key="id" class="badge bg-warning text-dark me-2 mb-2 p-2">
                  {{ employeeNameById(id) }}
                  <button type="button" class="btn-close btn-close-white ms-2" @click="removePIC(id)" aria-label="Remove"></button>
                </span>
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
            <button type="submit" class="btn btn-warning me-2">Submit</button>
            <button type="button" class="btn btn-warning me-2" @click="handleDraft">Draft</button>
            <router-link to="/projects" class="btn btn-secondary">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { showInfoNotification } from '@/common/notificationService'

export default {
  name: 'ProjectCreate',
  data() {
    return {
      form: {
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
      employees: 'employees/allEmployees'
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
        this.$swal({ icon: 'warning', title: 'Technical Lead required', text: 'Please select a Technical Lead' })
        return
      }
      if (this.form.picIds.length === 0) {
        this.$swal({ icon: 'warning', title: 'PIC required', text: 'Please select at least one PIC' })
        return
      }

      try {
        // Convert to backend field names
        const payload = {
          project_ticket_no: this.form.ticketNo,
          project_name: this.form.name,
          project_status: this.form.status,
          technical_lead: this.employeeNameById(this.form.technicalLeadId),
          pics_json: JSON.stringify(this.form.picIds.map(id => this.employeeNameById(id))),
          start_date: this.form.startDate,
          end_date: this.form.endDate,
          total_day: Number(this.form.totalDays) || 0,
          percent_done: Number(this.form.percentDone) || 0
        }
        
        await this.$store.dispatch('projects/addProject', payload)
        localStorage.removeItem('projectDraft')
        
        // Reset form to initial state
        this.form = {
          ticketNo: '',
          name: '',
          status: '',
          technicalLeadId: null,
          picIds: [],
          startDate: '',
          endDate: '',
          totalDays: 0,
          percentDone: 0
        }
        this.selectedPICCandidate = null
        
        this.$router.push({ 
          name: 'project-list', 
          query: { 
            flash: `Project \"${payload.project_name}\" created successfully`,
            type: 'success'
          }
        })
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error!',
          text: error?.response?.data?.message || 'Failed to create project'
        })
      }
    },
    handleDraft() {
      localStorage.setItem('projectDraft', JSON.stringify(this.form))
      showInfoNotification('Draft saved successfully')
    }
  },
  mounted() {
    // Load employees and statuses
    this.$store.dispatch('employees/fetchEmployees')
    this.$store.dispatch('master/fetchProjectStatuses')
    // Load draft if exists
    const draft = localStorage.getItem('projectDraft')
    if (draft) {
      this.form = JSON.parse(draft)
    }
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
</style>
