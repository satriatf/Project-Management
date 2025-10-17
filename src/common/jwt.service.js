const ID_TOKEN_KEY = 'token'
const ID_REFRESH_TOKEN_KEY = 'refresh_token'

export const getToken = () => {
  return window.sessionStorage.getItem(ID_TOKEN_KEY)
}
export const getRefreshToken = ()=>{
  return window.sessionStorage.getItem(ID_REFRESH_TOKEN_KEY)
}

export const saveToken = token => {
  window.sessionStorage.setItem(ID_TOKEN_KEY, token)
}

export const saveRefreshToken = token => {
  window.sessionStorage.setItem(ID_REFRESH_TOKEN_KEY, token)
}

export const destroyToken = () => {
  window.sessionStorage.removeItem(ID_TOKEN_KEY)
}
export const destroyRefreshToken = () => {
  window.sessionStorage.removeItem(ID_REFRESH_TOKEN_KEY)
}


export default { getToken, saveToken, destroyToken,saveRefreshToken,getRefreshToken,destroyRefreshToken }
