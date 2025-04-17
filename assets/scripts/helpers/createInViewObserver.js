// helpers/createInViewObserver.js

/**
 * Creates an IntersectionObserver instance.
 * @param {function(Element, boolean, IntersectionObserverEntry, IntersectionObserver)} callback - The function to call when an element's intersection changes.
 * Receives the target element, a boolean indicating if it's intersecting, the full entry, and the observer instance.
 * @param {object} options - IntersectionObserver options (root, rootMargin, threshold).
 * @returns {IntersectionObserver} The created observer instance.
 */
export function createInViewObserver(callback, options = {}) {
  // Default options
  const defaultOptions = {
    root: null, // observing intersections relative to the viewport
    rootMargin: '0px',
    threshold: 0, // Trigger callback as soon as 1 pixel is visible
  };

  const observerOptions = { ...defaultOptions, ...options };

  // Create the observer. Its callback simply iterates through entries
  // and calls the user-provided callback function with useful arguments.
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      // Call the callback passed into createInViewObserver
      callback(entry.target, entry.isIntersecting, entry, obs);
    });
  }, observerOptions);

  return observer;
}