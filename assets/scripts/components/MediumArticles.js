import { medium } from '../helpers/medium.js';
import { debounce } from '../helpers/utils/debounce.js';

/**
 * @class MediumArticles
 * @classdesc A custom HTMLElement that fetches and displays Medium articles
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
   * Extracts a thumbnail URL from the article data.
   * Prefers the 'thumbnail' property, otherwise searches the description HTML.
   * @param {object} article - The Medium article data object.
   * @returns {string} The URL of the thumbnail or a placeholder.
   */
  extractThumbnail(article) {
    // Use provided thumbnail if it exists
    if (article.thumbnail && typeof article.thumbnail === 'string' && article.thumbnail.trim() !== '') {
      return article.thumbnail;
    }
    // Otherwise, try to find the first image URL in the description HTML
    const imgMatch = article.description?.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : 'placeholder-image.jpg'; // Provide a default placeholder path
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
   * Fetches articles, renders them using the template, and initializes Swiper.
   */
  async render() {
    // Get configuration from element attributes, with defaults
    const limit = parseInt(this.getAttribute('data-limit'), 10) || 5; // Use radix 10
    const username = this.getAttribute('data-username');

    if (!username) {
      console.error('MediumArticles: data-username attribute is required.', this);
      this.innerHTML = '<p>Error: Medium username not specified.</p>'; // Display error in component
      return;
    }

    try {
      // Fetch articles and load template concurrently
      const [articles, templateHTML] = await Promise.all([
        medium.fetchArticles(username, limit),
        this.loadTemplate(),
      ]);

      if (!articles || articles.length === 0) {
        console.warn(`No articles found for username: ${username}`);
        // Optionally display a message inside the component
        // this.innerHTML = '<p>No articles found.</p>';
        // return; // Exit if no articles
      }

      // Determine where to append articles (directly or inside a .swiper-wrapper)
      const swiperWrapper = this.querySelector('.swiper-wrapper');
      const appendTarget = swiperWrapper || this; // Default to 'this' if no wrapper

      // Clear target before appending new items (if needed)
      // appendTarget.innerHTML = '';

      // Process and append each article
      articles.forEach(article => {
        const thumbnailSrc = this.extractThumbnail(article);
        const cleanDesc = this.cleanDescription(article.description);
        const formattedDate = new Date(article.pubDate).toLocaleDateString('en-GB', { // Example: Use specific locale
          year: 'numeric', month: 'short', day: 'numeric',
        });

        // Replace placeholders in the template
        const articleHTML = templateHTML
          .replace(/{{\s*article\.guid\s*}}/g, article.guid || '') // Use || '' as fallback
          .replace(/{{\s*article\.thumbnail\s*}}/g, thumbnailSrc || '')
          .replace(/{{\s*article\.title\s*}}/g, article.title || 'Untitled')
          .replace(/{{\s*article\.description\s*}}/g, cleanDesc || '')
          .replace(/{{\s*article\.author\s*}}/g, article.author || 'Unknown Author')
          .replace(/{{\s*article\.pubDate\s*}}/g, formattedDate || '')
          .replace(/{{\s*article\.categories\s*}}/g, (article.categories || []).join(', '))
          .replace(/{{\s*article\.link\s*}}/g, article.link || '#');

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
      new Swiper(this, {
        slidesPerView: 1.15,
        spaceBetween: 24,
        loop: articles.length > 1, // Only loop if there's more than one article
        grabCursor: true,
        freeModeMomentum: false,
        autoplay: false, // Autoplay usually not desired for article carousels
        navigation: {
          nextEl: '#articles-btn-next', // Ensure these selectors are correct and unique if multiple instances exist
          prevEl: '#articles-btn-previous',
        },
        // Responsive breakpoints
        breakpoints: {
          // when window width is >= 768px
          768: {
            slidesPerView: 2,
            spaceBetween: 32,
          },
          // when window width is >= 968px
          968: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          // when window width is >= 1200px
          1200: {
            slidesPerView: 4,
            spaceBetween: 48,
          },
        },
      });

    } catch (error) {
      console.error('Error fetching or rendering Medium articles:', error);
      // Display an error message within the component
      this.innerHTML = `<p>Error loading articles. ${error.message || ''}</p>`;
    }
  }
}

// Define the custom element
customElements.define('medium-articles', MediumArticles);