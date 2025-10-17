# 📘 Panduan Penggunaan Notifikasi

## 🔔 Cara Menggunakan Notifikasi di Project

### 1️⃣ **Import Notifikasi**
Di bagian atas file `.vue`, import fungsi yang dibutuhkan:

```javascript
// Di dalam <script>
import { 
  showSuccessNotification, 
  showErrorNotification,
  showInfoNotification,
  showWarningNotification,
  showDeleteConfirmation 
} from '@/common/notificationService'
```

---

### 2️⃣ **Success Notification** (Hijau ✅)
Digunakan untuk **operasi berhasil** seperti create, update, delete.

```javascript
// Contoh di EmployeeCreate.vue
methods: {
  handleSubmit() {
    const newEmployee = {
      id: Date.now(),
      ...this.form
    }
    
    // Save ke store
    this.$store.dispatch('employees/addEmployee', newEmployee)
    
    // ✅ Tampilkan notifikasi success
    showSuccessNotification(`Employee "${newEmployee.name}" has been created successfully`)
    
    // Redirect ke list
    this.$router.push({ name: 'employee-list' })
  }
}
```

**Hasil:**
```
┌─────────────────────────────────────┐
│  ✅ Success!                        │
│  Employee "John Doe" has been       │
│  created successfully               │
└─────────────────────────────────────┘
```

---

### 3️⃣ **Error Notification** (Merah ❌)
Digunakan untuk **error** dari API atau validasi.

```javascript
// Contoh di EmployeeEdit.vue
methods: {
  async handleSubmit() {
    try {
      await this.$store.dispatch('employees/updateEmployee', this.form)
      showSuccessNotification('Employee updated successfully')
      this.$router.push({ name: 'employee-list' })
    } catch (error) {
      // ❌ Tampilkan notifikasi error
      showErrorNotification(error.message || 'Failed to update employee')
    }
  }
}
```

**Hasil:**
```
┌─────────────────────────────────────┐
│  ❌ Error!                          │
│  Failed to update employee          │
└─────────────────────────────────────┘
```

---

### 4️⃣ **Info Notification** (Biru ℹ️)
Digunakan untuk **informasi** seperti draft saved, auto-save, etc.

```javascript
// Contoh di EmployeeCreate.vue
methods: {
  handleDraft() {
    // Save draft to localStorage
    localStorage.setItem('employeeDraft', JSON.stringify(this.form))
    
    // ℹ️ Tampilkan notifikasi info
    showInfoNotification('Draft saved successfully')
  }
}
```

**Hasil:**
```
┌─────────────────────────────────────┐
│  ℹ️  Info                           │
│  Draft saved successfully           │
└─────────────────────────────────────┘
```

---

### 5️⃣ **Warning Notification** (Kuning ⚠️)
Digunakan untuk **peringatan** seperti validasi, incomplete data.

```javascript
// Contoh validasi form
methods: {
  handleSubmit() {
    if (!this.form.email || !this.form.name) {
      // ⚠️ Tampilkan notifikasi warning
      showWarningNotification('Please fill all required fields')
      return
    }
    
    // Lanjutkan submit...
  }
}
```

**Hasil:**
```
┌─────────────────────────────────────┐
│  ⚠️  Warning!                       │
│  Please fill all required fields    │
└─────────────────────────────────────┘
```

---

### 6️⃣ **Delete Confirmation** (Center Popup)
Digunakan untuk **konfirmasi delete** sebelum menghapus data.

```javascript
// Contoh di EmployeeList.vue
methods: {
  confirmDelete(employee) {
    // 🗑️ Tampilkan popup konfirmasi
    showDeleteConfirmation(employee.name, () => {
      // Callback ini dijalankan jika user klik "Yes, delete it!"
      
      // Hapus dari store
      this.$store.dispatch('employees/deleteEmployee', employee.id)
      
      // Tampilkan success notification
      showSuccessNotification(`Employee "${employee.name}" has been deleted successfully`)
    })
  }
}
```

**Hasil Step 1 - Popup Konfirmasi:**
```
┌───────────────────────────────────────┐
│  ⚠️  Are you sure?                    │
│                                       │
│  Do you want to delete "John Doe"?    │
│  This action cannot be undone!        │
│                                       │
│     [Cancel]  [Yes, delete it!]       │
└───────────────────────────────────────┘
```

**Hasil Step 2 - Setelah klik Yes:**
```
┌─────────────────────────────────────┐
│  ✅ Success!                        │
│  Employee "John Doe" has been       │
│  deleted successfully               │
└─────────────────────────────────────┘
```

---

## 🎨 Kustomisasi Notifikasi

### Custom Title
```javascript
showSuccessNotification('Data saved!', 'Great!')
// Title: "Great!"
// Message: "Data saved!"
```

### Custom Message Only
```javascript
showSuccessNotification('Employee created successfully')
// Title: "Success!" (default)
// Message: "Employee created successfully"
```

---

## 📋 Template Lengkap CRUD

```vue
<template>
  <div>
    <!-- Form here -->
    <button @click="handleSubmit">Save</button>
    <button @click="handleDraft">Save Draft</button>
  </div>
</template>

<script>
import { 
  showSuccessNotification, 
  showErrorNotification,
  showInfoNotification 
} from '@/common/notificationService'

export default {
  methods: {
    async handleSubmit() {
      try {
        await this.$store.dispatch('employees/addEmployee', this.form)
        showSuccessNotification('Employee created successfully') // ✅
        this.$router.push({ name: 'employee-list' })
      } catch (error) {
        showErrorNotification('Failed to create employee') // ❌
      }
    },
    
    handleDraft() {
      localStorage.setItem('draft', JSON.stringify(this.form))
      showInfoNotification('Draft saved') // ℹ️
    }
  }
}
</script>
```

---

## ✅ Checklist Implementasi

Pastikan setiap page memiliki notifikasi:

- [x] **EmployeeCreate** - Success saat create
- [x] **EmployeeEdit** - Success saat update
- [x] **EmployeeList** - Confirmation + Success saat delete
- [x] **ProjectCreate** - Success saat create
- [x] **ProjectEdit** - Success saat update
- [x] **ProjectList** - Confirmation + Success saat delete
- [x] **NonProjectCreate** - Success saat create
- [x] **NonProjectEdit** - Success saat update
- [x] **NonProjectList** - Confirmation + Success saat delete
- [x] **Master Pages** - Success saat create/delete

---

## 🚀 Ready to Use!

Semua notifikasi sudah siap digunakan di seluruh aplikasi!

**Happy Coding!** 🎉
