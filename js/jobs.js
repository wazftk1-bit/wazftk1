import { db } from './firebase-config.js';
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// تحديث شريط التنقل
onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
            logoutBtn.onclick = () => auth.signOut().then(() => location.reload());
        }
    }
});

// تحميل الوظائف
async function loadJobs(searchTerm = '', category = '') {
    const jobsGrid = document.getElementById('jobsGrid');
    const jobsCount = document.getElementById('jobsCount');
    
    jobsGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> جاري تحميل الوظائف...</div>';
    
    try {
        // ✅ استعلام بسيط بدون فلترة معقدة لتجنب مشاكل الفهارس
        const q = query(
            collection(db, 'jobs'), 
            orderBy('createdAt', 'desc'), 
            limit(100)
        );
        
        const snapshot = await getDocs(q);
        let jobs = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            jobs.push({ id: doc.id, ...data });
        });
        
        // فلترة في الواجهة (Client-side filtering)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            jobs = jobs.filter(j => 
                (j.title && j.title.toLowerCase().includes(term)) || 
                (j.company && j.company.toLowerCase().includes(term)) ||
                (j.description && j.description.toLowerCase().includes(term))
            );
        }
        
        if (category) {
            jobs = jobs.filter(j => j.category === category);
        }
        
        if (jobsCount) {
            jobsCount.textContent = `${jobs.length} وظيفة متاحة`;
        }
        
        if (jobs.length === 0) {
            jobsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 20px; display: block;"></i>
                    <h3>لا توجد وظائف مطابقة</h3>
                    <p style="color: #64748b;">جرب بحثاً مختلفاً أو أضف وظيفة جديدة</p>
                    <a href="post-job.html" class="btn btn-primary" style="margin-top: 15px;">نشر وظيفة</a>
                </div>
            `;
            return;
        }
        
        jobsGrid.innerHTML = jobs.map(job => {
            const date = job.createdAt 
                ? new Date(job.createdAt.toDate()).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })
                : 'حديثاً';
            
            return `
                <div class="job-card" onclick="window.location.href='job-details.html?id=${job.id}'" style="cursor: pointer;">
                    <div class="job-card-header">
                        <img src="${job.logo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(job.company || 'Company') + '&background=6366f1&color=fff'}" 
                             alt="${job.company || 'شركة'}" class="company-logo">
                        <span style="color: #94a3b8; font-size: 0.8rem;">${date}</span>
                    </div>
                    <h3>${job.title || 'بدون عنوان'}</h3>
                    <p class="company">${job.company || 'شركة غير معروفة'}</p>
                    <div class="job-tags">
                        <span class="badge badge-primary">${job.category || 'عام'}</span>
                        <span class="badge badge-secondary">${job.type || 'دوام كامل'}</span>
                        <span class="badge badge-outline">${job.location ? job.location.split(',')[0] : 'غير محدد'}</span>
                    </div>
                    <div class="job-footer">
                        <span class="salary"><i class="fas fa-money-bill"></i> ${job.salary || 'غير محدد'}</span>
                        <span class="location"><i class="fas fa-map-marker-alt"></i> ${job.location || 'غير محدد'}</span>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading jobs:', error);
        
        let errorMessage = 'حدث خطأ غير متوقع';
        
        if (error.code === 'permission-denied') {
            errorMessage = 'خطأ في صلاحيات الوصول - تحقق من قواعد Firestore';
        } else if (error.code === 'failed-precondition') {
            errorMessage = 'يلزم إنشاء فهرس في Firestore (Index required)';
        } else if (error.code === 'unavailable') {
            errorMessage = 'الشبكة غير متوفرة - تحقق من اتصال الإنترنت';
        } else if (error.message && error.message.includes('index')) {
            errorMessage = 'يلزم إنشاء فهرس في Firestore';
        }
        
        jobsGrid.innerHTML = `
            <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 60px;">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #ef4444; margin-bottom: 15px; display: block;"></i>
                <h3 style="color: #1e1b4b; margin-bottom: 10px;">${errorMessage}</h3>
                <p style="color: #64748b; margin-bottom: 20px;">${error.message || ''}</p>
                <button onclick="location.reload()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}

// أحداث البحث
document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            loadJobs(searchInput ? searchInput.value : '', categoryFilter ? categoryFilter.value : '');
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                loadJobs(searchInput.value, categoryFilter ? categoryFilter.value : '');
            }
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            loadJobs(searchInput ? searchInput.value : '', categoryFilter.value);
        });
    }
});