<template>
  <div class="container-fluid">
    <div class="page-header pt-4 pb-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-2">
          <li class="breadcrumb-item"><router-link to="/master/non-project-types">Non-Project Types</router-link></li>
          <li class="breadcrumb-item active">Create</li>
        </ol>
      </nav>
      <h1 class="h2 mb-0">Create Non-Project Type</h1>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label">Non-Project Type Name<span class="text-danger">*</span></label>
            <input 
              type="text" 
              class="form-control" 
              v-model="form.name" 
              placeholder="Enter non-project type name"
              required>
          </div>

          <div class="mt-4">
            <button type="submit" class="btn btn-warning me-2">Submit</button>
            <router-link to="/master/non-project-types" class="btn btn-secondary">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NonProjectTypeCreate',
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
        await this.$store.dispatch('master/addNonProjectType', this.form.name)
        this.$router.push({ 
          name: 'nonproject-type-list',
          query: {
            flash: `Non-Project Type \"${this.form.name}\" created successfully`,
            type: 'success'
          }
        })
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to create non-project type'
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

.breadcrumb-item a {
  color: #111;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: #111;
  text-decoration: underline;
}
</style>
