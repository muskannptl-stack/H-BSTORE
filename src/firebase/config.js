import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// These are placeholder keys. You will need to replace them with your actual 
// Firebase project keys from the Firebase Console (https://console.firebase.google.com/)
const firebaseConfig = {
  apiKey: "AIzaSyAjAJ_gJ1OB-d8FgJ3xOCw7S6B8R1-ZePY",
  authDomain: "hb-store-93cbe.firebaseapp.com",
  projectId: "hb-store-93cbe",
  storageBucket: "hb-store-93cbe.firebasestorage.app",
  messagingSenderId: "908321476802",
  appId: "1:908321476802:web:7672482e945b23565eeb5b",
  measurementId: "G-QN9E0WHQG4"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
