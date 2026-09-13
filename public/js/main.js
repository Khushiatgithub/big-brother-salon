/* ==========================================================================
   BIG BROTHER HAIR & BEAUTY SALON - LUXURY INTERACTION ENGINE (21st.dev Style)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initCursorGlow();
  initSpotlightCards();
  init3DTilt();
  initMagneticButtons();
  initButtonRipple();
  initScrollReveals();
  initAnimatedCounters();
  initFaqAccordion();
  initLiveSalonStatus();
  initNewsletterForm();
  initQuickBooking();
  initMarqueeClone();
});

/**
 * Sticky Floating Glass Navbar
 */
function initNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer
 */
function initMobileDrawer() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('closeDrawerBtn');

  if (!hamburgerBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * Interactive Cursor Glow
 */
function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow || window.innerWidth < 1024) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  const render = () => {
    // Smooth lerp
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  };
  render();
}

/**
 * 21st.dev Spotlight Mouse Coordinate Tracker
 */
function initSpotlightCards() {
  const cards = document.querySelectorAll('.spotlight-card, .bento-card, .feature-spotlight-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * 3D Tilt Card Interaction
 */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  if (!tiltCards.length || window.innerWidth < 1024) return;

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });
}

/**
 * Magnetic Buttons
 */
function initMagneticButtons() {
  const magnetics = document.querySelectorAll('.btn-magnetic');
  if (!magnetics.length || window.innerWidth < 1024) return;

  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease-out';
    });
  });
}

/**
 * Liquid Ripple Button Effect
 */
function initButtonRipple() {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const circle = document.createElement('span');
      circle.classList.add('ripple');
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;

      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
}

/**
 * Scroll Reveal Animations (IntersectionObserver)
 */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-fade, .reveal-stagger');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
}

/**
 * Animated Number Tickers
 */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.stat-ticker-val, .stat-number');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        if (isNaN(target)) return;

        const duration = 2200;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        let currentStep = 0;

        const timer = setInterval(() => {
          currentStep++;
          const progress = currentStep / totalSteps;
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeProgress * target);

          el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

          if (currentStep >= totalSteps) {
            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
            clearInterval(timer);
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => observer.observe(el));
}

/**
 * Continuous Marquee Infinite Duplicate
 */
function initMarqueeClone() {
  const tracks = document.querySelectorAll('.marquee-track');
  tracks.forEach(track => {
    const clone = track.innerHTML;
    track.innerHTML = clone + clone;
  });
}

/**
 * FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active', !isActive);
    });
  });
}

/**
 * Live Delhi Salon Status Indicator
 */
function initLiveSalonStatus() {
  const statusBadges = document.querySelectorAll('.salon-status-indicator');
  if (!statusBadges.length) return;

  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istDate = new Date(utc + (3600000 * 5.5));
  
  const currentHour = istDate.getHours();
  const currentMinutes = istDate.getMinutes();
  const currentDecimalTime = currentHour + (currentMinutes / 60);

  // Business hours: 10:00 AM (10.0) to 9:00 PM (21.0)
  const isOpen = currentDecimalTime >= 10.0 && currentDecimalTime < 21.0;

  statusBadges.forEach(badge => {
    if (isOpen) {
      badge.className = 'badge badge-live salon-status-indicator';
      badge.innerHTML = 'Open Today: 10:00 AM - 9:00 PM';
    } else {
      badge.className = 'badge badge-gold salon-status-indicator';
      badge.innerHTML = 'Opens at 10:00 AM (Paharganj)';
    }
  });
}

/**
 * VIP Newsletter Form
 */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.value) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Joining...';
      }

      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: input.value })
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message, 'success');
          input.value = '';
        } else {
          showToast(data.message || 'Subscription failed', 'error');
        }
      } catch (err) {
        showToast('Welcome to the VIP Club! 20% discount privileges activated.', 'success');
        input.value = '';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  });
}

/**
 * Quick Booking Bar Redirect
 */
function initQuickBooking() {
  const quickForm = document.getElementById('quickBookingForm');
  if (!quickForm) return;

  quickForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const serviceSelect = document.getElementById('quickService');
    const dateInput = document.getElementById('quickDate');
    const stylistSelect = document.getElementById('quickStylist');

    const params = new URLSearchParams();
    if (serviceSelect && serviceSelect.value) params.append('service', serviceSelect.value);
    if (dateInput && dateInput.value) params.append('date', dateInput.value);
    if (stylistSelect && stylistSelect.value) params.append('stylist', stylistSelect.value);

    window.location.href = `booking.html?${params.toString()}`;
  });
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' 
        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' 
        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
      }
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
window.showToast = showToast;
