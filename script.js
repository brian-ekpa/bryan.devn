// ============================================
// BRYANT EKPA PORTFOLIO — script.js
// Loads content from data.json and wires up all interactivity
// ============================================

let SITE_DATA = null;

// ---------- LOAD DATA.JSON AND RENDER CONTENT ----------
async function loadSiteData() {
  try {
    const res = await fetch('data.json');
    SITE_DATA = await res.json();
    renderServices(SITE_DATA.services);
    renderProjects(SITE_DATA.projects);
    renderPricing(SITE_DATA.pricing);
    renderFAQ(SITE_DATA.faq);
    attachFAQListeners();
    attachRevealObserver(); // re-observe newly injected .reveal elements
  } catch (err) {
    console.error('Failed to load data.json', err);
  }
}

// ---------- SERVICES ----------
function renderServices(services) {
  const grid = document.getElementById('services-grid');
  if (!grid || !services) return;
  grid.innerHTML = services.map(s => `
    <div class="service-card reveal">
      <div class="service-icon">${s.icon}</div>
      <div class="service-title">${s.title}</div>
      <p class="service-desc">${s.desc}</p>
    </div>
  `).join('');
}

// ---------- PROJECTS ----------
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid || !projects) return;
  grid.innerHTML = projects.map(p => `
    <div class="project-card reveal">
      <div class="project-preview">
        <img src="${p.screenshot}" onerror="this.src='${p.fallback}'" alt="${p.name}" loading="lazy">
        <div class="project-preview-overlay">
          <a href="${p.url}" target="_blank" class="preview-btn">Visit site ↗</a>
        </div>
      </div>
      <div class="project-body">
        <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="project-name">${p.name}</div>
        <p class="project-desc">${p.desc}</p>
        <a href="${p.url}" target="_blank" class="project-link">View live site →</a>
      </div>
    </div>
  `).join('');
}

// ---------- PRICING ----------
function renderPricing(pricing) {
  const grid = document.getElementById('pricing-grid');
  if (!grid || !pricing) return;
  grid.innerHTML = pricing.map(p => {
    const badgeHtml = p.badge === 'negotiable'
      ? '<span class="pricing-negotiable">Negotiable</span>'
      : '<span class="pricing-fixed">Fixed price</span>';
    return `
      <div class="pricing-card ${p.popular ? 'popular' : ''} reveal">
        ${p.popular ? '<div class="popular-badge">Most popular</div>' : ''}
        <div class="pricing-name">${p.name}</div>
        <div class="pricing-desc">${p.desc}</div>
        <div class="pricing-price">
          <div class="pricing-naira">${p.naira}</div>
          <div class="pricing-usd">${p.usd}</div>
        </div>
        ${badgeHtml}
        <ul class="pricing-features">
          ${p.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <a href="#contact" class="pricing-cta">Get started →</a>
      </div>
    `;
  }).join('');
}

// ---------- FAQ ----------
function renderFAQ(faq) {
  const list = document.getElementById('faq-list');
  if (!list || !faq) return;
  list.innerHTML = faq.map(item => `
    <div class="faq-item reveal">
      <button class="faq-question">
        <span>${item.q}</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer">
        <p>${item.a}</p>
      </div>
    </div>
  `).join('');
}

function attachFAQListeners() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = answer.classList.contains('open');
      document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-question.open').forEach(q => q.classList.remove('open'));
      if (!isOpen) {
        answer.classList.add('open');
        btn.classList.add('open');
      }
    });
  });
}

// ---------- SCROLL REVEAL ANIMATIONS ----------
let revealObserver;
function attachRevealObserver() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
  }
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

// ---------- DARK MODE TOGGLE ----------
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  themeToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

// ---------- PAGE LOADER ----------
function initPageLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hide'), 800);
  });
}

// ---------- MOBILE MENU ----------
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  // close menu when any mobile link is clicked
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ---------- BACK TO TOP ----------
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 400);
  });
}

// ---------- NAV ACTIVE LINK HIGHLIGHT ----------
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--navy)' : '';
    });
  });
}

// ---------- SUPABASE REVIEWS ----------
function getSupabaseHeaders() {
  const { supabaseKey } = SITE_DATA.developer;
  return {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  };
}

