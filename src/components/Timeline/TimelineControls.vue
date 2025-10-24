<template>
  <div>
    <!-- Filter Controls -->
    <div class="filter-container">
      <span class="filter-label">Filter by Task:</span>
      <div class="filter-checkbox-group">
        <input 
          type="checkbox" 
          id="filter-project" 
          :checked="showProject"
          @change="$emit('update:showProject', !$event.target.checked ? false : true)"
          class="filter-checkbox">
        <label for="filter-project" class="filter-checkbox-label">Project</label>
      </div>
      <div class="filter-checkbox-group">
        <input 
          type="checkbox" 
          id="filter-non-project" 
          :checked="showNonProject"
          @change="$emit('update:showNonProject', !$event.target.checked ? false : true)"
          class="filter-checkbox">
        <label for="filter-non-project" class="filter-checkbox-label">Non-Project</label>
      </div>
    </div>

    <!-- Legend -->
    <div class="gantt-legend">
      <div class="gantt-legend-item">
        <div class="gantt-legend-color project"></div>
        <span>Project</span>
      </div>
      <div class="gantt-legend-item">
        <div class="gantt-legend-color non-project"></div>
        <span>Non-Project</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimelineControls',
  props: {
    showProject: { type: Boolean, default: true },
    showNonProject: { type: Boolean, default: true }
  }
}
</script>

<style scoped>
.filter-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-checkbox {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.filter-checkbox-label {
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  user-select: none;
}

.gantt-legend {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.gantt-legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.gantt-legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.gantt-legend-color.project { background: #3b82f6; }
.gantt-legend-color.non-project { background: #f59e0b; }
</style>
