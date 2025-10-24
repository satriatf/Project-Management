import { createApp,ref  } from 'vue'
import App from './App.vue'
import router from './router'
import ApiService from '@/common/api.service'
import store from './store'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'vue-multiselect/dist/vue-multiselect.css'

import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import '../public/bootstrap/js/bootstrap.bundle.min.js'
import GlobalLoading from '@/includes/loading.vue'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// permission
import permissionDirective from "@/directives/permission";
const app = createApp(App)
import ToastPlugin from 'vue-toast-notification';
// Import one of the available themes

import 'vue-toast-notification/dist/theme-bootstrap.css';
import { CALL_SERVICE_ASYNC } from '@/store/actions.type.js'
import alertService from '@/common/alertService.js'
import { SessionService } from '@/common/cookieSession.js'
import Cookies from 'js-cookie'
import  globalFormat  from '@/common/globalFormat.js'
import userService from '@/common/user.service.js'
// Buat ref untuk loading instance

const loadingRef = ref(null)

app.config.globalProperties.$loading = {
  show: () => loadingRef.value?.show(),
  hide: () => loadingRef.value?.hide()
}

app.provide('loadingRef', loadingRef)


// Mount App
// Initialize API service (Axios baseURL, interceptors)
ApiService.init(app)

app.mixin(globalFormat)
app.use(ToastPlugin);
app.component('GlobalLoading', GlobalLoading)
app.use(router)
app.use(store)
app.use(VueSweetalert2)
app.component('EasyDataTable', Vue3EasyDataTable);
app.directive("permission", permissionDirective);
app.mount('#app')

// DISABLED FOR DEVELOPMENT - Enable untuk production
// document.addEventListener('contextmenu', (e) => e.preventDefault()) // Nonaktifkan klik kanan
// document.addEventListener('keydown', (e) => {
//   if (
//     e.key === 'F12' ||
//     (e.ctrlKey && e.shiftKey && e.key === 'I') ||
//     (e.ctrlKey && e.shiftKey && e.key === 'J') ||
//     (e.ctrlKey && e.key === 'U')
//   ) {
//     e.preventDefault()
//   }
// })

const showIdlePopup = () => {
  let countdown = 240
  app.config.globalProperties.$swal({
    title: 'Activity',
    html: `Session anda telah berakhir!<br>
         <b>Anda tidak bisa melanjutkan session anda dalam 
         <span id="countdown">${countdown}</span> detik</b>`,
    icon: 'warning',
    confirmButtonText: 'Logout',
    cancelButtonText: 'Lanjut',
    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonColor: '#F04438',
    cancelButtonColor: '#fddb00',
    didOpen: () => {
      const cancelBtn = Swal.getCancelButton()
      cancelBtn.disabled = false

      const timer = setInterval(() => {
        countdown--
        const countdownEl = document.getElementById('countdown')
        if (countdownEl) countdownEl.textContent = countdown

        if (countdown <= 0) {
          clearInterval(timer)
          cancelBtn.disabled = true
          countdownEl.textContent = '0'
        }
      }, 1000)
    }
  }).then((result) => {
    if (result.isConfirmed) {
      doLogout()
    } else {
      alreadyLoggedOut = false
      idleTime = 0
      SessionService.destroy()
    }
  })
}

// Fungsi logout
const doLogout = () => {
  // 🛑 reset semua flag supaya popup tidak muncul lagi
  alreadyLoggedOut = false
  idleTime = 0
  Cookies.remove("idleTime")
  Cookies.remove("alreadyLoggedOut")
  SessionService.destroy()

  app.config.globalProperties.$loading.show()
  app.config.globalProperties.$store
    .dispatch(CALL_SERVICE_ASYNC, {
      token: userService.getToken('token'),
      url: `${import.meta.env.VITE_BASE_URL_LOGIN}${import.meta.env.VITE_AUTH_LOGOUT}`,
      body: { nik: userService.getNik() }
    })
    .then(() => {
      sessionStorage.clear()
      app.config.globalProperties.$router.push({ name: 'login' }).then(() => {
        window.location.reload()
      })
    })
    .catch((error) => {
      alertService.alert(error?.data?.message || error, 'error')
    })
    .finally(() => {
      app.config.globalProperties.$loading.hide()
    })
}


const IDLE_2_MIN = 120    // 2 menit = 120 detik
const IDLE_20_MIN = 1000  // 20 menit = 1200 detik

let idleTime = Number(Cookies.get("idleTime")) || 0
let alreadyLoggedOut = Cookies.get("alreadyLoggedOut") === "true"

// ✅ Kalau setelah refresh status logout sudah true → langsung munculkan popup
if (alreadyLoggedOut) {
  showIdlePopup()
}

// Reset idle timer kalau ada aktivitas
function resetIdleTimer() {
  if (alreadyLoggedOut) return

  idleTime = 0
  Cookies.remove("idleTime")
  Cookies.remove("alreadyLoggedOut")
  SessionService.destroy()
}

// Cek idle tiap detik
function checkIdleTime() {
  if (router.currentRoute.value.path === "/login" || alreadyLoggedOut) return

  idleTime++
  Cookies.set("idleTime", idleTime, { expires: 1 / 24 }) // expired 1 jam

  // idle 2 menit → set session (sekali saja)
  if (idleTime === IDLE_2_MIN && !SessionService.get()) {
    SessionService.set({ loginDate: Date.now() })
  }

  // idle 20 menit → tampilkan popup
  const savedSession = SessionService.get()
  if (savedSession) {
    const diffSec = Math.floor((Date.now() - savedSession.loginDate) / 1000)
    if (diffSec >= IDLE_20_MIN) {
      alreadyLoggedOut = true
      Cookies.set("alreadyLoggedOut", "true", { expires: 1 / 24 })
      showIdlePopup()
    }
  }
}


// Event listener aktivitas
['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'].forEach((event) => {
  window.addEventListener(event, resetIdleTimer)
})

// Jalankan cek tiap detik
setInterval(checkIdleTime, 1000)



export default app
