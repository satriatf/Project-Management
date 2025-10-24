<template>
  <div 
    v-if="show" 
    class="gantt-tooltip show"
    :style="{ left: x + 'px', top: y + 'px' }">
    <div class="gantt-tooltip-title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: 'TimelineTooltip',
  props: {
    show: Boolean,
    x: Number,
    y: Number,
    title: String
  }
}
</script>

<style scoped>
.gantt-tooltip {
  position: fixed;
  background: #1f2937;
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  z-index: 10000;
  max-width: 200px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  transform: translateX(-50%);
}

.gantt-tooltip.show { opacity: 1; }
.gantt-tooltip-title { font-weight: 600; color: #fbbf24; }
</style>
