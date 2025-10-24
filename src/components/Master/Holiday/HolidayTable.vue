<template>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th><input type="checkbox" class="form-check-input"></th>
          <th>Holiday Name</th>
          <th>Date</th>
          <th>Created By</th>
          <th>Created Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="holidays.length === 0">
          <td colspan="6" class="text-center text-muted py-4">No holidays found</td>
        </tr>
        <tr v-else v-for="holiday in holidays" :key="holiday.id">
          <td><input type="checkbox" class="form-check-input"></td>
          <td>{{ holiday.description }}</td>
          <td>{{ formatDate(holiday.date) }}</td>
          <td>{{ holiday.createdBy || '-' }}</td>
          <td>{{ formatDate(holiday.createdAt) }}</td>
          <td>
            <div class="d-flex gap-2">
              <router-link 
                :to="{ name: 'holiday-edit', params: { id: holiday.id } }" 
                class="btn btn-sm btn-link p-0"
                title="Edit">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </router-link>
              <button 
                @click="handleDelete(holiday)" 
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
import '@/assets/css/components/tables.css'

export default {
  name: 'HolidayTable',
  props: {
    holidays: {
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
    handleDelete(holiday) {
      this.$emit('delete', holiday)
    }
  }
}
</script>
