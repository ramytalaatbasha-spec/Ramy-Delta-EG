// ============================================
// DELTA Lighting Lab - JavaScript Functions
// ============================================

// Language and Theme Management
const htmlElement = document.documentElement;
const btnAr = document.getElementById('btn-ar');
const btnEn = document.getElementById('btn-en');

// Initialize language from localStorage
function initLanguage() {
  const savedLang = localStorage.getItem('language') || 'ar';
  setLanguage(savedLang);
}

// Set language
function setLanguage(lang) {
  htmlElement.lang = lang;
  htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  htmlElement.classList.toggle('en', lang === 'en');
  localStorage.setItem('language', lang);
  
  // Update active button
  if (btnAr && btnEn) {
    btnAr.classList.toggle('active', lang === 'ar');
    btnEn.classList.toggle('active', lang === 'en');
  }
}

// Language button listeners
if (btnAr) btnAr.addEventListener('click', () => setLanguage('ar'));
if (btnEn) btnEn.addEventListener('click', () => setLanguage('en'));

// ============================================
// DARK MODE MANAGEMENT
// ============================================

function initDarkMode() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    enableDarkMode();
  } else if (savedTheme === 'light') {
    disableDarkMode();
  }
}

function enableDarkMode() {
  htmlElement.classList.add('dark-mode');
  localStorage.setItem('theme', 'dark');
  updateDarkModeButton();
}

function disableDarkMode() {
  htmlElement.classList.remove('dark-mode');
  localStorage.setItem('theme', 'light');
  updateDarkModeButton();
}

function toggleDarkMode() {
  if (htmlElement.classList.contains('dark-mode')) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

function updateDarkModeButton() {
  const btn = document.getElementById('dark-mode-btn');
  if (btn) {
    btn.textContent = htmlElement.classList.contains('dark-mode') ? '☀️' : '🌙';
  }
}

// ============================================
// CAROUSEL FUNCTIONALITY
// ============================================

function initCarousel() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  let currentIndex = 0;
  const images = carousel.querySelectorAll('img');
  const totalImages = images.length;

  if (totalImages === 0) return;

  function rotateCarousel() {
    currentIndex = (currentIndex + 1) % totalImages;
    carousel.style.transform = `translateX(${-currentIndex * 100}%)`;
  }

  // Auto-rotate every 5 seconds
  setInterval(rotateCarousel, 5000);

  // Click to rotate
  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      carousel.style.transform = `translateX(${-currentIndex * 100}%)`;
    });
  });
}

// ============================================
// FORM HANDLING
// ============================================

function initFormHandling() {
  const form = document.getElementById('testRequestForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validate
    if (!data.name || !data.email || !data.test) {
      showNotification('الرجاء ملء جميع الحقول', 'error');
      return;
    }

    // Simulate sending
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = htmlElement.classList.contains('en') ? 'Sending...' : 'جاري الإرسال...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      showNotification(
        htmlElement.classList.contains('en')
          ? 'Request sent successfully! We will contact you soon.'
          : 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.',
        'success'
      );
      form.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1500);
  });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Styles for notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    color: 'white',
    fontWeight: '600',
    zIndex: '9999',
    animation: 'slideIn 0.3s ease-out',
    fontSize: '0.95rem',
  });

  if (type === 'success') {
    notification.style.background = 'linear-gradient(135deg, #00d4ff, #0066ff)';
  } else if (type === 'error') {
    notification.style.background = 'linear-gradient(135deg, #ff006e, #ff3366)';
  } else {
    notification.style.background = 'linear-gradient(135deg, #0066ff, #00d4ff)';
  }

  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'fadeIn 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
  });

  document.querySelectorAll('.test, .card, .device').forEach((el) => {
    observer.observe(el);
  });
}

// ============================================
// INTERACTIVE CARDS
// ============================================

function initInteractiveCards() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    card.addEventListener('click', function () {
      // Expand/collapse functionality
      cards.forEach((c) => {
        if (c !== this) {
          c.classList.remove('expanded');
        }
      });
      this.classList.toggle('expanded');
    });
  });
}

// ============================================
// THEME SYSTEM UPDATES
// ============================================

function updateLanguageDependentContent() {
  // You can add language-dependent updates here
  // For example, updating placeholder texts, aria-labels, etc.
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  // Initialize all features
  initLanguage();
  initDarkMode();
  initCarousel();
  initFormHandling();
  initSmoothScroll();
  initScrollAnimations();
  initInteractiveCards();
  updateLanguageDependentContent();

  // Set up dark mode button
  const darkModeBtn = document.getElementById('dark-mode-btn');
  if (darkModeBtn) {
    darkModeBtn.addEventListener('click', toggleDarkMode);
    updateDarkModeButton();
  }

  // Listen to system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        enableDarkMode();
      } else {
        disableDarkMode();
      }
    }
  });

  console.log('✅ DELTA Lighting Lab initialized successfully');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Detect if user prefers dark mode
function prefersDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Get current language
function getCurrentLanguage() {
  return htmlElement.lang || 'ar';
}

// Get current theme
function getCurrentTheme() {
  return htmlElement.classList.contains('dark-mode') ? 'dark' : 'light';
}

// Reload page with language change
function reloadPage() {
  window.location.reload();
}

// Export for use in other scripts
window.deltaLighting = {
  setLanguage,
  toggleDarkMode,
  getCurrentLanguage,
  getCurrentTheme,
  showNotification,
  reloadPage,
};
