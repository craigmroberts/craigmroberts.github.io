/**
 * Wraps each word and character of an element's text content in separate spans
 * for character-level animation, adding CSS custom properties for delays.
 * Replaces the original text content.
 *
 * @param {Element} el - The DOM element whose text content should be wrapped.
 */
export function wrapTextWithSpans(el) {
  // Get and trim the text content to handle leading/trailing whitespace
  const text = el.textContent?.trim() || ''; // Use optional chaining and default to empty string
  if (!text) {
    // If there's no text, nothing to wrap
    return;
  }

  // Clear original content before adding spans
  el.textContent = '';

  // Mark as initialized (Note: Might be redundant if already done by caller)
  el.classList.add('animated-init');

  // Split text into words based on spaces
  const words = text.split(/\s+/); // Split by one or more spaces

  words.forEach((word, wordIndex) => {
    // Don't process empty strings that might result from multiple spaces
    if (!word) {
      return;
    }

    // Add a space before the word span (except for the first word)
    if (wordIndex > 0) {
      // Using a regular space ' ' allows normal line wrapping
      // Using non-breaking space '\u00A0' prevents wrapping between words
      const space = document.createTextNode(' ');
      el.appendChild(space);
    }

    // Create a span to wrap the entire word
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word'; // Assign class for potential word-level styling/animation

    // Iterate over each character in the word
    // Use Array.from() to correctly handle potential multi-byte characters (like emoji)
    Array.from(word).forEach((char, charIndex) => {
      // Create a span for the individual character
      const span = document.createElement('span');
      span.className = 'char'; // Assign class for character-level styling/animation
      span.textContent = char;

      // Set a CSS custom property for staggered animation delays
      // Adjust multiplier (10) as needed for desired stagger effect
      const delayIndex = wordIndex * 10 + charIndex;
      span.style.setProperty('--char-index', delayIndex.toString());

      // Append the character span to the word span
      wordSpan.appendChild(span);
    });

    // Append the fully constructed word span to the original element
    el.appendChild(wordSpan);
  });
}