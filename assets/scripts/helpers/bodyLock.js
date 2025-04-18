// bodyLock.js

let scrollPosition = 0;

/**
 * Locks the body scroll by disabling overflow.
 * Stores the current scroll position for potential future use.
 */
export function lockBody() {
  scrollPosition = window.pageYOffset;
  document.body.style.overflow = 'hidden';
}

/**
 * Unlocks the body scroll by resetting the overflow style.
 */
export function unlockBody() {
  document.body.style.overflow = '';
}
