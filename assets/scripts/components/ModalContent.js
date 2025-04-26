import { lockBody, unlockBody } from '../helpers/dom/bodyLock.js';
// import { throttle } from '../helpers/utils/throttle.js';

class ModalContent extends HTMLElement {
  constructor() {
    super();
    this.isDragging = false;        // Is the modal currently being dragged?
    this._dragStarted = false;      // Has the drag gesture definitely started? (Used to latch state in touchmove)
    this.startY = 0;              // Initial touch Y position
    this.currentY = 0;            // Current Y translation of modalContent
    this.startScrollTop = 0;      // scrollTop of innerContent at touchstart
    this._dragHandleInitiated = false; // Did the touch start on the drag handle?

    this.closeThreshold = 150; // Pixels to drag down before closing

    // Bind methods
    this.boundHandleTouchStart = this.handleTouchStart.bind(this);
    // No throttling on touchmove for now
    this.boundHandleTouchMove = this.handleTouchMove.bind(this);
    this.boundHandleTouchEnd = this.handleTouchEnd.bind(this);
    this.boundCloseModal = this.closeModal.bind(this); // Bind close if used directly
  }

  connectedCallback() {
    const triggerSelector = this.dataset.triggers;
    if (!triggerSelector) return;

    const triggers = document.querySelectorAll(triggerSelector);
    if (!triggers.length) return;

    triggers.forEach(trigger => {
      trigger.addEventListener('click', async () => {
        await this.ensureModalLoaded();
        this.showModal();
      });
    });
  }

  disconnectedCallback() {
    window.removeEventListener('touchmove', this.boundHandleTouchMove);
    window.removeEventListener('touchend', this.boundHandleTouchEnd);
  }

