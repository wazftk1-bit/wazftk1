import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyARM_FRLaB7U18dq7i3I5hVqI5U28zCQxM",
  authDomain: "wazftk-87fbf.firebaseapp.com",
  projectId: "wazftk-87fbf",
  storageBucket: "wazftk-87fbf.firebasestorage.app",
  messagingSenderId: "701237074217",
  appId: "1:701237074217:web:9c966b82116d4a096d3f38",
  measurementId: "G-HCSTH4TCZS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);