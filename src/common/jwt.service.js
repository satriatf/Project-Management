import axios from 'axios'

const ID_TOKEN_KEY = 'token'
const ID_REFRESH_TOKEN_KEY = 'refresh_token'

export const getToken = () => {
  return window.sessionStorage.getItem(ID_TOKEN_KEY)
}
export const getRefreshToken = ()=>{
  return window.sessionStorage.getItem(ID_REFRESH_TOKEN_KEY)
}

export const saveToken = token => {
  console.log('💾 JWT Service - Saving token to sessionStorage:', token ? `${token.substring(0, 50)}...` : 'null');
  window.sessionStorage.setItem(ID_TOKEN_KEY, token)
  
  // UPDATE AXIOS DEFAULT HEADER
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
  
  console.log('💾 JWT Service - Token saved. Verifying...');
  const saved = window.sessionStorage.getItem(ID_TOKEN_KEY)
  console.log('💾 JWT Service - Verification:', saved ? 'SUCCESS' : 'FAILED');
}

export const saveRefreshToken = token => {
  window.sessionStorage.setItem(ID_REFRESH_TOKEN_KEY, token)
}

export const destroyToken = () => {
  window.sessionStorage.removeItem(ID_TOKEN_KEY)
  delete axios.defaults.headers.common['Authorization']
}
export const destroyRefreshToken = () => {
  window.sessionStorage.removeItem(ID_REFRESH_TOKEN_KEY)
}


export default { getToken, saveToken, destroyToken,saveRefreshToken,getRefreshToken,destroyRefreshToken }
