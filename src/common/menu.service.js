import CryptoJS from 'crypto-js'

// Simple encryption/decryption functions
const SECRET_KEY = import.meta.env.VITE_SALT || 'default_salt'

function encryptData(data) {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString()
}

function decryptData(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}

const ID_MENU_KEY = 'sidebarMenus'
const ID_MENU_ACTIVE = 'activePage'
const ID_MENU_INDEX = 'index'
const ID_SUBMENU_ACTIVE = 'subActivePage' // <== perbaikan untuk hindari duplikasi key
const ID_SUBMENU_INDEX = 'subActiveIndex'
const ID_CURRENT_PAGE = 'currentPage'
const ID_PARAMETER_ACTIVE_PAGE = 'parameterCurrentPage'

/**
 * Mendapatkan item dari sessionStorage dan mendekripsinya.
 * @param {string} key - Key penyimpanan.
 * @param {boolean} [isJSON=false] - Apakah data perlu di-parse sebagai JSON.
 * @returns {any} Nilai data hasil dekripsi atau null.
 */
function getDecryptedItem(key, isJSON = false) {
  try {
    const item = window.sessionStorage.getItem(key)
    if (!item) return isJSON ? [] : null

    const decrypted = decryptData(item)
    if (!decrypted) return isJSON ? [] : null

    return isJSON ? JSON.parse(decrypted) : decrypted
  } catch (error) {
    console.error(`Error decrypting session item for key "${key}":`, error)
    return isJSON ? [] : null
  }
}

/**
 * Mengenkripsi dan menyimpan item ke sessionStorage.
 * @param {string} key - Key penyimpanan.
 * @param {any} value - Nilai yang akan disimpan.
 * @param {boolean} [isJSON=false] - Apakah perlu diserialisasi ke JSON.
 */
function setEncryptedItem(key, value, isJSON = false) {
  try {
    const data = isJSON ? JSON.stringify(value) : value
    const encrypted = encryptData(data)
    window.sessionStorage.setItem(key, encrypted)
  } catch (error) {
    console.error(`Error encrypting session item for key "${key}":`, error)
  }
}

/**
 * Menghapus item dari sessionStorage.
 * @param {string} key - Key penyimpanan.
 */
function removeItem(key) {
  window.sessionStorage.removeItem(key)
}

// Getter
export const getMenu = () => getDecryptedItem(ID_MENU_KEY)
export const getActivePage = () => getDecryptedItem(ID_MENU_ACTIVE)
export const getMenuActiveIndex = () => {
  try {
    const index = window.sessionStorage.getItem(ID_MENU_INDEX)
    return index !== null ? Number(index) : null
  } catch (error) {
    console.error(`Error reading menu index:`, error)
    return null
  }
}
export const getCurrentPage = () => getDecryptedItem(ID_CURRENT_PAGE)
export const getCurrentParameter = () => getDecryptedItem(ID_PARAMETER_ACTIVE_PAGE)

// Setter
export const saveMenuActivePage = (menu) => setEncryptedItem(ID_MENU_ACTIVE, menu)
export const saveMenuIndex = (index) => {
  try {
    window.sessionStorage.setItem(ID_MENU_INDEX, String(index))
  } catch (error) {
    console.error(`Error saving menu index:`, error)
  }
}
export const saveCurrentPage = (menu) => setEncryptedItem(ID_CURRENT_PAGE, menu)
export const saveSubMenuActivePage = (menu) => setEncryptedItem(ID_SUBMENU_ACTIVE, menu)
export const saveSubMenuIndex = (index) => setEncryptedItem(ID_SUBMENU_INDEX, index)
export const saveCurrentParameter = (menu) => setEncryptedItem(ID_PARAMETER_ACTIVE_PAGE, menu)

// Destroyer
export const destroyMenu = () => removeItem(ID_MENU_KEY)
export const destroyActivePage = () => removeItem(ID_MENU_ACTIVE)
export const destroyActiveIndex = () => removeItem(ID_MENU_INDEX)
export const destroyCurrentPage = () => removeItem(ID_CURRENT_PAGE)
export const destroyCurrentParameter = () => removeItem(ID_PARAMETER_ACTIVE_PAGE)

// Export default
export default {
  getMenu,
  saveMenuActivePage,
  saveMenuIndex,
  saveSubMenuActivePage,
  saveSubMenuIndex,
  saveCurrentParameter,
  destroyMenu,
  getActivePage,
  getMenuActiveIndex,
  destroyActivePage,
  destroyActiveIndex,
  getCurrentPage,
  getCurrentParameter,
  saveCurrentPage,
  destroyCurrentPage,
  destroyCurrentParameter
}
