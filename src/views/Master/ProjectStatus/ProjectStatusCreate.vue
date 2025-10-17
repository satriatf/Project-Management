<template>
  <div class="container-fluid">
    <div class="page-header pt-4 pb-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-2">
          <li class="breadcrumb-item"><router-link to="/master/project-statuses">Project Statuses</router-link></li>
          <li class="breadcrumb-item active">Create</li>
        </ol>
      </nav>
      <h1 class="h2 mb-0">Create Project Status</h1>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="row g-3">
            <div class="col-md-12">
              <label class="form-label">Project Status Name<span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                v-model="form.name" 
                placeholder="Enter project status name"
                required>
            </div>
          </div>

          <div class="mt-4">
            <button type="submit" class="btn btn-warning me-2">Submit</button>
            <router-link to="/master/project-statuses" class="btn btn-secondary">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import userService from '@/common/user.service.js'
export default {
  name: 'ProjectStatusCreate',
  data() {
    return {
      form: {
        name: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      const newStatus = {
        id: Date.now(),
        name: this.form.name,
        createdBy: userService.getNama() || 'Unknown',
        createdDate: new Date().toISOString().split('T')[0],
        isDeleted: false
      }
      this.$store.dispatch('master/addProjectStatus', newStatus)
      this.$router.push({ name: 'project-status-list' })
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
