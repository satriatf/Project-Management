/* eslint-disable */
import ApiService from '@/common/api.service'
import JwtService from '@/common/jwt.service'
import USertService from '@/common/user.service'
import MenuService from '@/common/menu.service'
import axios from 'axios'
import { API_CONFIG } from '@/config/database.js'
import {
  LOGIN,
  LOGOUT,
  CHECK_AUTH,
  CALL_SERVICE_ASYNC,
  CALL_SERVICE_ASYNC_SUBMIT,
  CALL_SERVICE_ASYNC_UPLOAD,
  REFRESH_TOKEN,
  CALL_SERVICE_ASYNC_GET,
  CALL_SERVICE_ASYNC_DELETE,
  CALL_SERVICE_ASYNC_UPDATE, CALL_SERVICE_ASYNC_GET_BLOP
} from '@/store/actions.type'
import {
  SET_AUTH,
  PURGE_AUTH,
  SET_ERROR,
  GET_RESPON,
  SET_REFRESH_TOKEN
} from '@/store//mutations.type'
import userService from '@/common/user.service.js'

const state = {
  error: null,
  user: {},
  parameters: [],
  isAuthenticated:   userService.getUserLocation().length > 0 && userService.getUserPosition().length > 0,
  result: null
}

const mutations = {
  [SET_ERROR](state, error) {
    state.error = error
  },
  [GET_RESPON](state, data) {
    state.result = data
  },
  [SET_AUTH](state, user) {
    state.isAuthenticated = true
    state.user = user
    state.error = {}
    
    // Save token (encrypted is OK for token)
    JwtService.saveToken(state.user.data.accessToken)
    if (state.user.data.refreshToken) {
      JwtService.saveRefreshToken(state.user.data.refreshToken)
    }
    
    // DON'T save user data with encryption - Login.vue already saved to plain sessionStorage
    // User data (nama, nik, role) already saved by Login.vue as plain text
    
    // Menu
    MenuService.saveMenuActivePage('Master_Budget')
    MenuService.saveMenuIndex(0)
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false
    state.user = {}
    state.errors = {}
    JwtService.destroyToken()
    JwtService.destroyRefreshToken()
    USertService.destroyNama()
    USertService.destroyNik()
    USertService.destroyRole()
    MenuService.destroyMenu()
    MenuService.destroyActivePage()
    MenuService.destroyActiveIndex()
  },
  [SET_REFRESH_TOKEN](state, user) {
    JwtService.saveToken(state.user.data.accessToken)
    JwtService.saveRefreshToken(state.user.data.refreshToken)
  }
}

const getters = {
  currentUser(state) {
    return state.user
  },
  isAuthenticated(state) {
    return state.isAuthenticated
  },
  error(state) {
    return state.error
  }
}

