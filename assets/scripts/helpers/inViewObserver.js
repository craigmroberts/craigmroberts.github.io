export function createInViewObserver(callback, threshold = 0.2) {
    return new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold });
}
