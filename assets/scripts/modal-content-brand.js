import { lockBody, unlockBody } from './helpers/bodyLock.js';
import ModalContent from './helpers/modal-content.js';
import brands from '../data/brands.js';
import { createProgressBlocks } from './helpers/progressBlocks.js';

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

    const brandId = this.getAttribute('data-brand-id');
    const brandData = brands.find(b => b.id === brandId);

    if (!brandData) {
      innerContent.innerHTML = `<p>Brand not found.</p>`;
      return;
    }

    const img = document.createElement("img");
    img.src = brandData.lifestyleImage;
    img.alt = `${brandData.name} lifestyle image`;
    img.style.width = "100%";
    img.style.aspectRatio = "16/9";
    img.style.objectFit = "cover";
    img.style.marginBottom = "1.25rem";

    const logo = document.createElement("img");
    logo.src = brandData.logo;
    logo.alt = `${brandData.name} logo`;
    logo.classList.add("modal__brand-logo");

    const wrapper = document.createElement("div");
    let description = brandData.modal.description_html
      .replace(/{{\s*brand\.involvement_progress\s*}}/g, createProgressBlocks(brandData.involvement.progress, brandData.involvement.max).outerHTML)
      .replace(/{{\s*brand\.agency\s*}}/g, brandData.agency);
    wrapper.innerHTML = description;

    innerContent.appendChild(img);
    innerContent.appendChild(logo);
    innerContent.appendChild(wrapper);

    if (this.dataset.nav === "true") {
      this.setupNavigation(modal);
    }

    setTimeout(() => {
      lockBody();
      document.body.classList.add("modal-open");
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

    // Clean up previous key handler
    if (this.constructor._keyHandler) {
      window.removeEventListener("keydown", this.constructor._keyHandler);
    }

    const keyHandler = (e) => {
      if (e.key === "ArrowRight") {
        this.constructor.prototype.showModal.call(allModals[nextIndex]);
      }
      if (e.key === "ArrowLeft") {
        this.constructor.prototype.showModal.call(allModals[prevIndex]);
      }
      if (e.key === "Escape") {
        document.body.classList.remove("modal-open");
        modal.classList.remove("is-active");
        unlockBody();
        window.removeEventListener("keydown", keyHandler);
      }
    };

    window.addEventListener("keydown", keyHandler);
    this.constructor._keyHandler = keyHandler;
  }
}

customElements.define("modal-content-brand", ModalBrand);
