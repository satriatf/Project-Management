<template>
  <div class="container-fluid">
    <div class="page-header pt-4 pb-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-2">
          <li class="breadcrumb-item"><router-link to="/master/holidays">Holidays</router-link></li>
          <li class="breadcrumb-item active">Create</li>
        </ol>
      </nav>
      <h1 class="h2 mb-0">Create Holiday</h1>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="row g-3">
            <div class="col-md-12">
              <label class="form-label">Holiday Name<span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                v-model="form.name" 
                placeholder="Enter holiday name"
                required>
            </div>

            <div class="col-md-12">
              <label class="form-label">Holiday Date<span class="text-danger">*</span></label>
              <input 
                type="date" 
                class="form-control" 
                v-model="form.date" 
                required>
            </div>
          </div>

          <div class="mt-4">
            <button type="submit" class="btn btn-warning me-2">Submit</button>
            <router-link to="/master/holidays" class="btn btn-secondary">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HolidayCreate',
  data() {
    return {
      form: {
        name: '',
        date: new Date().toISOString().split('T')[0]
      }
    }
  },
  methods: {
    async handleSubmit() {
      try {
        // Backend expects { date, description }, auto-fills created_by
        const payload = {
          date: this.form.date,
          description: this.form.name
        }
        await this.$store.dispatch('master/addHoliday', payload)
        this.$router.push({ 
          name: 'holiday-list',
          query: {
            flash: `Holiday \"${this.form.name}\" created successfully`,
            type: 'success'
          }
        })
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to create holiday'
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
