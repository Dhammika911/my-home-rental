'use strict';

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('premium-ready');

  const header = document.querySelector('[data-header]');
  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle('premium-scrolled', window.scrollY > 24);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });

  if (!window.__legacyNavReady) {
    const navbar = document.querySelector('[data-navbar]');
    const overlay = document.querySelector('[data-overlay]');
    const navOpen = document.querySelector('[data-nav-open-btn]');
    const navClose = document.querySelector('[data-nav-close-btn]');
    const toggleMenu = () => {
      navbar?.classList.toggle('active');
      overlay?.classList.toggle('active');
    };
    navOpen?.addEventListener('click', toggleMenu);
    navClose?.addEventListener('click', toggleMenu);
    overlay?.addEventListener('click', toggleMenu);
    document.querySelectorAll('[data-nav-link]').forEach((link) => {
      link.addEventListener('click', () => {
        navbar?.classList.remove('active');
        overlay?.classList.remove('active');
      });
    });
  }

  const revealTargets = document.querySelectorAll(
    'section, .property-card, .blog-card, .team-card, .info-card-item, .review-card, .contact-form-panel, .contact-info-panel'
  );
  revealTargets.forEach((item) => item.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach((item) => observer.observe(item));
  } else {
    revealTargets.forEach((item) => item.classList.add('in-view'));
  }

  document.querySelectorAll('.property-card .card-banner').forEach((banner) => {
    if (banner.querySelector('.premium-favorite')) return;
    const button = document.createElement('button');
    button.className = 'premium-favorite';
    button.type = 'button';
    button.setAttribute('aria-label', 'Save property');
    button.innerHTML = '<i class="fa-regular fa-heart"></i>';
    button.addEventListener('click', () => {
      button.classList.toggle('active');
      button.innerHTML = button.classList.contains('active')
        ? '<i class="fa-solid fa-heart"></i>'
        : '<i class="fa-regular fa-heart"></i>';
    });
    banner.appendChild(button);
  });

  const propertyGrid = document.querySelector('.property-grid');
  if (propertyGrid && !document.querySelector('.view-toggle')) {
    const toggle = document.createElement('div');
    toggle.className = 'view-toggle';
    toggle.innerHTML = `
      <button type="button" class="active" data-view="grid" aria-label="Grid view"><i class="fa-solid fa-grip"></i></button>
      <button type="button" data-view="list" aria-label="List view"><i class="fa-solid fa-list"></i></button>
    `;
    propertyGrid.parentElement.insertBefore(toggle, propertyGrid);
    toggle.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      toggle.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      propertyGrid.classList.toggle('list-view', button.dataset.view === 'list');
    });
  }
});
