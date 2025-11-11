/**
 * Lazy load Swiper library only when needed
 * Reduces initial JavaScript execution time
 */

let swiperLoaded = false;
let swiperPromise = null;

/**
 * Lazy load Swiper library
 * @returns {Promise<typeof Swiper>} Swiper constructor
 */
export async function loadSwiper() {
  // Return existing promise if already loading
  if (swiperPromise) {
    return swiperPromise;
  }

  // Return immediately if already loaded
  if (swiperLoaded && window.Swiper) {
    return Promise.resolve(window.Swiper);
  }

  // Create promise to load Swiper
  swiperPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = './dist/scripts/swiper.min.v1.0.522.js';
    script.async = true;
    
    script.onload = () => {
      swiperLoaded = true;
      resolve(window.Swiper);
    };
    
    script.onerror = () => {
      swiperPromise = null; // Reset so it can be retried
      reject(new Error('Failed to load Swiper'));
    };
    
    document.head.appendChild(script);
  });

  return swiperPromise;
}

/**
 * Initialize Swiper with Intersection Observer
 * Only loads Swiper when element is near viewport
 * @param {HTMLElement} element - Element to observe
 * @param {Function} initCallback - Callback to initialize Swiper
 */
export function lazyInitSwiper(element, initCallback) {
  if (!element) {
    console.warn('lazyInitSwiper: element is null');
    return;
  }

  // Use Intersection Observer to detect when element is near viewport
  const observer = new IntersectionObserver(
    async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect(); // Stop observing
          
          try {
            // Load Swiper
            const Swiper = await loadSwiper();
            
            // Initialize with loaded Swiper
            if (initCallback) {
              initCallback(Swiper);
            }
          } catch (error) {
            console.error('Failed to initialize Swiper:', error);
          }
        }
      }
    },
    {
      // Load when element is 200px from entering viewport
      rootMargin: '200px',
      threshold: 0,
    }
  );

  observer.observe(element);
}
