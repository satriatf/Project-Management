export function isEmpty(value) {
  return !value || (typeof value === 'string' && value.trim().length === 0);
}

export function isLengthExceeded(value) {
  return typeof value === 'string' && value.length > 4000;
}

export function containsInvalidChars(value) {
  return /[<>#{}[\]]/.test(value);
}

const validFileTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/zip',
  'application/x-zip-compressed',
  'image/png',
  'image/jpeg',
  'image/jpg'
];

function validateString(value, label, maxLength) {
  if (containsInvalidChars(value)) {
    return `${label} tidak boleh mengandung <, >, #, {, }, [, atau ]`;
  }
  if (maxLength && isLengthExceeded(value)) {
    return `${label} melebihi batas maksimal karakter (4000)`;
  }
  return true;
}

function validateFile(file, label) {
  if (!validFileTypes.includes(file.type)) {
    return `${label} harus berupa PDF, DOC, DOCX, PNG, JPG, atau ZIP`;
  }
  if (file.size > 1 * 1024 * 1024) {
    return `${label} tidak boleh lebih dari 1MB`;
  }
  return true;
}

/**
 * Validasi untuk input teks atau file
 * @param {*} value - Nilai yang akan divalidasi (string atau File)
 * @param {*} label - Label field untuk pesan error
 * @param {*} maxLength - true jika validasi panjang karakter diperlukan
 * @param {*} isFile - true jika value adalah File
 * @param {*} customValidator - optional custom validation function
 * @returns {true|string} - true jika valid, atau pesan error string
 */
export function validateTextField(value, label = 'Inputan', maxLength = false, isFile = false, customValidator = null) {
  if (isEmpty(value)) {
    return `${label} tidak boleh kosong`;
  }

  if (!isFile && typeof value === 'string') {
    const stringValidation = validateString(value, label, maxLength);
    if (stringValidation !== true) return stringValidation;
  }

  if (isFile && value instanceof File) {
    const fileValidation = validateFile(value, label);
    if (fileValidation !== true) return fileValidation;
  }

  if (typeof customValidator === 'function') {
    const result = customValidator(value);
    if (result !== true) return result;
  }

  return true;
}
