/* ============================================
   Jonathan Coja — Portfolio Script
   - Active nav highlighting on scroll
   - Contact form validation (client-side only)
   - Back-to-top button
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initActiveNav();
  initContactForm();
  initBackToTop();
});

/* ---------- Active nav link on scroll ---------- */

function initActiveNav() {
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Contact form validation ---------- */

function initContactForm() {
  const form = document.querySelector('#contact form');
  if (!form) return;

  const nameField = form.querySelector('#name');
  const emailField = form.querySelector('#email');
  const messageField = form.querySelector('#message');
  const submitBtn = form.querySelector('button[type="submit"]');

  let statusEl = form.querySelector('.form-status');
  if (!statusEl) {
    statusEl = document.createElement('p');
    statusEl.className = 'form-status';
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');
    form.appendChild(statusEl);
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showFieldError = (field, message) => {
    clearFieldError(field);
    if (!message) return;
    const errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    field.setAttribute('aria-invalid', 'true');
    field.insertAdjacentElement('afterend', errorEl);
  };

  const clearFieldError = (field) => {
    field.removeAttribute('aria-invalid');
    const next = field.nextElementSibling;
    if (next && next.classList.contains('field-error')) {
      next.remove();
    }
  };

  const validateField = (field) => {
    const value = field.value.trim();

    if (field === nameField && !value) {
      showFieldError(field, 'Enter your name.');
      return false;
    }

    if (field === emailField) {
      if (!value) {
        showFieldError(field, 'Enter your email.');
        return false;
      }
      if (!emailPattern.test(value)) {
        showFieldError(field, 'Enter a valid email address.');
        return false;
      }
    }

    if (field === messageField && !value) {
      showFieldError(field, 'Write a short message.');
      return false;
    }

    clearFieldError(field);
    return true;
  };

  [nameField, emailField, messageField].forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = [nameField, emailField, messageField];
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      statusEl.dataset.state = 'error';
      statusEl.textContent = 'Please fix the highlighted fields.';
      return;
    }

    // No backend is wired up yet — this simulates a send so the form
    // feels responsive. Replace with a real fetch() call when ready.
    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');
    statusEl.dataset.state = '';
    statusEl.textContent = 'Sending...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
      statusEl.dataset.state = 'success';
      statusEl.textContent = `Thanks, ${nameField.value.trim()}. Your message is ready to send once a backend is connected.`;
      form.reset();
    }, 700);
  });
}

/* ---------- Back to top button ---------- */

function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.textContent = '↑';
  document.body.appendChild(btn);

  const toggleVisibility = () => {
    btn.classList.toggle('visible', window.scrollY > 480);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}