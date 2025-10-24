import Swal from 'sweetalert2'

/**
 * Show success notification
 * @param {string} message - Success message to display
 * @param {string} title - Title of the notification (optional)
 */
export const showSuccessNotification = (message = 'Operation completed successfully!', title = 'Success!') => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonColor: '#FFDD00',
    confirmButtonText: 'OK',
    timer: 3000,
    timerProgressBar: true
  })
}

/**
 * Show error notification
 * @param {string} message - Error message to display
 * @param {string} title - Title of the notification (optional)
 */
export const showErrorNotification = (message = 'An error occurred!', title = 'Error!') => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonColor: '#FFDD00',
    confirmButtonText: 'OK'
  })
}

/**
 * Show info notification
 * @param {string} message - Info message to display
 * @param {string} title - Title of the notification (optional)
 */
export const showInfoNotification = (message = 'Information', title = 'Info') => {
  Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    confirmButtonColor: '#FFDD00',
    confirmButtonText: 'OK',
    timer: 3000,
    timerProgressBar: true
  })
}

/**
 * Show warning notification
 * @param {string} message - Warning message to display
 * @param {string} title - Title of the notification (optional)
 */
export const showWarningNotification = (message = 'Warning!', title = 'Warning') => {
  Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    confirmButtonColor: '#FFDD00',
    confirmButtonText: 'OK'
  })
}

/**
 * Show delete confirmation dialog
 * @param {string} message - Confirmation message
 * @param {string} title - Title of the dialog (optional)
 * @returns {Promise} - Promise that resolves with the user's choice
 */
export const showDeleteConfirmation = (
  message = 'Are you sure you want to delete this item?',
  title = 'Delete Confirmation'
) => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })
}

/**
 * Show general confirmation dialog
 * @param {string} message - Confirmation message
 * @param {string} title - Title of the dialog (optional)
 * @param {string} confirmText - Text for confirm button (optional)
 * @param {string} cancelText - Text for cancel button (optional)
 * @returns {Promise} - Promise that resolves with the user's choice
 */
export const showConfirmation = (
  message = 'Are you sure?',
  title = 'Confirmation',
  confirmText = 'Yes',
  cancelText = 'Cancel'
) => {
  return Swal.fire({
    icon: 'question',
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: '#FFDD00',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText
  })
}

/**
 * Show loading notification
 * @param {string} message - Loading message to display
 * @param {string} title - Title of the notification (optional)
 */
export const showLoadingNotification = (message = 'Please wait...', title = 'Loading') => {
  Swal.fire({
    title: title,
    text: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })
}

/**
 * Close any open Swal notification
 */
export const closeNotification = () => {
  Swal.close()
}

export default {
  showSuccessNotification,
  showErrorNotification,
  showInfoNotification,
  showWarningNotification,
  showDeleteConfirmation,
  showConfirmation,
  showLoadingNotification,
  closeNotification
}
