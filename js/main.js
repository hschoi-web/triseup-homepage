document.addEventListener('DOMContentLoaded', () => {
  initGNB();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initFAQ();
  initFilterTabs();
  initChannelTabs();
  initDemoForm();
});

/* ---------- GNB Sticky ---------- */
function initGNB() {
  const gnb = document.getElementById('gnb');
  if (!gnb) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 10) {
      gnb.classList.add('scrolled');
    } else {
      gnb.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  if (!hamburger || !mobileMenu) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    mobileMenu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Mobile sub-nav toggle
  const navTitles = mobileMenu.querySelectorAll('.mobile-nav-title');
  navTitles.forEach(title => {
    title.addEventListener('click', () => {
      const subnav = title.nextElementSibling;
      if (subnav) {
        subnav.classList.toggle('open');
        const chevron = title.querySelector('.chevron');
        if (chevron) {
          chevron.style.transform = subnav.classList.contains('open') ? 'rotate(180deg)' : '';
        }
      }
    });
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ---------- Counter Animation ---------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-value[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = target > 1000 ? 2000 : 1200;
  const start = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutExpo(progress);
    const current = Math.round(eased * target);

    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ---------- FAQ Accordion ---------- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      items.forEach(other => other.classList.remove('open'));

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ---------- Filter Tabs (Cases) ---------- */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.case-card[data-category]');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.filter;

      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ---------- Channel Tabs (PMS) ---------- */
function initChannelTabs() {
  const tabs = document.querySelectorAll('.channel-tab');
  const contents = document.querySelectorAll('.channel-content');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.channel);
      if (target) target.classList.add('active');
    });
  });
}

/* ---------- Demo Form ---------- */
function initDemoForm() {
  const form = document.getElementById('demoForm');
  if (!form) return;

  // Auto-fill from URL params
  const params = new URLSearchParams(window.location.search);
  const productParam = params.get('product');
  if (productParam) {
    const productSelect = form.querySelector('[name="product"]');
    if (productSelect) {
      const mapping = {
        pms: 'PMS',
        tms: 'TMS',
        license: '면허 솔루션',
        marketplace: 'Marketplace'
      };
      if (mapping[productParam]) {
        productSelect.value = mapping[productParam];
      }
    }
  }

  const caseParam = params.get('case');
  if (caseParam) {
    const messageField = form.querySelector('[name="message"]');
    if (messageField) {
      messageField.value = `[${decodeURIComponent(caseParam)}] 관련 문의`;
    }
  }

  // Phone auto-format
  const phoneInput = form.querySelector('[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 3 && val.length <= 7) {
        val = val.slice(0, 3) + '-' + val.slice(3);
      } else if (val.length > 7) {
        val = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7, 11);
      }
      e.target.value = val;
    });
  }

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(err => err.style.display = 'none');
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    let hasError = false;

    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        showFieldError(field, '필수 입력 항목입니다.');
        hasError = true;
      }
    });

    // Validate email
    const emailField = form.querySelector('[name="email"]');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        showFieldError(emailField, '올바른 이메일 주소를 입력해주세요.');
        hasError = true;
      }
    }

    // Validate phone
    if (phoneInput && phoneInput.value) {
      const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
      if (!phoneRegex.test(phoneInput.value)) {
        showFieldError(phoneInput, '올바른 연락처를 입력해주세요. (예: 010-1234-5678)');
        hasError = true;
      }
    }

    if (hasError) return;

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('Demo form submitted:', data);

    // Show success
    form.style.display = 'none';
    const successEl = document.getElementById('formSuccess');
    if (successEl) successEl.classList.add('show');
  });
}

function showFieldError(field, message) {
  field.classList.add('error');
  const errorEl = field.parentElement.querySelector('.form-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}
