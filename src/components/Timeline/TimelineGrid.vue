
<template>
  <div class="gantt-container">
    <table class="gantt-table">
      <thead>
        <tr>
          <th class="employee-header" rowspan="2">Employee</th>
          <th v-for="month in monthsData" :key="month.index" :colspan="month.daysCount" class="month-header">
            {{ month.name }} {{ year }}
          </th>
        </tr>
        <tr>
          <th v-for="day in allDays" :key="day.key" class="day-header">{{ day.label }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in rows" :key="row.name">
          <!-- Project row -->
          <tr v-if="shouldShowProjectRow(row)">
            <td v-if="shouldShowBothRows(row)" class="employee" :rowspan="2">{{ row.name }}</td>
            <td v-else class="employee">{{ row.name }}</td>
            <td
              v-for="day in allDays"
              :key="`${row.name}-p-${day.key}`"
              :class="['day-cell', getCellClass(row.projectTasks, day.date)]"
              @mouseenter="onHover($event, row.projectTasks, day.date)"
              @mouseleave="$emit('cell-leave')"
              @click="onClick(row.projectTasks, day.date)"
            >
              <span class="band-count center" v-if="getTasksForDay(row.projectTasks, day.date).length > 1">{{ getTasksForDay(row.projectTasks, day.date).length }}+</span>
            </td>
          </tr>

          <!-- Non-Project row -->
          <tr v-if="shouldShowNonProjectRow(row)">
            <td v-if="!shouldShowProjectRow(row)" class="employee">{{ row.name }}</td>
            <td
              v-for="day in allDays"
              :key="`${row.name}-n-${day.key}`"
              :class="['day-cell', getCellClass(row.nonProjectTasks, day.date)]"
              @mouseenter="onHover($event, row.nonProjectTasks, day.date)"
              @mouseleave="$emit('cell-leave')"
              @click="onClick(row.nonProjectTasks, day.date)"
            >
              <span class="band-count center dark" v-if="getTasksForDay(row.nonProjectTasks, day.date).length > 1">{{ getTasksForDay(row.nonProjectTasks, day.date).length }}+</span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import '@/assets/css/components/timeline.css'

export default {
  name: 'TimelineGrid',
  props: {
    year: { type: Number, required: true },
    monthsData: { type: Array, required: true },
    allDays: { type: Array, required: true },
    rows: { type: Array, required: true },
    showProject: { type: Boolean, default: true },
    showNonProject: { type: Boolean, default: true }
  },
  methods: {
    dateRangeOverlaps(aStart, aEnd, bStart, bEnd) { return aStart <= bEnd && bStart <= aEnd },
    getTasksForDay(tasks, date) {
      return tasks.filter(task => {
        const taskStart = new Date(task.startDate + 'T00:00:00')
        const taskEnd = new Date(task.endDate + 'T00:00:00')
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        return this.dateRangeOverlaps(taskStart, taskEnd, dayStart, dayEnd)
      })
    },
    shouldShowProjectRow(row) {
      return this.showProject && row.projectTasks && row.projectTasks.length > 0
    },
    shouldShowNonProjectRow(row) {
      return this.showNonProject && row.nonProjectTasks && row.nonProjectTasks.length > 0
    },
    shouldShowBothRows(row) {
      return this.shouldShowProjectRow(row) && this.shouldShowNonProjectRow(row)
    },
    getCellClass(tasks, date) {
      const overlapping = this.getTasksForDay(tasks, date)
      if (!overlapping.length) return ''
      const type = overlapping[0].type
      return type === 'project' ? 'project' : 'mtc'
    },
    onHover(event, tasks, date) {
      const overlapping = this.getTasksForDay(tasks, date)
      if (!overlapping.length) return
      const rect = event.target.getBoundingClientRect()
      this.$emit('cell-hover', { x: rect.left + rect.width / 2, y: rect.bottom + 5, title: overlapping[0].name })
    },
    onClick(tasks, date) {
      const overlapping = this.getTasksForDay(tasks, date)
      if (!overlapping.length) return
      this.$emit('cell-click', overlapping)
    }
  }
}
</script>
