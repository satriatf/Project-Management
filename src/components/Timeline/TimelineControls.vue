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
          @change="$emit('update:showProject', $event.target.checked)"
          class="filter-checkbox">
        <label for="filter-project" class="filter-checkbox-label">Project</label>
      </div>
      <div class="filter-checkbox-group">
        <input 
          type="checkbox" 
          id="filter-non-project" 
          :checked="showNonProject"
          @change="$emit('update:showNonProject', $event.target.checked)"
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
import '@/assets/css/components/timeline.css'

export default {
  name: 'TimelineControls',
  props: {
    showProject: { type: Boolean, default: true },
    showNonProject: { type: Boolean, default: true }
  }
}
</script>
