<template>
  <div class="container-fluid tm-table">
    <div class="page-header pt-4 pb-3">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-2">
              <li class="breadcrumb-item"><a href="#">Project Statuses</a></li>
              <li class="breadcrumb-item active">List</li>
            </ol>
          </nav>
          <h1 class="h2 mb-0">Project Statuses</h1>
        </div>
        <router-link :to="{ name: 'project-status-create' }" class="btn btn-warning">
          New Project Status
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
              <input type="text" class="form-control" placeholder="Search by name..." v-model="searchQuery">
            </div>
          </div>
        </div>


        <div class="table-responsive" style="overflow-x: auto;">
          <table class="table table-hover align-middle" style="min-width: 600px;">
            <thead class="table-light">
              <tr>
                <th style="min-width: 200px;">Name</th>
                <th style="min-width: 160px;">Created By</th>
                <th style="min-width: 160px;">Created Date</th>
                <th style="width: 60px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="status in paginatedStatuses" :key="status.id">
                <td>{{ status.name }}</td>
                <td>{{ status.createdBy || '-' }}</td>
                <td>{{ formatDate(status.createdAt) }}</td>
                <td>
                  <button
                    @click="confirmDelete(status)"
                    class="btn btn-sm btn-link p-0 text-danger"
                    title="Delete">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredStatuses.length === 0">
                <td colspan="4" class="text-center text-muted" style="padding: 3rem 0;">No project statuses found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <TablePagination
          :current-page="currentPage"
          :per-page="perPage"
          :total-items="filteredStatuses.length"
          @update:currentPage="currentPage = $event"
          @update:perPage="perPage = $event; currentPage = 1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/partials/TablePagination.vue'
import { showSuccessNotification, showDeleteConfirmation } from '@/common/notificationService'
import Swal from 'sweetalert2'

export default {
  name: 'ProjectStatusList',
  data() {
    return {
      searchQuery: '',
      perPage: 10,
      currentPage: 1
    }
  },
  components: { TablePagination },
  computed: {
    ...mapGetters({
      projectStatuses: 'master/activeProjectStatuses'
    }),
    filteredStatuses() {
      if (!this.searchQuery) {
        return this.projectStatuses
      }
      const query = this.searchQuery.toLowerCase()
      return this.projectStatuses.filter(status => 
        status.name.toLowerCase().includes(query)
      )
    },
    paginatedStatuses() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredStatuses.slice(start, end)
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '-'
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(date).toLocaleDateString('en-US', options)
    },
    async confirmDelete(status) {
      const result = await showDeleteConfirmation(
        `Are you sure you want to delete project status "${status.name}"?`,
        'Delete Project Status'
      )
      
      if (result.isConfirmed) {
        this.$store.dispatch('master/softDeleteProjectStatus', status.id)
        showSuccessNotification(`Project status "${status.name}" has been deleted successfully`)
      }
    }
  },
  mounted() {
    // Load project statuses from backend
    this.$store.dispatch('master/fetchProjectStatuses')
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
      this.$router.replace({ name: 'project-status-list' })
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1
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
