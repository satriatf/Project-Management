<template>
  <div class="container-fluid">
    <div class="page-header pt-4 pb-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-2">
          <li class="breadcrumb-item"><router-link to="/non-projects">Non-Projects</router-link></li>
          <li class="breadcrumb-item active">Create</li>
        </ol>
      </nav>
      <h1 class="h2 mb-0">Create Non-Project</h1>
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
                v-model="form.noTiket"
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
              <select class="form-select" v-model.number="form.resolverId" required>
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
            <button type="submit" class="btn btn-warning me-2">Submit</button>
            <button type="button" class="btn btn-warning me-2" @click="handleDraft">Draft</button>
            <router-link to="/non-projects" class="btn btn-secondary">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userService from '@/common/user.service.js'
import { showInfoNotification, showSuccessNotification, showErrorNotification } from '@/common/notificationService'

export default {
  name: 'NonProjectCreate',
  data() {
    return {
      form: {
        createdById: null,
        resolverId: null,
        noTiket: '',
        type: "",
        application: "",
        description: "",
        solution: "",
        date: "",
        attachment: null
      }
    }
  },
  computed: {
    ...mapGetters({
      nonProjectTypes: 'master/activeNonProjectTypes',
      applications: 'master/activeApplications',
      employees: 'employees/activeEmployees'
    }),
    shAndStaff() { return this.employees.filter(e => e.level==='SH' || e.level==='Staff') }
  },
  methods: {
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
      if (!this.form.resolverId) {
        showWarningNotification('Please select a Resolver PIC', 'Resolver PIC Required')
        return
      }
      
      const payload = {
        createdById: this.form.createdById || userService.getId(),
        resolverId: this.form.resolverId,  // Send ID directly as number
        noTiket: this.form.noTiket,
        deskripsi: this.form.description,
        type: this.form.type,
        solusi: this.form.solution || '',
        application: this.form.application,
        tanggal: this.form.date,
        attachmentsJson: this.form.attachment ? JSON.stringify(this.form.attachment) : null,
        attachmentsCount: this.form.attachment ? 1 : 0
      }
      
      try {
        await this.$store.dispatch('nonProjects/addNonProject', payload)
        localStorage.removeItem('nonProjectDraft')
        
        // Reset form to initial state
        this.form = {
          createdById: null,
          resolverPicId: null,
          ticketNo: '',
          type: "",
          application: "",
          description: "",
          solution: "",
          date: "",
          attachment: null
        }
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = ''
        }
        
          showSuccessNotification(`Ticket "${payload.noTiket}" has been created successfully`)
          this.$router.push({ name: 'nonproject-list' })
      } catch (err) {
          const errorMsg = err?.response?.data?.message || err?.message || 'Failed to create Non-Project'
          showErrorNotification(errorMsg)
      }
    },
    handleDraft() {
      localStorage.setItem('nonProjectDraft', JSON.stringify(this.form))
      showInfoNotification('Draft saved successfully')
    }
  },
  mounted() {
    // Load required data
    this.$store.dispatch('employees/fetchEmployees')
    this.$store.dispatch('master/fetchNonProjectTypes')
    this.$store.dispatch('master/fetchApplications')
    // Load draft if exists
    const draft = localStorage.getItem('nonProjectDraft')
    if (draft) {
      const parsed = JSON.parse(draft)
      this.form = { ...this.form, ...parsed, id: undefined }
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

.resolver-tags { 
  display: flex; flex-wrap: wrap; gap: .5rem; 
}
.tag { 
  background: #f1f3f5; border: 1px solid #dee2e6; border-radius: 16px; padding: .25rem .5rem; 
  display: inline-flex; align-items: center; gap: .35rem; font-size: .9rem;
}
.tag-close { 
  border: none; background: transparent; color: #dc3545; font-size: 1rem; line-height: 1; cursor: pointer; 
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
