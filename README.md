# Team Management Application

A comprehensive Vue 3 application for managing team members, projects, non-projects, and master data for Adira Finance IT Department.

## 🎉 Latest Updates (October 16, 2025)

### ✨ Major Refactoring - Component & View Separation
- **Separated Concerns**: Components now handle presentation, Views handle logic
- **Improved Maintainability**: Cleaner code structure with clear separation
- **Enhanced Reusability**: Table components can be reused across modules
- **Consistent Design**: All modules follow the same pattern
- **Better Search**: Enhanced search functionality with descriptive placeholders
- **Professional Layout**: Breadcrumb navigation, card wrappers, and consistent styling

For details, see:
- 📖 [Component Structure Guide](COMPONENT_STRUCTURE.md)
- 📊 [Visual Structure Guide](VISUAL_STRUCTURE_GUIDE.md)
- 📝 [Refactoring Summary](REFACTORING_SUMMARY.md)
- ⚡ [Quick Reference](QUICK_REFERENCE.md)

## Features

### ✅ Implemented
- **Dashboard**: Welcome section with user profile and overview cards (Employees, Projects, Non-Projects, Applications, Holidays)
- **Employees Management**: Full CRUD (Create, Read, Update, Delete) with levels (Manager, Asmen, SH, Staff, Intern)
- **Projects Management**: Full CRUD with status tracking, technical lead, multi-PIC, dates, and progress percentage
- **Non-Projects Management**: Full CRUD for incidents, requests, support tickets with file upload capability
- **Project Timeline**: Gantt-style visualization of projects and tasks per employee
- **Master Data**: Complete CRD (Create, Read, soft Delete) for:
  - Project Statuses (19 default statuses)
  - Non-Project Types (6 default types)
  - Applications (39 default applications)
  - Holidays (national/company holidays)
- **Responsive Sidebar**: Collapsible navigation with nested menus
- **User Profile**: Dropdown with avatar (ZY) and sign-out option
- **Draft Feature**: Save form progress to localStorage
- **File Upload**: Attachment support with preview and download for Non-Projects
- **Soft Delete**: Master data uses soft delete to maintain data integrity

### 📋 To Be Completed
- Real API integration (currently using Vuex with sample data)
- Form validation library integration (Vuelidate/VeeValidate)
- Pagination for large data sets
- Export to Excel functionality
- Advanced filtering options
- Restore functionality for soft-deleted master data
- Edit functionality for master data

## Installation & Running

```sh
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/              # ✨ NEW: Reusable components
│   ├── Employees/
│   │   └── EmployeeTable.vue
│   ├── NonProjects/
│   │   └── NonProjectTable.vue
│   ├── Projects/
│   │   └── ProjectTable.vue
│   └── partials/
│       └── TablePagination.vue
├── views/                   # Page components (logic layer)
│   ├── Dashboard/
│   ├── Employees/
│   │   ├── EmployeeList.vue      # ♻️ Refactored
│   │   ├── EmployeeCreate.vue
│   │   └── EmployeeEdit.vue
│   ├── Projects/
│   │   ├── ProjectList.vue       # ♻️ Refactored
│   │   ├── ProjectCreate.vue
│   │   └── ProjectEdit.vue
│   ├── NonProjects/
│   │   ├── NonProjectList.vue    # ♻️ Refactored
│   │   ├── NonProjectCreate.vue
│   │   └── NonProjectEdit.vue
│   ├── Timeline/
│   └── Master/
├── store/modules/           # Vuex state management
│   ├── employees/           # Employee CRUD
│   ├── projects/            # Project CRUD
│   ├── nonProjects/         # Non-Project CRUD
│   └── master/              # Master data (soft delete)
├── includes/                # Layout (Sidebar, Navbar, Footer)
├── common/                  # Utilities & services
└── router/                  # Route configuration
```

### Architecture Pattern

```
┌──────────┐     Props    ┌────────────┐
│  Views   │ ─────────▶   │ Components │
│ (Logic)  │              │    (UI)    │
│          │ ◀─────────   │            │
└──────────┘    Events    └────────────┘
     ▲                          │
     │                          │
     │        Display           │
     │  ◀───────────────────────┘
     │
     ▼
┌──────────┐
│   Vuex   │
│  Store   │
└──────────┘
```

## Key Routes

| Path | Description |
|------|-------------|
| `/` | Dashboard with overview cards |
| `/employees` | Employee list & management |
| `/projects` | Project list with modal details |
| `/non-projects` | Non-project tickets |
| `/timeline` | Gantt chart timeline view |
| `/master/non-project-types` | Master data management |

## Master Data Presets

**Project Statuses (19)**: PEMBAHASAN, TASKLIST, SIGN-OFF, NEED SCHEDULE, WTD, DEV, WTQ, QC, WAITING TO UAT, UAT, UAT DONE, READY TO DEPLOY, GO LIVE, PENDING PEMBAHASAN, PENDING UAT, NO IMPACT DEV, DROP, PENDING DEV, PENTEST

**Non-Project Types (5)**: PROBLEM, REQUEST DATA, INCIDENT, SERVICE REQUEST, SUPPORT UAT

**Applications (39)**: Ad1Access, Ad1ForFlow, Ad1Primajaga, Audit Management, SAP ASSIST, etc.

## Documentation

### 📚 Complete Documentation Set

- **[COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md)** - ✨ Component & View architecture guide
- **[VISUAL_STRUCTURE_GUIDE.md](./VISUAL_STRUCTURE_GUIDE.md)** - ✨ Visual diagrams and flows
- **[REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)** - ✨ Latest refactoring changes
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - ✨ Quick reference for developers
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Complete implementation guide
- **[CRUD_GUIDE.md](./CRUD_GUIDE.md)** - CRUD implementation patterns
- **[MASTER_DATA_GUIDE.md](./MASTER_DATA_GUIDE.md)** - Master data management guide

### 👤 Current User
**Zestado Mahesa Yudha (ZY)** - Manager

## Development Guidelines

### Adding a New Module

1. **Create Table Component**: `src/components/[Module]/[Module]Table.vue`
2. **Create Views**: 
   - `src/views/[Module]/[Module]List.vue`
   - `src/views/[Module]/[Module]Create.vue`
   - `src/views/[Module]/[Module]Edit.vue`
3. **Follow the Pattern**: See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
4. **Test All Features**: Search, pagination, CRUD operations

### Code Quality

- ✅ Separation of concerns (Components vs Views)
- ✅ Props down, events up pattern
- ✅ Consistent naming conventions
- ✅ Reusable components
- ✅ Clear documentation

## Tech Stack

- **Vue 3** - Progressive JavaScript Framework
- **Vuex** - State Management
- **Vue Router** - Client-side Routing
- **Bootstrap 5** - UI Framework
- **Vite** - Build Tool

## Contributing

When contributing to this project:

1. Follow the established component/view pattern
2. Update documentation for any structural changes
3. Maintain consistent styling and naming
4. Test all CRUD operations
5. Keep components reusable and views focused on logic

## Tech Stack

Vue 3 + Vuex + Vue Router + Bootstrap 5 + Vite

 "scripts": {
    "build": "vite build --mode production "Ubah sesuai kebutuhan deploy contoh"",
  },
## Folder Env

Pastikan folder .env ada dalam folder untuk menemukan base url dan end point api
```

### function
- permission
  - v-permission="{ role: 'user', module: 'home', action: 'create' }"