const actions = {
  [LOGIN](context, credentials) {
    return new Promise((resolve, reject) => {
      // Call backend auth login
      const url = credentials?.url || (import.meta.env.VITE_BASE_URL_LOGIN + import.meta.env.VITE_AUTH_LOGIN)
      console.log('📡 AUTH STORE - Calling login API:', { url, email: credentials.body?.email });
      
      ApiService.post(url, credentials.body)
        .then(({ data }) => {
          console.log('📡 AUTH STORE - Login response received:', data);
          console.log('📡 AUTH STORE - Data structure:', JSON.stringify(data, null, 2));
          
          // Expecting backend to return { status, token, user }
          if (data && data.token) {
            // Normalize payload to Vuex state shape
            const payload = { 
              data: { 
                accessToken: data.token, 
                refreshToken: null, 
                nama: data.user?.employeeName || 'User', 
                nik: String(data.user?.employeeNik || ''), 
                role: data.user?.level || 'Staff' 
              } 
            }
            console.log('📡 AUTH STORE - Committing SET_AUTH with payload:', JSON.stringify(payload, null, 2));
            
            // Commit auth state FIRST before resolving
            context.commit(SET_AUTH, payload)
            console.log('📡 AUTH STORE - SET_AUTH committed successfully');
            
            // Check if token was saved
            const savedToken = JwtService.getToken()
            console.log('📡 AUTH STORE - Token saved to sessionStorage:', savedToken ? 'YES' : 'NO');
            console.log('📡 AUTH STORE - Token value:', savedToken);
            
            // Save response for result getter
            context.commit(GET_RESPON, data)
            
            // Resolve with NORMALIZED response that Login.vue expects
            const normalizedResponse = {
              status: data.status,
              token: data.token,
              user: data.user,
              // Also include normalized data for compatibility
              data: payload.data
            }
            console.log('📡 AUTH STORE - Resolving with normalized response:', normalizedResponse);
            resolve(normalizedResponse)
          } else {
            console.warn('📡 AUTH STORE - Response missing token:', data);
            reject({ message: 'Invalid response from server' })
          }
        })
        .catch((error) => {
          console.error('📡 AUTH STORE - Login error:', error);
          console.error('📡 AUTH STORE - Error response:', error?.response);
          console.error('📡 AUTH STORE - Error data:', error?.response?.data);
          
          // Handle error properly
          const response = error?.response
          if (!response?.data?.message){
            const errorResponse = {
              ...error,
              data: {
                ...response?.data,
                message: response?.data?.message || "Email atau password salah!"
              }
            };
            reject(errorResponse)
          }else{
            reject(error)
          }
        })
    })
  },
  [LOGOUT](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader()
      ApiService.post(credentials.url, credentials.body)
        .then(({ data }) => {
          context.commit(GET_RESPON, data)
          resolve(data)
        })
        .catch(({ response }) => {
          if (!response?.data?.message){
            const errorResponse = {
              ...response,
              data: {
                ...response?.data,
                message: response?.data?.message || "Sistem Sedang offline. dimohon menuggu beberapa saat lagi!"
              }
            };
            reject(errorResponse)
          }else{
            reject(response)
          }
        })
    })
  },
  [REFRESH_TOKEN](context, credentials) {
    return new Promise((resolve, reject) => {
      axios
        .post(API_CONFIG.loginURL + API_CONFIG.refreshToken, {
          access_token: localStorage.getItem('token'),
          refresh_token: localStorage.getItem('refresh_token')
        })
        .then(({ data }) => {
          context.commit(SET_REFRESH_TOKEN, data)
          resolve(data)
        })
        .catch(({ response }) => {
          if (!response?.data?.message){
            const errorResponse = {
              ...response,
              data: {
                ...response?.data,
                message: response?.data?.message || "Sistem Sedang offline. dimohon menuggu beberapa saat lagi!"
              }
            };
            reject(errorResponse)
          }else{
            reject(response)
          }
        })
    })
  },
  [CHECK_AUTH](context) {
    if (JwtService.getToken()) {
      ApiService.setHeader()
    } else {
      context.commit(PURGE_AUTH)
    }
  },
  [CALL_SERVICE_ASYNC](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader()
      ApiService.post(credentials.url, credentials.body)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(({ response }) => {
          if (!response?.data?.message){
            const errorResponse = {
              ...response,
              data: {
                ...response?.data,
                message: response?.data?.message || "Sistem Sedang offline. dimohon menuggu beberapa saat lagi!"
              }
            };
            reject(errorResponse)
          }else{
            reject(response)
          }
        })
    })
  },
  [CALL_SERVICE_ASYNC_GET](context, credentials) {
    //gunakan, jika data response dibutuhkan
    return new Promise((resolve, reject) => {
      // ApiService.setCROSS()
      ApiService.setHeader()
      ApiService.get(credentials.url, credentials.body)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(({ response }) => {
          if (!response?.data?.message){
            const errorResponse = {
              ...response,
              data: {
                ...response?.data,
                message: response?.data?.message || "Sistem Sedang offline. dimohon menuggu beberapa saat lagi!"
              }
            };
            reject(errorResponse)
          }else{
            reject(response)
          }
        })
    })
  },
  [CALL_SERVICE_ASYNC_GET_BLOP](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      // Menentukan responseType 'blob' jika diminta dalam credentials
      const config = credentials.responseType === 'blob' ? { responseType: 'blob' } : {};
      ApiService.get(credentials.url, credentials.body, config)
        .then(({ data }) => {
          if (credentials.responseType === 'blob') {
            // Jika format blob, buat URL Object agar bisa digunakan di frontend
            const fileURL = URL.createObjectURL(data);
            resolve(fileURL);
          } else {
            resolve(data);
          }
        })
        .catch(({ response }) => {
          const errorResponse = {
            ...response,
            data: {
              ...response?.data,
              message: response?.data?.message || "Sistem Sedang offline. dimohon menuggu beberapa saat lagi!"
            }
          };
          reject(errorResponse);
        });
    });
  },

  [CALL_SERVICE_ASYNC_SUBMIT](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader()
      ApiService.post(credentials.url, credentials.body)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(({ response }) => {
          if (!response?.data?.message){
            const errorResponse = {
              ...response,
              data: {
                ...response?.data,
                message: response?.data?.message || "Sistem Sedang offline. dimohon menuggu beberapa saat lagi!"
              }
            };
            reject(errorResponse)
          }else{
            reject(response)
          }
        })
    })
  },
  [CALL_SERVICE_ASYNC_UPLOAD](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader()
      ApiService.post(credentials.url, credentials.body, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(({ data }) => {
          resolve(data)
        })
        .catch(({ response }) => {
          if (!response?.data?.message){
            const errorResponse = {
              ...response,
              data: {
                ...response?.data,
                message: response?.data?.message || "Sistem Sedang offline. dimohon menuggu beberapa saat lagi!"
              }
            };
            reject(errorResponse)
          }else{
            reject(response)
          }
        })
    })
  },
  [CALL_SERVICE_ASYNC_DELETE](context, credentials) {
    //gunakan, jika data response dibutuhkan
    return new Promise((resolve, reject) => {
      ApiService.setHeader()
      ApiService.delete(credentials.url, credentials.body)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(({ response }) => {
          if (!response?.data?.message){
            const errorResponse = {
              ...response,
              data: {
                ...response?.data,
                message: response?.data?.message || "Sistem Sedang offline. dimohon menuggu beberapa saat lagi!"
              }
            };
            reject(errorResponse)
          }else{
            reject(response)
          }
        })
    })
  },
  [CALL_SERVICE_ASYNC_UPDATE](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader()
      ApiService.put(credentials.url, credentials.body)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(({ response }) => {
          if (!response?.data?.message){
            const errorResponse = {
              ...response,
              data: {
                ...response?.data,
                message: response?.data?.message || "Sistem Sedang offline. dimohon menuggu beberapa saat lagi!"
              }
            };
            reject(errorResponse)
          }else{
            reject(response)
          }
        })
    })
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
