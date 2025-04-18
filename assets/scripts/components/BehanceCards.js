import behanceProjects from '../../data/behanceProjects.js'; // Import Behance projects data

/**
 * @class BehanceCards
 * @classdesc A custom HTMLElement that displays Behance projects using a template and initializes a Swiper instance for scrolling.
 * @property {string | null} cardTemplate - Cached HTML template for a Behance card.
 */
class BehanceCards extends HTMLElement {
  /**
   * Initializes the component and caches for the template.
   */
  constructor() {
    super();
    this.cardTemplate = null; // Cache the template
  }

  /**
   * Called when the element is added to the DOM. Triggers rendering.
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Loads and caches the Behance card HTML template from a snippet file.
   * @returns {Promise<string>} The HTML string of the template or an error message template.
   */
  async loadTemplate() {
    // Return cached template if available
    if (this.cardTemplate) {
      return this.cardTemplate;
    }

    try {
      const response = await fetch('./snippets/behance-card.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      this.cardTemplate = html; // Cache the template
      return html;
    } catch (err) {
      console.error('Failed to load Behance card snippet:', err);
      // Return a fallback error structure
      return `<div class="article-card article-card-error"><p>Failed to load project content.</p></div>`;
    }
  }

  /**
   * Cleans and truncates the project description.
   * @param {string} description - The description from the project data.
   * @returns {string} A plain text, truncated description.
   */
  cleanDescription(description) {
    // Remove HTML tags and truncate to 150 characters, adding ellipsis
    const plainText = description?.replace(/<[^>]+>/g, '') || '';
    return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
  }

  /**
   * Fetches Behance projects, renders them using the template, and initializes Swiper.
   */
  async render() {
    // Get configuration from element attributes, with defaults
    const limit = parseInt(this.getAttribute('data-limit'), 10) || 5; // Use radix 10

    try {
      // Load the template
      const templateHTML = await this.loadTemplate();

      // Limit the number of projects to render
      const projects = behanceProjects.slice(0, limit);

      if (!projects || projects.length === 0) {
        console.warn('No Behance projects found.');
        this.innerHTML = '<p>No projects found.</p>'; // Display message in component
        return;
      }

      // Determine where to append projects (directly or inside a .swiper-wrapper)
      const swiperWrapper = this.querySelector('.swiper-wrapper');
      const appendTarget = swiperWrapper || this; // Default to 'this' if no wrapper

      // Clear target before appending new items (if needed)
      appendTarget.innerHTML = '';

      // Process and append each project
      projects.forEach((project) => {
        const cleanDesc = this.cleanDescription(project.description);
        const formattedDate = new Date(project.pubDate).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        // Replace placeholders in the template
        const projectHTML = templateHTML
          .replace(/{{\s*behance\.guid\s*}}/g, project.guid || '')
          .replace(/{{\s*behance\.thumbnail\s*}}/g, project.thumbnail || '')
          .replace(/{{\s*behance\.title\s*}}/g, project.title || 'Untitled')
          .replace(/{{\s*behance\.description\s*}}/g, cleanDesc || '')
          .replace(/{{\s*behance\.author\s*}}/g, project.author || 'Unknown Author')
          .replace(/{{\s*behance\.pubDate\s*}}/g, formattedDate || '')
          .replace(/{{\s*behance\.link\s*}}/g, project.link || '#');

        // Create element from HTML string safely
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = projectHTML.trim();
        const projectElement = tempDiv.firstElementChild;

        if (projectElement) {
          appendTarget.appendChild(projectElement);
        }
      });

      // Initialize Swiper on this custom element
      new Swiper(this, {
        slidesPerView: 1.15,
        spaceBetween: 24,
        loop: projects.length > 1, // Only loop if there's more than one project
        grabCursor: true,
        freeModeMomentum: false,
        autoplay: false, // Autoplay usually not desired for project carousels
        navigation: {
          nextEl: '#behance-btn-next', // Ensure these selectors are correct and unique if multiple instances exist
          prevEl: '#behance-btn-previous',
        },
        // Responsive breakpoints
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 32,
          },
          968: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 48,
          },
        },
      });
    } catch (error) {
      console.error('Error rendering Behance projects:', error);
      // Display an error message within the component
      this.innerHTML = `<p>Error loading projects. ${error.message || ''}</p>`;
    }
  }
}

// Define the custom element
customElements.define('behance-cards', BehanceCards);