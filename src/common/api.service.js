import axios from 'axios'
import VueAxios from 'vue-axios'
import JwtService from '@/common/jwt.service'
import app from '@/main'
import store from '@/store/index.js'
import { REFRESH_TOKEN } from '@/store/actions.type.js'
import userService from '@/common/user.service.js'
import { API_CONFIG } from '@/config/database.js'
/* eslint-disable */
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token)
    } else {
      prom.reject(error)
    }
  })
  failedQueue = []
}
function handleRefreshTokenFailure() {
  app.config.globalProperties.$swal({
    title: 'Session Expired',
    text: 'Session Anda Telah Habis. Silahkan login kembali.',
    icon: 'warning',
    showCancelButton: false, // Tidak menampilkan tombol "Cancel"
    confirmButtonText: 'Login',
    allowOutsideClick: false, // Mencegah pengguna menutup alert dengan klik di luar
  }).then(() => {
    sessionStorage.removeItem('sidebarMenus');
    sessionStorage.removeItem('nik');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('nama');

    app.config.globalProperties.$router.push({ name: 'login' }).then(() => {
      window.location.reload();
    });
  });
}

const ApiService = {
  init(app) {
    app.use(VueAxios, axios)
    // Configure base URL for PostgreSQL backend using environment variables
    app.axios.defaults.baseURL = API_CONFIG.baseURL
    axios.defaults.timeout = API_CONFIG.timeout;
    axios.defaults.headers.common = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    this.setInterceptors()
  },

  setInterceptors() {
    axios.interceptors.response.use(
      (response) => {
        return response // Proceed with the response if no issues
      },
      async (error) => {
        const originalRequest = error.config
        if (error.response.config.url.includes('auth/login')) {
          return Promise.reject(error);
        }
        // Check if the error is 401 Unauthorized and the request hasn't been retried
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          if (
            error.response.config.url ===
            `${import.meta.env.VITE_BASE_URL_LOGIN}${import.meta.env.VITE_REFRESH_TOKEN}`
          ) {
            handleRefreshTokenFailure.call(this)
          }

          if (!isRefreshing) {
            isRefreshing = true
            try {
              // Request refresh token from the API
              const newTokens = await store.dispatch(REFRESH_TOKEN)

              // Update tokens in the header
              JwtService.saveToken(newTokens.data.accesstoken)
              JwtService.saveRefreshToken(newTokens.data.refreshtoken)
              axios.defaults.headers.common['Authorization'] = `${newTokens.data.access_token}`

              // Process the queued requests with the new token
              processQueue(null, newTokens.data.access_token)

              // Retry the original failed request
              return axios(originalRequest)
            } catch (err) {
              processQueue(err, null)
              return Promise.reject(err)
            } finally {
              isRefreshing = false
            }
          } else {
            // Queue the failed requests while refresh is in progress
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then((token) => {
                originalRequest.headers['Authorization'] = `${token}`
                return axios(originalRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }
        }
        // For any other errors, return the error as it is
        return Promise.reject(error)
      }
    )
  },


  setHeader(nik) {
    const headers = {
      key: `${JwtService.getToken()}`,
      // 'Content-Security-Policy': "script-src 'self' js.example.com",
      // 'X-Frame-Options': 'SAMEORIGIN',
      // 'X-Content-Type-Options': 'nosniff',
      // 'Strict-Transport-Security': 'max-age=16070400; includeSubDomains',
      // 'X-Permitted-Cross-Domain-Policies': 'none',
      // 'Referrer-Policy': 'no-referrer',
      // 'Content-Security-Policy': "style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none';",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=31536000',
      'Referrer-Policy': 'no-referrer',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'sourceType': 'WEB',
      'sourceVersion':import.meta.env.VITE_VERSION,
      'createdBy': userService.getNik() ?? nik.nik
    };
    Object.keys(headers).forEach((key) => {
      app.axios.defaults.headers.common[key] = headers[key];
    });
  },
  setCROSS() {
    app.axios.defaults.headers.common['Access-Control-Allow-Origin'] = true
  },

  setHeaderAuth(credentials) {
    app.axios.defaults.headers.common['Authorization'] = `Bearer ${credentials}`
  },

  setHeaderDownload() {
    app.axios.defaults.headers.common['responseType'] = 'blob'
  },

  query(resource, params) {
    return app.axios.get(resource, params).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`)
    })
  },

  get(resource, slug) {
    return app.axios.get(`${resource}`).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`)
    })
  },

  stream(resource) {
    return axios.get(resource, { responseType: 'stream' }).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`)
    })
  },

  get1(resource, slug) {
    return app.axios.get(`${resource}/${slug}`).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`)
    })
  },

  get2(resource, slug) {
    return app.axios.get(`${resource}=${slug}`).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`)
    })
  },

  get3(resource) {
    return app.axios.get(`${resource}`).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`)
    })
  },

  // get( resource, params) {
  //   return app.axios.get(`${resource}`, params).catch(error => {
  //     throw new Error(`[RWV] ApiService ${error}`);
  //   });
  // },

  post(resource, params) {
    return app.axios.post(`${resource}`, params)
  },

  update(resource, slug, params) {
    return app.axios.put(`${resource}/${slug}`, params)
  },

  put(resource, params) {
    return app.axios.put(`${resource}`, params)
  },
  delete(resource) {
    return app.axios.delete(`${resource}`)
  }
  // delete(resource) {
  //   return app.axios.delete(`${resource}`).catch((error) => {
  //     throw new Error(`[RWV] ApiService ${error}`)
  //   })
  // }
}

// Interceptor untuk menangani error
// ApiService.axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       // Jika ada response dari server
//       if (error.response.status === 404) {
//         router.push({ name: 'ErrorPage', params: { message: 'Page not found' } })
//       } else if (error.response.status === 500) {
//         router.push({ name: 'ErrorPage', params: { message: 'Internal server error' } })
//       }
//     } else {
//       // Jika tidak ada response (koneksi gagal atau masalah jaringan)
//       router.push({ name: 'ErrorPage', params: { message: 'Server connection lost' } })
//     }
//     return Promise.reject(error)
//   }
// )

export default ApiService
