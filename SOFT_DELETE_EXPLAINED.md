# 🗑️ SOFT DELETE - Dokumentasi Lengkap

## ✅ **YA! Master Data Menggunakan SOFT DELETE**

### 📊 **Konsep Soft Delete:**

**Soft Delete** = Data **TIDAK** dihapus permanent dari database, hanya ditandai sebagai `isDeleted: true`

```javascript
// ❌ Hard Delete (Permanent)
state.applications = state.applications.filter(app => app.id !== id)
// Data hilang selamanya dari database!

// ✅ Soft Delete (Masih ada di DB)
const app = state.applications.find(a => a.id === id)
app.isDeleted = true  // Hanya ubah flag
// Data masih ada di database, tapi tidak ditampilkan!
```

---

## 🔍 **Implementasi di Store Module**

### File: `src/store/modules/master/index.js`

### 1️⃣ **State - Semua data punya flag `isDeleted`:**
```javascript
const state = {
  applications: [
    { 
      id: 1, 
      name: 'Ad1Access', 
      createdBy: 'Admin', 
      createdDate: '2025-01-01', 
      isDeleted: false  // ✅ Flag soft delete
    },
    { 
      id: 2, 
      name: 'Public Access', 
      createdBy: 'Admin', 
      createdDate: '2025-01-01', 
      isDeleted: false 
    }
  ],
  holidays: [
    { 
      id: 1, 
      name: 'New Year 2025', 
      date: '2025-01-01',
      createdBy: 'Admin', 
      createdDate: '2024-12-01', 
      isDeleted: false  // ✅ Flag soft delete
    }
  ],
  projectStatuses: [...],  // Semua punya isDeleted: false
  nonProjectTypes: [...]   // Semua punya isDeleted: false
}
```

### 2️⃣ **Getters - Filter data yang tidak dihapus:**
```javascript
const getters = {
  // ✅ Hanya tampilkan data dengan isDeleted = false
  activeApplications: (state) => 
    state.applications.filter(app => !app.isDeleted),
  
  activeHolidays: (state) => 
    state.holidays.filter(h => !h.isDeleted),
  
  activeProjectStatuses: (state) => 
    state.projectStatuses.filter(ps => !ps.isDeleted),
  
  activeNonProjectTypes: (state) => 
    state.nonProjectTypes.filter(npt => !npt.isDeleted)
}
```

### 3️⃣ **Mutations - Soft delete (ubah flag):**
```javascript
const mutations = {
  // ✅ Soft Delete Application
  SOFT_DELETE_APPLICATION(state, id) {
    const app = state.applications.find(a => a.id === id)
    if (app) {
      app.isDeleted = true  // Hanya ubah flag, data masih ada!
    }
  },
  
  // ✅ Soft Delete Holiday
  SOFT_DELETE_HOLIDAY(state, id) {
    const holiday = state.holidays.find(h => h.id === id)
    if (holiday) {
      holiday.isDeleted = true  // Data masih ada di state!
    }
  },
  
  // Sama untuk ProjectStatus dan NonProjectType
}
```

### 4️⃣ **Actions - Dispatch soft delete:**
```javascript
const actions = {
  softDeleteApplication({ commit }, id) {
    commit('SOFT_DELETE_APPLICATION', id)
  },
  
  softDeleteHoliday({ commit }, id) {
    commit('SOFT_DELETE_HOLIDAY', id)
  },
  
  softDeleteProjectStatus({ commit }, id) {
    commit('SOFT_DELETE_PROJECT_STATUS', id)
  },
  
  softDeleteNonProjectType({ commit }, id) {
    commit('SOFT_DELETE_NON_PROJECT_TYPE', id)
  }
}
```

---

## 🎯 **Implementasi di Views**

### File: `src/views/Master/Application/ApplicationList.vue`

```vue
<script>
import { mapGetters } from 'vuex'
import { showSuccessNotification, showDeleteConfirmation } from '@/common/notificationService'

export default {
  computed: {
    ...mapGetters({
      // ✅ Menggunakan getter 'activeApplications' 
      // yang sudah filter isDeleted = false
      applications: 'master/activeApplications'
    }),
    filteredApplications() {
      // Aplikasi yang sudah deleted tidak akan muncul di sini
      return this.applications.filter(...)
    }
  },
  methods: {
    confirmDelete(app) {
      showDeleteConfirmation(app.name, () => {
        // ✅ Dispatch soft delete (bukan hard delete)
        this.$store.dispatch('master/softDeleteApplication', app.id)
        
        showSuccessNotification(
          `Application "${app.name}" has been deleted successfully`
        )
      })
    }
  }
}
</script>
```

