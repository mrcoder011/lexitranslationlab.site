// script.js

// Mobile menu toggle with ARIA attribute
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');

if (mobileMenuBtn && nav) {
  mobileMenuBtn.setAttribute('aria-expanded', 'false');

  mobileMenuBtn.addEventListener('click', () => {
    const isActive = nav.classList.toggle('active');
    mobileMenuBtn.innerHTML = isActive
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
    mobileMenuBtn.setAttribute('aria-expanded', isActive.toString());
  });
}

// FAQ accordion with accessibility and keyboard support
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach((question, index) => {
  // Set ARIA attributes and tabindex for accessibility
  question.setAttribute('aria-expanded', 'false');
  if (!question.hasAttribute('tabindex')) question.setAttribute('tabindex', '0');
  // Optional: set aria-controls pointing to the answer container id, if available

  question.addEventListener('click', () => {
    const isOpen = question.classList.contains('active');

    // Close all other FAQs
    faqQuestions.forEach((q) => {
      q.classList.remove('active');
      q.setAttribute('aria-expanded', 'false');
      if (q.nextElementSibling) {
        q.nextElementSibling.style.maxHeight = null;
      }
    });

    // Toggle selected FAQ
    if (!isOpen) {
      question.classList.add('active');
      question.setAttribute('aria-expanded', 'true');
      const answer = question.nextElementSibling;
      if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });

  // Keyboard support (Enter or Space)
  question.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      question.click();
    }
  });
});

// Smooth scrolling for anchor links with offset (for fixed header height)
// Assumes fixed header height ~80px, adjust if needed
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      e.preventDefault();

      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = window.pageYOffset + elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      if(nav.classList.contains('active')) {
        nav.classList.remove('active');
        if(mobileMenuBtn) {
          mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });
});

// Form submission handling with inline success message without blocking default submit
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    // Let the form submit normally to Google Forms (do NOT call e.preventDefault())

    // Instead, show a friendly message after a delay (submit opens a new tab due to target="_blank")
    // So here we add a success message right on the page for user feedback.

    // Remove previous message if any
    const oldMsg = this.querySelector('.form-success-message');
    if (oldMsg) oldMsg.remove();

    // Create success message element
    const successMsg = document.createElement('p');
    successMsg.classList.add('form-success-message');
    successMsg.style.color = 'green';
    successMsg.textContent = 'Thank you for your feedback! Your message has been submitted successfully.';

    // Append message after the form
    this.appendChild(successMsg);

    // Reset form fields
    this.reset();

    // Success message fades out after 8 seconds
    setTimeout(() => {
      successMsg.remove();
    }, 8000);
  });
}

// Scroll animation for specific elements using Intersection Observer
const animatedElements = document.querySelectorAll('.service-box, .testimonial-card, .about-image img');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
} else {
  // Fallback if Intersection Observer not supported
  // Show all elements immediately
  animatedElements.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

 