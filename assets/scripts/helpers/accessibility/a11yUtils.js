/**
 * Accessibility Utilities
 * Provides keyboard navigation and focus management enhancements
 */

/**
 * Trap focus within a modal or dialog
 * @param {HTMLElement} element - The container element to trap focus within
 */
export function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announces content to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.classList.add('visually-hidden');
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Add keyboard navigation to carousel/swiper
 * @param {HTMLElement} swiper - The swiper container element
 * @param {Object} swiperInstance - The Swiper instance
 */
export function enhanceSwiperAccessibility(swiper, swiperInstance) {
  if (!swiper || !swiperInstance) return;

  swiper.setAttribute('role', 'region');
  swiper.setAttribute('aria-label', 'Carousel');

  // Add keyboard navigation
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        swiperInstance.slidePrev();
        announceToScreenReader(`Slide ${swiperInstance.activeIndex + 1} of ${swiperInstance.slides.length}`);
        break;
      case 'ArrowRight':
        e.preventDefault();
        swiperInstance.slideNext();
        announceToScreenReader(`Slide ${swiperInstance.activeIndex + 1} of ${swiperInstance.slides.length}`);
        break;
      case 'Home':
        e.preventDefault();
        swiperInstance.slideTo(0);
        announceToScreenReader('First slide');
        break;
      case 'End':
        e.preventDefault();
        swiperInstance.slideTo(swiperInstance.slides.length - 1);
        announceToScreenReader('Last slide');
        break;
    }
  };

  swiper.addEventListener('keydown', handleKeyDown);

  // Add aria-label to slides
  swiperInstance.slides.forEach((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${swiperInstance.slides.length}`);
  });

  return () => {
    swiper.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Initialize focus visible utility for keyboard navigation
 */
export function initFocusVisible() {
  let hadKeyboardEvent = false;

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      hadKeyboardEvent = true;
      document.body.classList.add('keyboard-nav');
    }
  };

  const handleMouseDown = () => {
    hadKeyboardEvent = false;
    document.body.classList.remove('keyboard-nav');
  };

  document.addEventListener('keydown', handleKeyDown, { passive: true });
  document.addEventListener('mousedown', handleMouseDown, { passive: true });

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('mousedown', handleMouseDown);
  };
}

/**
 * Manage page scroll lock (for modals)
 * @param {boolean} lock - Whether to lock or unlock scroll
 */
export function toggleScrollLock(lock) {
  if (lock) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  } else {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}
