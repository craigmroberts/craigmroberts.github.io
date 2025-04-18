// initInViewAnimations.js
import { animateScrollText } from '../helpers/animation/textAnimator.js';
import { watchInViewElements } from '../helpers/animation/inViewWatcher.js';
import enableSnapScroll from '../features/snapScroll.js';

export function initInViewAnimations(scope = document) {
  // Assuming animateScrollText also uses scope or is independent
  animateScrollText(scope);
  watchInViewElements(scope, { topThreshold: 100, bottomThreshold: 0 });
}

// Optional: Expose globally if needed, though often better to avoid globals
// window.animateText = initInViewAnimations;

document.addEventListener('DOMContentLoaded', () => {
  initInViewAnimations();
  enableSnapScroll();
});
