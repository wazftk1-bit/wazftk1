import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const jobsContainer = document.getElementById("jobsContainer");
const stateTitle = document.getElementById("stateTitle");
const stateSelect = document.getElementById("stateSelect");


// 🔥 تحميل الوظائف مع UX حديث
async function loadJobs(state = null) {

    try {

        // ✨ إظهار تحميل فوري
        jobsContainer.innerHTML = `
            <div style="text-align:center; padding:20px;">
                ⏳ جاري تحميل الوظائف...
            </div>
        `;

        let q;

        const cleanState = (state || "").trim();

        if (cleanState) {

            stateTitle.innerText = `جاري تحميل وظائف ${cleanState}...`;

            q = query(
                collection(db, "jobs"),
                where("state", "==", cleanState)
            );

        } else {

            stateTitle.innerText = "جاري تحميل كل الوظائف...";

            q = collection(db, "jobs");
        }

        const snapshot = await getDocs(q);

        // لو مافي بيانات
        if (snapshot.empty) {
            jobsContainer.innerHTML = `
                <p style="text-align:center;">لا توجد وظائف</p>
            `;
            stateTitle.innerText = "لا توجد وظائف";
            return;
        }

        let html = "";

        snapshot.forEach((doc) => {

            const job = doc.data();

            html += `
                <div class="job-card" style="animation: fadeIn 0.3s ease;">

                    <h3>${job.title || "بدون عنوان"}</h3>

                    <p>🏢 ${job.company || "غير معروف"}</p>

                    <p>📍 ${job.state || ""} - ${job.city || ""}</p>

                    <button onclick="location.href='job-details.html?id=${doc.id}'">
                        عرض التفاصيل
                    </button>

                </div>
            `;
        });

        jobsContainer.innerHTML = html;

        // ✨ عنوان نهائي بعد التحميل
        stateTitle.innerText = cleanState
            ? `وظائف ${cleanState}`
            : "كل الوظائف المتاحة";

    } catch (err) {

        console.error(err);

        jobsContainer.innerHTML = "<p>حدث خطأ أثناء التحميل</p>";
    }
}


// 🔥 تشغيل أول مرة
loadJobs();


// 🔥 فلترة حديثة (سريعة + UX)
stateSelect.addEventListener("change", (e) => {

    const value = e.target.value;

    loadJobs(value);

});