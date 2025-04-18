import { lockBody, unlockBody } from '../helpers/dom/bodyLock.js';
import ModalContent from './ModalContent.js'; // Base class
import brands from '../../data/brands.js';
import { createProgressBlocks } from '../helpers/progressBlocks.js';
import Mustache from 'mustache'; // Import Mustache.js

/**
 * @class ModalBrand
 * @classdesc Extends ModalContent to display brand-specific details.
 * @extends ModalContent
 */
class ModalBrand extends ModalContent {
  // Instance property to store the keyboard handler for cleanup
  _keyHandler = null;

  // Cache for the modal HTML snippet
  static modalHtmlCache = null;

  // Instance property to store the last focused element
  _lastFocusedElement = null;

  /**
   * Ensures the brand-specific modal template is loaded.
   * @override
   */
  async ensureModalLoaded() {
    // Check if the modal is already in the DOM
    if (document.getElementById('modal')) {
      return; // Modal is already loaded
    }

    // Check if the modal HTML is cached
    if (ModalBrand.modalHtmlCache) {
      // Clone the cached modal and append it to the DOM
      const cachedModal = ModalBrand.modalHtmlCache.cloneNode(true);
      document.body.appendChild(cachedModal);
      return;
    }

    // Fetch the modal HTML snippet and cache it
    try {
      const response = await fetch('./snippets/modal-brand.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html.trim();
      const modal = wrapper.querySelector('#modal');

      if (!modal) {
        throw new Error('Modal structure (#modal) not found in snippet: ./snippets/modal-brand.html');
      }

      // Cache the modal HTML for future use
      ModalBrand.modalHtmlCache = modal;

      // Append the modal to the DOM
      document.body.appendChild(modal);

      // Add ARIA roles and attributes
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('tabindex', '-1'); // Make modal focusable

      // Inherited methods from ModalContent:
      this.attachCloseHandlers(modal); // Assumes base class provides this
      this.setupDragFunctionality(modal); // Assumes base class provides this
    } catch (err) {
      console.error('Failed to load modal-brand snippet:', err);
      // Optionally display a user-facing error message
    }
  }

  /**
   * Populates and shows the modal with specific brand data.
   * @override
   */
  async showModal() {
    // Ensure modal structure is loaded before proceeding
    await this.ensureModalLoaded(); // Wait for loading if needed

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
      console.error('ModalBrand: data-brand-id attribute is missing.', this);
      innerContent.innerHTML = '<p>Error: Brand ID not specified.</p>';
      return; // Stop if no ID
    }

    // Find the corresponding brand data
    const brandData = brands.find(b => b.id === brandId);

    if (!brandData) {
      console.error(`Brand data not found for ID: ${brandId}`);
      innerContent.innerHTML = `<p>Brand information not available.</p>`;
      // Optionally still show the modal frame by not returning here
    } else {
      // --- Populate Modal Content ---
      this.populateBrandContent(innerContent, brandData);

      // Setup navigation if enabled for this instance
      if (this.dataset.nav === 'true') {
        this.setupNavigation(modal); // Call the overridden setupNavigation
      }
    }

    // Save the last focused element
    this._lastFocusedElement = document.activeElement;

    // Show the modal container and trigger animations/locks
    requestAnimationFrame(() => {
      lockBody(); // Assumes this handles locking correctly
      document.body.classList.add('modal-open');
      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      modal.focus(); // Set focus to the modal

      // Trap focus within the modal
      this.trapFocus(modal);

      // Animate progress blocks after modal is visible
      const progressBlocks = modal.querySelector('.progress-blocks');
      if (progressBlocks) {
        // Use a shorter delay for better responsiveness
        setTimeout(() => {
          progressBlocks.classList.add('in-view');
        }, 300); // Reduced delay
      }
    });
  }