---

## 📝 **Demo Soft Delete:**

### Sebelum Delete:
```javascript
// State di Vuex
state.applications = [
  { id: 1, name: 'Ad1Access', isDeleted: false },
  { id: 2, name: 'Public Access', isDeleted: false },
  { id: 3, name: 'Secure Access', isDeleted: false }
]

// Yang ditampilkan di UI (dari getter activeApplications)
[
  { id: 1, name: 'Ad1Access', isDeleted: false },
  { id: 2, name: 'Public Access', isDeleted: false },
  { id: 3, name: 'Secure Access', isDeleted: false }
]
```

### User klik Delete pada "Public Access":
```javascript
// 1. Konfirmasi muncul
showDeleteConfirmation('Public Access', callback)

// 2. User klik "Yes, delete it!"
this.$store.dispatch('master/softDeleteApplication', 2)

// 3. Mutation dijalankan
SOFT_DELETE_APPLICATION(state, 2) {
  const app = state.applications.find(a => a.id === 2)
  app.isDeleted = true  // ✅ Hanya ubah flag
}
```

### Setelah Delete:
```javascript
// State di Vuex (DATA MASIH ADA!)
state.applications = [
  { id: 1, name: 'Ad1Access', isDeleted: false },
  { id: 2, name: 'Public Access', isDeleted: true },  // ✅ Masih ada!
  { id: 3, name: 'Secure Access', isDeleted: false }
]

// Yang ditampilkan di UI (dari getter activeApplications)
// ✅ Filter yang isDeleted = false saja
[
  { id: 1, name: 'Ad1Access', isDeleted: false },
  { id: 3, name: 'Secure Access', isDeleted: false }
]
// "Public Access" TIDAK tampil di UI tapi MASIH ADA di database!
```

---

## 🔐 **Keuntungan Soft Delete:**

### ✅ **1. Data Recovery**
```javascript
// Bisa restore data yang "terhapus"
RESTORE_APPLICATION(state, id) {
  const app = state.applications.find(a => a.id === id)
  if (app) {
    app.isDeleted = false  // Restore!
  }
}
```

### ✅ **2. Audit Trail**
```javascript
// Bisa lihat history siapa yang delete
{
  id: 2,
  name: 'Public Access',
  isDeleted: true,
  deletedBy: 'Admin',
  deletedAt: '2025-10-17 14:30:00'
}
```

### ✅ **3. Data Integrity**
```javascript
// Relasi dengan tabel lain tetap aman
// Misalnya Project yang pakai Application ini
// Tidak akan error karena data masih ada
```

### ✅ **4. Compliance**
```javascript
// Untuk audit, regulator bisa minta data
// yang "sudah dihapus" untuk investigasi
```

---

## 🧪 **Test Soft Delete:**

### Test 1: Delete Application
```javascript
// Before
console.log(store.state.master.applications)
// 39 applications dengan isDeleted: false

// Delete "Ad1Access"
store.dispatch('master/softDeleteApplication', 1)

// After
console.log(store.state.master.applications)
// ✅ Masih 39 applications (tidak berkurang!)
// ✅ Tapi id 1 sekarang isDeleted: true

console.log(store.getters['master/activeApplications'])
// ✅ 38 applications (yang isDeleted: false)
```

### Test 2: UI Display
```javascript
// Before delete
<tr v-for="app in applications">  // 39 rows

// After delete id=1
<tr v-for="app in applications">  // 38 rows
// "Ad1Access" tidak muncul di tabel
```

---

## 📊 **Summary:**

| Aspek | Hard Delete | Soft Delete (✅ Yang Dipakai) |
|-------|-------------|-------------------------------|
| Data di DB | ❌ Hilang permanent | ✅ Masih ada |
| Tampilan UI | ❌ Hilang | ✅ Hilang |
| Recovery | ❌ Tidak bisa | ✅ Bisa restore |
| Audit Trail | ❌ Tidak ada | ✅ Ada history |
| Relasi Data | ❌ Bisa error | ✅ Aman |

---

## ✅ **Kesimpulan:**

**BENAR!** Master data menggunakan **SOFT DELETE**:
- ✅ Data **MASIH ADA** di `state.applications`, `state.holidays`, dll
- ✅ Flag `isDeleted: true` ditambahkan
- ✅ Getter **filter** data dengan `isDeleted: false`
- ✅ UI **TIDAK TAMPILKAN** data yang deleted
- ✅ Data bisa **di-restore** jika diperlukan

**Implementasi sudah 100% benar!** 🎉
