/**
 * Home page script - hero query redirection & dynamic featured list render
 */

'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('heroSearchForm');
  const featuredList = document.getElementById('featuredPropertiesList');

  // 1. Redirect search parameters to rentals page
  searchForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const location = document.getElementById('heroLocation').value;
    const type = document.getElementById('heroType').value;
    const maxBudget = document.getElementById('heroPrice').value;

    let queryUrl = 'rentals.html?';
    const params = [];
    if (location) params.push(`location=${location}`);
    if (type) params.push(`type=${type}`);
    if (maxBudget) params.push(`price=${maxBudget}`);

    queryUrl += params.join('&');
    window.location.href = queryUrl;
  });

  // 2. Fetch and render first 3 properties dynamically
  function fetchFeaturedProperties() {
    fetch('/api/properties')
      .then(res => res.json())
      .then(properties => {
        // Take the first 3 featured properties
        const featured = properties.slice(0, 3);
        renderFeatured(featured);
      })
      .catch(err => {
        console.error('Error loading featured properties:', err);
        if (featuredList) {
          featuredList.innerHTML = `<li style="text-align:center; grid-column:span 3;"><p style="color:red;">Failed to load properties. Ensure Node server is running!</p></li>`;
        }
      });
  }

  function renderFeatured(properties) {
    if (!featuredList) return;
    featuredList.innerHTML = '';

    if (properties.length === 0) {
      featuredList.innerHTML = `<li style="text-align:center; grid-column:span 3;"><p style="color:var(--cadet);">No properties available.</p></li>`;
      return;
    }

    properties.forEach((property, index) => {
      const li = document.createElement('li');
      li.style.animationDelay = `${index * 0.1}s`;

      const formattedPrice = new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(property.price).replace('LKR', 'Rs.');

      let imgSrc = property.image;
      if (!imgSrc.startsWith('data:') && !imgSrc.startsWith('http') && !imgSrc.startsWith('images/')) {
        imgSrc = 'images/' + imgSrc;
      }

      li.innerHTML = `
        <div class="property-card" style="box-shadow: var(--shadow-1); border-radius: 12px; overflow: hidden; background: var(--white); transition: all var(--transition);">
          <figure class="card-banner" style="position: relative; overflow: hidden; height: 230px;">
            <a href="${property.link}">
              <img src="${imgSrc}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </a>
            <div class="card-badge green" style="position: absolute; top: 15px; left: 15px; padding: 5px 12px; border-radius: 4px; color: var(--white); background: var(--yellow-green); font-size: var(--fs-7); text-transform: uppercase;">For Rent</div>
            <div class="banner-actions" style="position: absolute; bottom: 15px; left: 15px; right: 15px; background: rgba(18, 29, 31, 0.7); backdrop-filter: blur(4px); padding: 8px 12px; border-radius: 8px;">
              <button class="banner-actions-btn" style="color: var(--white); display: flex; align-items: center; gap: 5px; font-size: var(--fs-6);">
                <ion-icon name="location" style="color: var(--orange-soda);"></ion-icon>
                <address style="font-style: normal;">${property.address}</address>
              </button>
            </div>
          </figure>

          <div class="card-content" style="padding: 24px;">
            <div class="card-price" style="font-size: var(--fs-4); color: var(--orange-soda); margin-bottom: 10px;">
              <strong style="font-size: var(--fs-2); font-weight: var(--fw-700);">${formattedPrice}</strong>/ Month
            </div>
            <h3 class="h3 card-title" style="margin-bottom: 12px;">
              <a href="${property.link}" style="color: var(--dark-jungle-green); font-family: var(--ff-poppins); font-weight: var(--fw-600);">${property.title}</a>
            </h3>
            <p class="card-text" style="color: var(--cadet); font-size: var(--fs-6); line-height: 1.6; margin-bottom: 15px;">
              ${property.description}
            </p>
            <ul class="card-list" style="display: flex; justify-content: space-between; border-top: 1px solid #eee; padding-top: 15px;">
              <li class="card-item" style="display: flex; align-items: center; gap: 5px; font-size: var(--fs-6); color: var(--cadet);">
                <strong>${property.bedrooms}</strong>
                <ion-icon name="bed-outline" style="color: var(--orange-soda);"></ion-icon>
                <span>Bedrooms</span>
              </li>
              <li class="card-item" style="display: flex; align-items: center; gap: 5px; font-size: var(--fs-6); color: var(--cadet);">
                <strong>${property.bathrooms}</strong>
                <ion-icon name="man-outline" style="color: var(--orange-soda);"></ion-icon>
                <span>Bathrooms</span>
              </li>
              <li class="card-item" style="display: flex; align-items: center; gap: 5px; font-size: var(--fs-6); color: var(--cadet);">
                <strong>${property.sqft}</strong>
                <ion-icon name="square-outline" style="color: var(--orange-soda);"></ion-icon>
                <span>Sq Ft</span>
              </li>
            </ul>
          </div>
        </div>
      `;

      featuredList.appendChild(li);
    });
  }

  fetchFeaturedProperties();
});
