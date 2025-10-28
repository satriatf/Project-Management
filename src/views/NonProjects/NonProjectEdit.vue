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
              <label class="form-label">Attachments</label>
              <input 
                type="file" 
                class="form-control" 
                multiple
                @change="handleFilesChange"
                ref="fileInput">
              <small class="text-muted">You can upload multiple files (PDF, JPG, PNG, DOCX, max 10MB each)</small>
              
              <div v-if="form.attachments.length" class="mt-2 p-3 border rounded bg-light">
                <div 
                  v-for="(att, idx) in form.attachments" 
                  :key="idx" 
                  class="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <i class="fa fa-file me-2"></i>
                    <strong>{{ att.originalName || att.name }}</strong>
                    <small class="text-muted ms-2">({{ formatFileSize(att.size) }})</small>
                    <span v-if="!att.data" class="badge bg-success ms-2">Saved</span>
                    <span v-else class="badge bg-warning ms-2">New</span>
                  </div>
                  <div>
                    <button type="button" class="btn btn-sm btn-outline-primary me-2" @click="previewFile(att)">
                      <i class="fa fa-eye"></i> Preview
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-primary me-2" @click="downloadFile(att)">
                      <i class="fa fa-download"></i> Download
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="removeAttachment(idx)">
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
import axios from 'axios'
import '@/assets/css/views/non-projects.css'

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
        attachments: []
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
    handleFilesChange(event) {
      const files = Array.from(event.target.files || [])
      const MAX_SIZE = 10 * 1024 * 1024 // 10MB
      const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const ALLOWED_EXTS = ['.pdf', '.jpg', '.jpeg', '.png', '.docx']

      const validated = []
      for (const f of files) {
        if (!f || f.size === 0) continue
        
        if (f.size > MAX_SIZE) {
          showWarningNotification(`File "${f.name}" exceeds 10MB limit`, 'File Too Large')
          continue
        }
        
        const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase()
        if (!ALLOWED_TYPES.includes(f.type) && !ALLOWED_EXTS.includes(ext)) {
          showWarningNotification(`File "${f.name}" is not allowed. Only PDF, JPG, PNG, DOCX are accepted.`, 'Invalid File Type')
          continue
        }
        
        validated.push({
          name: f.name,
          originalName: f.name,
          size: f.size,
          type: f.type,
          data: f,
          url: URL.createObjectURL(f)
        })
      }
      
      const existingKey = new Set(this.form.attachments.map(a => `${a.originalName||a.name}:${a.size}`))
      const toAdd = validated.filter(a => !existingKey.has(`${a.originalName||a.name}:${a.size}`))
      this.form.attachments = [...this.form.attachments, ...toAdd]
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    },
    async downloadFile(att) {
      if (!att) {
        showWarningNotification('No file to download', 'No Attachment')
        return
      }
      
      try {
        if (att.data) {
          const url = att.url || URL.createObjectURL(att.data)
          const link = document.createElement('a')
          link.href = url
          link.download = att.originalName || att.name || 'download'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          showSuccessNotification('File download started')
          return
        }

        const fileUrl = att.url
        if (!fileUrl) {
          showErrorNotification('File URL not found', 'Download Failed')
          return
        }
        const { data } = await axios.get(fileUrl, { responseType: 'blob' })
        const blobUrl = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = att.originalName || att.name || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
        showSuccessNotification('File downloaded successfully')
      } catch (error) {
        console.error('Download error:', error)
        const msg = error?.response?.status === 403 ? 'Unauthorized. Please re-login.' : 'File not found or cannot be downloaded'
        showErrorNotification(msg, 'Download Failed')
      }
    },
    async previewFile(att) {
      if (!att) {
        showWarningNotification('No file to preview', 'No Attachment')
        return
      }
      
      try {
        if (att.data) {
          const previewUrl = att.url || URL.createObjectURL(att.data)
          window.open(previewUrl, '_blank')
          return
        }

        const fileUrl = att.url
        if (!fileUrl) {
          showErrorNotification('File URL not found', 'Preview Failed')
          return
        }
        window.open(fileUrl, '_blank')
      } catch (error) {
        console.error('Preview error:', error)
        showErrorNotification('Failed to preview file', 'Preview Failed')
      }
    },
    removeAttachment(index) {
      this.form.attachments.splice(index, 1)
      if (this.$refs.fileInput && this.form.attachments.length === 0) {
        this.$refs.fileInput.value = ''
      }
    },
    async handleSubmit() {
      if (!this.form.resolverId) {
        showWarningNotification('Please select a Resolver PIC', 'Resolver PIC Required')
        return
      }

      try {
        let attachmentData = null
        
        // Separate new files (with .data) and existing (without .data)
        const newFiles = this.form.attachments.filter(a => a.data)
        const existingFiles = this.form.attachments.filter(a => !a.data)
        
        // Upload new files if any
        if (newFiles.length > 0) {
          const formData = new FormData()
          newFiles.forEach(f => formData.append('files', f.data))

          try {
            const uploadUrl = `${axios.defaults.baseURL}non-projects/uploads`
            const { data } = await axios.post(uploadUrl, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            // Merge uploaded files with existing
            attachmentData = [...existingFiles, ...data.data]
          } catch (uploadError) {
            const msg = uploadError?.response?.data?.message || uploadError.message || 'File upload failed'
            showErrorNotification('Failed to upload file: ' + msg)
            return
          }
        } else {
          // No new files, just keep existing
          attachmentData = existingFiles.length > 0 ? existingFiles : null
        }
        
        const payload = {
          id: this.form.id,
          createdBy: this.form.createdById,
          createdById: this.form.createdById,
          ticketNo: this.form.noTiket,
          noTiket: this.form.noTiket,
          deskripsi: this.form.description,
          description: this.form.description,
          type: this.form.type,
          resolverPic: this.form.resolverId,
          resolverId: this.form.resolverId,
          solusi: this.form.solution,
          solution: this.form.solution,
          application: this.form.application,
          tanggal: this.form.date,
          date: this.form.date,
          attachment: attachmentData && attachmentData.length > 0 ? attachmentData : null
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
        let createdById = nonProject.createdBy
        let resolverId = nonProject.resolverPic
        
        if (typeof createdById === 'string') {
          createdById = this.employeeIdByName(createdById)
        }
        
        if (typeof resolverId === 'string') {
          resolverId = this.employeeIdByName(resolverId)
        }
        
        // Process attachments - parse JSON and convert to array
        let attachments = []
        if (nonProject.attachment) {
          try {
            const parsed = typeof nonProject.attachment === 'string' 
              ? JSON.parse(nonProject.attachment) 
              : nonProject.attachment
            
            const items = Array.isArray(parsed) ? parsed : [parsed]
            attachments = items.map(item => {
              const computedUrl = (() => {
                if (item.url) {
                  if (item.url.startsWith('http')) return item.url
                  if (item.url.startsWith('/api/')) return `http://localhost:8080${item.url}`
                  return `http://localhost:8080/api/${item.url.replace(/^\//,'')}`
                }
                return item.name ? `http://localhost:8080/api/non-projects/files/${item.name}` : null
              })()
              
              return {
                ...item,
                url: computedUrl
              }
            })
          } catch (e) {
            console.error('Failed to parse attachments:', e)
          }
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
          attachments: attachments
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
  },
  watch: {
    // Re-load when navigating between different edit pages or after refresh
    '$route.params.id': {
      handler() {
        // Re-fetch to ensure fresh data from backend
        this.$store.dispatch('nonProjects/fetchNonProjects').then(() => {
          this.loadNonProject()
        })
      },
      immediate: false
    }
  }
}
</script>
