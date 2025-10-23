<template>
  <div class="container-fluid">
    <div class="page-header pt-4 pb-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-2">
          <li class="breadcrumb-item"><router-link to="/non-projects">Non-Projects</router-link></li>
          <li class="breadcrumb-item active">Edit</li>
        </ol>
      </nav>
      <h1 class="h2 mb-0">Edit Non-Project</h1>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Created By<span class="text-danger">*</span></label>
              <select class="form-select" v-model.number="form.createdById" required>
                <option :value="null">Select</option>
                <option v-for="emp in shAndStaff" :key="emp.sk_user" :value="emp.sk_user">
                  {{ emp.employee_name }}
                </option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">No. Ticket<span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                v-model="form.ticketNo"
                placeholder="Enter ticket number"
                required>
            </div>

            <div class="col-md-12">
              <label class="form-label">Description<span class="text-danger">*</span></label>
              <textarea 
                class="form-control" 
                v-model="form.description" 
                rows="3"
                placeholder="Enter description"
                required></textarea>
            </div>

            <div class="col-md-6">
              <label class="form-label">Type<span class="text-danger">*</span></label>
              <select class="form-select" v-model="form.type" required>
                <option value="">Select</option>
                <option v-for="type in nonProjectTypes" :key="type.id" :value="type.name">
                  {{ type.name }}
                </option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Resolver PIC<span class="text-danger">*</span></label>
              <select class="form-select" v-model.number="form.resolverPicId" required>
                <option :value="null">Select</option>
                <option v-for="emp in shAndStaff" :key="emp.sk_user" :value="emp.sk_user">
                  {{ emp.employee_name }}
                </option>
              </select>
            </div>

            <div class="col-md-12">
              <label class="form-label">Solution</label>
              <textarea 
                class="form-control" 
                v-model="form.solution" 
                rows="3"
                placeholder="Enter solution"></textarea>
            </div>

            <div class="col-md-6">
              <label class="form-label">Application<span class="text-danger">*</span></label>
              <select class="form-select" v-model="form.application" required>
                  <option value="">Select</option>
                <option v-for="app in applications" :key="app.id" :value="app.name">
                  {{ app.name }}
                </option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Date<span class="text-danger">*</span></label>
              <input 
                type="date" 
                class="form-control" 
                v-model="form.date" 
                 lang="en"
                required>
            </div>

            <div class="col-md-12">
              <label class="form-label">Attachment</label>
              <input 
                type="file" 
                class="form-control" 
                @change="handleFileUpload"
                ref="fileInput">
              <small class="text-muted">Upload file for documentation</small>
              
              <div v-if="form.attachment" class="mt-2 p-3 border rounded bg-light">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <i class="fa fa-file me-2"></i>
                    <strong>{{ form.attachment.name }}</strong>
                    <small class="text-muted ms-2">({{ formatFileSize(form.attachment.size) }})</small>
                  </div>
                  <div>
                    <button type="button" class="btn btn-sm btn-outline-primary me-2" @click="downloadFile">
                      <i class="fa fa-download"></i> Download
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-primary me-2" @click="previewFile">
                      <i class="fa fa-eye"></i> Preview
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="removeFile">
                      <i class="fa fa-trash"></i> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <button type="submit" class="btn btn-warning me-2">Update</button>
            <router-link to="/non-projects" class="btn btn-secondary">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { showSuccessNotification, showErrorNotification } from '@/common/notificationService'

export default {
  name: 'NonProjectEdit',
  data() {
    return {
      form: {
        id: null,
        createdById: null,
        ticketNo: '',
        description: '',
        type: '',
        resolverPicId: null,
        solution: '',
        application: '',
        date: '',
        attachment: null
      }
    }
  },
  computed: {
    ...mapGetters({
      nonProjectTypes: 'master/activeNonProjectTypes',
      applications: 'master/activeApplications',
      employees: 'employees/allEmployees',
      getNonProjectById: 'nonProjects/nonProjectById'
    }),
    shAndStaff() { return this.employees.filter(e => (e.level==='SH' || e.level==='Staff') && e.is_active==='Active') }
  },
  methods: {
    employeeIdByName(name){
      const e = this.employees.find(x=>x.employee_name===name)
      return e ? e.sk_user : null
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.form.attachment = {
          name: file.name,
          size: file.size,
          type: file.type,
          data: file,
          url: URL.createObjectURL(file)
        }
      }
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    },
    downloadFile() {
      if (this.form.attachment && this.form.attachment.data) {
        const link = document.createElement('a')
        link.href = this.form.attachment.url || URL.createObjectURL(this.form.attachment.data)
        link.download = this.form.attachment.name
        link.click()
      }
    },
    previewFile() {
      if (this.form.attachment && this.form.attachment.url) {
        window.open(this.form.attachment.url, '_blank')
      }
    },
    removeFile() {
      this.form.attachment = null
      this.$refs.fileInput.value = ''
    },
    async handleSubmit() {
      if (!this.form.resolverPicId) {
        this.$swal({ icon: 'warning', title: 'Resolver PIC required', text: 'Please select a Resolver PIC' })
        return
      }

      try {
        const payload = {
          ...this.form,
          resolverPic: this.form.resolverPicId
        }
        
        await this.$store.dispatch('nonProjects/updateNonProject', payload)
        this.$router.push({ 
          name: 'nonproject-list', 
          query: { 
            flash: `Ticket \"${payload.ticketNo}\" updated successfully`,
            type: 'success'
          }
        })
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error!',
          text: error?.response?.data?.message || 'Failed to update Non-Project'
        })
      }
    },
    loadNonProject() {
      const nonProjectId = parseInt(this.$route.params.id)
      const nonProject = this.getNonProjectById(nonProjectId)
      if (nonProject) {
        const createdById = this.employeeIdByName(nonProject.createdBy) || nonProject.createdById
        const resolverPicId = this.employeeIdByName(nonProject.resolverPic) || nonProject.resolverPicId
        
        this.form = { 
          ...nonProject,
          createdById,
          resolverPicId
        }
      } else {
        this.$swal({
          icon: 'error',
          title: 'Error!',
          text: 'Non-Project not found'
        })
        this.$router.push({ name: 'nonproject-list' })
      }
    }
  },
  mounted() {
    // Load required data
    this.$store.dispatch('employees/fetchEmployees')
    this.$store.dispatch('master/fetchNonProjectTypes')
    this.$store.dispatch('master/fetchApplications')
    this.$store.dispatch('nonProjects/fetchNonProjects').then(() => {
      this.loadNonProject()
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
</style>
