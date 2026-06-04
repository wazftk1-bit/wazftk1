import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


/* =========================
   1. البحث عن الوظائف
========================= */

function searchJobs() {

    const state =
    document.getElementById("stateSelect").value;

    if (!state) {
        alert("الرجاء اختيار ولاية");
        return;
    }

    window.location.href =
    `jobs.html?state=${encodeURIComponent(state)}`;
}

// جعلها متاحة في HTML
window.searchJobs = searchJobs;


/* =========================
   2. حماية صفحة الأدمن
========================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.href = "login.html";
        return;
    }

    try {

        const userDoc =
        await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
            location.href = "login.html";
            return;
        }

        const userData = userDoc.data();

        if (userData.role !== "admin") {
            location.href = "index.html";
        }

    } catch (error) {

        console.error(error);

        location.href = "login.html";
    }

});
function searchJobs() {
    const state = document.getElementById("stateSelect").value;

    if (!state) {
        alert("اختر ولاية");
        return;
    }

    window.location.href =
    `pages/jobs.html?state=${encodeURIComponent(state)}`;
}

window.searchJobs = searchJobs;