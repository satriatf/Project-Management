<template>
  <div 
    v-if="show" 
    class="gantt-tooltip show"
    :style="{ left: x + 'px', top: y + 'px' }">
    <div class="gantt-tooltip-title">{{ title }}</div>
  </div>
</template>

<script>
import '@/assets/css/components/timeline.css'

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
