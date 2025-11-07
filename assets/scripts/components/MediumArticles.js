import mediumArticles from '../../data/mediumArticles.js';
import { debounce } from '../helpers/utils/debounce.js';

/**
 * @class MediumArticles
 * @classdesc A custom HTMLElement that displays Medium articles
 * using a template and initializes a Swiper instance for scrolling.
 * @property {string | null} articleTemplate - Cached HTML template for an article card.
 */
class MediumArticles extends HTMLElement {
  /**
   * Initializes the component and caches for the template.
   */
  constructor() {
    super();
    this.articleTemplate = null; // Cache the template

    // Debounce the render method to avoid excessive calls
    this.debouncedRender = debounce(this.render.bind(this), 300);
  }

  /**
   * Called when the element is added to the DOM. Triggers rendering.
   */
  connectedCallback() {
    this.debouncedRender();
  }

  /**
   * Loads and caches the article card HTML template from a snippet file.
   * @returns {Promise<string>} The HTML string of the template or an error message template.
   */
  async loadTemplate() {
    // Return cached template if available
    if (this.articleTemplate) {
      return this.articleTemplate;
    }

    try {
      const response = await fetch('./snippets/article-card.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      this.articleTemplate = html; // Cache the template
      return html;
    } catch (err) {
      console.error('Failed to load article card snippet:', err);
      // Return a fallback error structure
      return `<div class="article-card article-card-error"><p>Failed to load article content.</p></div>`;
    }
  }

  /**
   * Cleans and truncates the article description HTML.
   * @param {string} description - The HTML string description from the article.
   * @returns {string} A plain text, truncated description.
   */
  cleanDescription(description) {
    // Remove HTML tags and truncate to 150 characters, adding ellipsis
    const plainText = description?.replace(/<[^>]+>/g, '') || '';
    return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
  }

  /**
   * Renders articles using the template and initializes Swiper.
   */
  async render() {
    // Get configuration from element attributes, with defaults
    const limit = parseInt(this.getAttribute('data-limit'), 10) || mediumArticles.length;

    try {
      // Load the template
      const templateHTML = await this.loadTemplate();

      // Limit the number of articles to render
      const articles = mediumArticles.slice(0, limit);

      if (!articles || articles.length === 0) {
        console.warn('No Medium articles found.');
        this.innerHTML = '<p>No articles found.</p>'; // Display message in component
        return;
      }

      // Determine where to append articles (directly or inside a .swiper-wrapper)
      const swiperWrapper = this.querySelector('.swiper-wrapper');
      const appendTarget = swiperWrapper || this; // Default to 'this' if no wrapper

      // Clear target before appending new items (if needed)
      appendTarget.innerHTML = '';

      // Process and append each article
      articles.forEach((article) => {
        const cleanDesc = this.cleanDescription(article.description);
        const formattedDate = new Date(article.pubDate).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        // Replace placeholders in the template
        const articleHTML = templateHTML
          .replace(/{{\s*article\.guid\s*}}/g, article.guid || '')
          .replace(/{{\s*article\.imageSrc\s*}}/g, article.imageSrc || '')
          .replace(/{{\s*article\.title\s*}}/g, article.title || 'Untitled')
          .replace(/{{\s*article\.description\s*}}/g, cleanDesc || '')
          .replace(/{{\s*article\.author\s*}}/g, article.author || 'Unknown Author')
          .replace(/{{\s*article\.pubDate\s*}}/g, formattedDate || '')
          .replace(/{{\s*article\.categories\s*}}/g, (article.categories || []).join(', '))
          .replace(/{{\s*article\.href\s*}}/g, article.href || '#');

        // Create element from HTML string safely
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = articleHTML.trim();
        const articleElement = tempDiv.firstElementChild;

        if (articleElement) {
          appendTarget.appendChild(articleElement);
        }
      });

      // Trigger potential text animations if the function exists
      window.animateText?.(this); // Run animation within the scope of this element

      // Initialize Swiper on this custom element
      // Use requestIdleCallback to defer non-critical initialization
      const initSwiper = () => {
        // Batch DOM operations with requestAnimationFrame
        requestAnimationFrame(() => {
          new Swiper(this, {
            slidesPerView: 1.15,
            spaceBetween: 24,
            loop: articles.length > 1,
            grabCursor: true,
            freeModeMomentum: false,
            autoplay: false,
            lazy: {
              loadPrevNext: true,
              loadPrevNextAmount: 2,
            },
            navigation: {
              nextEl: '#articles-btn-next',
              prevEl: '#articles-btn-previous',
            },
            // Optimize performance - reduce forced reflows
            watchSlidesProgress: false,
            watchSlidesVisibility: false,
            observer: false,
            observeParents: false,
            observeSlideChildren: false,
            // Use CSS scroll snap as fallback
            cssMode: false,
            // Responsive breakpoints
            breakpoints: {
              768: {
                slidesPerView: 2,
                spaceBetween: 32,
              },
              968: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            },
          });
        });
      };

      // Use requestIdleCallback if available, otherwise fallback to setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(initSwiper, { timeout: 2000 });
      } else {
        setTimeout(initSwiper, 100);
      }
    } catch (error) {
      console.error('Error rendering Medium articles:', error);
      // Display an error message within the component
      this.innerHTML = `<p>Error loading articles. ${error.message || ''}</p>`;
    }
  }
}

// Define the custom element
customElements.define('medium-articles', MediumArticles);