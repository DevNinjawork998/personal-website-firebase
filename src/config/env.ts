// Environment variables utility
// This module centralizes access to Vite environment variables
// and makes them easier to mock in tests

export const env = {
  // Firebase
  FIREBASE_API_KEY: import.meta.env.REACT_APP_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: import.meta.env.REACT_APP_FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: import.meta.env.REACT_APP_FIREBASE_MEASUREMENT_ID,

  // EmailJS
  EMAILJS_SERVICE_ID: import.meta.env.REACT_APP_EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID: import.meta.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY: import.meta.env.REACT_APP_EMAILJS_PUBLIC_KEY,

  // Environment
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  MODE: import.meta.env.MODE,
};

export default env;

