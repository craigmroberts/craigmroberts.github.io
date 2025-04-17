import { wrapTextWithSpans } from './wrapTextWithSpans.js';
import { createInViewObserver } from './createInViewObserver.js';

export function animateScrollText(scope = document) {
  const observer = createInViewObserver((el, inView, entry, obs) => {
    const label = el.getAttribute('aria-label') || el.textContent?.slice(0, 20) || '[text]';

    if (inView) {
      el.classList.add('in-view');
      console.log(`🌀 ${label} is in view`);
      obs.unobserve(el);
    }
  }, { threshold: 0.1 });

  const textElements = scope.querySelectorAll('.scroll-animate:not(.animated-init)');
  textElements.forEach(el => {
    wrapTextWithSpans(el);
    el.classList.add('animated-init');
    observer.observe(el);
  });
}
