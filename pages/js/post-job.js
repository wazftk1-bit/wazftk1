import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


document.getElementById("jobForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const company = document.getElementById("company").value.trim();
    const state = document.getElementById("stateSelect").value.trim();
    const city = document.getElementById("city").value.trim();
    const salary = document.getElementById("salary").value.trim();
    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();


    // 🔥 تحقق من الحقول
    if (!title) return alert("أدخل اسم الوظيفة");
    if (!company) return alert("أدخل اسم الشركة");
    if (!state) return alert("اختر الولاية");
    if (!city) return alert("أدخل المدينة");
    if (!description) return alert("أدخل التفاصيل");


    try {

        await addDoc(collection(db, "jobs"), {

            title,
            company,
            state,
            city,
            salary,
            type,
            description,
            email,
            phone,

            status: "approved", // أو pending لو عندك مراجعة
            createdAt: serverTimestamp()

        });

        alert("تم نشر الوظيفة بنجاح ✅");

        window.location.href = "jobs.html";

    } catch (error) {

        console.error(error);
        alert("حدث خطأ أثناء النشر ❌");
    }

});