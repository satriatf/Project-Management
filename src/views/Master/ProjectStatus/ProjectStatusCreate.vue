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
    async handleSubmit() {
      try {
        // Send only the name string, backend will auto-fill created_by
        await this.$store.dispatch('master/addProjectStatus', this.form.name)
        this.$router.push({ 
          name: 'project-status-list',
          query: {
            flash: `Project Status \"${this.form.name}\" created successfully`,
            type: 'success'
          }
        })
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to create project status'
        })
      }
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

.breadcrumb-item a {
  color: #111;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: #111;
  text-decoration: underline;
}
</style>
