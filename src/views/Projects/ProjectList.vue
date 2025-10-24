<template>
  <div class="container-fluid tm-table">
    <div class="page-header pt-4 pb-3">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-2">
              <li class="breadcrumb-item"><a href="#">Projects</a></li>
              <li class="breadcrumb-item active">List</li>
            </ol>
          </nav>
          <h1 class="h2 mb-0">Projects</h1>
        </div>
        <router-link :to="{ name: 'project-create' }" class="btn btn-warning">
          New Project
        </router-link>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </span>
              <input type="text" class="form-control" placeholder="Search by project name..." v-model="searchQuery">
            </div>
          </div>
        </div>

        <ProjectTable 
          :projects="paginatedProjects" 
          @delete="confirmDelete"
        />

        <TablePagination
          :current-page="currentPage"
          :per-page="perPage"
          :total-items="filteredProjects.length"
          @update:currentPage="currentPage = $event"
          @update:perPage="perPage = $event; currentPage = 1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProjectTable from '@/components/Projects/ProjectTable.vue'
import TablePagination from '@/components/partials/TablePagination.vue'
import { showSuccessNotification, showDeleteConfirmation } from '@/common/notificationService'
import Swal from 'sweetalert2'
import '@/assets/css/projects.css'

export default {
  name: 'ProjectList',
  components: {
    ProjectTable,
    TablePagination
  },
  data() {
    return {
      searchQuery: '',
      perPage: 10,
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters({
      projects: 'projects/allProjects'
    }),
    filteredProjects() {
      if (!this.searchQuery) {
        return this.projects
      }
      const query = this.searchQuery.toLowerCase()
      return this.projects.filter(proj =>
        (proj.project_name || '').toLowerCase().includes(query) ||
        (proj.project_ticket_no || '').toLowerCase().includes(query)
      )
    },
    paginatedProjects() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredProjects.slice(start, end)
    }
  },
  methods: {
    async confirmDelete(project) {
      const result = await showDeleteConfirmation(
        `Are you sure you want to delete project "${project.project_name}"?`,
        'Delete Project'
      )
      
      if (result.isConfirmed) {
        this.$store.dispatch('projects/deleteProject', project.sk_project)
        showSuccessNotification(`Project "${project.project_name}" has been deleted successfully`)
      }
    }
  },
  mounted() {
    // Load projects from backend
    this.$store.dispatch('projects/fetchProjects')
    // Flash success after navigation
    const msg = this.$route.query?.flash
    if (msg) {
      this.$swal({
        icon: 'success',
        title: 'Success!',
        text: msg,
        timer: 1500,
        showConfirmButton: false
      })
      this.$router.replace({ name: 'project-list' })
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1
    }
  }
}
</script>
