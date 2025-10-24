
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

<style scoped>
.gantt-container { overflow-x: auto; background: #ffffff; }
.gantt-container::-webkit-scrollbar { height: 8px; }
.gantt-container::-webkit-scrollbar-track { background: #f1f5f9; }
.gantt-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.gantt-container::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.gantt-table { border-collapse: collapse; width: 100%; min-width: 1200px; font-size: 0.875rem; background: #ffffff; }
.gantt-table th, .gantt-table td { border: 1px solid #e5e7eb; padding: 0.5rem; text-align: center; vertical-align: middle; }
.gantt-table th { background: #f9fafb; font-weight: 600; color: #374151; position: sticky; top: 0; z-index: 100; }
.gantt-table th.employee-header { background: #f3f4f6; position: sticky; left: 0; z-index: 200; min-width: 250px; text-align: left; }
.gantt-table th.month-header { font-weight: 700; color: #1f2937; background: #f9fafb; }
.gantt-table th.day-header { font-weight: 500; color: #6b7280; background: #f9fafb; font-size: 0.75rem; min-width: 20px; }

.gantt-table td.employee { background:#fff; position: sticky; left:0; z-index:50; text-align:left; font-weight:500; color:#374151; min-width:250px; border-right:2px solid #d1d5db; }
.gantt-table tbody tr:nth-child(even) td.employee { background: #f9fafb; }
.gantt-table tbody tr:nth-child(odd) td:not(.employee) { background: #ffffff; }
.gantt-table tbody tr:nth-child(even) td:not(.employee) { background: #f9fafb; }

.gantt-table td { height: 28px; width: 20px; padding: 0; background: #ffffff; min-width: 20px; text-align: center; }

/* New banded rendering inside each cell */
.day-cell { position: relative; }
.single-band { width: 100%; height: 100%; }
.dual-band { width: 100%; height: 100%; display: flex; flex-direction: column; }
.band { width: 100%; flex: 1 1 50%; }
.dual-band .band + .band { border-top: 1px solid #e5e7eb; }
.project { background: #3b82f6; }
.mtc { background: #f59e0b; }
/* Ensure cell color overrides base td background */
.gantt-table td.project { background-color: #3b82f6 !important; color: #fff; }
.gantt-table td.mtc { background-color: #f59e0b !important; color: #fff; }
.band.empty { background: transparent; }
.band-count { position: absolute; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 700; color: #fff; }
.band-count.dark { color: #1f2937; }
.band-count.center { top: 50%; transform: translate(-50%, -50%); }
.band-count.top { top: 15%; }
.band-count.bottom { bottom: 15%; }

/* Removed hover-based color/layout changes to keep cells static on cursor hover */

@media (max-width: 768px) {
  .gantt-table { font-size: 0.75rem; }
  .gantt-table th.employee-header, .gantt-table td.employee { min-width: 200px; }
}
</style>
