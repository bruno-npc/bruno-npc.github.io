import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const requiredConfigKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

const isFirebaseConfigured = requiredConfigKeys.every((key) => Boolean(firebaseConfig[key]));
let firebaseInitializationError = null;
let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    firebaseInitializationError = error;
    console.error("Erro ao inicializar Firebase:", error);
  }
} else {
  firebaseInitializationError = new Error("Configuração do Firebase ausente.");
}

const reportDatabaseUnavailable = (error) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("database-unavailable", {
      detail: {
        message: error?.message || "Banco de dados indisponível.",
      },
    })
  );
};

export {
  app,
  db,
  auth,
  firebaseConfig,
  firebaseInitializationError,
  isFirebaseConfigured,
  reportDatabaseUnavailable,
};
