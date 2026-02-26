<template>
  <div class="holiday-calendar-card">
    <div class="calendar-header">
      <button @click="previousMonth" class="nav-btn">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
      </button>
      <h5 class="current-month">{{ currentMonthYear }}</h5>
      <button @click="nextMonth" class="nav-btn">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    </div>

    <div class="calendar-body">
      <!-- Day headers -->
      <div class="calendar-weekdays">
        <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
      </div>

      <!-- Calendar dates -->
      <div class="calendar-dates">
        <div
          v-for="(date, index) in calendarDates"
          :key="index"
          :class="[
            'calendar-date',
            {
              'other-month': !date.isCurrentMonth,
              'today': date.isToday,
              'holiday': date.isHoliday,
              'weekend': date.isWeekend
            }
          ]"
          :title="date.holidayName || ''"
        >
          <span class="date-number">{{ date.day }}</span>
          <span v-if="date.isHoliday" class="holiday-indicator">•</span>
        </div>
      </div>
    </div>

    <!-- Holiday list -->
    <div v-if="currentMonthHolidays.length > 0" class="holiday-list">
      <h6 class="holiday-list-title">Holidays This Month</h6>
      <div v-for="holiday in currentMonthHolidays" :key="holiday.id" class="holiday-item">
        <span class="holiday-date">{{ formatHolidayDate(holiday.date) }}</span>
        <span class="holiday-name">{{ holiday.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HolidayCalendar',
  props: {
    holidays: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentDate: new Date(),
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  },
  computed: {
    currentMonthYear() {
      const options = { month: 'long', year: 'numeric' }
      return this.currentDate.toLocaleDateString('en-US', options)
    },
    calendarDates() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      
      // First day of the month
      const firstDay = new Date(year, month, 1)
      const firstDayWeek = firstDay.getDay()
      
      // Last day of the month
      const lastDay = new Date(year, month + 1, 0)
      const lastDate = lastDay.getDate()
      
      // Previous month's last date
      const prevLastDay = new Date(year, month, 0)
      const prevLastDate = prevLastDay.getDate()
      
      const dates = []
      const today = new Date()
      
      // Previous month dates
      for (let i = firstDayWeek - 1; i >= 0; i--) {
        const day = prevLastDate - i
        dates.push({
          day,
          isCurrentMonth: false,
          isToday: false,
          isHoliday: false,
          isWeekend: false,
          holidayName: null,
          fullDate: new Date(year, month - 1, day)
        })
      }
      
      // Current month dates
      for (let day = 1; day <= lastDate; day++) {
        const date = new Date(year, month, day)
        const dayOfWeek = date.getDay()
        const isToday = date.toDateString() === today.toDateString()
        const holidayInfo = this.getHolidayInfo(date)
        
        dates.push({
          day,
          isCurrentMonth: true,
          isToday,
          isHoliday: holidayInfo.isHoliday,
          isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
          holidayName: holidayInfo.name,
          fullDate: date
        })
      }
      
      // Next month dates
      const remainingDays = 42 - dates.length // 6 rows x 7 days
      for (let day = 1; day <= remainingDays; day++) {
        dates.push({
          day,
          isCurrentMonth: false,
          isToday: false,
          isHoliday: false,
          isWeekend: false,
          holidayName: null,
          fullDate: new Date(year, month + 1, day)
        })
      }
      
      return dates
    },
    currentMonthHolidays() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      
      return this.holidays.filter(holiday => {
        const holidayDate = new Date(holiday.date)
        return holidayDate.getFullYear() === year && holidayDate.getMonth() === month
      }).sort((a, b) => new Date(a.date) - new Date(b.date))
    }
  },
  methods: {
    getHolidayInfo(date) {
      const holiday = this.holidays.find(h => {
        const holidayDate = new Date(h.date)
        return holidayDate.toDateString() === date.toDateString()
      })
      
      return {
        isHoliday: !!holiday,
        name: holiday ? holiday.name : null
      }
    },
    previousMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      )
    },
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      )
    },
    formatHolidayDate(date) {
      const d = new Date(date)
      const options = { day: 'numeric', month: 'short' }
      return d.toLocaleDateString('en-US', options)
    }
  }
}
</script>

<style scoped>
.holiday-calendar-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  max-width: 400px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.current-month {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.nav-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #6c757d;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn svg {
  width: 16px;
  height: 16px;
}

.nav-btn:hover {
  color: #2c3e50;
}

.calendar-body {
  margin-bottom: 0.75rem;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.weekday {
  text-align: center;
  font-weight: 600;
  color: #6c757d;
  font-size: 0.7rem;
  padding: 0.25rem 0;
}

.calendar-dates {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
}

.calendar-date {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  font-size: 0.75rem;
  min-height: 32px;
}

.calendar-date:hover {
  background-color: #f8f9fa;
}

.date-number {
  font-weight: 500;
}

.calendar-date.other-month {
  color: #adb5bd;
}

.calendar-date.today {
  background-color: #0d6efd;
  color: white;
  font-weight: 600;
}

.calendar-date.today:hover {
  background-color: #0b5ed7;
}

.calendar-date.holiday {
  background-color: #fee;
  color: #dc3545;
  font-weight: 600;
}

.calendar-date.holiday:hover {
  background-color: #fdd;
}

.calendar-date.weekend:not(.holiday):not(.today) {
  color: #6c757d;
}

.holiday-indicator {
  position: absolute;
  bottom: 1px;
  font-size: 1rem;
  color: #dc3545;
}

.holiday-list {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.holiday-list-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.holiday-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4rem;
  margin-bottom: 0.4rem;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.holiday-date {
  font-weight: 600;
  color: #dc3545;
  min-width: 50px;
  font-size: 0.75rem;
}

.holiday-name {
  color: #495057;
  font-size: 0.75rem;
}

/* Responsive */
@media (max-width: 768px) {
  .holiday-calendar-card {
    padding: 0.75rem;
    max-width: 100%;
  }
  
  .current-month {
    font-size: 0.95rem;
  }
  
  .calendar-date {
    font-size: 0.7rem;
    min-height: 28px;
  }
  
  .weekday {
    font-size: 0.65rem;
  }
}
</style>
