const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Gather all data smoothly into an object
    const formData = {
      name: document.getElementById('cf-name').value,
      company: document.getElementById('cf-company').value,
      email: document.getElementById('cf-email').value,
      phone: document.getElementById('cf-phone').value,
      type: document.getElementById('cf-type').value,
      budget: document.getElementById('cf-budget').value,
      message: document.getElementById('cf-msg').value,
    };

    try {
      // Send the data to your local backend server
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Show your styled success CSS grid message
        contactForm.classList.add('success');
        contactForm.reset();
      } else {
        alert(result.error || 'Something went wrong. Please check your fields.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Unable to connect to the server. Please try again later.');
    }
  });
}

// ==========================================
// THEME TOGGLE (Light/Dark Mode)
// ==========================================
const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;

// Restore saved preference, defaulting to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    if (htmlElement.getAttribute('data-theme') === 'dark') {
      htmlElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}