  /**
   * Helper function to create and append brand content elements.
   * @param {Element} container - The element to append content to.
   * @param {object} brandData - The data for the brand.
   */
  populateBrandContent(container, brandData) {
    // Create a DocumentFragment to batch DOM updates
    const fragment = document.createDocumentFragment();

    const galleryImages = brandData.galleryImages || [];
    const galleryWrapper = document.createElement('gallery-media');

    // forEach image in the gallery
    galleryImages.forEach((image) => {
      const img = document.createElement('img');
      console.log('Image:', image);
      img.src = image.src || 'placeholder-image.jpg'; // Fallback src
      img.alt = image.alt || 'Brand image';

      const imgWrapper = document.createElement('div');
      imgWrapper.classList.add('modal__brand-image-wrapper');
      imgWrapper.appendChild(img);
      fragment.appendChild(imgWrapper);

    });
    // Append the gallery wrapper to the fragment
    galleryWrapper.appendChild(fragment);
    container.appendChild(galleryWrapper);

    // Create Container for Logo and Description
    const container2 = document.createElement('div');
    container2.classList.add('modal__container');

    // Create Logo
    const logo = document.createElement('img');
    logo.src = brandData.logo || '';
    logo.alt = `${brandData.name || 'Brand'} logo`;
    logo.classList.add('modal__brand-logo');
    container2.appendChild(logo);

    // Create Description Wrapper and Inject Dynamic Content
    const wrapper = document.createElement('div');
    const descriptionHtml = brandData.modal?.description_html || '<p>No description available.</p>';
    const progressHtml = brandData.involvement
      ? createProgressBlocks(brandData.involvement.progress, brandData.involvement.max).outerHTML
      : ''; // Default if no involvement data

    // Define the data for the template
    const templateData = {
      brand: {
        involvement_progress: progressHtml,
        agency: brandData.agency || 'N/A',
      },
    };

    // Render the template using Mustache.js
    const renderedHtml = Mustache.render(descriptionHtml, templateData);
    wrapper.innerHTML = renderedHtml;
    container2.appendChild(wrapper);

    // Append the container to the fragment
    fragment.appendChild(container2);

    // Append the fragment to the container
    container.appendChild(fragment);
  }


  /**
   * Sets up navigation specific to brand modals (buttons and keyboard).
   * @param {Element} modal - The modal container element.
   * @override
   */
  setupNavigation(modal) {
    const allModals = Array.from(document.querySelectorAll("modal-content-brand[data-nav='true']"));
    const currentIndex = allModals.indexOf(this);
    if (currentIndex === -1) return; // Element not found in navigable list

    const nextIndex = (currentIndex + 1) % allModals.length;
    const prevIndex = (currentIndex - 1 + allModals.length) % allModals.length;

    const nextBtn = modal.querySelector('.modal__nav--next');
    const prevBtn = modal.querySelector('.modal__nav--prev');

    // --- Navigation Button Handlers ---
    if (nextBtn) {
      nextBtn.onclick = null; // Clear previous handler
      // Call showModal directly on the target instance
      nextBtn.onclick = () => allModals[nextIndex].showModal();
    }

    if (prevBtn) {
      prevBtn.onclick = null; // Clear previous handler
      prevBtn.onclick = () => allModals[prevIndex].showModal();
    }

    // --- Keyboard Navigation Handler (Instance-specific) ---
    // Clean up any existing handler attached TO THIS INSTANCE
    if (this._keyHandler) {
      window.removeEventListener('keydown', this._keyHandler);
    }

    // Define the new key handler specific to this instance when it's active
    this._keyHandler = (e) => {
      // Only act if the main modal element is currently active
      if (!modal.classList.contains('is-active')) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault(); // Prevent page scroll
        allModals[nextIndex].showModal();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); // Prevent page scroll
        allModals[prevIndex].showModal();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.closeModal(); // Trigger the instance's close method for proper cleanup
      }
    };

    // Add the new listener
    window.addEventListener('keydown', this._keyHandler);
  }

  /**
   * Closes the modal and restores focus.
   * @override
   */
  closeModal() {
    // Call the parent class's close logic first (handles classes, body lock)
    super.closeModal(); // Assumes ModalContent has a closeModal method

    const modal = document.getElementById('modal');
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-active');

    // Restore focus to the last focused element
    if (this._lastFocusedElement) {
      this._lastFocusedElement.focus();
    }

    // Unlock the body
    unlockBody();
    document.body.classList.remove('modal-open');

    // Clean up the keyboard listener associated with this specific instance
    if (this._keyHandler) {
      window.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null; // Clear the reference
      // console.log('Cleaned up key handler on close for instance:', this.getAttribute('data-brand-id'));
    }
  }

  /**
   * Traps focus within the modal.
   * @param {Element} modal - The modal element.
   */
  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleFocus = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleFocus);

    // Remove the event listener when the modal is closed
    modal.addEventListener('transitionend', () => {
      modal.removeEventListener('keydown', handleFocus);
    }, { once: true });
  }
}

// Define the custom element
customElements.define('modal-content-brand', ModalBrand);