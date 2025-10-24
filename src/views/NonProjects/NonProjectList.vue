<template>
  <div class="container-fluid tm-table">
    <div class="page-header pt-4 pb-3">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-2">
              <li class="breadcrumb-item"><a href="#">Non-Projects</a></li>
              <li class="breadcrumb-item active">List</li>
            </ol>
          </nav>
          <h1 class="h2 mb-0">Non-Projects</h1>
        </div>
        <router-link :to="{ name: 'nonproject-create' }" class="btn btn-warning">
          New Non-Project
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
              <input type="text" class="form-control" placeholder="Search by no ticket or description..." v-model="searchQuery">
            </div>
          </div>
        </div>

        <NonProjectTable 
          :non-projects="paginatedNonProjects" 
          @delete="confirmDelete"
        />

        <TablePagination
          :current-page="currentPage"
          :per-page="perPage"
          :total-items="filteredNonProjects.length"
          @update:currentPage="currentPage = $event"
          @update:perPage="perPage = $event; currentPage = 1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NonProjectTable from '@/components/NonProjects/NonProjectTable.vue'
import TablePagination from '@/components/partials/TablePagination.vue'
import { showSuccessNotification, showDeleteConfirmation, showErrorNotification } from '@/common/notificationService'

export default {
  name: 'NonProjectList',
  components: { 
    NonProjectTable,
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
      nonProjects: 'nonProjects/allNonProjects',
      employees: 'employees/activeEmployees'
    }),
    // Table-ready rows with names resolved
    tableRows() {
      const nameById = (id) => {
        const e = this.employees.find(x => x.sk_user === id)
        return e ? e.employee_name : null
      }
      return this.nonProjects.map(n => {
        // support multi-pic JSON if present
        let resolverNames = null
        if (n.resolverPicsJson) {
          try {
            const arr = JSON.parse(n.resolverPicsJson)
            resolverNames = Array.isArray(arr) ? arr.map(nameById).filter(Boolean).join(', ') : null
          } catch {}
        }
        if (!resolverNames && n.resolverPic) {
          resolverNames = nameById(n.resolverPic)
        }
        return {
          ...n,
          createdByName: nameById(n.createdBy),
          resolverPicNames: resolverNames,
          attachmentsCount: Array.isArray(n.attachment) ? n.attachment.length : (n.attachment ? 1 : 0)
        }
      })
    },
    filteredNonProjects() {
      if (!this.searchQuery) return this.tableRows
      const query = this.searchQuery.toLowerCase()
      return this.tableRows.filter(np => 
        (np.ticketNo || '').toLowerCase().includes(query) ||
        (np.description || '').toLowerCase().includes(query)
      )
    },
    paginatedNonProjects() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredNonProjects.slice(start, end)
    }
  },
  methods: {
    async confirmDelete(np) {
      const result = await showDeleteConfirmation(
        `Are you sure you want to delete ticket "${np.ticketNo}"?`,
        'Delete Non-Project'
      )
      
      if (result.isConfirmed) {
        try {
          await this.$store.dispatch('nonProjects/deleteNonProject', np.id)
          showSuccessNotification(`Ticket "${np.ticketNo}" has been deleted successfully`)
          // Ensure refresh
          await this.$store.dispatch('nonProjects/fetchNonProjects')
        } catch (err) {
          const msg = err?.response?.data?.message || err?.message || 'Failed to delete Non-Project'
          showErrorNotification(msg)
        }
      }
    }
  },
  mounted() {
    // Load non-projects from backend
    this.$store.dispatch('nonProjects/fetchNonProjects')
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
      this.$router.replace({ name: 'nonproject-list' })
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

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #000;
  font-weight: 500;
}

.btn-warning:hover {
  background-color: #e0a800;
  border-color: #d39e00;
}

.breadcrumb-item a {
  color: #111;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: #111;
  text-decoration: underline;
}

.input-group-text {
  background-color: #fff;
  border-right: 0;
}

.input-group .form-control {
  border-left: 0;
}

.input-group .form-control:focus {
  border-color: #ced4da;
  box-shadow: none;
}
</style>
