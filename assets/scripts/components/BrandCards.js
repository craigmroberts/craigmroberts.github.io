import brands from '../../data/brands.js';

class BrandCards extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  /**
   * Loads and caches the brand card HTML template from a snippet file.
   * @returns {Promise<string>} The HTML string of the template.
   */
  async loadTemplate() {
    if (this._template) return this._template;

    try {
      const response = await fetch('./snippets/brand-card.html');
      const html = await response.text();
      this._template = html;
      return html;
    } catch (err) {
      console.error('Failed to load brand card snippet:', err);
      return '';
    }
  }

  /**
   * Renders brand cards inside the custom element using a template and brand data.
   */
  async render() {
    const container = this;
    const templateHTML = await this.loadTemplate();

    if (!templateHTML) return;

    // Use DocumentFragment to batch DOM operations and prevent forced reflows
    const fragment = document.createDocumentFragment();

    brands.forEach((brand) => {
      // Generate WebP version of lifestyle image with responsive sizes
      const lifestyleImageWebP = brand.lifestyleImage.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      const lifestyleImageWebP400 = brand.lifestyleImage.replace(/\.(jpg|jpeg|png|webp)$/i, '-400w.webp');
      const lifestyleImageWebP800 = brand.lifestyleImage.replace(/\.(jpg|jpeg|png|webp)$/i, '-800w.webp');
      
      // Build srcset - always include 400w and full size
      // Only include 800w for larger images (these are the ones that have 800w versions)
      const largerImages = ['and-sons', 'bad-monday', 'kjaer-weis', 'medik8', 'pangaia', 'protectapet', 'pucci', 'rhino-greenhouses', 'st-john'];
      const hasLargeSize = largerImages.some(name => brand.lifestyleImage.includes(name));
      
      const srcsetParts = [
        `${lifestyleImageWebP400} 400w`
      ];
      
      if (hasLargeSize) {
        srcsetParts.push(`${lifestyleImageWebP800} 800w`);
      }
      
      srcsetParts.push(`${lifestyleImageWebP} 1200w`);
      const lifestyleImageSrcset = srcsetParts.join(', ');
      
      // Replace template placeholders with brand data
      const cardHTML = templateHTML
        .replace(/{{\s*brand\.key\s*}}/g, brand.id)
        .replace(/{{\s*brand\.logo\s*}}/g, brand.logo || '')
        .replace(/{{\s*brand\.logoWidth\s*}}/g, brand.logoWidth || '120')
        .replace(/{{\s*brand\.logoHeight\s*}}/g, brand.logoHeight || '40')
        .replace(/{{\s*brand\.lifestyleImageSrcset\s*}}/g, lifestyleImageSrcset)
        .replace(/{{\s*brand\.lifestyleImage\s*}}/g, brand.lifestyleImage)
        .replace(/{{\s*brand\.name\s*}}/g, brand.name);

      // Create a wrapper to parse HTML string into DOM elements
      const wrapper = document.createElement('div');
      wrapper.innerHTML = cardHTML;

      const cardEl = wrapper.firstElementChild;

      // Hide logo container if brand has no logo
      if (!brand.logo || brand.logo === false) {
        const logoContainer = cardEl.querySelector('.brands__brand-logo');
        if (logoContainer) {
          // Use class instead of inline style to avoid forced reflow
          logoContainer.classList.add('visually-hidden');
        }
      }

      // Apply special class if the brand has a large block flag
      if (brand.largeBlock) {
        cardEl.classList.add('large-block');
      }

      // Add to fragment instead of directly to DOM
      fragment.appendChild(cardEl);
    });

    // Single DOM append - prevents multiple reflows
    container.appendChild(fragment);
  }
}

customElements.define('brand-cards', BrandCards);
