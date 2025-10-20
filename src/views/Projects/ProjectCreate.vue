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
                required>
            </div>

            <div class="col-md-6">
              <label class="form-label">Project Name<span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                v-model="form.name" 
                required>
            </div>

            <div class="col-md-6">
              <label class="form-label">Project Status<span class="text-danger">*</span></label>
              <select class="form-select" v-model="form.status" required>
                <option value="">Select status</option>
                <option v-for="status in projectStatuses" :key="status.id" :value="status.name">
                  {{ status.name }}
                </option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Technical Lead<span class="text-danger">*</span></label>
              <select class="form-select" v-model="form.technicalLead" required>
                <option value="">Select one</option>
                <option v-for="emp in shEmployees" :key="emp.id" :value="emp.name">
                  {{ emp.name }}
                </option>
              </select>
            </div>

            <div class="col-md-12">
              <label class="form-label">PIC (Person In Charge)<span class="text-danger">*</span></label>
              <select class="form-select" v-model="form.pic" multiple size="5" required>
                <option v-for="emp in staffEmployees" :key="emp.id" :value="emp.name">
                  {{ emp.name }}
                </option>
              </select>
              <small class="text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</small>
            </div>

            <div class="col-md-6">
              <label class="form-label">Start Date<span class="text-danger">*</span></label>
              <input 
                type="date" 
                class="form-control" 
                v-model="form.startDate"
                @change="calculateTotalDays"
                required>
            </div>

            <div class="col-md-6">
              <label class="form-label">End Date<span class="text-danger">*</span></label>
              <input 
                type="date" 
                class="form-control" 
                v-model="form.endDate"
                @change="calculateTotalDays"
                required>
            </div>

            <div class="col-md-6">
              <label class="form-label">Total Days</label>
              <input 
                type="number" 
                class="form-control" 
                v-model="form.totalDays" 
                readonly>
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
import Swal from 'sweetalert2'

export default {
  name: 'ProjectCreate',
  data() {
    return {
      form: {
        ticketNo: '',
        name: '',
        status: '',
        technicalLead: '',
        pic: [],
        startDate: '',
        endDate: '',
        totalDays: 0,
        percentDone: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      projectStatuses: 'master/activeProjectStatuses',
      employees: 'employees/allEmployees'
    }),
    shEmployees() {
      return this.employees.filter(emp => emp.level === 'SH' && emp.isActive === 'Active')
    },
    staffEmployees() {
      return this.employees.filter(emp => emp.level === 'Staff' && emp.isActive === 'Active')
    }
  },
  methods: {
    calculateTotalDays() {
      if (this.form.startDate && this.form.endDate) {
        const start = new Date(this.form.startDate)
        const end = new Date(this.form.endDate)
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        this.form.totalDays = diffDays
      }
    },
    handleSubmit() {
      const newProject = {
        id: Date.now(),
        ...this.form
      }
      this.$store.dispatch('projects/addProject', newProject)
      localStorage.removeItem('projectDraft')
      showSuccessNotification(`Project "${newProject.name}" has been created successfully`)
      this.$router.push({ name: 'project-list' })
    },
    handleDraft() {
      localStorage.setItem('projectDraft', JSON.stringify(this.form))
      showInfoNotification('Draft saved successfully')
    }
  },
  mounted() {
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
