export function wrapTextWithSpans(el) {
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
        span.style.setProperty('--char-index', wordIndex * 10 + charIndex); // delay offset
        wordSpan.appendChild(span);
      });
  
      const space = document.createTextNode('\u00A0');
      el.appendChild(wordSpan);
      el.appendChild(space);
    });
}
  