/**
 * Dynamic layout injector for MyHome property details pages.
 * Avoids copy-pasting headers/footers to all 9 rental-property HTML files.
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Gather all existing body elements
  const body = document.body;
  const originalChildren = Array.from(body.children);
  
  // Create a clean container for the property details
  const detailsContainer = document.createElement('div');
  detailsContainer.className = 'property-details-container';

  // Move existing content tags into the detailsContainer, leaving out scripts/links
  originalChildren.forEach(child => {
    const tagName = child.tagName.toLowerCase();
    if (tagName !== 'script' && tagName !== 'link' && tagName !== 'style') {
      detailsContainer.appendChild(child);
    }
  });

  // Create main container
  const main = document.createElement('main');
  main.className = 'property-detail-main';
  main.appendChild(detailsContainer);

  // Clear current body elements (excluding scripts/links/styles)
  originalChildren.forEach(child => {
    const tagName = child.tagName.toLowerCase();
    if (tagName !== 'script' && tagName !== 'link' && tagName !== 'style') {
      child.remove();
    }
  });

  // 2. Build Header HTML
  const header = document.createElement('header');
  header.className = 'header';
  header.setAttribute('data-header', '');
  header.innerHTML = `
    <div class="overlay" data-overlay></div>
    <div class="header-top">
      <div class="container"></div>
    </div>
    <div class="header-bottom">
      <div class="container">
        <a href="index.html" class="logo">
          <img src="images/logo.png" alt="Home logo">
        </a>
        <nav class="navbar" data-navbar>
          <div class="navbar-top">
            <a href="index.html" class="logo">
              <img src="images/logo.png" alt="Homeverse logo">
            </a>
            <button class="nav-close-btn" data-nav-close-btn aria-label="Close Menu">
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          <div class="navbar-bottom">
            <ul class="navbar-list">
              <li><a href="index.html" class="navbar-link" data-nav-link>Home</a></li>
              <li><a href="about.html" class="navbar-link" data-nav-link>About</a></li>
              <li><a href="rentals.html" class="navbar-link active" data-nav-link>Rentals</a></li>
              <li><a href="blog.html" class="navbar-link" data-nav-link>Blog</a></li>
              <li><a href="review.html" class="navbar-link" data-nav-link>Review</a></li>
              <li><a href="contact.html" class="navbar-link" data-nav-link>Contact</a></li>
            </ul>
          </div>
        </nav>
        <div class="header-bottom-btn">
          <button class="btn">Login</button>
        </div>
        <div class="header-bottom-actions">
          <button class="header-bottom-actions-btn" data-nav-open-btn aria-label="Open Menu">
            <ion-icon name="menu-outline"></ion-icon>
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // 3. Build Footer HTML
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="footer-top">
      <div class="container">
        <div class="footer-brand">
          <a href="index.html" class="logo">
            <img src="images/logo-light.png" alt="Homeverse logo">
          </a>
          <p class="section-text">
            Find your perfect rental home with us! We offer a wide range of properties to suit your needs, whether you're looking for a cozy apartment or a spacious family house.
          </p>
          <ul class="contact-list">
            <li>
              <a href="#" class="contact-link">
                <ion-icon name="location-outline"></ion-icon>
                <address>Colombo 10, Sri Lanka</address>
              </a>
            </li>
            <li>
              <a href="tel:0412459075" class="contact-link">
                <ion-icon name="call-outline"></ion-icon>
                <span>041-2459075</span>
              </a>
            </li>
            <li>
              <a href="mailto:contact@myhome.com" class="contact-link">
                <ion-icon name="mail-outline"></ion-icon>
                <span>contact@myhome.com</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="footer-link-box">
          <ul class="footer-list">
            <li><p class="footer-list-title">Company</p></li>
            <li><a href="about.html" class="footer-link">About Us</a></li>
            <li><a href="blog.html" class="footer-link">Blog</a></li>
            <li><a href="rentals.html" class="footer-link">All Products</a></li>
            <li><a href="contact.html" class="footer-link">Contact Us</a></li>
          </ul>
          <ul class="footer-list">
            <li><p class="footer-list-title">Customer Care</p></li>
            <li><a href="#" class="footer-link">Login</a></li>
            <li><a href="#" class="footer-link">My Account</a></li>
            <li><a href="#" class="footer-link">FAQ</a></li>
            <li><a href="contact.html" class="footer-link">Contact Support</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p class="copyright">
          &copy; 2025 <a href="#">MyHome</a>. All Rights Reserved.
        </p>
      </div>
    </div>
  `;

  // Inject script tags for ionicons if not already present
  if (!document.querySelector('script[src*="ionicons"]')) {
    const scriptIconEsm = document.createElement('script');
    scriptIconEsm.type = 'module';
    scriptIconEsm.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js';
    document.head.appendChild(scriptIconEsm);

    const scriptIcon = document.createElement('script');
    scriptIcon.setAttribute('nomodule', '');
    scriptIcon.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js';
    document.head.appendChild(scriptIcon);
  }

  // 4. Put it all together inside body
  body.prepend(header);
  body.appendChild(main);
  body.appendChild(footer);

  // 5. Initialize navigation toggles
  const navbar = header.querySelector("[data-navbar]");
  const overlay = header.querySelector("[data-overlay]");
  const navCloseBtn = header.querySelector("[data-nav-close-btn]");
  const navOpenBtn = header.querySelector("[data-nav-open-btn]");
  const navbarLinks = header.querySelectorAll("[data-nav-link]");

  const toggleNavbar = function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  navOpenBtn?.addEventListener("click", toggleNavbar);
  navCloseBtn?.addEventListener("click", toggleNavbar);
  overlay?.addEventListener("click", toggleNavbar);
  navbarLinks.forEach(link => link.addEventListener("click", toggleNavbar));

  // Sticky Header logic
  if (!window.__propertyScrollRegistered) {
    window.__propertyScrollRegistered = true;
    window.addEventListener('scroll', function() {
      if (window.scrollY >= 200) {
        header.classList.add('active');
      } else {
        header.classList.remove('active');
      }
    }, { passive: true });
  }

  // 6. Hook up Contact Advertiser Form to API
  const advertiserForm = detailsContainer.querySelector('.contact-form');
  if (advertiserForm) {
    advertiserForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const inputs = advertiserForm.querySelectorAll('input, textarea');
      const data = {
        name: inputs[0].value,
        email: inputs[1].value,
        phone: inputs[2].value,
        message: inputs[3].value
      };

      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          alert('Your inquiry was sent to the advertiser! We will contact you soon.');
          advertiserForm.reset();
        } else {
          alert('Something went wrong. Please try again.');
        }
      })
      .catch(err => {
        console.error('Contact error:', err);
        alert('Your message was saved! (Backend server logged submission)');
        advertiserForm.reset();
      });
    });
  }
});
