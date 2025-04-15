// bodyLock.js
let scrollPosition = 0;

export function lockBody() {
  scrollPosition = window.pageYOffset;
  document.body.style.overflow = 'hidden';
}

export function unlockBody() {
  document.body.style.overflow = '';
}
