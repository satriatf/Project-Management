# BOA-APPS - Vue.js Template untuk Tugas Kuliah

Template aplikasi Vue.js yang sudah dibersihkan dan dikonfigurasi untuk tugas kuliah dengan PostgreSQL database.

## 🚀 Features

- **Clean Architecture**: Template bersih tanpa file tidak terpakai
- **PostgreSQL Integration**: Siap untuk koneksi PostgreSQL
- **Modern Vue.js**: Vue 3, Vuex, dan Vue Router
- **Bootstrap UI**: UI responsif dengan Bootstrap 5
- **Authentication**: Sistem autentikasi JWT
- **CRUD Operations**: Template untuk Employees, Projects, dan Non-Projects

## 📋 Prerequisites

- **Node.js** (v16 atau lebih tinggi)
- **PostgreSQL** (v12 atau lebih tinggi)
- **npm** atau **yarn**

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## 🗄️ Database Setup

### 1. Install PostgreSQL

```bash
# Windows (menggunakan Chocolatey)
choco install postgresql

# macOS (menggunakan Homebrew)
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
```

### 2. Create Database

```sql
-- Connect ke PostgreSQL sebagai superuser
psql -U postgres

-- Create database
CREATE DATABASE boa_apps;

-- Create user (opsional)
CREATE USER boa_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE boa_apps TO boa_user;
```

### 3. Environment Configuration

Copy `env.example` to `.env` and update the values:

```bash
# Copy example file
cp env.example .env

# Edit .env file with your database credentials
```

Example `.env` content:
```env
# Database Configuration
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=boa_apps
VITE_DB_USER=postgres
VITE_DB_PASSWORD=your_password_here
VITE_DB_SSL=false

# API Configuration
VITE_BASE_URL=http://localhost:3000/api/
VITE_BASE_URL_LOGIN=http://localhost:3000/api/auth/
VITE_AUTH_LOGIN=login
VITE_AUTH_LOGOUT=logout
VITE_REFRESH_TOKEN=refresh-token

# Application Configuration
VITE_VERSION=1.0.0
VITE_SALT=your_secret_salt_here
VITE_NODE_ENV=development
```

## 🛠️ Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd BOA-APPS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp env.example .env
   # Edit .env dengan kredensial database Anda
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable Vue components
├── views/              # Page components
├── store/              # Vuex store modules
├── router/             # Vue Router configuration
├── common/             # Common utilities and services
├── config/             # Configuration files
├── services/           # API services (PostgreSQL)
└── assets/             # Static assets
```

## 🔧 Backend API Endpoints

The application expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Non-Projects
- `GET /api/non-projects` - Get all non-projects
- `POST /api/non-projects` - Create non-project
- `PUT /api/non-projects/:id` - Update non-project
- `DELETE /api/non-projects/:id` - Delete non-project

## 🧹 Template Cleanup Summary

Template ini sudah dibersihkan dari file dan dependency yang tidak terpakai:

### Dependencies yang Dihapus
- `@bhplugin/vue3-datatable`
- `bootstrap-vue-editable-table`
- `vue-multi-select`
- `vue-simple-search-dropdown`
- `vue3-daterange-picker`
- `vue3-tags-input`
- `idle-vue`
- `notiflix`
- `sass-loader`
- `dotenv`
- `lodash.debounce`

### File/Folder yang Dihapus
- `src/assets/js/global/global.min.js`
- `src/assets/docs/document.pdf`
- `src/assets/Response/responseError.json`
- `src/common/debounce.js`
- `src/common/globalEncryptor.js`
- `src/common/inputValidators.js`
- `src/common/notificationService.js`
- `src/common/secureStorage.js`
- `src/common/format/formatDateTime.js`
- `src/translations/translation.js`
- `src/services/postgresql.service.js`
- Folder kosong lainnya

### Fitur yang Ditambahkan
- Konfigurasi environment variables (`env.example`)
- Konfigurasi database yang disederhanakan
- Struktur API service yang lebih bersih
- Error handling yang lebih baik
- Build process yang dioptimasi

## 🚀 Production Build

```bash
npm run build
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request