import { createInViewObserver } from './createInViewObserver.js';

/**
 * Observes elements with [data-watch-inview="true"] and adds/removes
 * state classes ('in-view', 'in-full-view', 'top-in-view', 'bottom-in-view')
 * based on their visibility and edge positions relative to the viewport.
 * @param {Document|Element} scope - The container element to search within. Defaults to document.
 * @param {Object} options - Configuration options
 * @param {number} options.topThreshold - Amount (in pixels) of top edge that can be outside viewport before removing top-in-view class. Default is 0.
 * @param {number} options.bottomThreshold - Amount (in pixels) of bottom edge that can be outside viewport before removing bottom-in-view class. Default is 0.
 * @returns {Object} An object containing the observer instance and a cleanup function.
 */
export function watchInViewElements(scope = document, options = {}) {
  // Default options
  const settings = {
    topThreshold: options.topThreshold || 0,
    bottomThreshold: options.bottomThreshold || 0
  };
  
  // Keep track of elements being observed
  const observedElements = new Set();
  
  // Create a scroll event handler to precisely track edge visibility
  const handleScroll = () => {
    observedElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const label = element.getAttribute('aria-label') || element.textContent?.slice(0, 20) || `[${element.tagName}]`;
      
      // Top edge visibility - allowing for a threshold amount to be out of view
      if (rect.top >= -settings.topThreshold && rect.top <= windowHeight) {
        if (!element.classList.contains('top-in-view')) {
          element.classList.add('top-in-view');
          // console.log(`⬆️ ${label} top edge is IN view`);
        }
      } else {
        if (element.classList.contains('top-in-view')) {
          element.classList.remove('top-in-view');
          // console.log(`⬆️ ${label} top edge is OUT of view (beyond threshold)`);
        }
      }
      
      // Bottom edge visibility - allowing for a threshold amount to be out of view
      if (rect.bottom >= 0 && rect.bottom <= windowHeight + settings.bottomThreshold) {
        if (!element.classList.contains('bottom-in-view')) {
          element.classList.add('bottom-in-view');
          // console.log(`⬇️ ${label} bottom edge is IN view`);
        }
      } else {
        if (element.classList.contains('bottom-in-view')) {
          element.classList.remove('bottom-in-view');
          // console.log(`⬇️ ${label} bottom edge is OUT of view (beyond threshold)`);
        }
      }
      
      // Optional: You can also add a data attribute to track exact position
      element.setAttribute('data-top-position', Math.round(rect.top));
      element.setAttribute('data-bottom-position', Math.round(rect.bottom));
    });
  };
  
  // Throttle the scroll handler to improve performance
  const throttledScrollHandler = throttle(handleScroll, 100);
  
  // Attach the scroll event handler
  window.addEventListener('scroll', throttledScrollHandler, { passive: true });
  window.addEventListener('resize', throttledScrollHandler, { passive: true }); // Also handle resize events
  
  // We'll still use IntersectionObserver for in-view and in-full-view states
  const handleIntersection = (element, isIntersecting, entry) => {
    const label = element.getAttribute('aria-label') || element.textContent?.slice(0, 20) || `[${element.tagName}]`;
    const intersectionRatio = entry.intersectionRatio;
    
    if (isIntersecting) {
      // General visibility
      element.classList.add('in-view');
      // console.log(`✅ ${label} entered view (ratio: ${intersectionRatio.toFixed(2)})`);
      
      // Full visibility
      if (intersectionRatio === 1) {
        element.classList.add('in-full-view');
        // console.log(`💯 ${label} entered FULL view`);
      } else {
        element.classList.remove('in-full-view');
      }
      
      // Add element to the observed set for scroll handler
      observedElements.add(element);
      
      // Initialize edge visibility on entry
      handleScroll();
    } else {
      // Remove visibility classes
      element.classList.remove('in-view', 'in-full-view');
      
      // Determine direction of exit (optional)
      const bounds = entry.boundingClientRect;
      const rootBounds = entry.rootBounds;
      let exitDirection = '';
      
      if (rootBounds) {
        if (bounds.bottom <= rootBounds.top) {
          exitDirection = ' (Exited Top)';
        } else if (bounds.top >= rootBounds.bottom) {
          exitDirection = ' (Exited Bottom)';
        }
      }
      
      // console.log(`❌ ${label} exited view${exitDirection}`);
      
      // Also make sure edge classes are removed when completely out of view
      element.classList.remove('top-in-view', 'bottom-in-view');
    }
  };

  // Create the observer with suitable thresholds
  const observer = createInViewObserver(handleIntersection, {
    threshold: [0, 1] // We only need to know when it enters/exits (0) and when fully visible (1)
  });

  // Find and observe elements
  const elements = scope.querySelectorAll('[data-watch-inview="true"]');
  if (elements.length === 0) {
    console.warn("No elements found with [data-watch-inview='true'] within the specified scope.");
  }
  
  elements.forEach(el => {
    observer.observe(el);
    observedElements.add(el);
  });
  
  // Initial check
  handleScroll();
  
  // Return functions for cleanup
  return {
    observer,
    cleanup: () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', throttledScrollHandler);
      observer.disconnect();
      observedElements.clear();
    }
  };
}

// Simple throttle function to limit how often the scroll handler runs
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}