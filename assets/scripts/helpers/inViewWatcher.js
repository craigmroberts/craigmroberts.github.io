// helpers/inViewWatcher.js
import { createInViewObserver } from './createInViewObserver.js';

/**
 * Observes elements with [data-watch-inview="true"] and adds/removes
 * 'in-view' and 'in-full-view' classes based on their visibility.
 * @param {Document|Element} scope - The container element to search within. Defaults to document.
 * @returns {IntersectionObserver} The observer instance used.
 */
export function watchInViewElements(scope = document) {
  // Define the logic to execute when an element's intersection state changes
  const handleIntersection = (element, isIntersecting, entry) => {
    const label = element.getAttribute('aria-label') || element.textContent?.slice(0, 20) || `[${element.tagName}]`;
    const intersectionRatio = entry.intersectionRatio; // Get the ratio

    if (isIntersecting) {
      // Element is at least partially in view
      element.classList.add('in-view');
      console.log(`✅ ${label} entered view (ratio: ${intersectionRatio.toFixed(2)})`);

      // Check if it's fully in view
      if (intersectionRatio === 1) {
        element.classList.add('in-full-view');
        console.log(`💯 ${label} entered FULL view`);
      } else {
        // If it's intersecting but not fully, ensure 'in-full-view' is removed
        // (Handles cases where it scrolls from full view to partial view)
        element.classList.remove('in-full-view');
      }
    } else {
      // Element has completely left the viewport
      element.classList.remove('in-view');
      element.classList.remove('in-full-view'); // Ensure both classes are removed
      console.log(`❌ ${label} exited view`);
      // We could check entry.boundingClientRect.top/bottom here relative to
      // entry.rootBounds.top/bottom to guess *which direction* it exited if needed.
    }
  };

  // Create the observer using the simplified creator function
  // Use threshold [0, 1] to trigger at the start/end of intersection AND at 100% visibility
  const observer = createInViewObserver(handleIntersection, {
    threshold: [0, 1] // Trigger callbacks at 0% and 100% visibility
  });

  // Find and observe all target elements within the scope
  const elements = scope.querySelectorAll('[data-watch-inview="true"]');
   if (elements.length === 0) {
      console.warn("No elements found with [data-watch-inview='true'] within the specified scope.");
  }
  elements.forEach(el => observer.observe(el));

  return observer; // Return the observer instance
}