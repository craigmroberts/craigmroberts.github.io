import { lockBody, unlockBody } from '../helpers/dom/bodyLock.js';
import { throttle } from '../helpers/utils/throttle.js';

class ModalContent extends HTMLElement {
  constructor() {
    super();
    this.isDragging = false;
    this.startY = 0;
    this.currentY = 0;
    this.initialTouchY = 0;
    this.closeThreshold = 150; // Pixels to drag down before closing
    this.boundHandleTouchStart = this.handleTouchStart.bind(this);
    this.boundHandleTouchMove = throttle(this.handleTouchMove.bind(this), 100); // Throttled
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
    const innerContent = modalContent.querySelector(".modal__inner-content");

    if (!modalContent || !dragBar || !innerContent) return;

    // Add visual indicator to drag bar if desired
    dragBar.setAttribute('aria-label', 'Drag to close');

    // Add touch event listeners to modal content and drag bar
    dragBar.addEventListener('touchstart', this.boundHandleTouchStart, { passive: true });
    innerContent.addEventListener('touchstart', this.boundHandleTouchStart, { passive: true });

    // Use passive: false for touchmove to allow e.preventDefault()
    document.addEventListener('touchmove', this.boundHandleTouchMove, { passive: false });
    document.addEventListener('touchend', this.boundHandleTouchEnd);
  }

  handleTouchStart(e) {
    const touch = e.touches[0];
    const modalContent = document.querySelector('.modal__content');
    const innerContent = modalContent.querySelector('.modal__inner-content');

    // Check if the touch is on the drag bar or if the inner content is scrolled to the top
    const contentRect = modalContent.getBoundingClientRect();
    const touchY = touch.clientY - contentRect.top;

    // Allow normal scrolling if the user is not pulling down and the content is scrollable
    if (innerContent.scrollTop > 0 && touchY > 60) {
        this.isDragging = false;
        return;
    }

    // Activate dragging if the user is pulling down and the content is fully scrolled to the top
    if (touchY <= 60 || (innerContent.scrollTop === 0 && touchY > 60)) {
        this.isDragging = true;
        this.initialTouchY = touch.clientY;
        this.startY = touch.clientY;

        const transform = window.getComputedStyle(modalContent).transform;
        const matrix = new DOMMatrix(transform);
        this.currentY = matrix.m42;

        modalContent.classList.add('is-dragging');
    }
  }

  handleTouchMove(e) {
    const modalContent = document.querySelector('.modal__content');
    const innerContent = modalContent.querySelector('.modal__inner-content');
    const touch = e.touches[0];
    const deltaY = touch.clientY - this.startY;

    // Allow normal scrolling if the user is scrolling up and the content is scrollable
    if (!this.isDragging && deltaY < 0 && innerContent.scrollTop > 0) {
        return; // Let the browser handle scrolling
    }

    // Prevent default behavior and activate dragging if pulling down
    if (this.isDragging) {
        e.preventDefault(); // Prevent scrolling when dragging
        const newY = Math.max(0, this.currentY + deltaY);

        modalContent.style.transform = `translateY(${newY}px)`;

        const modal = document.getElementById('modal');
        const overlay = modal.querySelector('.modal__overlay');

        if (overlay) {
            const dragPercentage = Math.min(1, newY / this.closeThreshold);
            overlay.style.opacity = 1 - (dragPercentage * 0.5);
        }
    }
  }

  handleTouchEnd() {
    if (!this.isDragging) return;

    const modalContent = document.querySelector('.modal__content');
    this.isDragging = false;
    modalContent.classList.remove('is-dragging');

    const transform = window.getComputedStyle(modalContent).transform;
    const matrix = new DOMMatrix(transform);
    const currentY = matrix.m42;

    if (currentY > this.closeThreshold) {
        this.animateAndClose(modalContent);
    } else {
        this.resetPosition(modalContent);
    }
  }

  animateAndClose(modalContent) {
    modalContent.style.transition = 'transform 0.3s ease';
    modalContent.style.transform = `translateY(100%)`;

    const modal = document.getElementById('modal');
    const overlay = modal.querySelector('.modal__overlay');
    if (overlay) {
      overlay.style.opacity = '';
    }

    setTimeout(() => {
      this.closeModal();
      modalContent.style.transform = '';
      modalContent.style.transition = '';
    }, 300);
  }

  resetPosition(modalContent) {
    modalContent.style.transition = 'transform 0.3s ease';
    modalContent.style.transform = '';

    const modal = document.getElementById('modal');
    const overlay = modal.querySelector('.modal__overlay');
    if (overlay) {
      overlay.style.opacity = '';
    }

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

    const modalContent = modal.querySelector(".modal__content");
    if (modalContent) {
      modalContent.style.transform = '';
      modalContent.style.transition = '';
    }
  }
}

customElements.define("modal-content", ModalContent);

export default ModalContent;