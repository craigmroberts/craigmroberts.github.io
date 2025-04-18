// initInViewAnimations.js
import { animateScrollText } from '../helpers/textAnimator.js';
import { watchInViewElements } from '../helpers/inViewWatcher.js';

export function initInViewAnimations(scope = document) {
  // Assuming animateScrollText also uses scope or is independent
  animateScrollText(scope);
  watchInViewElements(scope, { topThreshold: 100, bottomThreshold: 0 });
}

// Optional: Expose globally if needed, though often better to avoid globals
// window.animateText = initInViewAnimations;

document.addEventListener('DOMContentLoaded', () => {
  initInViewAnimations();
});