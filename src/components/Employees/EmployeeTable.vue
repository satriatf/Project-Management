<template>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Employee NIK</th>
          <th>Employee Name</th>
          <th>Employee Email</th>
          <th>Level</th>
          <th>Is Active</th>
          <th>Join Date</th>
          <th>End Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="employees.length === 0">
          <td colspan="8" class="text-center text-muted py-4">
            No employees found
          </td>
        </tr>
        <tr v-else v-for="employee in employees" :key="employee.sk_user">
          <td>{{ employee.employee_nik || '-' }}</td>
          <td>{{ employee.employee_name }}</td>
          <td>{{ employee.employee_email }}</td>
          <td><span class="badge bg-secondary">{{ employee.level || '-' }}</span></td>
          <td>
            <span class="badge" :class="getStatusClass(employee.is_active)">
              {{ employee.is_active === 'Active' ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td>{{ formatDate(employee.join_date) }}</td>
          <td>{{ formatDate(employee.end_date) }}</td>
          <td>
            <div class="d-flex gap-2">
              <router-link 
                :to="{ name: 'employee-edit', params: { id: employee.sk_user } }" 
                class="btn btn-sm btn-link p-0"
                title="Edit">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>

              </router-link>
              <button 
                @click="handleDelete(employee)" 
                class="btn btn-sm btn-link p-0 text-danger"
                title="Delete">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'EmployeeTable',
  props: {
    employees: {
      type: Array,
      required: true
    }
  },
  emits: ['delete'],
  methods: {
    formatDate(date) {
      if (!date) return '-'
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(date).toLocaleDateString('en-US', options)
    },
    getStatusClass(isActive) {
      return (isActive === 'Active') ? 'bg-success' : 'bg-danger'
    },
    handleDelete(employee) {
      this.$emit('delete', employee)
    }
  }
}
</script>

<style scoped>
.table th {
  font-weight: 600;
  color: #495057;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
}

.btn-link {
  text-decoration: none;
}

.gap-2 {
  gap: 0.5rem;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
}
</style>
