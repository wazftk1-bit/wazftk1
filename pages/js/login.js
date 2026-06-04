import { auth, db } from "./firebase.js";

import {
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


/* =========================
   Google Login
========================= */

document.getElementById("googleLogin")
.addEventListener("click", async () => {

    const provider = new GoogleAuthProvider();

    try {

        const result =
        await signInWithPopup(auth, provider);

        const user = result.user;

        const userRef =
        doc(db, "users", user.uid);

        const userSnap =
        await getDoc(userRef);

        // إنشاء المستخدم أول مرة
        if (!userSnap.exists()) {

            await setDoc(userRef, {

                name: user.displayName,
                email: user.email,
                role: "jobseeker",

                createdAt: new Date().toISOString()
            });
        }

        const finalData =
        await getDoc(userRef);

        redirectUser(finalData.data().role);

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
});


/* =========================
   التوجيه حسب الصفحات المتاحة
========================= */

function redirectUser(role) {

    switch (role) {

        case "admin":
            window.location.href = "/admin.html";
            break;

        case "company":
            window.location.href = "/pages/post-job.html";
            break;

        case "jobseeker":
            window.location.href = "/pages/jobs.html";
            break;

        default:
            window.location.href = "/pages/jobs.html";
            break;
    }
}