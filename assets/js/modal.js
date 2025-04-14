(function () {
    const modal = document.getElementById("modal");
    const closeBtn = modal.querySelector(".modal__close");
    const overlay = modal.querySelector(".modal__overlay");
    const innerContent = modal.querySelector(".modal__inner-content");
  
    function openModal() {
      modal.classList.add("is-active");
    }
  
    function closeModal() {
      modal.classList.remove("is-active");
    }
  
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);
  
    // Expose open function globally
    window.showModal = openModal;
  
    document.addEventListener("DOMContentLoaded", () => {
      const brandCards = document.querySelectorAll(".brands__item");
  
      brandCards.forEach(card => {
        card.addEventListener("click", () => {
          // Clone and replace modal content
          const template = card.querySelector(".js-modal-content");
          if (!template) return; // Skip if no template found
          const clone = template.content.cloneNode(true);
          innerContent.innerHTML = ""; // Clear previous content
          innerContent.appendChild(clone);
  
          openModal();
        });
      });
    });
  })();
  