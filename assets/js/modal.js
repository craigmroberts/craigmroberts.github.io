(function () {
    const modal = document.getElementById("modal");
    const closeBtn = modal.querySelector(".modal__close");
    const overlay = modal.querySelector(".modal__overlay");
  
    function openModal() {
      modal.classList.add("is-active");
    }
  
    function closeModal() {
      modal.classList.remove("is-active");
    }
  
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);
  
    // Expose globally
    window.showModal = openModal;
  
    // Listen for brand card clicks
    document.addEventListener("DOMContentLoaded", () => {
      const brandCards = document.querySelectorAll(".brands__item");
      brandCards.forEach(card => {
        card.addEventListener("click", () => {
          showModal();
        });
      });
    });
  })();
  