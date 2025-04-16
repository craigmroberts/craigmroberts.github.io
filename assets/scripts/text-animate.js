import { wrapTextWithSpans } from './helpers/textAnimator.js';
import { createInViewObserver } from './helpers/inViewObserver.js';

export function animateTextElements(scope = document) {
  const elements = scope.querySelectorAll('.scroll-animate:not(.animated-init)');

  const observer = createInViewObserver((el) => {
    el.classList.add('in-view');
  });

  elements.forEach(el => {
    wrapTextWithSpans(el);
    observer.observe(el);
  });
}

// Optionally expose globally
window.animateText = animateTextElements;

document.addEventListener('DOMContentLoaded', () => {
  animateTextElements();
});
