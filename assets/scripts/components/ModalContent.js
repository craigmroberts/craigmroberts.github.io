import { lockBody, unlockBody } from '../helpers/bodyLock.js';

class ModalContent extends HTMLElement {
  constructor() {
    super();
    this.isDragging = false;
    this.startY = 0;
    this.currentY = 0;
    this.initialTouchY = 0;
    this.closeThreshold = 150; // Pixels to drag down before closing
    this.boundHandleTouchStart = this.handleTouchStart.bind(this);
    this.boundHandleTouchMove = this.handleTouchMove.bind(this);
    this.boundHandleTouchEnd = this.handleTouchEnd.bind(this);
  }

  connectedCallback() {
    const triggerSelector = this.dataset.triggers;
    if (!triggerSelector) return;

    const triggers = document.querySelectorAll(triggerSelector);
    if (!triggers.length) return;

    triggers.forEach(trigger => {
      trigger.addEventListener("click", async () => {
        await this.ensureModalLoaded();
        this.showModal();
      });
    });
  }

  async ensureModalLoaded() {
    if (document.getElementById("modal")) return;

    try {
      const response = await fetch('./snippets/modal.html');
      const html = await response.text();
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      const modal = wrapper.querySelector("#modal");
      if (!modal) throw new Error("Modal not found in snippet");
      document.body.appendChild(modal);
      this.attachCloseHandlers(modal);
      this.setupDragFunctionality(modal);
    } catch (err) {
      console.error("Failed to load modal snippet:", err);
    }
  }

  attachCloseHandlers(modal) {
    const closeBtn = modal.querySelector(".modal__close");
    const overlay = modal.querySelector(".modal__overlay");
    closeBtn?.addEventListener("click", this.closeModal);
    overlay?.addEventListener("click", this.closeModal);
  }

  setupDragFunctionality(modal) {
    // Only setup drag on mobile/tablet
    if (window.innerWidth >= 768) return;
    
    const modalContent = modal.querySelector(".modal__content");
    const dragBar = modal.querySelector(".modal__drag-bar");
    
    if (!modalContent || !dragBar) return;
    
    // Add visual indicator to drag bar if desired
    dragBar.setAttribute('aria-label', 'Drag to close');
    
    // Add touch event listeners to modal content
    console.log('Setting up touch events for modal drag');
    modalContent.addEventListener('touchstart', this.boundHandleTouchStart, { passive: true });
    document.addEventListener('touchmove', this.boundHandleTouchMove, { passive: false });
    document.addEventListener('touchend', this.boundHandleTouchEnd);
  }

  handleTouchStart(e) {
    // Only initiate drag from the top part of the modal
    const touch = e.touches[0];
    const modalContent = document.querySelector('.modal__content');
    const dragBar = document.querySelector('.modal__drag-bar');
    
    // Get the bounding boxes to check if touch is near the drag bar
    const contentRect = modalContent.getBoundingClientRect();
    const touchY = touch.clientY - contentRect.top;
    
    // Allow dragging if touch is in the top 60px of the modal
    // Adjust this value based on your design
    if (touchY <= 60) {
      this.isDragging = true;
      this.initialTouchY = touch.clientY;
      this.startY = touch.clientY;
      
      // Get the current transform value
      const transform = window.getComputedStyle(modalContent).transform;
      const matrix = new DOMMatrix(transform);
      this.currentY = matrix.m42; // The Y translation value from the matrix
      
      // Add a class to indicate dragging
      modalContent.classList.add('is-dragging');
    }
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;
    
    // Prevent scrolling when dragging
    e.preventDefault();
    
    const modalContent = document.querySelector('.modal__content');
    const touch = e.touches[0];
    const deltaY = touch.clientY - this.startY;
    
    // Don't allow dragging the modal up past its starting position
    const newY = Math.max(0, this.currentY + deltaY);
    
    // Apply the transform
    modalContent.style.transform = `translateY(${newY}px)`;
    
    // Optional: adjust opacity of overlay based on drag distance
    const modal = document.getElementById('modal');
    const overlay = modal.querySelector('.modal__overlay');
    
    if (overlay) {
      const dragPercentage = Math.min(1, newY / this.closeThreshold);
      overlay.style.opacity = 1 - (dragPercentage * 0.5);
    }
  }

