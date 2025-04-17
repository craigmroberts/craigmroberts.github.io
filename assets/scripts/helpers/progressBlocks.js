/**
 * Generate a progress blocks element.
 * @param {number} filled - The number of filled blocks.
 * @param {number} total - The total number of blocks.
 * @returns {HTMLElement} - A DOM element containing the blocks.
 */
export function createProgressBlocks(filled = 0, total = 5) {
  const container = document.createElement('div');
  container.className = 'progress-blocks';
  container.setAttribute('aria-label', `Progress: ${filled} out of ${total}`);

  for (let i = 0; i < total; i++) {
    const block = document.createElement('span');
    block.className = 'block';
    if (i < filled) {
      block.classList.add('filled');
      block.setAttribute('data-index', i); // For staggered animation
    }
    container.appendChild(block);
  }

  return container;
}
