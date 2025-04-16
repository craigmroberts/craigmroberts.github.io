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

    // new Swiper('#brands-worked-with', {
        
    //     slidesPerView: 2,
    //     spaceBetween: 24,
    //     speed: 8000,
    //     autoplay: {
    //       delay: 0,
    //       disableOnInteraction: false,
    //       pauseOnMouseEnter: false
    //     },
    //     loop: true,
    //     grabCursor: true,
    //     freeMode: true,
    //     freeModeMomentum: false,
    //     grid: {
    //       rows: 2,
    //       fill: 'row'
    //     },
    //     breakpoints: {
    //       768: {
    //         slidesPerView: 3,
    //         grid: {
    //           rows: 2,
    //           fill: 'row'
    //         },
    //         spaceBetween: 32
    //       },
    //       1200: {
    //         slidesPerView: 5,
    //         grid: {
    //           rows: 2,
    //           fill: 'row'
    //         },
    //         spaceBetween: 48
    //       }
    //     }
    //   });
});