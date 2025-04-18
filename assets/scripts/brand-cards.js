import brands from '../data/brands.js';

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

    brands.forEach((brand) => {
      // Replace template placeholders with brand data
      const cardHTML = templateHTML
        .replace(/{{\s*brand\.key\s*}}/g, brand.id)
        .replace(/{{\s*brand\.logo\s*}}/g, brand.logo)
        .replace(/{{\s*brand\.lifestyleImage\s*}}/g, brand.lifestyleImage)
        .replace(/{{\s*brand\.name\s*}}/g, brand.name);

      // Create a wrapper to parse HTML string into DOM elements
      const wrapper = document.createElement('div');
      wrapper.innerHTML = cardHTML;

      const cardEl = wrapper.firstElementChild;

      // Apply special class if the brand has a large block flag
      if (brand.largeBlock) {
        cardEl.classList.add('large-block');
      }

      container.appendChild(cardEl);
    });
  }
}

customElements.define('brand-cards', BrandCards);
