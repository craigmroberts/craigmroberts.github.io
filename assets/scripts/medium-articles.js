class MediumArticles extends HTMLElement {
  constructor() {
    super();
    this.articleTemplate = null; // Cache the template
  }

  connectedCallback() {
    this.render();
  }

  async fetchArticles(username, limit) {
    const feedURL = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/@${username}/feed`;
    const response = await fetch(feedURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.items.slice(0, limit);
  }

  async loadTemplate() {
    if (this.articleTemplate) return this.articleTemplate;

    try {
      const response = await fetch('./snippets/article-card.html');
      const html = await response.text();
      this.articleTemplate = html;
      return html;
    } catch (err) {
      console.error("Failed to load article card snippet:", err);
      return '<div class="article-card-error">Failed to load article</div>';
    }
  }

  extractThumbnail(article) {
    if (article.thumbnail) return article.thumbnail;
    const imgMatch = article.description.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : 'placeholder-image.jpg';
  }

  cleanDescription(description) {
    return description.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
  }

  async render() {
    const limit = parseInt(this.getAttribute('data-limit')) || 5;
    const username = this.getAttribute('data-username');

    try {
      const [articles, templateHTML] = await Promise.all([
        this.fetchArticles(username, limit),
        this.loadTemplate()
      ]);

      articles.forEach(article => {
        const thumbnailSrc = this.extractThumbnail(article);
        const cleanDesc = this.cleanDescription(article.description);

        const articleHTML = templateHTML
          .replace(/{{ article\.guid }}/g, article.guid)
          .replace(/{{ article\.thumbnail }}/g, thumbnailSrc)
          .replace(/{{ article\.title }}/g, article.title)
          .replace(/{{ article\.description }}/g, cleanDesc)
          .replace(/{{ article\.author }}/g, article.author)
          .replace(/{{ article\.pubDate }}/g, new Date(article.pubDate).toLocaleDateString())
          .replace(/{{ article\.categories }}/g, article.categories.join(', '))
          .replace(/{{ article\.link }}/g, article.link);

        const articleElement = document.createElement('div');
        articleElement.innerHTML = articleHTML;

        const swiperWrapper = this.querySelector('.swiper-wrapper');
        if (swiperWrapper) {
          swiperWrapper.appendChild(articleElement.firstElementChild);
        } else {
          this.appendChild(articleElement.firstElementChild);
        }
      });

      window.animateText(document);

      new Swiper(this, {
        slidesPerView: 1.15,
        spaceBetween: 24,
        loop: true,
        grabCursor: true,
        freeModeMomentum: false,
        autoplay: false,
        navigation: {
          nextEl: '#articles-btn-next',
          prevEl: '#articles-btn-previous',
        },
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
          }
        }
      });

    } catch (error) {
      console.error('Error fetching Medium articles:', error);
    }
  }
}

customElements.define('medium-articles', MediumArticles);
