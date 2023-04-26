import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWdV32CUU4OBA5947K_2E8wK85oyAhQzI",
  authDomain: "next-snake-7da2a.firebaseapp.com",
  projectId: "next-snake-7da2a",
  storageBucket: "next-snake-7da2a.appspot.com",
  messagingSenderId: "516799534122",
  appId: "1:516799534122:web:e5e0c927feff0b9601df53",
  measurementId: "G-W86SLF91R8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//required functions
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
