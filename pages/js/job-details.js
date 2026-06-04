import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const jobContainer = document.getElementById("jobContainer");


// 🔥 جلب ID من الرابط
const urlParams = new URLSearchParams(window.location.search);
const jobId = urlParams.get("id");


// 🔥 تحميل التفاصيل
async function loadJobDetails() {

    if (!jobId) {
        jobContainer.innerHTML = "<p>لا توجد وظيفة</p>";
        return;
    }

    try {

        jobContainer.innerHTML = "<p>جاري تحميل البيانات...</p>";

        const jobRef = doc(db, "jobs", jobId);
        const jobSnap = await getDoc(jobRef);

        if (!jobSnap.exists()) {
            jobContainer.innerHTML = "<p>الوظيفة غير موجودة</p>";
            return;
        }

        const job = jobSnap.data();

        jobContainer.innerHTML = `
            <div class="job-details">

                <h2>${job.title || "بدون عنوان"}</h2>

                <p><strong>🏢 الشركة:</strong> ${job.company || "غير معروف"}</p>

                <p><strong>📍 الولاية:</strong> ${job.state || ""}</p>

                <p><strong>🏙️ المدينة:</strong> ${job.city || ""}</p>

                <p><strong>💰 الراتب:</strong> ${job.salary || "غير مذكور"}</p>

                <p><strong>⏰ نوع الوظيفة:</strong> ${job.type || ""}</p>

                <hr>

                <h3>الوصف</h3>
                <p>${job.description || ""}</p>

                <hr>

                <h3>التواصل</h3>
                <p>📧 ${job.email || ""}</p>
                <p>📞 ${job.phone || ""}</p>

            </div>
        `;

    } catch (error) {
        console.error(error);
        jobContainer.innerHTML = "<p>حدث خطأ في تحميل البيانات</p>";
    }
}


// تشغيل
loadJobDetails();