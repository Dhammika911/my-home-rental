/**
 * Review script - Star ratings selection, backend fetch and render
 */

'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const reviewsContainer = document.getElementById('reviewsContainer');
  const reviewForm = document.getElementById('reviewForm');
  const starButtons = document.querySelectorAll('#ratingStars .star-btn');
  let selectedRating = 4; // Default starting rating is 4 stars

  // 1. Handle star button interactive selections
  starButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      selectedRating = parseInt(this.getAttribute('data-value'));
      updateStarsDisplay(selectedRating);
    });
  });

  function updateStarsDisplay(rating) {
    starButtons.forEach(btn => {
      const val = parseInt(btn.getAttribute('data-value'));
      const icon = btn.querySelector('ion-icon');
      if (val <= rating) {
        icon.setAttribute('name', 'star');
      } else {
        icon.setAttribute('name', 'star-outline');
      }
    });
  }

  // Set default star UI
  updateStarsDisplay(selectedRating);

  // 2. Fetch and render customer reviews
  function fetchReviews() {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(reviews => {
        renderReviews(reviews);
      })
      .catch(err => {
        console.error('Error fetching reviews:', err);
        if (reviewsContainer) {
          reviewsContainer.innerHTML = `<p style="text-align: center; color: red;">Failed to load reviews. Make sure Node server is running!</p>`;
        }
      });
  }

  function renderReviews(reviews) {
    if (!reviewsContainer) return;
    reviewsContainer.innerHTML = '';

    if (reviews.length === 0) {
      reviewsContainer.innerHTML = `<p style="text-align: center; color: var(--cadet); padding: 20px;">No reviews submitted yet. Be the first to write one!</p>`;
      return;
    }

    // Sort reviews by date descending or ID descending (newest first)
    const sortedReviews = [...reviews].reverse();

    sortedReviews.forEach(review => {
      const card = document.createElement('div');
      card.className = 'review-card';

      // Build stars HTML
      let starsHTML = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= review.rating) {
          starsHTML += '<ion-icon name="star"></ion-icon>';
        } else {
          starsHTML += '<ion-icon name="star-outline"></ion-icon>';
        }
      }

      // Generate initials for avatar
      const initials = review.name ? review.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

      card.innerHTML = `
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">${initials}</div>
            <div class="reviewer-name">
              <h4>${review.name}</h4>
              <span>${review.designation || 'Verified Client'}</span>
            </div>
          </div>
          <div class="review-stars">
            ${starsHTML}
          </div>
        </div>
        <p class="review-text">"${review.text}"</p>
        <span class="review-date">${review.date}</span>
      `;

      reviewsContainer.appendChild(card);
    });
  }

  // 3. Post review payload to server
  reviewForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const designation = document.getElementById('designation').value;
    const text = document.getElementById('reviewText').value;

    const payload = {
      name,
      designation: designation || 'Verified Customer',
      rating: selectedRating,
      text
    };

    fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to save review');
        }
        return res.json();
      })
      .then(data => {
        alert('Thank you! Your review has been submitted successfully.');
        reviewForm.reset();
        selectedRating = 4; // Reset to default
        updateStarsDisplay(selectedRating);
        fetchReviews(); // Reload list
      })
      .catch(err => {
        console.error('Error submitting review:', err);
        alert('Failed to submit review. Make sure Node server is running!');
      });
  });

  // Initial fetch on page load
  fetchReviews();
});
