// scroll-animate.js

function animateTextElements(scope = document) {
    const elements = scope.querySelectorAll('.scroll-animate:not(.animated-init)');
  
    elements.forEach(el => {
      const text = el.textContent;
      el.textContent = '';
      el.classList.add('animated-init');
  
      Array.from(text).forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.setProperty('--char-index', i);
        el.appendChild(span);
      });
  
      observer.observe(el);
    });
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    animateTextElements();
  });
  
  // Optional: expose it globally so you can re-run after AJAX
  window.animateText = animateTextElements;
  