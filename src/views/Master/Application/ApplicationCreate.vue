<template>
  <div class="container-fluid">
    <div class="page-header pt-4 pb-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-2">
          <li class="breadcrumb-item"><router-link to="/master/applications">Applications</router-link></li>
          <li class="breadcrumb-item active">Create</li>
        </ol>
      </nav>
      <h1 class="h2 mb-0">Create Application</h1>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="row g-3">
            <div class="col-md-12">
              <label class="form-label">Application Name<span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                v-model="form.name" 
                placeholder="Enter application name"
                required>
            </div>
          </div>

          <div class="mt-4">
            <button type="submit" class="btn btn-warning me-2">Submit</button>
            <router-link to="/master/applications" class="btn btn-secondary">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/views/master.css'

export default {
  name: 'ApplicationCreate',
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
        await this.$store.dispatch('master/addApplication', this.form.name)
        this.$router.push({ 
          name: 'application-list',
          query: {
            flash: `Application \"${this.form.name}\" created successfully`,
            type: 'success'
          }
        })
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to create application'
        })
      }
    }
  }
}
</script>
