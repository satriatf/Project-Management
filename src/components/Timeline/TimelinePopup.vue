<template>
  <div v-if="show" class="gantt-detail-overlay" @click="$emit('close')">
    <div class="gantt-detail-card" @click.stop>
      <div style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: #111827;">
        {{ tasks.length === 1 ? tasks[0].name : `${tasks.length} Tasks on this date` }}
      </div>
      <div style="color: #6b7280; margin-bottom: 16px; font-size: 13px;">
        {{ tasks.length ? formatDateRange(tasks[0].startDate, tasks[0].endDate) : '' }}
      </div>

      <template v-for="(task, index) in tasks" :key="task.id">
        <hr v-if="index > 0" style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">

        <div v-if="tasks.length > 1" style="font-size: 15px; font-weight: 600; margin-bottom: 10px;" :style="{ color: task.type === 'project' ? '#3b82f6' : '#f59e0b' }">
          {{ task.name }}
        </div>

        <table style="width: 100%; border-collapse: collapse;" cellpadding="8">
          <tr>
            <td style="width: 140px; color: #6b7280;"><b>Task</b></td>
            <td>
              <span class="badge" :style="{ 
                background: task.type === 'project' ? '#3b82f6' : '#f59e0b', 
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600'
              }">
                {{ task.type === 'project' ? 'Project' : 'Non-Project' }}
              </span>
            </td>
          </tr>

          <template v-if="task.type === 'project'">
            <tr><td style="color:#6b7280;"><b>Ticket No</b></td><td>{{ task.ticketNo || '—' }}</td></tr>
            <tr><td style="color:#6b7280;"><b>Name</b></td><td>{{ task.name || '—' }}</td></tr>
            <tr><td style="color:#6b7280;"><b>Status</b></td><td>{{ task.status || '—' }}</td></tr>
            <tr><td style="color:#6b7280;"><b>Technical Lead</b></td><td>{{ task.technicalLead || '—' }}</td></tr>
            <tr>
              <td style="color:#6b7280; vertical-align: top;"><b>PIC</b></td>
              <td>
                <div v-if="task.pic && task.pic.length">
                  <div v-for="(picName, idx) in task.pic" :key="idx" style="padding: 2px 0;">{{ idx + 1 }}. {{ picName }}</div>
                </div>
                <span v-else>—</span>
              </td>
            </tr>
            <tr><td style="color:#6b7280;"><b>Start Date</b></td><td>{{ formatDate(task.startDate) }}</td></tr>
            <tr><td style="color:#6b7280;"><b>End Date</b></td><td>{{ formatDate(task.endDate) }}</td></tr>
          </template>

          <template v-else>
            <tr><td style="color:#6b7280;"><b>Ticket No</b></td><td>{{ task.ticketNo || '—' }}</td></tr>
            <tr><td style="color:#6b7280;"><b>Description</b></td><td>{{ task.description || '—' }}</td></tr>
            <tr><td style="color:#6b7280;"><b>Type</b></td><td>{{ task.nonProjectType || '—' }}</td></tr>
            <tr><td style="color:#6b7280;"><b>Application</b></td><td>{{ task.application || '—' }}</td></tr>
            <tr><td style="color:#6b7280;"><b>Created By</b></td><td>{{ task.createdBy || '—' }}</td></tr>
            <tr><td style="color:#6b7280;"><b>Resolver PIC</b></td><td>{{ task.resolverPic || '—' }}</td></tr>
            <tr><td style="color:#6b7280;"><b>Date</b></td><td>{{ formatDate(task.startDate) }}</td></tr>
          </template>
        </table>
      </template>

      <div class="gantt-detail-actions">
        <button type="button" class="gantt-btn gantt-btn-gray" @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimelinePopup',
  props: {
    show: Boolean,
    tasks: { type: Array, default: () => [] }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '—'
      const date = new Date(dateStr + 'T00:00:00')
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },
    formatDateRange(startDateStr, endDateStr) {
      if (!startDateStr) return '—'
      const start = this.formatDate(startDateStr)
      if (!endDateStr || startDateStr === endDateStr) return start
      const end = this.formatDate(endDateStr)
      return `${start} — ${end}`
    }
  }
}
</script>

<style scoped>
.gantt-detail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 9999; display:flex; align-items:center; justify-content:center; }
.gantt-detail-card { background:#fff; border-radius:12px; box-shadow:0 20px 40px rgba(0,0,0,0.2); width:min(660px,92vw); max-height:80vh; overflow:auto; padding:24px; color:#111827; font-size:14px; line-height:1.5; }
.gantt-detail-card table { margin-top:12px; }
.gantt-detail-card table tr { border-bottom:1px solid #f3f4f6; }
.gantt-detail-card table tr:last-child { border-bottom:none; }
.gantt-detail-card table td { padding:10px 8px; }
.gantt-detail-card table td:first-child { font-weight:500; }
.gantt-detail-actions { margin-top:20px; display:flex; gap:10px; justify-content:flex-end; padding-top:16px; border-top:1px solid #e5e7eb; }
.gantt-btn { padding:8px 12px; border-radius:8px; text-decoration:none; display:inline-flex; align-items:center; gap:8px; border:none; cursor:pointer; font-size:14px; }
.gantt-btn-gray { background:#e5e7eb; color:#111827; }
.gantt-btn-gray:hover { background:#d1d5db; }
</style>
