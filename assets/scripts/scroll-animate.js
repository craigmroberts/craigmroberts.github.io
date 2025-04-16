function animateTextElements(scope = document) {
  const elements = scope.querySelectorAll('.scroll-animate:not(.animated-init)');

  elements.forEach(el => {
    const text = el.textContent;
    el.textContent = ''; // Clear original content
    el.classList.add('animated-init');

    const words = text.split(' ');

    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';

      Array.from(word).forEach((char, charIndex) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.setProperty('--char-index', wordIndex * 10 + charIndex); // offset for delay
        wordSpan.appendChild(span);
      });

      // Add space between words
      const space = document.createTextNode('\u00A0');
      el.appendChild(wordSpan);
      el.appendChild(space);
    });

    observer.observe(el);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2
});

document.addEventListener('DOMContentLoaded', () => {
  animateTextElements();
});

window.animateText = animateTextElements;
