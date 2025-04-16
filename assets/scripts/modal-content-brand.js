import { lockBody, unlockBody } from './helpers/bodyLock.js';
import ModalContent from './helpers/modal-content.js';
import brands from '../data/brands.js';

class ModalBrand extends ModalContent {
  async ensureModalLoaded() {
    if (document.getElementById("modal")) return;

    try {
      const response = await fetch('./snippets/modal-brand.html');
      const html = await response.text();
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      const modal = wrapper.querySelector("#modal");
      if (!modal) throw new Error("Modal not found in modal-brand.html");
      document.body.appendChild(modal);
      this.attachCloseHandlers(modal);
    } catch (err) {
      console.error("Failed to load modal-brand snippet:", err);
    }
  }

  async showModal() {
    const modal = document.getElementById("modal");
    const innerContent = modal.querySelector(".modal__inner-content");
    innerContent.innerHTML = "";

    const brandName = this.getAttribute('brand');
    const brandData = brands.find(b => b.name === brandName);

    if (!brandData) {
      innerContent.innerHTML = `<p>Brand not found.</p>`;
      return;
    }

    // --- Image ---
    const img = document.createElement("img");
    img.src = brandData.lifestyleImage;
    img.alt = `${brandData.name} lifestyle image`;
    img.style.width = "100%";
    img.style.aspectRatio = "16/9";
    img.style.objectFit = "cover";
    img.style.marginBottom = "1.25rem";

    // --- Logo ---
    const logo = document.createElement("img");
    logo.src = brandData.logo;
    logo.alt = `${brandData.name} logo`;
    logo.style.maxHeight = "40px";
    logo.style.marginBottom = "1rem";

    // --- HTML description block ---
    const wrapper = document.createElement("div");
    wrapper.innerHTML = brandData.modal.description_html;

    // --- Append all ---
    innerContent.appendChild(logo);
    innerContent.appendChild(img);
    innerContent.appendChild(wrapper);

    if (this.dataset.nav === "true") {
      this.setupNavigation(modal);
    }

    setTimeout(() => {
      lockBody();
      modal.classList.add("is-active");
    }, 50);
  }

  setupNavigation(modal) {
    const allModals = Array.from(document.querySelectorAll("modal-content-brand[data-nav='true']"));
    const currentIndex = allModals.indexOf(this);
    const nextIndex = (currentIndex + 1) % allModals.length;
    const prevIndex = (currentIndex - 1 + allModals.length) % allModals.length;
  
    const nextBtn = modal.querySelector(".modal__nav--next");
    const prevBtn = modal.querySelector(".modal__nav--prev");
  
    if (nextBtn) {
      nextBtn.onclick = () => {
        this.constructor.prototype.showModal.call(allModals[nextIndex]);
      };
    }
  
    if (prevBtn) {
      prevBtn.onclick = () => {
        this.constructor.prototype.showModal.call(allModals[prevIndex]);
      };
    }
  }  
}

customElements.define("modal-content-brand", ModalBrand);