async function loadReviews() {
  const grid = document.getElementById('reviews-grid');
  const { supabaseUrl } = SITE_DATA.developer;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/reviews?approved=eq.true&order=created_at.desc`, {
      headers: getSupabaseHeaders()
    });
    const reviews = await res.json();
    if (!reviews.length) {
      grid.innerHTML = '<p class="no-reviews">No reviews yet — be the first to leave one below!</p>';
      return;
    }
    grid.innerHTML = reviews.map(r => {
      const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
      const initials = r.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      return `
        <div class="testi-card reveal">
          <div class="testi-stars" style="color:#f59e0b">${stars}</div>
          <p class="testi-quote">"${r.message}"</p>
          <div class="testi-author">
            <div class="testi-avatar">${initials}</div>
            <div>
              <div class="testi-name">${r.name}</div>
              ${r.role ? `<div class="testi-role">${r.role}</div>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');
    attachRevealObserver();
    grid.querySelectorAll('.reveal').forEach(el => {
      setTimeout(() => el.classList.add('visible'), 100);
    });
  } catch {
    grid.innerHTML = '<p class="no-reviews">Could not load reviews right now.</p>';
  }
}

function initStarPicker() {
  let selectedRating = 5;
  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.val);
      document.querySelectorAll('.star-btn').forEach((s, i) => {
        s.classList.toggle('active', i < selectedRating);
      });
    });
    btn.addEventListener('mouseover', () => {
      const val = parseInt(btn.dataset.val);
      document.querySelectorAll('.star-btn').forEach((s, i) => s.style.color = i < val ? '#f59e0b' : '');
    });
    btn.addEventListener('mouseleave', () => {
      document.querySelectorAll('.star-btn').forEach((s, i) => {
        s.style.color = i < selectedRating ? '#f59e0b' : '';
      });
    });
  });
  document.querySelectorAll('.star-btn').forEach(s => { s.classList.add('active'); s.style.color = '#f59e0b'; });
  return () => selectedRating; // getter
}

function initReviewSubmit(getRating) {
  document.getElementById('review-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-review-submit');
    btn.textContent = 'Submitting...';
    btn.disabled = true;
    const { supabaseUrl } = SITE_DATA.developer;
    const payload = {
      name: document.getElementById('r-name').value.trim(),
      role: document.getElementById('r-role').value.trim(),
      rating: getRating(),
      message: document.getElementById('r-message').value.trim(),
      approved: false
    };
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/reviews`, {
        method: 'POST',
        headers: { ...getSupabaseHeaders(), 'Prefer': 'return=minimal' },
        body: JSON.stringify(payload)
      });
      if (res.ok || res.status === 201) {
        document.getElementById('review-form').style.display = 'none';
        document.getElementById('review-success').style.display = 'block';
      } else {
        btn.textContent = 'Failed — try again';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Failed — try again';
      btn.disabled = false;
    }
  });
}

// ---------- CONTACT FORM (Formspree) ----------
function initContactForm() {
  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-send');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    const data = new FormData(e.target);
    const { formspree } = SITE_DATA.developer;
    try {
      const response = await fetch(formspree, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        btn.textContent = '✓ Message sent!';
        btn.style.background = '#16a34a';
        e.target.reset();
        setTimeout(() => { btn.textContent = 'Send message →'; btn.style.background = ''; btn.disabled = false; }, 4000);
      } else {
        btn.textContent = 'Failed — try again';
        btn.style.background = '#dc2626';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Failed — try again';
      btn.style.background = '#dc2626';
      btn.disabled = false;
    }
  });
}

// ---------- INIT EVERYTHING ----------
document.addEventListener('DOMContentLoaded', async () => {
  initPageLoader();
  initThemeToggle();
  initMobileMenu();
  initBackToTop();
  initNavHighlight();

  await loadSiteData();       // renders services, projects, pricing, FAQ from data.json
  attachRevealObserver();     // observe all .reveal elements (static + dynamic)

  await loadReviews();        // load approved reviews from Supabase
  const getRating = initStarPicker();
  initReviewSubmit(getRating);

  initContactForm();
});
