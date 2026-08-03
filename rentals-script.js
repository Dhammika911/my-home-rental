/**
 * Rentals page JavaScript - Dynamic Property Filtering and Integration
 */

'use strict';

document.addEventListener('DOMContentLoaded', function () {
  let allProperties = [];

  // Elements
  const propertyGrid = document.querySelector('.property-list');
  const filterForm = document.querySelector('.filter-form');
  const locationSelect = document.getElementById('location');
  const typeSelect = document.getElementById('property-type');
  const priceSelect = document.getElementById('price-range');
  const bedroomSelect = document.getElementById('bedrooms');

  // Fetch properties from Express backend API
  function fetchProperties() {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        allProperties = data;
        renderProperties(allProperties);
      })
      .catch(err => {
        console.error('Error fetching properties from backend:', err);
        // Fallback banner if fetch fails
        propertyGrid.innerHTML = `<li class="full-width"><p class="section-text" style="grid-column: span 3; text-align: center; color: red;">Failed to load properties from server. Make sure node server is running!</p></li>`;
      });
  }

  // Render properties into DOM
  function renderProperties(properties) {
    if (!propertyGrid) return;
    
    // Add animations & transition effect
    propertyGrid.style.opacity = '0';
    propertyGrid.style.transform = 'translateY(10px)';

    setTimeout(() => {
      propertyGrid.innerHTML = '';

      if (properties.length === 0) {
        propertyGrid.innerHTML = `<li class="full-width" style="grid-column: span 3; text-align: center; padding: 40px;"><p class="section-text" style="font-size: var(--fs-4); font-weight: bold; color: var(--cadet);">No properties found matching your filters.</p></li>`;
        propertyGrid.style.opacity = '1';
        propertyGrid.style.transform = 'translateY(0)';
        return;
      }

      properties.forEach((property, index) => {
        const li = document.createElement('li');
        
        // Stagger entrance animations via inline style delay
        li.style.animationDelay = `${index * 0.05}s`;

        // Format price
        const formattedPrice = new Intl.NumberFormat('en-LK', {
          style: 'currency',
          currency: 'LKR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(property.price).replace('LKR', 'Rs.');

        // Build image source (handle absolute/base64 uploads)
        let imgSrc = property.image;
        if (!imgSrc.startsWith('data:') && !imgSrc.startsWith('http') && !imgSrc.startsWith('images/')) {
          imgSrc = 'images/' + imgSrc;
        }

        li.innerHTML = `
          <div class="property-card" style="box-shadow: var(--shadow-1); border-radius: 12px; overflow: hidden; background: var(--white); transition: all var(--transition);">
            <figure class="card-banner" style="position: relative; overflow: hidden; height: 230px;">
              <a href="${property.link}">
                <img src="${imgSrc}" alt="${property.title}" class="w-100" style="width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition);">
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
                <a href="${property.link}" style="color: var(--dark-jungle-green); font-family: var(--ff-poppins); font-weight: var(--fw-600); transition: color var(--transition);">${property.title}</a>
              </h3>
              <p class="card-text" style="color: var(--cadet); font-size: var(--fs-6); line-height: 1.6; margin-bottom: 15px;">
                ${property.description}
              </p>
              <ul class="card-list" style="display: flex; justify-content: space-between; border-top: 1px solid #eee; padding-top: 15px;">
                <li class="card-item" style="display: flex; align-items: center; gap: 5px; font-size: var(--fs-6); color: var(--cadet);">
                  <strong>${property.bedrooms}</strong>
                  <ion-icon name="bed-outline" style="color: var(--orange-soda); font-size: 16px;"></ion-icon>
                  <span>Bedrooms</span>
                </li>
                <li class="card-item" style="display: flex; align-items: center; gap: 5px; font-size: var(--fs-6); color: var(--cadet);">
                  <strong>${property.bathrooms}</strong>
                  <ion-icon name="man-outline" style="color: var(--orange-soda); font-size: 16px;"></ion-icon>
                  <span>Bathrooms</span>
                </li>
                <li class="card-item" style="display: flex; align-items: center; gap: 5px; font-size: var(--fs-6); color: var(--cadet);">
                  <strong>${property.sqft}</strong>
                  <ion-icon name="square-outline" style="color: var(--orange-soda); font-size: 16px;"></ion-icon>
                  <span>Sq Ft</span>
                </li>
              </ul>
            </div>

            <div class="card-footer" style="padding: 0 24px 24px 24px; display: flex; justify-content: flex-end;">
              <a href="${property.link}" style="width: 100%;"><button class="btn" style="width: 100%; text-align: center; padding: 12px; background: var(--orange-soda); color: var(--white); border-radius: 8px; font-weight: var(--fw-600);">View Details</button></a>
            </div>
          </div>
        `;

        propertyGrid.appendChild(li);
      });

      propertyGrid.style.opacity = '1';
      propertyGrid.style.transform = 'translateY(0)';
    }, 400);
  }

  // Filter Properties based on dropdown selections
  function filterProperties(e) {
    if (e) e.preventDefault();

    const selectedLoc = locationSelect.value.toLowerCase();
    const selectedType = typeSelect.value.toLowerCase();
    const selectedPrice = priceSelect.value;
    const selectedBeds = bedroomSelect.value;

    const filtered = allProperties.filter(property => {
      // 1. Location filter
      if (selectedLoc && property.location !== selectedLoc) {
        return false;
      }

      // 2. Type filter
      if (selectedType && property.type !== selectedType) {
        return false;
      }

      // 3. Bedrooms filter
      if (selectedBeds) {
        if (selectedBeds === '4+') {
          if (parseInt(property.bedrooms) < 4 || isNaN(parseInt(property.bedrooms))) return false;
        } else {
          if (property.bedrooms.toString() !== selectedBeds) return false;
        }
      }

      // 4. Price filter
      if (selectedPrice) {
        const price = property.price;
        if (selectedPrice === '100000-200000') {
          if (price < 100000 || price > 200000) return false;
        } else if (selectedPrice === '200000-400000') {
          if (price < 200000 || price > 400000) return false;
        } else if (selectedPrice === '400000-600000') {
          if (price < 400000 || price > 600000) return false;
        } else if (selectedPrice === '600000+') {
          if (price < 600000) return false;
        }
      }

      return true;
    });

    renderProperties(filtered);
  }

  // Bind Form Submit & Select Events for interactive quick filtering
  filterForm?.addEventListener('submit', filterProperties);
  locationSelect?.addEventListener('change', filterProperties);
  typeSelect?.addEventListener('change', filterProperties);
  priceSelect?.addEventListener('change', filterProperties);
  bedroomSelect?.addEventListener('change', filterProperties);

  // Initialize page fetch
  fetchProperties();
});
