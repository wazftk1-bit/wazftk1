import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const container =
document.getElementById("jobsContainer");

async function loadPendingJobs() {

    container.innerHTML = "جاري التحميل...";

    try {

        const snapshot =
        await getDocs(collection(db, "jobs"));

        container.innerHTML = "";

        let found = false;

        snapshot.forEach((jobDoc) => {

            const job = jobDoc.data();

            if (job.status === "pending") {

                found = true;

                container.innerHTML += `
                <div class="job-card">

                    <h3>${job.title}</h3>

                    <p>الشركة: ${job.company}</p>

                    <p>الولاية: ${job.state}</p>

                    <p>المدينة: ${job.city}</p>

                    <button onclick="approveJob('${jobDoc.id}')">
                        موافقة
                    </button>

                    <button onclick="rejectJob('${jobDoc.id}')">
                        رفض
                    </button>

                </div>
                `;
            }

        });

        if (!found) {
            container.innerHTML =
            "<p>لا توجد وظائف معلقة.</p>";
        }

    } catch (error) {

        console.error(error);

        container.innerHTML =
        "<p>حدث خطأ أثناء تحميل البيانات</p>";
    }
}

window.approveJob = async (id) => {

    const jobRef = doc(db, "jobs", id);

    await updateDoc(jobRef, {
        status: "approved"
    });

    alert("تمت الموافقة على الوظيفة");

    loadPendingJobs();
};

window.rejectJob = async (id) => {

    const jobRef = doc(db, "jobs", id);

    await updateDoc(jobRef, {
        status: "rejected"
    });

    alert("تم رفض الوظيفة");

    loadPendingJobs();
};

loadPendingJobs();