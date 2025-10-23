import { encryptData, decryptData } from './secureStorage'

// Constants
const ID_KEYS = {
  id: 'id',
  nama: 'nama',
  nik: 'nik',
  jabatan: 'jabatan',
  lokasi: 'lokasi',
  role: 'role',
  outype: 'outype',
  userLocation: 'User Location',
  userPosition: 'User Position',
  loginDate:'loginDate'
}

/**
 * Ambil dan dekripsi item dari sessionStorage.
 * @param {string} key - Key yang akan diambil.
 * @param {boolean} [isJSON=false] - Apakah nilai berupa JSON.
 * @returns {any} Nilai hasil dekripsi, atau null/[] jika gagal.
 */
export function getDecryptedItem(key, isJSON = false) {
  try {
    const item = window.sessionStorage.getItem(key)
    if (!item) return isJSON ? [] : null

    const decrypted = decryptData(item)
    if (!decrypted) return isJSON ? [] : null

    return isJSON ? JSON.parse(decrypted) : decrypted
  } catch (error) {
    console.warn(`Error parsing key "${key}":`, error)
    return isJSON ? [] : null
  }
}

/**
 * Enkripsi dan simpan item ke sessionStorage.
 * @param {string} key - Key tempat menyimpan.
 * @param {any} value - Nilai yang akan disimpan.
 * @param {boolean} [isJSON=false] - Apakah perlu JSON.stringify.
 */
export function setEncryptedItem(key, value, isJSON = false) {
  try {
    const data = isJSON ? JSON.stringify(value) : value
    const encrypted = encryptData(data)
    window.sessionStorage.setItem(key, encrypted)
  } catch (error) {
    console.error(`Error encrypting key "${key}":`, error)
  }
}

/**
 * Hapus item dari sessionStorage.
 * @param {string} key - Key yang akan dihapus.
 */
export function destroyKey(key) {
  window.sessionStorage.removeItem(key)
}

// Getter Functions
export const getId = () => getDecryptedItem(ID_KEYS.id)
export const getNama = () => getDecryptedItem(ID_KEYS.nama)
export const getNik = () => getDecryptedItem(ID_KEYS.nik)
export const getRole = () => getDecryptedItem(ID_KEYS.role, true)
export const getIdJabatan = () => getDecryptedItem(ID_KEYS.jabatan)
export const getIdLokasi = () => getDecryptedItem(ID_KEYS.lokasi)
export const getOutype = () => getDecryptedItem(ID_KEYS.outype)
export const getUserLocation = () => getDecryptedItem(ID_KEYS.userLocation, true)
export const getUserPosition = () => getDecryptedItem(ID_KEYS.userPosition, true)
export const getLoginDate = () => {
  const stored = getDecryptedItem(ID_KEYS.loginDate)
  return stored ? new Date(stored) : null
}

// Setter Functions
export const saveId = (val) => setEncryptedItem(ID_KEYS.id, val)
export const saveNama = (val) => setEncryptedItem(ID_KEYS.nama, val)
export const saveNik = (val) => setEncryptedItem(ID_KEYS.nik, val)
export const saveRole = (val) => setEncryptedItem(ID_KEYS.role, val, true)
export const saveIdLokasi = (val) => setEncryptedItem(ID_KEYS.lokasi, val)
export const saveIdJabatan = (val) => setEncryptedItem(ID_KEYS.jabatan, val)
export const saveOutype = (val) => setEncryptedItem(ID_KEYS.outype, val)
export const saveUserLocation = (val) => setEncryptedItem(ID_KEYS.userLocation, val, true)
export const saveUserPosition = (val) => setEncryptedItem(ID_KEYS.userPosition, val, true)
export const saveLoginDate = (val) => setEncryptedItem(ID_KEYS.loginDate, new Date(val).toISOString())


// Destroyer Functions
export const destroyId = () => destroyKey(ID_KEYS.id)
export const destroyNama = () => destroyKey(ID_KEYS.nama)
export const destroyNik = () => destroyKey(ID_KEYS.nik)
export const destroyRole = () => destroyKey(ID_KEYS.role)
export const destroyIdLokasi = () => destroyKey(ID_KEYS.lokasi)
export const destroyIdJabatan = () => destroyKey(ID_KEYS.jabatan)
export const destroyOutype = () => destroyKey(ID_KEYS.outype)
export const destroyUserLocation = () => destroyKey(ID_KEYS.userLocation)
export const destroyUserPosition = () => destroyKey(ID_KEYS.userPosition)
export const destroyLoginDate = () => destroyKey(ID_KEYS.loginDate)

// Default export for test & usage
export default {
  getId, getNama, getNik, getRole, getIdJabatan, getIdLokasi, getOutype,
  getUserLocation, getUserPosition,getLoginDate,

  saveId, saveNama, saveNik, saveRole, saveIdLokasi, saveIdJabatan, saveOutype,
  saveUserLocation, saveUserPosition,saveLoginDate,

  destroyId, destroyNama, destroyNik, destroyRole, destroyIdLokasi,
  destroyIdJabatan, destroyOutype, destroyUserLocation, destroyUserPosition,destroyLoginDate,

  getDecryptedItem, setEncryptedItem, destroyKey
}
