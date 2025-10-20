<template>
  <div class="container-fluid">
    <div class="page-header pt-4 pb-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-2">
          <li class="breadcrumb-item"><router-link to="/employees">Employees</router-link></li>
          <li class="breadcrumb-item active">Edit</li>
        </ol>
      </nav>
      <h1 class="h2 mb-0">Edit Employee</h1>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Employee NIK<span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                v-model="form.nik" 
                required>
            </div>

            <div class="col-md-6">
              <label class="form-label">Employee Name<span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                v-model="form.name" 
                required>
            </div>

            <div class="col-md-6">
              <label class="form-label">Employee Email<span class="text-danger">*</span></label>
              <input 
                type="email" 
                class="form-control" 
                v-model="form.email" 
                required>
            </div>

            <div class="col-md-6">
              <label class="form-label">Level<span class="text-danger">*</span></label>
              <select class="form-select" v-model="form.level" required>
                <option value="">Select one</option>
                <option value="Manager">Manager</option>
                <option value="Asmen">Asmen</option>
                <option value="SH">SH</option>
                <option value="Staff">Staff</option>
                <option value="Intern">Intern</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Is Active<span class="text-danger">*</span></label>
              <select class="form-select" v-model="form.isActive" required>
                <option value="">Select status</option>
                <option :value="true">Active</option>
                <option :value="false">Inactive</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Join Date</label>
              <input 
                type="date" 
                class="form-control" 
                v-model="form.joinDate">
            </div>

            <div class="col-md-6">
              <label class="form-label">End Date</label>
              <input 
                type="date" 
                class="form-control" 
                v-model="form.endDate">
            </div>

            <div class="col-md-6">
              <label class="form-label">Password</label>
              <div class="input-group">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-control" 
                  v-model="form.password" 
                  placeholder="Leave blank to keep current password">
                <button 
                  class="btn btn-outline-secondary" 
                  type="button" 
                  @click="showPassword = !showPassword">
                  <svg v-if="showPassword" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                  </svg>
                  <svg v-else width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                  </svg>
                </button>
              </div>
              <small class="text-muted">Leave blank if you don't want to change password</small>
            </div>
          </div>

          <div class="mt-4">
            <button type="submit" class="btn btn-warning me-2">Update</button>
            <router-link to="/employees" class="btn btn-secondary">Cancel</router-link>
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
  name: 'EmployeeEdit',
  data() {
    return {
      showPassword: false,
      form: {
        id: null,
        nik: '',
        name: '',
        email: '',
        level: '',
        isActive: '',
        joinDate: '',
        endDate: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      getEmployeeById: 'employees/employeeById'
    })
  },
  methods: {
    handleSubmit() {
      // Remove password from form if it's empty (not changed)
      const updateData = { ...this.form }
      if (!updateData.password) {
        delete updateData.password
      }
      
      this.$store.dispatch('employees/updateEmployee', updateData)
      showSuccessNotification(`Employee "${updateData.name}" has been updated successfully`)
      this.$router.push({ name: 'employee-list' })
    },
    loadEmployee() {
      const employeeId = parseInt(this.$route.params.id)
      const employee = this.getEmployeeById(employeeId)
      if (employee) {
        this.form = { ...employee, password: '' }
      } else {
        showErrorNotification('Employee not found')
        this.$router.push({ name: 'employee-list' })
      }
    }
  },
  mounted() {
    this.loadEmployee()
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
