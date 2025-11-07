// Defer Swiper initialization to reduce forced reflow
const initBrandsSwiper = () => {
  // Use requestAnimationFrame to batch DOM reads/writes
  requestAnimationFrame(() => {
    new Swiper('.brands-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 48,
      speed: 8000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false
      },
      loop: true,
      freeMode: true,
      grabCursor: true,
      freeModeMomentum: false,
      // Optimize for performance
      watchSlidesProgress: false,
      watchSlidesVisibility: false,
      // Prevent forced reflow
      observer: false,
      observeParents: false,
      observeSlideChildren: false,
    });
  });
};

// Use requestIdleCallback to defer initialization
if ('requestIdleCallback' in window) {
  requestIdleCallback(initBrandsSwiper, { timeout: 2000 });
} else {
  // Fallback for browsers without requestIdleCallback
  setTimeout(initBrandsSwiper, 100);
}