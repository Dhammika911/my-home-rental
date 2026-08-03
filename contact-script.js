/**
 * Contact Form API Integration script
 */

'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');

  form?.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    const payload = {
      name,
      email,
      message
    };

    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to send contact message');
        }
        return res.json();
      })
      .then(data => {
        alert('Thank you! Your message has been sent successfully. We will get back to you soon.');
        form.reset();
      })
      .catch(err => {
        console.error('Error submitting contact query:', err);
        alert('Failed to send message. Make sure the Node server is running!');
      });
  });
});
