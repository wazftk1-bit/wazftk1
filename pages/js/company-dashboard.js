import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


const jobsContainer =
document.getElementById("jobsContainer");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.href = "login.html";
        return;
    }

    loadCompanyJobs(user.uid);
});


async function loadCompanyJobs(uid) {

    jobsContainer.innerHTML = "جاري التحميل...";

    try {

        const snapshot =
        await getDocs(collection(db, "jobs"));

        jobsContainer.innerHTML = "";

        let found = false;

        snapshot.forEach((jobDoc) => {

            const job = jobDoc.data();

            if (job.companyId === uid) {

                found = true;

                jobsContainer.innerHTML += `
                <div class="job-card">

                    <h3>${job.title}</h3>

                    <p>${job.state} - ${job.city}</p>

                    <p>الحالة: ${job.status}</p>

                    <button onclick="editJob('${jobDoc.id}')">
                        تعديل
                    </button>

                    <button onclick="deleteJob('${jobDoc.id}')">
                        حذف
                    </button>

                    <button onclick="viewApplicants('${jobDoc.id}')">
                        المتقدمون
                    </button>

                </div>
                `;
            }

        });

        if (!found) {
            jobsContainer.innerHTML =
            "<p>لا توجد وظائف منشورة بعد</p>";
        }

    } catch (error) {

        console.error(error);

        jobsContainer.innerHTML =
        "<p>حدث خطأ أثناء تحميل الوظائف</p>";
    }
}


// 🔥 حذف وظيفة
window.deleteJob = async (id) => {

    const confirmDelete =
    confirm("هل تريد حذف الوظيفة ؟");

    if (!confirmDelete) return;

    try {

        await deleteDoc(doc(db, "jobs", id));

        alert("تم حذف الوظيفة");

        location.reload();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء الحذف");
    }
};


// 🔥 تعديل (جاهزة للربط مع صفحة أخرى)
window.editJob = (id) => {

    location.href = `edit-job.html?id=${id}`;
};


// 🔥 عرض المتقدمين
window.viewApplicants = (id) => {

    location.href = `applicants.html?jobId=${id}`;
};