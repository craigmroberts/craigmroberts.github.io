export default function enableSnapScroll() {
  const container = document.body; // Or a specific parent container
  let startY = 0;
  let endY = 0;
  let isThrottled = false;

  container.addEventListener('touchstart', (e) => {
    const section = e.target.closest('[data-snap-section]');
    if (!section) return;
    startY = e.touches[0].clientY;
  });

  container.addEventListener('touchend', (e) => {
    const section = e.target.closest('[data-snap-section]');
    if (!section) return;
    endY = e.changedTouches[0].clientY;

    const direction = startY - endY > 0 ? 'down' : 'up';
    if (!isThrottled) {
      isThrottled = true;
      handleSwipe(section, direction);
      setTimeout(() => (isThrottled = false), 300); // Throttle duration
    }
  });

  function handleSwipe(section, direction) {
    if (direction === 'down') {
      const nextSection = section.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (direction === 'up') {
      const prevSection = section.previousElementSibling;
      if (prevSection) {
        prevSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
