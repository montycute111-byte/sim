// Firebase web config (public client config).
// Replace these placeholder values with your project settings from:
// Firebase Console -> Project settings -> General -> Your apps (Web app) -> SDK setup and configuration
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

window.FIREBASE_CONFIG =
  firebaseConfig.apiKey === "REPLACE_ME" ? null : firebaseConfig;
