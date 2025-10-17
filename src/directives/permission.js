import { permission } from "@/common/permission.js";

export default {
  mounted(el, binding) {
    const { role, module, action } = binding.value;

    // Periksa izin menggunakan fungsi permission
    const hasPermission = Array.isArray(role)
      ? role.some(r => permission(r, module, action)) // Periksa setiap role dalam array
      : permission(role, module, action);

    if (!hasPermission) {
      el.parentNode?.removeChild(el);
    }
  },
};
