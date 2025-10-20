// Database Configuration using Environment Variables
export const DB_CONFIG = {
  host: import.meta.env.VITE_DB_HOST || 'localhost',
  port: import.meta.env.VITE_DB_PORT || 5432,
  database: import.meta.env.VITE_DB_NAME || 'boa_apps',
  username: import.meta.env.VITE_DB_USER || 'postgres',
  password: import.meta.env.VITE_DB_PASSWORD || '',
  ssl: import.meta.env.VITE_DB_SSL === 'true' || false
}

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api/',
  loginURL: import.meta.env.VITE_BASE_URL_LOGIN || 'http://localhost:3000/api/auth/',
  authLogin: import.meta.env.VITE_AUTH_LOGIN || 'login',
  authLogout: import.meta.env.VITE_AUTH_LOGOUT || 'logout',
  refreshToken: import.meta.env.VITE_REFRESH_TOKEN || 'refresh-token',
  timeout: 60000
}

// Application Configuration
export const APP_CONFIG = {
  version: import.meta.env.VITE_VERSION || '1.0.0',
  salt: import.meta.env.VITE_SALT || 'default_salt',
  environment: import.meta.env.VITE_NODE_ENV || 'development',
  jwtSecret: import.meta.env.VITE_JWT_SECRET || 'default_jwt_secret',
  encryptionKey: import.meta.env.VITE_ENCRYPTION_KEY || 'default_encryption_key',
  sessionTimeout: import.meta.env.VITE_SESSION_TIMEOUT || 3600000,
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  enableLogging: import.meta.env.VITE_ENABLE_LOGGING === 'true'
}
