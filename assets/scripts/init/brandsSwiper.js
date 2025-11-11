import { lazyInitSwiper } from '../helpers/lazySwiper.js';

// Get the brands swiper element
const brandsSwiper = document.querySelector('.brands-swiper');

// Lazy load and initialize Swiper when element is near viewport
if (brandsSwiper) {
  lazyInitSwiper(brandsSwiper, (Swiper) => {
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
}