/** Gunakan jika pada env uat/prod
 *
 * import CryptoJS from "crypto-js";
 *
 * class GlobalEncryptor {
 *   constructor() {
 *     this.key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SALT); // 32 karakter
 *   }
 *
 *   // Generate IV secara acak
 *   _generateIV() {
 *     return CryptoJS.lib.WordArray.random(16);
 *   }
 *
 *   // Enkripsi data
 *   encrypt(plainText) {
 *     const iv = this._generateIV();
 *     const encrypted = CryptoJS.AES.encrypt(plainText, this.key, {
 *       iv: iv,
 *       mode: CryptoJS.mode.CBC,
 *       padding: CryptoJS.pad.Pkcs7,
 *     });
 *
 *     // Gabungkan IV + Encrypted Data sebelum encoding
 *     const combined = iv.concat(encrypted.ciphertext);
 *     return CryptoJS.enc.Base64.stringify(combined);
 *   }
 *
 *   // Dekripsi data
 *   decrypt(encryptedData) {
 *     const combined = CryptoJS.enc.Base64.parse(encryptedData);
 *
 *     // Ambil IV (16 byte pertama)
 *     const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4));
 *
 *     // Ambil ciphertext (sisanya)
 *     const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4));
 *
 *     const decrypted = CryptoJS.AES.decrypt(
 *       { ciphertext: ciphertext },
 *       this.key,
 *       { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
 *     );
 *
 *     return decrypted.toString(CryptoJS.enc.Utf8);
 *   }
 *
 *   // Enkripsi objek JSON
 *   encryptBody(body) {
 *     if (!body) return {};
 *     const encryptedBody = {};
 *     const fieldsToEncrypt = [
 *       "nik",
 *       "nikPicPenjawab",
 *       "divisi",
 *       "nikPenjawab",
 *       "idJabatan",
 *       "idLokasi",
 *     ];
 *
 *     for (const key in body) {
 *       if (fieldsToEncrypt.includes(key) && typeof body[key] === "string") {
 *         encryptedBody[key] = this.encrypt(body[key]);
 *       } else {
 *         encryptedBody[key] = body[key];
 *       }
 *     }
 *     return encryptedBody;
 *   }
 *
 *   // Dekripsi objek JSON
 *   decryptBody(body) {
 *     const decryptedBody = {};
 *
 *     for (const key in body) {
 *       if (typeof body[key] === "string") {
 *         try {
 *           decryptedBody[key] = this.decrypt(body[key]);
 *         } catch (e) {
 *           decryptedBody[key] = body[key]; // Jika gagal dekripsi, pakai data asli
 *         }
 *       } else {
 *         decryptedBody[key] = body[key];
 *       }
 *     }
 *     return decryptedBody;
 *   }
 * }
 *
 * export default new GlobalEncryptor();
 */



class GlobalEncryptor {
  constructor() {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
    this.secret = import.meta.env.VITE_SALT; // harus 32 karakter untuk AES-256
  }

  async _getKey() {
    const keyBytes = this.encoder.encode(this.secret);
    return await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  }

  _generateIV() {
    return crypto.getRandomValues(new Uint8Array(12)); // 16-byte IV agar match Java
  }

  async encrypt(plainText) {
    const iv = this._generateIV();
    const key = await this._getKey();
    const encoded = this.encoder.encode(plainText);

    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  async decrypt(base64Cipher) {
    const combined = Uint8Array.from(atob(base64Cipher), (c) =>
      c.charCodeAt(0)
    );

    const iv = combined.slice(0, 16);
    const ciphertext = combined.slice(16);

    const key = await this._getKey();

    try {
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
      );

      return this.decoder.decode(decrypted);
    } catch (err) {
      return null;
    }
  }

  async encryptBody(body) {

    if (!body) return {};
    const encryptedBody = {};
    const fieldsToEncrypt = [
      "nik",
      "nikPicPenjawab",
      "divisi",
      "nikPenjawab",
      "idJabatan",
      "idLokasi",
    ];

    for (const key in body) {

      if (fieldsToEncrypt.includes(key) && typeof body[key] === "string") {
        try {
          const encryptedValue = await this.encrypt(body[key]);
          encryptedBody[key] = encryptedValue;
        } catch (e) {
          console.error(`Encrypt error for ${key}:`, e);
        }
      } else {
        encryptedBody[key] = body[key];
      }
    }


    return encryptedBody;
  }

  async decryptBody(body) {
    const decryptedBody = {};
    for (const key in body) {
      if (typeof body[key] === "string") {
        try {
          decryptedBody[key] = await this.decrypt(body[key]);
        } catch {
          decryptedBody[key] = body[key];
        }
      } else {
        decryptedBody[key] = body[key];
      }
    }
    return decryptedBody;
  }
}

export default new GlobalEncryptor();
