# 🎬 DEMO SOFT DELETE - Step by Step

## 📺 **Simulasi: Delete Application "Ad1Access"**

---

### **STEP 1: Kondisi Awal** 📋

#### Database State (Vuex Store):
```javascript
state.applications = [
  { id: 1, name: 'Ad1Access', createdBy: 'Admin', isDeleted: false },
  { id: 2, name: 'Public Access', createdBy: 'Admin', isDeleted: false },
  { id: 3, name: 'Secure Access', createdBy: 'Admin', isDeleted: false },
  // ... 36 aplikasi lainnya
]
```

#### Tampilan di Browser (ApplicationList.vue):
```
┌────────────────────────────────────────────────────────────┐
│  Applications                                              │
├────────────────────────────────────────────────────────────┤
│  ☐  Application Name    Created By    Created Date    [X] │
│  ☐  Ad1Access          Admin          Jan 1, 2025     [X] │ ← Ini akan dihapus
│  ☐  Public Access      Admin          Jan 1, 2025     [X] │
│  ☐  Secure Access      Admin          Jan 1, 2025     [X] │
│  ☐  Ad1Suite           Admin          Jan 1, 2025     [X] │
│  ... (35 aplikasi lagi)                                    │
└────────────────────────────────────────────────────────────┘
Total: 39 applications
```

---

### **STEP 2: User Klik Delete** 🖱️

User klik icon delete (🗑️) pada "Ad1Access"

```javascript
// Method dipanggil
confirmDelete(app) {
  // app = { id: 1, name: 'Ad1Access', ... }
  
  showDeleteConfirmation(app.name, () => {
    // Callback ini akan dijalankan jika user klik "Yes"
  })
}
```

#### Popup Konfirmasi Muncul:
```
┌───────────────────────────────────────┐
│  ⚠️  Are you sure?                    │
│                                       │
│  Do you want to delete "Ad1Access"?   │
│  This action cannot be undone!        │
│                                       │
│     [Cancel]  [Yes, delete it!] ←     │
└───────────────────────────────────────┘
```

---

### **STEP 3: User Klik "Yes, delete it!"** ✅

```javascript
// Callback dijalankan
() => {
  // 1. Dispatch action soft delete
  this.$store.dispatch('master/softDeleteApplication', 1)
  
  // 2. Tampilkan notifikasi success
  showSuccessNotification('Application "Ad1Access" has been deleted successfully')
}
```

#### Action dipanggil:
```javascript
// store/modules/master/index.js
actions: {
  softDeleteApplication({ commit }, id) {
    commit('SOFT_DELETE_APPLICATION', id)  // id = 1
  }
}
```

#### Mutation dijalankan:
```javascript
mutations: {
  SOFT_DELETE_APPLICATION(state, id) {
    // Cari application dengan id = 1
    const app = state.applications.find(a => a.id === id)
    
    if (app) {
      // ✅ HANYA UBAH FLAG, tidak hapus data!
      app.isDeleted = true
    }
  }
}
```

---

### **STEP 4: State Berubah** 🔄

#### Database State (Vuex Store) SETELAH delete:
```javascript
state.applications = [
  // ✅ DATA MASIH ADA! Hanya flag berubah
  { id: 1, name: 'Ad1Access', createdBy: 'Admin', isDeleted: true },  // ← Changed!
  { id: 2, name: 'Public Access', createdBy: 'Admin', isDeleted: false },
  { id: 3, name: 'Secure Access', createdBy: 'Admin', isDeleted: false },
  // ... 36 aplikasi lainnya
]

// ✅ Total di state: MASIH 39 applications
console.log(state.applications.length)  // 39
```

#### Getter Filter Data:
```javascript
// Getter activeApplications dipanggil
getters: {
  activeApplications: (state) => 
    state.applications.filter(app => !app.isDeleted)
}

// Hasil filter:
activeApplications = [
  // "Ad1Access" TIDAK MASUK karena isDeleted = true
  { id: 2, name: 'Public Access', createdBy: 'Admin', isDeleted: false },
  { id: 3, name: 'Secure Access', createdBy: 'Admin', isDeleted: false },
  // ... 36 aplikasi lainnya
]

// ✅ Total di getter: 38 applications (yang aktif saja)
console.log(activeApplications.length)  // 38
```