  handleTouchEnd(e) {
    if (!this.isDragging) return;
    
    const modalContent = document.querySelector('.modal__content');
    this.isDragging = false;
    modalContent.classList.remove('is-dragging');
    
    // Get current position
    const transform = window.getComputedStyle(modalContent).transform;
    const matrix = new DOMMatrix(transform);
    const currentY = matrix.m42;
    
    // If dragged past threshold, close the modal
    if (currentY > this.closeThreshold) {
      this.animateAndClose(modalContent);
    } else {
      // Return to original position
      this.resetPosition(modalContent);
    }
  }

  animateAndClose(modalContent) {
    // Animate the modal moving down
    modalContent.style.transition = 'transform 0.3s ease';
    modalContent.style.transform = `translateY(100%)`;
    
    // Reset the overlay opacity
    const modal = document.getElementById('modal');
    const overlay = modal.querySelector('.modal__overlay');
    if (overlay) {
      overlay.style.opacity = '';
    }
    
    // Close the modal after animation
    setTimeout(() => {
      this.closeModal();
      // Reset the transform after closing
      modalContent.style.transform = '';
      modalContent.style.transition = '';
    }, 300);
  }

  resetPosition(modalContent) {
    modalContent.style.transition = 'transform 0.3s ease';
    modalContent.style.transform = '';
    
    // Reset the overlay opacity
    const modal = document.getElementById('modal');
    const overlay = modal.querySelector('.modal__overlay');
    if (overlay) {
      overlay.style.opacity = '';
    }
    
    // Remove the transition after it completes
    setTimeout(() => {
      modalContent.style.transition = '';
    }, 300);
  }

  showModal() {
    const modal = document.getElementById("modal");
    const innerContent = modal.querySelector(".modal__inner-content");
    innerContent.innerHTML = "";

    const clone = this.cloneNode(true);
    innerContent.append(...clone.childNodes);

    if (this.dataset.nav === "true") {
      this.setupNavigation(modal);
    }

    setTimeout(() => {
      lockBody();
      document.body.classList.add("modal-open");
      modal.classList.add("is-active");
      
      // Ensure any lingering transforms are reset
      const modalContent = modal.querySelector(".modal__content");
      if (modalContent) {
        modalContent.style.transform = '';
        modalContent.style.transition = '';
      }
    }, 50);
  }

  setupNavigation(modal) {
    const allModals = Array.from(document.querySelectorAll("modal-content[data-nav='true']"));
    const currentIndex = allModals.indexOf(this);
    const nextIndex = (currentIndex + 1) % allModals.length;
    const prevIndex = (currentIndex - 1 + allModals.length) % allModals.length;

    const nextBtn = modal.querySelector(".modal__nav--next");
    const prevBtn = modal.querySelector(".modal__nav--prev");

    if (nextBtn) {
      nextBtn.onclick = () => allModals[nextIndex].showModal();
    }
    if (prevBtn) {
      prevBtn.onclick = () => allModals[prevIndex].showModal();
    }
  }

  closeModal() {
    const modal = document.getElementById("modal");
    unlockBody();
    document.body.classList.remove("modal-open");
    modal.classList.remove("is-active");
    
    // Reset any transforms and transitions
    const modalContent = modal.querySelector(".modal__content");
    if (modalContent) {
      // Let CSS handle the closing animation
      modalContent.style.transform = '';
      modalContent.style.transition = '';
    }
  }
}

customElements.define("modal-content", ModalContent);

export default ModalContent;