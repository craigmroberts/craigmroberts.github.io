document.addEventListener('DOMContentLoaded', () => {
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
    });
});