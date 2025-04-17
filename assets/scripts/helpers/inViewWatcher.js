// helpers/inViewWatcher.js
import { createInViewObserver } from './createInViewObserver.js';

/**
 * Observes elements with [data-watch-inview="true"] and adds/removes
 * the 'in-view' class based on their visibility in the viewport.
 * @param {Document|Element} scope - The container element to search within. Defaults to document.
 * @returns {IntersectionObserver} The observer instance used (useful for later cleanup if needed).
 */
export function watchInViewElements(scope = document) {
  // Define the logic to execute when an element's intersection state changes
  const handleIntersection = (element, isIntersecting, entry) => {
    const label = element.getAttribute('aria-label') || element.textContent?.slice(0, 20) || `[${element.tagName}]`;

    if (isIntersecting) {
      // Element has entered the viewport
      element.classList.add('in-view');
      console.log(`✅ ${label} entered view`);
      // You could add more complex logic here based on entry.boundingClientRect
      // or entry.intersectionRect if needed, but for basic class toggling,
      // isIntersecting is usually enough.
    } else {
      // Element has left the viewport
      element.classList.remove('in-view');
      console.log(`❌ ${label} exited view`);
    }
  };

  // Create the observer using the simplified creator function
  // You can adjust the threshold here. For example:
  // threshold: 0.1 // Trigger when 10% of the element is visible
  // threshold: [0, 0.5, 1] // Trigger at 0%, 50%, and 100% visibility
  const observer = createInViewObserver(handleIntersection, {
    threshold: 0.1 // Example: Trigger once element is slightly in view
  });

  // Find and observe all target elements within the scope
  const elements = scope.querySelectorAll('[data-watch-inview="true"]');
  if (elements.length === 0) {
      console.warn("No elements found with [data-watch-inview='true'] within the specified scope.");
  }
  elements.forEach(el => observer.observe(el));

  return observer; // Return the observer instance
}