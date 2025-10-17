export function formatDateTime(dateString) {
  if (!dateString) return '-' // cek null, undefined, atau kosong

  const dateObj = new Date(dateString)
  if (isNaN(dateObj)) return '-' // cek invalid date

  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()

  let hours = dateObj.getHours()
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'

  hours = hours % 12 || 12

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`
}
