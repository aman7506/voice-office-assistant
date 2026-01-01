// Voice Office Assistant - Mobile App Configuration Template
// Copy this file to config.js and update with your values
// NEVER commit config.js with real API URLs to Git

const ENV = {
  development: {
    apiUrl: 'http://localhost:5000',
    socketUrl: 'http://localhost:5000',
    enableLogging: true,
    timeout: 30000,
  },
  production: {
    apiUrl: 'https://your-production-api.com',
    socketUrl: 'https://your-production-api.com',
    enableLogging: false,
    timeout: 15000,
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.development;
  }
  return ENV.production;
};

export default getEnvVars();
