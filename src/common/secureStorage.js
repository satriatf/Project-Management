import CryptoJS from 'crypto-js'

// Ganti dengan key yang aman, bisa dari .env atau key management system
const SECRET_KEY =  import.meta.env.VITE_SALT

function encryptData(data) {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString()
}

function decryptData(ciphertext) {
  if (!ciphertext) {
    // Skip decryption if input is empty or null
    return null;
  }
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      console.error('Decryption failed: Empty result');
      return null;
    }
    return decrypted;
  } catch (e) {
    console.error('Error decrypting data:', e.message);
    return null;
  }
}


export { encryptData, decryptData }
