import { lockBody, unlockBody } from '../helpers/dom/bodyLock.js';
import ModalContent from './ModalContent.js'; // Base class
import brands from '../../data/brands.js';
import { createProgressBlocks } from '../helpers/progressBlocks.js';

/**
 * @class ModalBrand
 * @classdesc Extends ModalContent to display brand-specific details.
 * @extends ModalContent
 */
class ModalBrand extends ModalContent {
  // Instance property to store the keyboard handler for cleanup
  _keyHandler = null;

  /**
   * Ensures the brand-specific modal template is loaded.
   * @override
   */
  async ensureModalLoaded() {
    if (document.getElementById('modal')) {
      return; // Already loaded
    }

    try {
      const response = await fetch('./snippets/modal-brand.html');
      if (!response.ok) { // Check if fetch was successful
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html.trim();
      const modal = wrapper.querySelector('#modal');

      if (!modal) {
        throw new Error('Modal structure (#modal) not found in snippet: ./snippets/modal-brand.html');
      }

      document.body.appendChild(modal);
      // Inherited methods from ModalContent:
      this.attachCloseHandlers(modal); // Assumes base class provides this
      this.setupDragFunctionality(modal); // Assumes base class provides this

    } catch (err) {
      console.error('Failed to load modal-brand snippet:', err);
      // Consider displaying a user-facing error
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

    // Show the modal container and trigger animations/locks
    requestAnimationFrame(() => {
      lockBody(); // Assumes this handles locking correctly
      document.body.classList.add('modal-open');
      modal.classList.add('is-active');

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
    // Create Lifestyle Image
    const img = document.createElement('img');
    img.src = brandData.lifestyleImage || 'placeholder-image.jpg'; // Fallback src
    img.alt = `${brandData.name || 'Brand'} lifestyle image`;
    // Consider using CSS classes for styling instead of inline styles
    img.style.width = '100%';
    img.style.aspectRatio = '16/9';
    img.style.objectFit = 'cover';
    img.style.marginBottom = '1.25rem';
    container.appendChild(img);

    // Create Logo
    const logo = document.createElement('img');
    logo.src = brandData.logo || '';
    logo.alt = `${brandData.name || 'Brand'} logo`;
    logo.classList.add('modal__brand-logo');
    container.appendChild(logo);

    // Create Description Wrapper and Inject Dynamic Content
    const wrapper = document.createElement('div');
    const descriptionHtml = brandData.modal?.description_html || '<p>No description available.</p>';
    const progressHtml = brandData.involvement
      ? createProgressBlocks(brandData.involvement.progress, brandData.involvement.max).outerHTML
      : ''; // Default if no involvement data

    // Replace placeholders
    let description = descriptionHtml
      .replace(/{{\s*brand\.involvement_progress\s*}}/g, progressHtml)
      .replace(/{{\s*brand\.agency\s*}}/g, brandData.agency || 'N/A');
    wrapper.innerHTML = description;
    container.appendChild(wrapper);
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
   * Closes the modal and cleans up instance-specific listeners.
   * @override
   */
  closeModal() {
    // Call the parent class's close logic first (handles classes, body lock)
    super.closeModal(); // Assumes ModalContent has a closeModal method

    // Clean up the keyboard listener associated with this specific instance
    if (this._keyHandler) {
      window.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null; // Clear the reference
      // console.log('Cleaned up key handler on close for instance:', this.getAttribute('data-brand-id'));
    }
  }
}

// Define the custom element
customElements.define('modal-content-brand', ModalBrand);