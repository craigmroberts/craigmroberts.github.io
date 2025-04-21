import { lockBody, unlockBody } from '../helpers/dom/bodyLock.js';
import ModalContent from './ModalContent.js';
import brands from '../../data/brands.js';
import { createProgressBlocks } from '../helpers/progressBlocks.js';
import Mustache from 'mustache';

/**
 * @class ModalBrand
 * @classdesc Extends ModalContent to display brand-specific details.
 * @extends ModalContent
 */
class ModalBrand extends ModalContent {
  // Static properties
  static modalHtmlCache = null;
  // Static keyboard handler for cross-instance navigation
  static #globalKeyHandler = null;
  
  // Class fields for better encapsulation and cleanup
  #lastFocusedElement = null;
  #focusTrapHandler = null;

  constructor() {
    super();
    // Bind methods to preserve 'this' context
    this.closeModal = this.closeModal.bind(this);
    this.handleFocusTrap = this.handleFocusTrap.bind(this);
  }

  // Web Component lifecycle method - handles cleanup
  disconnectedCallback() {
    this.cleanupEventListeners();
    super.disconnectedCallback?.();
  }

  /**
   * Ensures the brand-specific modal template is loaded.
   * @override
   * @returns {Promise<void>}
   */
  async ensureModalLoaded() {
    // Check if the modal is already in the DOM
    if (document.getElementById('modal')) {
      return;
    }

    try {
      // Use cached modal if available
      if (ModalBrand.modalHtmlCache) {
        const cachedModal = ModalBrand.modalHtmlCache.cloneNode(true);
        document.body.appendChild(cachedModal);
        return;
      }

      // Fetch the modal HTML snippet
      const response = await fetch('./snippets/modal-brand.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html.trim();
      const modal = wrapper.firstElementChild;

      if (!modal || modal.id !== 'modal') {
        throw new Error('Modal structure (#modal) not found in snippet');
      }

      // Cache the modal HTML for future use
      ModalBrand.modalHtmlCache = modal;

      // Setup accessibility attributes
      this.#setupModalAccessibility(modal);
      
      // Append to DOM
      document.body.appendChild(modal);
      
      // Setup base functionality
      this.attachCloseHandlers(modal);
      this.setupDragFunctionality(modal);
    } catch (err) {
      console.error('Failed to load modal-brand snippet:', err);
    }
  }

  /**
   * Sets up accessibility attributes for the modal
   * @param {HTMLElement} modal - The modal element
   */
  #setupModalAccessibility(modal) {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('tabindex', '-1');
  }

  /**
   * Populates and shows the modal with specific brand data.
   * @override
   */
  async showModal() {
    await this.ensureModalLoaded();

    const modal = document.getElementById('modal');
    if (!modal) {
      console.error('Cannot show modal: #modal element not found.');
      return;
    }

    const innerContent = modal.querySelector('.modal__inner-content');
    if (!innerContent) {
      console.error('Cannot show modal: .modal__inner-content element not found.');
      return;
    }

    // Clear previous content
    innerContent.innerHTML = '';

    const brandId = this.getAttribute('data-brand-id');
    if (!brandId) {
      console.error('ModalBrand: data-brand-id attribute is missing.');
      innerContent.innerHTML = '<p>Error: Brand ID not specified.</p>';
      return;
    }

    // Find the corresponding brand data
    const brandData = brands.find(b => b.id === brandId);
    if (!brandData) {
      console.error(`Brand data not found for ID: ${brandId}`);
      innerContent.innerHTML = '<p>Brand information not available.</p>';
      return;
    }

    // Populate modal content
    this.populateBrandContent(innerContent, brandData);

    // Setup navigation if enabled
    if (this.dataset.nav === 'true') {
      this.setupNavigation(modal);
    }

    // Save the last focused element and show modal
    this.#lastFocusedElement = document.activeElement;
    this.#showModalWithAnimation(modal);
  }

