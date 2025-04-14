class ModalContent extends HTMLElement {
    constructor() {
      super();
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
  
    showModal() {
      const modal = document.getElementById("modal");
      const innerContent = modal.querySelector(".modal__inner-content");
      innerContent.innerHTML = "";
      const clone = this.cloneNode(true);
      innerContent.append(...clone.childNodes);
      modal.classList.add("is-active");
    }
  
    closeModal() {
      const modal = document.getElementById("modal");
      modal.classList.remove("is-active");
    }
  }
  
  customElements.define("modal-content", ModalContent);