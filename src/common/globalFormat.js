import { formatDateTime } from '@/common/format/formatDateTime.js'

export default {
  methods: {
    $formatWaktu(date) {
      return formatDateTime(date)
    }
  }
}
