import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmUuw0hGoM29guvPbnWygT2F5phYSkPG0",
  authDomain: "ai-virtual-assistent.firebaseapp.com",
  projectId: "ai-virtual-assistent",
  storageBucket: "ai-virtual-assistent.firebasestorage.app",
  messagingSenderId: "915862734685",
  appId: "1:915862734685:web:2a1c827edabefdf3488ab4",
  measurementId: "G-4F1QYPN4BG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();