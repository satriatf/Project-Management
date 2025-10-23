// Simple date formatting function
function formatDateTime(date) {
  if (!date) return '-'
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(date).toLocaleDateString('en-US', options)
}

export default {
  methods: {
    $formatWaktu(date) {
      return formatDateTime(date)
    }
  }
}
