'use strict';

// Set flag IMMEDIATELY before DOMContentLoaded to prevent duplicate listeners
window.__legacyNavReady = true;

// Wrap everything in DOMContentLoaded to ensure proper initialization order
document.addEventListener('DOMContentLoaded', function() {
  /**
   * element toggle function
   */

  const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }

  /**
   * navbar toggle
   */

  const navbar = document.querySelector("[data-navbar]");
  const overlay = document.querySelector("[data-overlay]");
  const navCloseBtn = document.querySelector("[data-nav-close-btn]");
  const navOpenBtn = document.querySelector("[data-nav-open-btn]");
  const navbarLinks = document.querySelectorAll("[data-nav-link]");

  const navElemArr = [overlay, navCloseBtn, navOpenBtn];

  /**
   * close navbar when click on any navbar link
   */

  for (let i = 0; i < navbarLinks.length; i++) { navElemArr.push(navbarLinks[i]); }

  /**
   * add event on all elements for toggling navbar
   */

  for (let i = 0; i < navElemArr.length; i++) {
    navElemArr[i].addEventListener("click", function () {
      elemToggleFunc(navbar);
      elemToggleFunc(overlay);
    });
  }

  /**
   * header active state and scroll handling
   */

  const header = document.querySelector("[data-header]");

  // Create scroll handler and store reference
  if (!window.__scrollHandler) {
    window.__scrollHandler = function() {
      if (header) {
        window.scrollY >= 400 
          ? header.classList.add("active")
          : header.classList.remove("active");
        
        // Also toggle premium-scrolled class for premium-ui
        header.classList.toggle('premium-scrolled', window.scrollY > 24);
      }
    };
    
    // Add with passive flag for better performance
    window.addEventListener("scroll", window.__scrollHandler, { passive: true });
  }

  /**
   * highlight active navbar link
   */

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });
});
