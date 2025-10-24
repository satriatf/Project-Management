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
import { showSuccessNotification, showErrorNotification, showWarningNotification } from '@/common/notificationService'
import Swal from 'sweetalert2'
import '@/assets/css/non-projects.css'

export default {
  name: 'NonProjectEdit',
  data() {
    return {
      form: {
        id: null,
        createdById: null,
        noTiket: '',
        description: '',
        type: '',
        resolverId: null,
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
      if (!this.form.attachment) {
        showWarningNotification('No file to download', 'No Attachment')
        return
      }
      
      try {
        const link = document.createElement('a')
        
        // If attachment has data (newly uploaded file)
        if (this.form.attachment.data) {
          link.href = this.form.attachment.url || URL.createObjectURL(this.form.attachment.data)
        } 
        // If attachment only has url (existing file from backend)
        else if (this.form.attachment.url) {
          link.href = this.form.attachment.url
        }
        // If attachment has name but no url/data, try to construct url
        else if (this.form.attachment.name) {
          // Assuming backend serves files from /api/files/{filename}
          link.href = `/api/files/${this.form.attachment.name}`
        } else {
          showErrorNotification('File URL not found', 'Download Failed')
          return
        }
        
        link.download = this.form.attachment.name || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        showSuccessNotification('File download started')
      } catch (error) {
        console.error('Download error:', error)
        showErrorNotification('Failed to download file', 'Download Error')
      }
    },
    previewFile() {
      if (!this.form.attachment) {
        showWarningNotification('No file to preview', 'No Attachment')
        return
      }
      
      try {
        let previewUrl = null
        
        // If attachment has data (newly uploaded file)
        if (this.form.attachment.data) {
          previewUrl = this.form.attachment.url || URL.createObjectURL(this.form.attachment.data)
        }
        // If attachment only has url (existing file from backend)
        else if (this.form.attachment.url) {
          previewUrl = this.form.attachment.url
        }
        // If attachment has name but no url/data, try to construct url
        else if (this.form.attachment.name) {
          // Assuming backend serves files from /api/files/{filename}
          previewUrl = `/api/files/${this.form.attachment.name}`
        }
        
        if (previewUrl) {
          window.open(previewUrl, '_blank')
        } else {
          showErrorNotification('File URL not found', 'Preview Failed')
        }
      } catch (error) {
        console.error('Preview error:', error)
        showErrorNotification('Failed to preview file', 'Preview Error')
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

      try {
        const payload = {
          id: this.form.id,
          createdBy: this.form.createdById,
          createdById: this.form.createdById,
          ticketNo: this.form.noTiket,
          noTiket: this.form.noTiket,
          description: this.form.description,
          type: this.form.type,
          resolverPic: this.form.resolverId,
          resolverId: this.form.resolverId,
          solution: this.form.solution,
          application: this.form.application,
          date: this.form.date,
          attachment: this.form.attachment
        }
        
        await this.$store.dispatch('nonProjects/updateNonProject', payload)
        showSuccessNotification(`Ticket "${this.form.noTiket}" has been updated successfully`)
        this.$router.push({ name: 'nonproject-list' })
      } catch (error) {
        const errorMsg = error?.response?.data?.message || 'Failed to update Non-Project'
        showErrorNotification(errorMsg)
      }
    },
    loadNonProject() {
      const nonProjectId = parseInt(this.$route.params.id)
      const nonProject = this.getNonProjectById(nonProjectId)
      
      if (nonProject) {
        // Handle both name (string) and ID (number) formats
        let createdById = nonProject.createdBy
        let resolverId = nonProject.resolverPic
        
        // If createdBy is a name string, convert to ID
        if (typeof createdById === 'string') {
          createdById = this.employeeIdByName(createdById)
        }
        
        // If resolverPic is a name string, convert to ID
        if (typeof resolverId === 'string') {
          resolverId = this.employeeIdByName(resolverId)
        }
        
        this.form = { 
          id: nonProject.id,
          createdById: createdById || null,
          noTiket: nonProject.ticketNo || '',
          description: nonProject.description || '',
          type: nonProject.type || '',
          resolverId: resolverId || null,
          solution: nonProject.solution || '',
          application: nonProject.application || '',
          date: nonProject.date || '',
          attachment: nonProject.attachment || null
        }
      } else {
        showErrorNotification('Non-Project not found')
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
