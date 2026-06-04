import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const form = document.getElementById("registerForm");


form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name =
    document.getElementById("name").value;

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    const role =
    document.getElementById("role").value;

    const submitBtn = form.querySelector("button");

    // تحقق بسيط
    if (!name || !email || !password) {
        alert("الرجاء تعبئة جميع الحقول");
        return;
    }

    if (password.length < 6) {
        alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "جاري إنشاء الحساب...";

    try {

        const userCredential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {

            name,
            email,
            role,

            createdAt: new Date().toISOString()
        });

        alert("تم إنشاء الحساب بنجاح");

        window.location.href = "login.html";

    } catch (error) {

        console.error(error);

        if (error.code === "auth/email-already-in-use") {
            alert("هذا البريد مستخدم بالفعل");
        } else {
            alert("حدث خطأ أثناء إنشاء الحساب");
        }

    } finally {

        submitBtn.disabled = false;
        submitBtn.innerText = "إنشاء الحساب";
    }

});