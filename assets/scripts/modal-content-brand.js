import { lockBody, unlockBody } from './helpers/bodyLock.js';
import ModalContent from './helpers/modal-content.js'; // ensure ModalContent is exported in modal.js

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
}

customElements.define('modal-content-brand', ModalBrand);