  /**
   * Handles the animation and display of the modal
   * @param {HTMLElement} modal - The modal element
   */
  #showModalWithAnimation(modal) {
    requestAnimationFrame(() => {
      lockBody();
      document.body.classList.add('modal-open');
      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      modal.focus();

      // Setup focus trap
      this.#setupFocusTrap(modal);

      // Animate progress blocks with reduced delay
      const progressBlocks = modal.querySelector('.progress-blocks');
      if (progressBlocks) {
        setTimeout(() => progressBlocks.classList.add('in-view'), 300);
      }
    });
  }

  /**
   * Helper function to create and append brand content elements.
   * @param {Element} container - The element to append content to.
   * @param {object} brandData - The data for the brand.
   */
  populateBrandContent(container, brandData) {
    // Create a DocumentFragment for batch DOM updates
    const fragment = document.createDocumentFragment();
    
    // Create and populate gallery
    this.#createGallery(fragment, brandData.galleryImages || []);
    
    // Create container for logo and description
    const contentContainer = this.#createBrandContentContainer(brandData);
    fragment.appendChild(contentContainer);
    
    // Append all content at once
    container.appendChild(fragment);
  }
  
  /**
   * Creates the gallery section for the modal
   * @param {DocumentFragment} fragment - The document fragment to append to
   * @param {Array} galleryImages - Array of gallery image data
   */
  #createGallery(fragment, galleryImages) {
    const galleryWrapper = document.createElement('gallery-media');
    
    galleryImages.forEach(image => {
      const imgWrapper = document.createElement('div');
      imgWrapper.classList.add('modal__brand-image-wrapper');
      
      const img = document.createElement('img');
      img.src = image.src || 'placeholder-image.jpg';
      img.alt = image.alt || 'Brand image';
      // Add loading="lazy" for better performance with multiple images
      img.loading = "lazy";
      
      imgWrapper.appendChild(img);
      galleryWrapper.appendChild(imgWrapper);
    });
    
    fragment.appendChild(galleryWrapper);
  }
  
  /**
   * Creates the brand content container with logo and description
   * @param {Object} brandData - The brand data object
   * @returns {HTMLElement} - The content container element
   */
  #createBrandContentContainer(brandData) {
    const container = document.createElement('div');
    container.classList.add('modal__container');
    
    // Create logo
    const logo = document.createElement('img');
    logo.src = brandData.logo || '';
    logo.alt = `${brandData.name || 'Brand'} logo`;
    logo.classList.add('modal__brand-logo');
    container.appendChild(logo);
    
    // Create description wrapper with Mustache template
    const wrapper = document.createElement('div');
    const descriptionHtml = brandData.modal?.description_html || '<p>No description available.</p>';
    
    // Generate progress blocks HTML if involvement data exists
    const progressHtml = brandData.involvement
      ? createProgressBlocks(brandData.involvement.progress, brandData.involvement.max).outerHTML
      : '';
    
    // Render template with Mustache
    const templateData = {
      brand: {
        involvement_progress: progressHtml,
        agency: brandData.agency || 'N/A',
      }
    };
    
    wrapper.innerHTML = Mustache.render(descriptionHtml, templateData);
    container.appendChild(wrapper);
    
    return container;
  }

  /**
   * Sets up navigation specific to brand modals (buttons and keyboard).
   * @param {Element} modal - The modal container element.
   * @override
   */
  setupNavigation(modal) {
    const brandCards = Array.from(document.querySelectorAll('[data-brand-id]'));
    const currentBrandId = this.getAttribute('data-brand-id');
    const currentIndex = brandCards.findIndex(card => 
      card.getAttribute('data-brand-id') === currentBrandId);

    if (currentIndex === -1) {
      console.error('Current brand card not found in the list.');
      return;
    }

    const nextIndex = (currentIndex + 1) % brandCards.length;
    const prevIndex = (currentIndex - 1 + brandCards.length) % brandCards.length;

    // Store navigation info as data attributes on modal for keyboard handler
    modal.dataset.currentBrandIndex = currentIndex;
    modal.dataset.totalBrands = brandCards.length;

    // Setup navigation buttons
    this.#setupNavigationButtons(modal, brandCards, nextIndex, prevIndex);
    
    // Setup global keyboard navigation
    this.#setupGlobalKeyboardNavigation();
    
    // Store current brand ID on the modal for the global handler to reference
    modal.dataset.currentBrandId = currentBrandId;
  }
  
  /**
   * Sets up the next/prev navigation buttons
   * @param {HTMLElement} modal - The modal element
   * @param {Array} brandCards - Array of brand cards
   * @param {number} nextIndex - Index of the next brand
   * @param {number} prevIndex - Index of the previous brand
   */
  #setupNavigationButtons(modal, brandCards, nextIndex, prevIndex) {
    const nextBtn = modal.querySelector('.modal__nav--next');
    const prevBtn = modal.querySelector('.modal__nav--prev');
    
    if (nextBtn) {
      nextBtn.onclick = () => this.#navigateToBrand(brandCards[nextIndex]);
    }
    
    if (prevBtn) {
      prevBtn.onclick = () => this.#navigateToBrand(brandCards[prevIndex]);
    }
  }
  
  /**
   * Navigates to a specific brand
   * @param {HTMLElement} brandCard - The brand card to navigate to
   */
  #navigateToBrand(brandCard) {
    const brandId = brandCard.getAttribute('data-brand-id');
    const brandModal = document.querySelector(`modal-content-brand[data-brand-id="${brandId}"]`);
    
    if (brandModal) {
      brandModal.showModal();
    }
  }
  
  /**
   * Sets up global keyboard navigation that works across all instances
   * This is the key fix for the navigation issue
   */
  #setupGlobalKeyboardNavigation() {
    // Only set up once for all instances
    if (ModalBrand.#globalKeyHandler) {
      return;
    }
    
    // Create and store the global handler
    ModalBrand.#globalKeyHandler = (e) => {
      const modal = document.getElementById('modal');
      
      // Skip if modal isn't active
      if (!modal || !modal.classList.contains('is-active')) {
        return;
      }
      
      // Handle keyboard navigation
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          const nextBtn = modal.querySelector('.modal__nav--next');
          if (nextBtn) nextBtn.click();
          break;
          
        case 'ArrowLeft':
          e.preventDefault();
          const prevBtn = modal.querySelector('.modal__nav--prev');
          if (prevBtn) prevBtn.click();
          break;
          
        case 'Escape':
          e.preventDefault();
          const currentBrandId = modal.dataset.currentBrandId;
          const currentModal = document.querySelector(`modal-content-brand[data-brand-id="${currentBrandId}"]`);
          if (currentModal) currentModal.closeModal();
          break;
      }
    };
    
    // Add the global handler to the window
    window.addEventListener('keydown', ModalBrand.#globalKeyHandler);
  }

  /**
   * Closes the modal and restores focus.
   * @override
   */
  closeModal() {
    super.closeModal();

    const modal = document.getElementById('modal');
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-active');

    // Restore focus
    if (this.#lastFocusedElement && typeof this.#lastFocusedElement.focus === 'function') {
      setTimeout(() => this.#lastFocusedElement.focus(), 0);
    }

    // Cleanup
    unlockBody();
    document.body.classList.remove('modal-open');
    this.cleanupEventListeners();
  }
  
  /**
   * Cleans up all event listeners
   * Note: We don't clean up the global key handler
   */
  cleanupEventListeners() {
    // Clean up focus trap handler
    if (this.#focusTrapHandler) {
      const modal = document.getElementById('modal');
      if (modal) {
        modal.removeEventListener('keydown', this.#focusTrapHandler);
      }
      this.#focusTrapHandler = null;
    }
  }

  /**
   * Sets up focus trap in the modal for accessibility
   * @param {HTMLElement} modal - The modal element
   */
  #setupFocusTrap(modal) {
    // Clean up existing handler if present
    if (this.#focusTrapHandler) {
      modal.removeEventListener('keydown', this.#focusTrapHandler);
    }
    
    this.#focusTrapHandler = this.handleFocusTrap;
    modal.addEventListener('keydown', this.#focusTrapHandler);
  }
  
  /**
   * Handles focus trap keyboard events
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleFocusTrap(e) {
    if (e.key !== 'Tab') return;
    
    const modal = e.currentTarget;
    const focusableElements = Array.from(modal.querySelectorAll(
      'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), ' +
      'input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), ' +
      'input[type="checkbox"]:not([disabled]), select:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])'
    )).filter(el => {
      // Ensure element is visible and not hidden
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
  
  /**
   * Clean up the global key handler when no more modals need it
   * This should be called when the app is shutting down or when
   * all modals are being destroyed
   */
  static cleanupGlobalHandlers() {
    if (ModalBrand.#globalKeyHandler) {
      window.removeEventListener('keydown', ModalBrand.#globalKeyHandler);
      ModalBrand.#globalKeyHandler = null;
    }
  }
}

// Define the custom element
customElements.define('modal-content-brand', ModalBrand);