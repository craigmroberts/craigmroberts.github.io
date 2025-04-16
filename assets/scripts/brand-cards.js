import brands from '../data/brands.js';

class BrandCards extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

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

  async render() {
    const container = this;
    const templateHTML = await this.loadTemplate();
    if (!templateHTML) return;
  
    brands.forEach((brand) => {
      const cardHTML = templateHTML
        .replace(/{{\s*brand\.key\s*}}/g, brand.id)
        .replace(/{{\s*brand\.logo\s*}}/g, brand.logo)
        .replace(/{{\s*brand\.lifestyleImage\s*}}/g, brand.lifestyleImage)
        .replace(/{{\s*brand\.name\s*}}/g, brand.name)
  
      const wrapper = document.createElement('div');
      wrapper.innerHTML = cardHTML;
  
      const cardEl = wrapper.firstElementChild;
  
      if (brand.largeBlock) {
        cardEl.classList.add('large-block');
      }
  
      container.appendChild(cardEl);
    });
  }  
}

customElements.define('brand-cards', BrandCards);
