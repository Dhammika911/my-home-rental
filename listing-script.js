/**
 * Add Listing script - Base64 Image preview and API submission
 */

'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('propertyListingForm');
  const imageInput = document.getElementById('image');
  const preview = document.getElementById('preview');
  let base64ImageStr = '';

  // 1. Listen for image upload to convert to Base64 and display preview
  imageInput?.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        base64ImageStr = e.target.result;
        preview.src = base64ImageStr;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      preview.src = '';
      preview.style.display = 'none';
      base64ImageStr = '';
    }
  });

  // 2. Submit property payload to server API
  form?.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const location = document.getElementById('location').value;
    const address = document.getElementById('address').value;
    const type = document.getElementById('type').value;
    const bedrooms = document.getElementById('bedrooms').value;
    const bathrooms = document.getElementById('bathrooms').value;
    const sqft = document.getElementById('sqft').value;
    const description = document.getElementById('description').value;

    const payload = {
      title,
      price: parseFloat(price),
      location,
      address,
      type,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      sqft: parseInt(sqft),
      description,
      image: base64ImageStr || 'images/property-1.jpg' // Use uploaded base64 image or default fallback
    };

    // Post to API endpoint
    fetch('/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Server responded with an error');
        }
        return res.json();
      })
      .then(result => {
        alert('Listing submitted successfully! Redirecting you to the rentals page.');
        form.reset();
        preview.style.display = 'none';
        base64ImageStr = '';
        window.location.href = 'rentals.html'; // Redirect to rentals to view property
      })
      .catch(err => {
        console.error('Error submitting property listing:', err);
        alert('Failed to submit listing. Make sure the Node server is running!');
      });
  });
});