  async ensureModalLoaded() {
    // Same as before, ensure response.ok check
    if (document.getElementById('modal')) return;
    try {
      const response = await fetch('./snippets/modal.html');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); // Added check
      const html = await response.text();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html.trim(); // Added trim
      const modal = wrapper.querySelector('#modal');
      if (!modal) throw new Error('Modal not found in snippet');
      document.body.appendChild(modal);
      this.attachCloseHandlers(modal); // Ensure this uses boundCloseModal or arrow functions
      this.setupDragFunctionality(modal);
    } catch (err) {
      console.error('Failed to load modal snippet:', err);
    }
  }

  attachCloseHandlers(modal) {
    const closeBtn = modal.querySelector('.modal__close');
    const overlay = modal.querySelector('.modal__overlay');
    closeBtn?.addEventListener('click', this.boundCloseModal); // Use bound method
    overlay?.addEventListener('click', this.boundCloseModal); // Use bound method
  }

  setupDragFunctionality(modal) {
    // Only setup drag on mobile/tablet - consider touch support detection instead?
    if (window.matchMedia('(min-width: 768px)').matches) return;

    const modalContent = modal.querySelector('.modal__content');
    const dragBar = modal.querySelector('.modal__drag-bar');
    const innerContent = modalContent?.querySelector('.modal__inner-content'); // Use optional chaining

    // Ensure all required elements exist
    if (!modalContent || !dragBar || !innerContent) {
        console.warn("Modal drag setup failed: Missing required elements (.modal__content, .modal__drag-bar, .modal__inner-content)");
        return;
    }

    // Add visual indicator to drag bar if desired
    dragBar.setAttribute('aria-label', 'Drag down to close modal');

    // --- Event Listener Changes ---
    // Drag bar always initiates drag, passive can be true (optional optimization)
    dragBar.addEventListener('touchstart', this.boundHandleTouchStart, { passive: true });
    // Inner content MAY initiate drag OR scroll, must NOT be passive
    innerContent.addEventListener('touchstart', this.boundHandleTouchStart, { passive: false });

    // Listen on window/document to track movement even if pointer leaves the element
    window.addEventListener('touchmove', this.boundHandleTouchMove, { passive: false });
    window.addEventListener('touchend', this.boundHandleTouchEnd);
  }

  handleTouchStart(e) {
    // Prevent multi-touch interference
    if (e.touches.length > 1) return;

    const touch = e.touches[0];
    const modalContent = document.querySelector('#modal .modal__content'); // More specific selector
    const innerContent = modalContent?.querySelector('.modal__inner-content');
    const dragBar = modalContent?.querySelector('.modal__drag-bar');

    if (!modalContent || !innerContent || !dragBar) return;

    // Reset flags
    this.isDragging = false;
    this._dragStarted = false;

    // Check if touch started on the drag handle element
    this._dragHandleInitiated = (e.target === dragBar || dragBar.contains(e.target));

    // Record initial positions and state
    this.startY = touch.clientY;
    this.startScrollTop = innerContent.scrollTop;

    // Get initial transform state only if starting on handle (can optimize)
    // We recalculate this in touchmove if needed anyway
    if (this._dragHandleInitiated) {
        const transform = window.getComputedStyle(modalContent).transform;
        const matrix = (transform === 'none') ? new DOMMatrix() : new DOMMatrix(transform);
        this.currentY = matrix.m42;
        this.isDragging = true; // Can set dragging true immediately if starting on handle
    } else {
        this.currentY = 0; // Reset or get current transform if needed later
    }
  }

  handleTouchMove(e) {
    // If not touch started properly, or multi-touch, ignore
    if (this.startY === 0 || e.touches.length > 1) return;

    const touch = e.touches[0];
    const modalContent = document.querySelector('#modal .modal__content');
    const innerContent = modalContent?.querySelector('.modal__inner-content');
    if (!modalContent || !innerContent) return;

    const deltaY = touch.clientY - this.startY;

    // --- Core Logic: Decide Drag vs Scroll ---

    // 1. If drag was initiated on the handle, always drag
    if (this._dragHandleInitiated) {
      if (!this._dragStarted) {
        // First move event after starting on handle
        modalContent.style.transition = 'none'; // Disable transitions during drag
        modalContent.classList.add('is-dragging');
        this._dragStarted = true;
      }
      e.preventDefault(); // Prevent scroll only when dragging
      this.performDrag(modalContent, deltaY);
      return; // Stop further processing
    }

    // 2. If touch started on content, check conditions for dragging vs scrolling

    // Scrolling Up: If moving finger up, always allow native scroll
    if (deltaY < 0) {
      // If we were previously dragging down, but now move up, reset drag? Optional.
      // For now, just allow scrolling up.
      return;
    }

    // Scrolling Down:
    if (deltaY > 0) {
      // If content is scrolled down, allow native scroll
      if (this.startScrollTop > 0 || innerContent.scrollTop > 0) {
        // Ensure scrollTop is checked *currently* as well as at the start
        return;
      }

      // --- Start Dragging Down ---
      // If content is at the top (scrollTop === 0) and user is pulling down
      if (!this._dragStarted) {
        // This is the first 'move' event where we decide to drag down
        // Get the *current* transform accurately right before dragging starts
        const transform = window.getComputedStyle(modalContent).transform;
        const matrix = (transform === 'none') ? new DOMMatrix() : new DOMMatrix(transform);
        this.currentY = matrix.m42; // Update currentY to actual position

        modalContent.style.transition = 'none'; // Disable transitions during drag
        modalContent.classList.add('is-dragging');
        this._dragStarted = true; // Latch the dragging state
        this.isDragging = true; // Set main flag
      }

      e.preventDefault(); // Prevent scroll ONLY when dragging starts/continues
      this.performDrag(modalContent, deltaY);
      return; // Stop further processing
    }

    // If deltaY is 0, do nothing special
  }

  /**
   * Helper to apply the drag transformation and overlay opacity.
   */
  performDrag(modalContent, deltaY) {
    // Only allow dragging downwards from the initial position
    const newY = Math.max(0, this.currentY + deltaY);
    modalContent.style.transform = `translateY(${newY}px)`;

    // Optional: adjust overlay opacity
    const overlay = document.querySelector('#modal .modal__overlay');
    if (overlay) {
      const dragPercentage = Math.min(1, newY / this.closeThreshold); // Use newY relative to 0
      overlay.style.opacity = Math.max(0.3, 1 - dragPercentage * 0.7).toString();
    }
  }

  handleTouchEnd(e) {
    // Reset startY to prevent interference with subsequent moves if touch didn't end properly
    this.startY = 0;

    if (!this._dragStarted) { // Only process end if a drag actually started
        this._dragHandleInitiated = false; // Reset handle flag too
        return;
    }


    const modalContent = document.querySelector('#modal .modal__content');
    if (!modalContent) return;

    // Reset flags
    this.isDragging = false;
    this._dragStarted = false;
    this._dragHandleInitiated = false;
    modalContent.classList.remove('is-dragging');

    // Get final position
    const transform = window.getComputedStyle(modalContent).transform;
    const matrix = (transform === 'none') ? new DOMMatrix() : new DOMMatrix(transform);
    const finalY = matrix.m42;

    // Check threshold
    if (finalY > this.closeThreshold) {
      this.animateAndClose(modalContent);
    } else {
      this.resetPosition(modalContent);
    }
  }

  animateAndClose(modalContent) {
    // Same as before, ensure transitionend listener is used
    if (!modalContent) return;
    modalContent.style.transition = 'transform 0.25s ease-out';
    modalContent.style.transform = `translateY(100%)`;

    const overlay = document.querySelector('#modal .modal__overlay');
    if (overlay) {
        overlay.style.transition = 'opacity 0.25s ease-out';
        overlay.style.opacity = '0';
    }

    modalContent.addEventListener('transitionend', () => {
        this.closeModal();
        // Reset styles after closing
        modalContent.style.transform = '';
        modalContent.style.transition = '';
        if (overlay) {
            overlay.style.opacity = '';
            overlay.style.transition = '';
        }
    }, { once: true });
  }

  resetPosition(modalContent) {
    // Same as before, ensure transitionend listener is used
     if (!modalContent) return;
    modalContent.style.transition = 'transform 0.3s ease';
    modalContent.style.transform = ''; // Reset to original

    const overlay = document.querySelector('#modal .modal__overlay');
    if (overlay) {
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = ''; // Reset to default
    }

    modalContent.addEventListener('transitionend', () => {
        modalContent.style.transition = '';
        if (overlay) {
            overlay.style.transition = '';
        }
    }, { once: true });
  }

  showModal() {
    // Same as before, ensure modal/innerContent checks
    const modal = document.getElementById('modal');
     if (!modal) return; // Added check
    const innerContent = modal.querySelector('.modal__inner-content');
    if (!innerContent) return; // Added check

    innerContent.innerHTML = ''; // Clear previous

    const clone = this.cloneNode(true);
    innerContent.append(...clone.childNodes);

    if (this.dataset.nav === 'true') {
      this.setupNavigation(modal); // Assumes this is implemented correctly
    }

    // Reset scroll position of inner content when modal is shown
    innerContent.scrollTop = 0;

    requestAnimationFrame(() => { // Use rAF
      lockBody();
      document.body.classList.add('modal-open');
      modal.classList.add('is-active');

      const modalContent = modal.querySelector('.modal__content');
      if (modalContent) {
        modalContent.style.transform = ''; // Ensure transform is reset
        modalContent.style.transition = ''; // Ensure transition is reset
      }
       // Reset overlay opacity as well
      const overlay = modal.querySelector('.modal__overlay');
      if (overlay) {
          overlay.style.opacity = '';
          overlay.style.transition = '';
      }
    });
  }

  // setupNavigation() - Assuming correct implementation from previous steps

  closeModal() {
    // Same as before, consider cleanup
    const modal = document.getElementById('modal');
    if (!modal || !modal.classList.contains('is-active')) return; // Added checks

    unlockBody();
    document.body.classList.remove('modal-open');
    modal.classList.remove('is-active');

    // Reset styles if needed (though transitionend should handle it)
    const modalContent = modal.querySelector('.modal__content');
    if (modalContent) {
      modalContent.style.transform = '';
      modalContent.style.transition = '';
    }
     const overlay = modal.querySelector('.modal__overlay');
    if (overlay) {
        overlay.style.opacity = '';
        overlay.style.transition = '';
    }
  }
}

customElements.define('modal-content', ModalContent);

export default ModalContent;
