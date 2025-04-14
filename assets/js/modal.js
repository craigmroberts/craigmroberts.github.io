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

    if (this.dataset.nav === "true") {
      this.addNavigation(modal);
    }

    setTimeout(() => {
      modal.classList.add("is-active");
    }, 50);
  }

  addNavigation(modal) {
    // Clean up existing nav if present
    modal.querySelectorAll(".modal__nav").forEach(btn => btn.remove());

    const allModals = Array.from(document.querySelectorAll("modal-content[data-nav='true']"));
    const currentIndex = allModals.indexOf(this);
    const nextIndex = (currentIndex + 1) % allModals.length;
    const prevIndex = (currentIndex - 1 + allModals.length) % allModals.length;

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "›";
    nextBtn.className = "button modal__nav modal__nav--next";
    nextBtn.addEventListener("click", () => allModals[nextIndex].showModal());

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "‹";
    prevBtn.className = "button modal__nav modal__nav--prev";
    prevBtn.addEventListener("click", () => allModals[prevIndex].showModal());

    const innerContent = modal.querySelector(".modal__inner-content");

    innerContent.appendChild(prevBtn);
    innerContent.appendChild(nextBtn);
  }

  closeModal() {
    const modal = document.getElementById("modal");
    modal.classList.remove("is-active");
  }
}

customElements.define("modal-content", ModalContent);
