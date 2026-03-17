/* ============================================
   script.js — Sherbek Ashirov Portfolio
   ============================================ */

/* ──────────────────────────────────────────
   1. RASM YUKLASH FUNKSIYALARI
   ────────────────────────────────────────── */

/**
 * Fayl tanlash dialogini ochish
 */
function triggerFileUpload() {
    document.getElementById('photoInput').click();
}

/**
 * Yuklangan rasmni qayta ishlash
 * @param {Event} event - input[type=file] change hodisasi
 */
function handlePhotoUpload(event) {
    const file = event.target.files[0];

    // Fayl tanlanganmi?
    if (!file) return;

    // Rasm turini tekshirish
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        showToast('❌ Faqat JPG, PNG, WEBP yoki GIF formatdagi rasmlar qabul qilinadi!', 'error');
        return;
    }

    // Fayl hajmini tekshirish (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB bytes
    if (file.size > maxSize) {
        showToast('❌ Rasm hajmi 5MB dan oshmasligi kerak!', 'error');
        return;
    }

    // FileReader yordamida rasmni o'qish
    const reader = new FileReader();

    reader.onload = function (e) {
        const imgSrc = e.target.result;

        const profilePhoto   = document.getElementById('profilePhoto');
        const photoPlaceholder = document.getElementById('photoPlaceholder');
        const removeBtn      = document.getElementById('removePhotoBtn');

        // Rasmni o'rnatish
        profilePhoto.src   = imgSrc;
        profilePhoto.style.display = 'block';

        // Placeholder'ni yashirish
        photoPlaceholder.style.display = 'none';

        // O'chirish tugmasini ko'rsatish
        removeBtn.style.display = 'flex';

        // LocalStorage'ga saqlash (sahifa yangilanishida saqlansin)
        try {
            localStorage.setItem('portfolioProfilePhoto', imgSrc);
        } catch (storageError) {
            // localStorage to'lsa xato bermaydi, faqat o'sha sessiya uchun ishlaydi
            console.warn("LocalStorage'ga saqlashda xatolik:", storageError);
        }

        showToast('✅ Rasm muvaffaqiyatli yuklandi!', 'success');
    };

    reader.onerror = function () {
        showToast('❌ Rasm o\'qishda xatolik yuz berdi. Qayta urinib ko\'ring.', 'error');
    };

    reader.readAsDataURL(file);

    // Input'ni tozalash (xuddi shu faylni qayta yuklash imkoni bo'lsin)
    event.target.value = '';
}

/**
 * Rasmni o'chirish va placeholder'ni qaytarish
 */
function removePhoto() {
    const profilePhoto    = document.getElementById('profilePhoto');
    const photoPlaceholder  = document.getElementById('photoPlaceholder');
    const removeBtn       = document.getElementById('removePhotoBtn');

    // Rasmni yashirish
    profilePhoto.src   = '';
    profilePhoto.style.display = 'none';

    // Placeholder'ni ko'rsatish
    photoPlaceholder.style.display = 'flex';

    // O'chirish tugmasini yashirish
    removeBtn.style.display = 'none';

    // LocalStorage'dan o'chirish
    try {
        localStorage.removeItem('portfolioProfilePhoto');
    } catch (e) {
        console.warn('LocalStorage xatosi:', e);
    }

    showToast('🗑️ Rasm o\'chirildi.', 'success');
}

/**
 * Sahifa yuklanganda saqlangan rasmni tiklash
 */
function loadSavedPhoto() {
    try {
        const savedPhoto = localStorage.getItem('portfolioProfilePhoto');
        if (savedPhoto) {
            const profilePhoto    = document.getElementById('profilePhoto');
            const photoPlaceholder  = document.getElementById('photoPlaceholder');
            const removeBtn       = document.getElementById('removePhotoBtn');

            profilePhoto.src   = savedPhoto;
            profilePhoto.style.display = 'block';
            photoPlaceholder.style.display = 'none';
            removeBtn.style.display = 'flex';
        }
    } catch (e) {
        // LocalStorage mavjud bo'lmasa jimgina o'tkazib yuborish
        console.warn('Saqlangan rasmni tiklashda xatolik:', e);
    }
}

/* ──────────────────────────────────────────
   2. TOAST BILDIRISHNOMA
   ────────────────────────────────────────── */

let toastTimer = null;

/**
 * Ekranning pastida qisqa bildirishnoma ko'rsatish
 * @param {string} message  - Ko'rsatiladigan matn
 * @param {string} type     - 'success' | 'error' | ''
 */
function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    // Avvalgi timer'ni bekor qilish
    if (toastTimer) clearTimeout(toastTimer);

    toast.textContent = message;
    toast.className   = 'toast'; // klasslarni tiklash
    if (type) toast.classList.add(type);

    // Animatsiya bilan ko'rsatish
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // 3 soniyadan so'ng yashirish
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* ──────────────────────────────────────────
   3. MOBIL MENYU
   ────────────────────────────────────────── */

function toggleMobileMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
}

/* ──────────────────────────────────────────
   4. SILLIQ O'TISHLAR (Smooth Scroll)
   ────────────────────────────────────────── */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.getElementById('navMenu').classList.remove('active');
        }
    });
});

/* ──────────────────────────────────────────
   5. SCROLL ANIMATSIYALARI (Intersection Observer)
   ────────────────────────────────────────── */

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => scrollObserver.observe(el));

/* ──────────────────────────────────────────
   6. AKTIV NAVIGATSIYA (scroll holatida)
   ────────────────────────────────────────── */

window.addEventListener('scroll', () => {
    const sections  = document.querySelectorAll('section');
    const navLinks  = document.querySelectorAll('.nav-links a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--primary)';
        }
    });
});

/* ──────────────────────────────────────────
   7. ALOQA FORMASI
   ────────────────────────────────────────── */

function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data     = Object.fromEntries(formData);
    showToast(`✅ Rahmat, ${data.name}! Xabaringiz yuborildi.`, 'success');
    e.target.reset();
}

/* ──────────────────────────────────────────
   8. REZYUME YUKLAB OLISH
   ────────────────────────────────────────── */

function downloadResume() {
    showToast('📄 Rezyume yuklanmoqda...', '');
    // Haqiqiy faylda: window.location.href = 'Sherbek_Ashirov_Resume.pdf';
}

/* ──────────────────────────────────────────
   9. DRAG & DROP RASM YUKLASH
   ────────────────────────────────────────── */

(function setupDragDrop() {
    const frame = document.getElementById('photoFrame');
    if (!frame) return;

    ['dragenter', 'dragover'].forEach(eventName => {
        frame.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            frame.style.outline = '4px dashed var(--primary)';
            frame.style.outlineOffset = '6px';
        });
    });

    ['dragleave', 'dragend', 'drop'].forEach(eventName => {
        frame.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            frame.style.outline = '';
            frame.style.outlineOffset = '';
        });
    });

    frame.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            // Fayl tanlash hodisasini simulyatsiya qilish
            const input = document.getElementById('photoInput');
            // DataTransfer orqali FileInput'ga fayl yuborish
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(files[0]);
            input.files = dataTransfer.files;

            // handlePhotoUpload'ni chaqirish
            handlePhotoUpload({ target: input });
        }
    });
})();

/* ──────────────────────────────────────────
   10. SAHIFA YUKLANGANDA ISHGA TUSHIRISH
   ────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
    loadSavedPhoto();
});
