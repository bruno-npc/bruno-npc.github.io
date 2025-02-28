import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Exibir as variáveis de ambiente no console para depuração
console.log("Firebase Config Debug:");
console.log("API Key:", process.env.REACT_APP_FIREBASE_API_KEY || "MISSING_KEY");
console.log("Auth Domain:", process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "MISSING_AUTH_DOMAIN");
console.log("Project ID:", process.env.REACT_APP_FIREBASE_PROJECT_ID || "MISSING_PROJECT_ID");
console.log("Storage Bucket:", process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "MISSING_STORAGE_BUCKET");
console.log("Messaging Sender ID:", process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "MISSING_MESSAGING_SENDER_ID");
console.log("App ID:", process.env.REACT_APP_FIREBASE_APP_ID || "MISSING_APP_ID");

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };