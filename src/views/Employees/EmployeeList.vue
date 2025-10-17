<template>
  <div class="container-fluid tm-table">
    <div class="page-header pt-4 pb-3">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-2">
              <li class="breadcrumb-item"><a href="#">Employees</a></li>
              <li class="breadcrumb-item active">List</li>
            </ol>
          </nav>
          <h1 class="h2 mb-0">Employees</h1>
        </div>
        <router-link :to="{ name: 'employee-create' }" class="btn btn-warning">
          New Employee
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

        <EmployeeTable 
          :employees="paginatedEmployees" 
          @delete="confirmDelete"
        />

        <TablePagination
          :current-page="currentPage"
          :per-page="perPage"
          :total-items="filteredEmployees.length"
          @update:currentPage="currentPage = $event"
          @update:perPage="perPage = $event; currentPage = 1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EmployeeTable from '@/components/Employees/EmployeeTable.vue'
import TablePagination from '@/components/partials/TablePagination.vue'
import { showSuccessNotification, showDeleteConfirmation } from '@/common/notificationService'

export default {
  name: 'EmployeeList',
  components: {
    EmployeeTable,
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
      employees: 'employees/allEmployees'
    }),
    filteredEmployees() {
      if (!this.searchQuery) {
        return this.employees
      }
      const query = this.searchQuery.toLowerCase()
      return this.employees.filter(emp => 
        emp.name.toLowerCase().includes(query)
      )
    },
    paginatedEmployees() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredEmployees.slice(start, end)
    }
  },
  methods: {
    confirmDelete(employee) {
      showDeleteConfirmation(employee.name, () => {
        this.$store.dispatch('employees/deleteEmployee', employee.id)
        showSuccessNotification(`Employee "${employee.name}" has been deleted successfully`)
      })
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
  color: #6c757d;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: #495057;
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
