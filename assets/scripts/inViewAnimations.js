// initInViewAnimations.js
import { animateScrollText } from './helpers/textAnimator.js'; // Assuming this exists and works separately
import { watchInViewElements } from './helpers/inViewWatcher.js';

export function initInViewAnimations(scope = document) {
  // Assuming animateScrollText also uses scope or is independent
  animateScrollText(scope);
  watchInViewElements(scope);
}

// Optional: Expose globally if needed, though often better to avoid globals
// window.animateText = initInViewAnimations;

document.addEventListener('DOMContentLoaded', () => {
  initInViewAnimations();
});