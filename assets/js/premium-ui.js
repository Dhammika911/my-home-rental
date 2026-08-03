'use strict';

// All navigation and scroll handling is done in script.js
// This file only handles premium UI enhancements

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('premium-ready');

  // Only handle reveal animations - don't duplicate navbar or scroll listeners
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
