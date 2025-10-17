const MODULE_PERMISSIONS = {
  PPYM: {
    "IDM.Ad14Flow_ROLPPYM_INITIATE": ["view", "create",],
    "IDM.Ad14Flow_ROLPPYM_MONITORING": ["view", "create", "edit",'delete','export','monitoring'],
  },
  PPSJ: {
    "IDM.Ad14Flow_ROLPPSJ_INITIATE": ["view", "create",],
    "IDM.Ad14Flow_ROLPPSJ_MONITORING": ["view", "create", "edit",'delete','export','monitoring'],
  },
  PARAMETER: {
    "IDM.Ad14flow_ROLPPSJ_INITIATE_Parameter":["view", "create",],
    "IDM.Ad14Flow_ROLPARAMETER_MONITORING": ["view", "create", "edit",'delete','export','monitoring'],
  },
};

/**
 * Fungsi untuk mengecek apakah role memiliki izin dalam module tertentu
 * @param {string|string[]} role - Role pengguna atau array role
 * @param {string} module - Nama module
 * @param {string} action - Aksi (view, create, update, delete)
 * @returns {boolean} - True jika memiliki izin, False jika tidak
 */
export const permission = (role, module, action) => {
  if (!MODULE_PERMISSIONS[module]) {
    console.warn(`Module ${module} tidak ditemukan.`);
    return false;
  }

  if (Array.isArray(role)) {
    return role.some(r => MODULE_PERMISSIONS[module][r]?.includes(action));
  }

  return MODULE_PERMISSIONS[module][role]?.includes(action) || false;
};
