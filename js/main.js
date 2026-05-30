/**
  Cliqby - Core Interactive Features
  Handles Scroll animations, Metric Counters, Form Submissions, and Menu Interactions
*/

document.addEventListener('DOMContentLoaded', () => {
  setupHeader();
  setupMobileMenu();
  setupRevealOnScroll();
  setupCounters();
  setupForms();
});

// 1. Header scroll state
function setupHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 2. Mobile navbar toggle
function setupMobileMenu() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!toggleBtn || !navMenu) return;
  
  // Create mobile menu panel in DOM
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu-overlay';
  mobileMenu.innerHTML = `
    <div class="mobile-menu-container">
      <button class="mobile-menu-close">&times;</button>
      <div class="mobile-logo">${document.querySelector('.logo').outerHTML}</div>
      <ul class="mobile-links">
        ${Array.from(navMenu.querySelectorAll('a')).map(link => `
          <li><a href="${link.getAttribute('href')}" class="mobile-link">${link.textContent}</a></li>
        `).join('')}
      </ul>
      <div class="mobile-menu-footer">
        <p>scale@cliqby.com</p>
        <p>+91 1169266141</p>
      </div>
    </div>
  `;
  document.body.appendChild(mobileMenu);
  
  // Inject mobile styles into DOM dynamically
  const style = document.createElement('style');
  style.textContent = `
    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: rgba(8, 11, 17, 0.98);
      z-index: 2000;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      justify-content: flex-end;
    }
    .mobile-menu-overlay.active {
      left: 0;
    }
    .mobile-menu-container {
      width: 100%;
      max-width: 320px;
      height: 100%;
      background: var(--bg-slate);
      padding: 3rem 2rem;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 3rem;
      border-left: 1px solid var(--border-glow);
    }
    .mobile-menu-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 2.5rem;
      cursor: pointer;
    }
    .mobile-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 1.8rem;
      margin-top: 2rem;
    }
    .mobile-link {
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .mobile-link:hover {
      color: var(--primary);
    }
    .mobile-menu-footer {
      margin-top: auto;
      font-size: 0.9rem;
      color: var(--text-muted);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `;
  document.head.appendChild(style);

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
  closeBtn.addEventListener('click', closeMenu);
  
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  function closeMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'initial';
  }
}

// 3. Scroll Reveal Animation
function setupRevealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  };
  
  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));
}

// 4. Metric Counter Animations
function setupCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (counters.length === 0) return;
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const speed = 2000; // Total duration in ms
    const increment = target / (speed / 16); // 60 FPS approx
    let current = 0;
    
    const update = () => {
      current += increment;
      if (current < target) {
        // Format large currency displays
        if (target >= 10000000) {
          el.textContent = '₹' + Math.floor(current / 10000000) + ' Cr' + suffix;
        } else if (target >= 1000000) {
          el.textContent = '₹' + (current / 1000000).toFixed(1) + 'M' + suffix;
        } else {
          el.textContent = Math.floor(current).toLocaleString() + suffix;
        }
        requestAnimationFrame(update);
      } else {
        if (target >= 10000000) {
          el.textContent = '₹11 Cr' + suffix;
        } else if (target >= 1000000) {
          el.textContent = '₹15M' + suffix;
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
    };
    
    update();
  };
  
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
}

// 5. Intercept Form Submissions to Show Beautiful Success Panels
function setupForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'red';
        } else {
          input.style.borderColor = '';
        }
      });
      
      if (!isValid) return;
      
      // Submit loading animation
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending details...';
      }
      
      // Gather form data and convert to JSON
      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);
      
      // Submit to Web3Forms API
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        if (response.status === 200) {
          // Show success layout
          const formContainer = form.parentElement;
          form.style.display = 'none';
          
          let successTitle = 'Thank You!';
          let successMsg = 'Your details have been received successfully. Our team will contact you shortly.';
          
          if (form.id === 'audit-form') {
            successTitle = 'Audit Claimed Successfully!';
            successMsg = 'Our specialists will analyze your store and send your custom 72-hour E-Commerce action plan via email.';
          } else if (form.id === 'apply-form') {
            successTitle = 'Application Submitted!';
            successMsg = 'Thank you for your application to join Cliqby. We have received your resume and our hiring team will be in touch.';
          } else if (form.id === 'consult-form') {
            successTitle = 'Consultation Request Sent!';
            successMsg = 'We’ve booked your request for a Free 20-min Consultation. A Cliqby strategist will contact you within 24 hours to coordinate.';
          }
          
          const successDiv = document.createElement('div');
          successDiv.className = 'form-success-wrapper reveal active';
          successDiv.innerHTML = `
            <div class="success-icon-circle">
              <i class="btn-icon">✓</i>
            </div>
            <h3 style="font-size: 1.8rem; margin-bottom: 0.8rem; font-family: 'Outfit', sans-serif;">${successTitle}</h3>
            <p style="color: var(--text-secondary); max-width: 450px; margin: 0 auto 1.5rem auto;">${successMsg}</p>
            <button class="btn btn-secondary" onclick="window.location.reload()">Back to form</button>
          `;
          
          formContainer.appendChild(successDiv);
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Submission failed');
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
        alert('There was a problem submitting your request: ' + error.message + '. Please try again or email us directly at scale@cliqby.com.');
      });
    });
  });
}