---

### **STEP 5: UI Update Otomatis** 🔄

Vue reactivity otomatis update tampilan karena getter berubah.

#### Tampilan di Browser SETELAH delete:
```
┌────────────────────────────────────────────────────────────┐
│  Applications                                              │
├────────────────────────────────────────────────────────────┤
│  ☐  Application Name    Created By    Created Date    [X] │
│                                                            │ ← "Ad1Access" HILANG!
│  ☐  Public Access      Admin          Jan 1, 2025     [X] │
│  ☐  Secure Access      Admin          Jan 1, 2025     [X] │
│  ☐  Ad1Suite           Admin          Jan 1, 2025     [X] │
│  ... (35 aplikasi lagi)                                    │
└────────────────────────────────────────────────────────────┘
Total: 38 applications  ← Berkurang 1
```

#### Success Toast Muncul:
```
┌─────────────────────────────────────┐
│  ✅ Success!                        │
│  Application "Ad1Access" has been   │
│  deleted successfully               │
│  ████████████░░                     │
└─────────────────────────────────────┘
  ↑ Pojok kanan atas, 3 detik auto close
```

---

### **STEP 6: Verifikasi Console** 🔍

Buka Chrome DevTools → Console:

```javascript
// Cek state langsung
console.log($store.state.master.applications.length)
// Output: 39  ← Masih 39!

// Cek yang isDeleted = true
console.log($store.state.master.applications.find(a => a.id === 1))
// Output: { id: 1, name: 'Ad1Access', isDeleted: true, ... }
//         ✅ DATA MASIH ADA DI STATE!

// Cek getter
console.log($store.getters['master/activeApplications'].length)
// Output: 38  ← Yang ditampilkan 38

// Cek apakah "Ad1Access" masih di getter
console.log($store.getters['master/activeApplications'].find(a => a.id === 1))
// Output: undefined  ← TIDAK ADA di getter karena di-filter
```

---

## 🔄 **Bonus: Restore Data (Undo Delete)**

Jika ingin restore data yang sudah "dihapus":

```javascript
// Tambahkan mutation baru
mutations: {
  RESTORE_APPLICATION(state, id) {
    const app = state.applications.find(a => a.id === id)
    if (app) {
      app.isDeleted = false  // ✅ Restore!
    }
  }
}

// Action
actions: {
  restoreApplication({ commit }, id) {
    commit('RESTORE_APPLICATION', id)
  }
}

// Panggil di component
this.$store.dispatch('master/restoreApplication', 1)

// ✅ "Ad1Access" muncul lagi di UI!
```

---

## 📊 **Perbandingan:**

### ❌ **Hard Delete (Permanent):**
```javascript
// Mutation
HARD_DELETE_APPLICATION(state, id) {
  state.applications = state.applications.filter(a => a.id !== id)
}

// Setelah delete
state.applications = [
  // DATA HILANG SELAMANYA!
  { id: 2, name: 'Public Access', ... },
  { id: 3, name: 'Secure Access', ... }
]
// Total: 38 (berkurang permanent)
// ❌ Tidak bisa restore
// ❌ Tidak ada audit trail
```

### ✅ **Soft Delete (Your Implementation):**
```javascript
// Mutation
SOFT_DELETE_APPLICATION(state, id) {
  const app = state.applications.find(a => a.id === id)
  if (app) app.isDeleted = true
}

// Setelah delete
state.applications = [
  { id: 1, name: 'Ad1Access', isDeleted: true },  // ✅ Masih ada!
  { id: 2, name: 'Public Access', isDeleted: false },
  { id: 3, name: 'Secure Access', isDeleted: false }
]
// Total: 39 (tidak berkurang)
// ✅ Bisa restore
// ✅ Ada audit trail
```

---

## ✅ **Kesimpulan Demo:**

1. **Database (State)**: Data **MASIH ADA** dengan flag `isDeleted: true`
2. **Getter**: Filter dan return hanya yang `isDeleted: false`
3. **UI**: Tampilkan hasil dari getter (38 items)
4. **User**: Lihat 38 items, tidak tahu ada 1 item yang "hidden"
5. **Recovery**: Bisa restore kapan saja dengan ubah flag ke `false`

**Perfect Implementation!** 🎉
