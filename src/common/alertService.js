import Swal from 'sweetalert2'

export default {
  /** -------------------------------------------------------------- Start ALERT -----------------------------------------------
   * Alert dengan konten dinamis
   * @param {string} options.title - Judul alert
   * @param {string} options.text - Isi teks utama
   * @param {string} options.type - Tipe ('success', 'error', 'warning', 'info')
   * @param {string} options.confirmText - Teks tombol konfirmasi
   * @param {string} options.image - URL gambar khusus (opsional)
   * @param message
   * @param type
   * @param button

    Cara Pengunaan Alert
    alertService.alert(response.data.message, 'error')
   */

  alert(message = 'Terjadi Kesalahan yang tidak diketahui!', type = 'success', button = 'Tutup',) {
    let title;

    if (type === 'success') {
      title = 'Yeayy!';
    } else if (type === 'error') {
      title = 'Oops!';
    } else {
      title = 'Oops!';
    }
    Swal.fire({
      imageUrl: `/img/${type}.png`,
      imageHeight: 100,
      title: title,
      text: message,
      confirmButtonColor: '#FFDD00',
      confirmButtonText: button
    })
  },



  /** --------------------------------------------------------------------------- Start alert confirm ----------------------------------------------------------------------------------
   * Konfirmasi dengan konten dinamis
   * @param {Object} options
   * @param {string} options.text - Pertanyaan utama
   * @param {string} options.title - Judul alert
   * @param {string} options.confirmText - Teks tombol konfirmasi
   * @param {string} options.cancelText - Teks tombol batal
   * @param {string} options.image - Gambar khusus (opsional)
   */
  /**
   *
   * CARA PENGUNAAN
   *      const confirmed = await alertService.confirm({
   *         message: 'Apakah Anda Ingin Pindah Lokasi?',
   *         confirmText: 'Pindah',
   *         cancelText: 'Batal',
   *         image: 'warning'
   *       });
   *       if(confirmed){
   *
   *       }
   *
   **/
  async confirm({
                  message = 'Apakah anda yakin mengirim proposal ini?',
                  confirmText = 'Kirim',
                  cancelText = 'Batal',
                  image = 'warning'
                } = {}) {
    const titleMap = {
      success: 'Yeayy!',
      error: 'Oops!',
      warning: 'Oops!'
    };

    const swalOptions = {
      text: message,
      imageUrl: `/img/${image}.png`,
      imageHeight: 100,
      confirmButtonColor: '#fddb00',
      cancelButtonColor: '#F04438',
      showCancelButton: true,
      cancelButtonText: cancelText,
      confirmButtonText: confirmText,
      title: titleMap[image] || '' // hanya pakai title jika image cocok
    };

    const result = await Swal.fire(swalOptions);
    return result.isConfirmed;
  },






  /** ---------------------- ------------------------------------------------Start alert function ----------------------------------------------------------------------------------
 *  CARA PENGUNAAN ALERT FUNCTION
 * alertService.alertFunction({
 *   title: 'Konfirmasi',
 *   text: 'Apakah kamu yakin?',
 *   image: 'warning',
 *   confirmText: 'Lanjut',
 *   onConfirm: () => {
 *     console.log('Dijalankan, walaupun klik batal atau ok')
 *   }
 * })

 **/
  alertFunction({
                  message = 'Terjadi Kesalahan yang tidak diketahui!',
                  image = 'error',
                  confirmText = 'Keluar',
                  confirmColor = '#FDDB00',
                  onConfirm = null
                } = {}) {
    let title;
    if (image === 'success') {
      title = 'Yeayy!';
    } else if (image === 'error') {
      title = 'Oops!';
    } else {
      title = 'Oops!';
    }

    return Swal.fire({
      imageUrl: `/img/${image}.png`,
      imageHeight: 100,
      title: title,
      text: message,
      confirmButtonColor: confirmColor,
      confirmButtonText: confirmText
    }).then((result) => {
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    });
  }

}
