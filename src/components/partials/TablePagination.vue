<template>
  <div class="d-flex flex-column flex-md-row align-items-center justify-content-between mt-3">
    <div class="d-flex align-items-center mb-2 mb-md-0">
      <label class="me-2 text-muted">Show</label>
      <select
        class="form-select form-select-sm me-2"
        style="width: 80px;"
        :value="perPage"
        @change="$emit('update:perPage', Number($event.target.value))"
      >
        <option v-for="n in perPageOptions" :key="n" :value="n">{{ n }}</option>
      </select>
      <span class="text-muted">entries</span>
    </div>

    <nav aria-label="Table pagination">
      <ul class="pagination pagination-sm mb-0">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goPrev" :disabled="currentPage === 1">Prev</button>
        </li>
        <li class="page-item disabled">
          <span class="page-link bg-white text-muted">
            {{ currentPage }} / {{ totalPages }}
          </span>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goNext" :disabled="currentPage === totalPages">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import '@/assets/css/components/pagination.css'

export default {
  name: 'TablePagination',
  props: {
    currentPage: { type: Number, required: true },
    perPage: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    perPageOptions: { type: Array, default: () => [10, 25, 50, 100] }
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.totalItems / this.perPage))
    }
  },
  methods: {
    goPrev() {
      if (this.currentPage > 1) {
        this.$emit('update:currentPage', this.currentPage - 1)
      }
    },
    goNext() {
      if (this.currentPage < this.totalPages) {
        this.$emit('update:currentPage', this.currentPage + 1)
      }
    }
  }
}
</script>
