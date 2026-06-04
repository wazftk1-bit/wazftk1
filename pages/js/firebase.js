// firebase.js (إعداد موحّد لكل المشروع)

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";


// إعداد Firebase الخاص بك
const firebaseConfig = {
  apiKey: "AIzaSyARM_FRLaB7U18dq7i3I5hVqI5U28zCQxM",
  authDomain: "wazftk-87fbf.firebaseapp.com",
  projectId: "wazftk-87fbf",
  storageBucket: "wazftk-87fbf.firebasestorage.app",
  messagingSenderId: "701237074217",
  appId: "1:701237074217:web:9c966b82116d4a096d3f38",
  measurementId: "G-HCSTH4TCZS"
};


// تشغيل Firebase
const app = initializeApp(firebaseConfig);


// الخدمات الأساسية
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


// تصديرهم لاستخدامهم في أي ملف
export { auth, db, storage };