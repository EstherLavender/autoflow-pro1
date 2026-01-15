export const config = {
  // API URL - uses environment variable in production, localhost in development
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  
  // App info
  appName: 'AutoFlow Pro',
  appVersion: '1.0.0',
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

export default config;
