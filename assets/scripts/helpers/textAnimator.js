import { wrapTextWithSpans } from './wrapTextWithSpans.js';
import { createInViewObserver } from './createInViewObserver.js';

/**
 * Initializes text animations for elements when they scroll into view.
 * Wraps text content in spans and uses an IntersectionObserver to trigger
 * an 'in-view' class add, then unobserves the element.
 *
 * @param {Document|Element} [scope=document] - The scope within which to search for elements.
 */
export function animateScrollText(scope = document) {
  // Create an observer that triggers once when an element is 10% visible
  const observer = createInViewObserver(
    (el, isIntersecting, entry, obs) => {
      // Use isIntersecting for clarity, though threshold 0.1 means it triggers only on entry
      if (isIntersecting) {
        const label = el.getAttribute('aria-label') || el.textContent?.slice(0, 20) || '[text]';
        el.classList.add('in-view');
        console.log(`🌀 ${label} is in view, starting animation.`);

        // Stop observing the element once it has become visible
        obs.unobserve(el);
      }
    },
    { threshold: 0.1 } // Trigger when 10% of the element is visible
  );

  // Find all elements intended for scroll animation that haven't been initialized
  const textElements = scope.querySelectorAll('.scroll-animate:not(.animated-init)');

  if (textElements.length === 0) {
    // Exit if no elements found
    return;
  }

  textElements.forEach(el => {
    // Prepare the element's text content for animation (e.g., wrap letters/words in spans)
    wrapTextWithSpans(el);

    // Mark the element as initialized to prevent reprocessing
    el.classList.add('animated-init');

    // Start observing the element for intersection changes
    observer.observe(el);
  });
}