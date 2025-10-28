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
                multiple
                @change="handleFilesChange"
                ref="fileInput">
              <small class="text-muted">You can upload multiple files for documentation</small>

              <div v-if="form.attachments.length" class="mt-2 p-3 border rounded bg-light">
                <div 
                  v-for="(att, idx) in form.attachments" 
                  :key="idx" 
                  class="d-flex justify-content-between align-items-center py-1 border-bottom">
                  <div>
                    <i class="fa fa-file me-2"></i>
                    <strong>{{ att.name }}</strong>
                    <small class="text-muted ms-2">({{ formatFileSize(att.size) }})</small>
                  </div>
                  <div>
                    <button type="button" class="btn btn-sm btn-outline-primary me-2" @click="previewFile(att)">
                      <i class="fa fa-eye"></i> Preview
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
import { showInfoNotification, showSuccessNotification, showErrorNotification, showWarningNotification } from '@/common/notificationService'
import axios from 'axios'
import '@/assets/css/views/non-projects.css'

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
        attachments: []
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
    handleFilesChange(event) {
      const files = Array.from(event.target.files || [])
      const MAX_SIZE = 10 * 1024 * 1024 // 10MB
      const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const ALLOWED_EXTS = ['.pdf', '.jpg', '.jpeg', '.png', '.docx']

      const validated = []
      for (const f of files) {
        if (!f || f.size === 0) continue
        
        // Check size
        if (f.size > MAX_SIZE) {
          showWarningNotification(`File "${f.name}" exceeds 10MB limit`, 'File Too Large')
          continue
        }
        
        // Check type
        const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase()
        if (!ALLOWED_TYPES.includes(f.type) && !ALLOWED_EXTS.includes(ext)) {
          showWarningNotification(`File "${f.name}" is not allowed. Only PDF, JPG, PNG, DOCX are accepted.`, 'Invalid File Type')
          continue
        }
        
        validated.push({
          name: f.name,
          size: f.size,
          type: f.type,
          data: f,
          url: URL.createObjectURL(f)
        })
      }
      
      // merge with existing (avoid duplicates by name+size)
      const existingKey = new Set(this.form.attachments.map(a => `${a.name}:${a.size}`))
      const toAdd = validated.filter(a => !existingKey.has(`${a.name}:${a.size}`))
      this.form.attachments = [...this.form.attachments, ...toAdd]
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    },
    previewFile(att) {
      if (att && att.url) {
        window.open(att.url, '_blank')
      }
    },
    removeAttachment(index) {
      this.form.attachments.splice(index, 1)
      if (this.$refs.fileInput && this.form.attachments.length === 0) {
        this.$refs.fileInput.value = ''
      }
    },
    async handleSubmit() {
      // Minimal client-side validation to reduce 400 errors
      if (!this.form.createdById && !userService.getId()) {
        showWarningNotification('Created By is required (or login user missing).', 'Validation')
        return
      }
      if (!this.form.resolverId) {
        showWarningNotification('Please select a Resolver PIC', 'Resolver PIC Required')
        return
      }
      if (!this.form.noTiket || !this.form.description || !this.form.type || !this.form.application || !this.form.date) {
        showWarningNotification('Please fill all required fields (Ticket, Description, Type, Application, Date).', 'Validation')
        return
      }

      try {
  let attachmentData = null
        
        // Upload file first if there's an attachment
        const files = this.form.attachments || []
        if (files.length > 0) {
          const formData = new FormData()
          files.forEach(f => formData.append('files', f.data))

          try {
            // Use axios so Authorization header (JWT) is attached via interceptors
            const uploadUrl = `${axios.defaults.baseURL}non-projects/uploads`
            const { data } = await axios.post(uploadUrl, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            attachmentData = data.data // Array of file info from backend
          } catch (uploadError) {
            const msg = uploadError?.response?.data?.message || uploadError.message || 'File upload failed'
            showErrorNotification('Failed to upload file: ' + msg)
            return
          }
        }
        
        const payload = {
          createdById: this.form.createdById || Number(userService.getId()),
          resolverId: this.form.resolverId,
          noTiket: this.form.noTiket,
          deskripsi: this.form.description,
          type: this.form.type,
          solusi: this.form.solution || '',
          application: this.form.application,
          tanggal: this.form.date,
          attachmentsJson: attachmentData && attachmentData.length ? JSON.stringify(attachmentData) : null,
          attachmentsCount: attachmentData && attachmentData.length ? attachmentData.length : 0
        }
        // Debug: inspect payload sent to backend
        // eslint-disable-next-line no-console
        console.log('Submitting Non-Project payload:', payload)
        
        await this.$store.dispatch('nonProjects/addNonProject', payload)
        localStorage.removeItem('nonProjectDraft')
        
        // Reset form to initial state
        this.form = {
          createdById: null,
          resolverId: null,
          noTiket: '',
          type: "",
          application: "",
          description: "",
          solution: "",
          date: "",
          attachments: []
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
