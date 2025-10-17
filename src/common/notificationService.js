// Notification Helper using SweetAlert2
import Swal from 'sweetalert2'

export const showSuccessNotification = (message, title = 'Success!') => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#ffc107',
    timer: 3000,
    timerProgressBar: true,
    position: 'top-end',
    toast: true,
    showConfirmButton: false
  })
}

export const showErrorNotification = (message, title = 'Error!') => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#dc3545',
    position: 'top-end',
    toast: true,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false
  })
}

export const showInfoNotification = (message, title = 'Info') => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'info',
    confirmButtonText: 'OK',
    confirmButtonColor: '#0dcaf0',
    position: 'top-end',
    toast: true,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false
  })
}

export const showWarningNotification = (message, title = 'Warning!') => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    confirmButtonText: 'OK',
    confirmButtonColor: '#ffc107',
    position: 'top-end',
    toast: true,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false
  })
}

export const showDeleteConfirmation = (itemName, onConfirm) => {
  Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to delete "${itemName}"? This action cannot be undone!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm()
    }
  })
}
