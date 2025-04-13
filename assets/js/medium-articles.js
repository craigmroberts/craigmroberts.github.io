class MediumArticles extends HTMLElement {
    constructor() {
      super();
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
  
      const template = this.querySelector('template[data-type="article-card"]');
  
      try {
        const articles = await this.fetchArticles(username, limit);
        articles.forEach(article => {
          const thumbnailSrc = this.extractThumbnail(article);
          const cleanDesc = this.cleanDescription(article.description);
  
          const articleHTML = template.innerHTML
            .replace('{{ article.guid }}', article.guid)
            .replace('{{ article.thumbnail }}', thumbnailSrc)
            .replace(/{{ article.title }}/g, article.title)
            .replace('{{ article.description }}', cleanDesc)
            .replace('{{ article.author }}', article.author)
            .replace('{{ article.pubDate }}', new Date(article.pubDate).toLocaleDateString())
            .replace('{{ article.categories }}', article.categories.join(', '))
            .replace('{{ article.link }}', article.link);
  
          const articleElement = document.createElement('div');
          articleElement.innerHTML = articleHTML;
  
          this.appendChild(articleElement.firstElementChild);

          window.animateText(document);
        });
      } catch (error) {
        console.error('Error fetching Medium articles:', error);
      }
    }
  }
  
  // Register the custom element
  customElements.define('medium-articles', MediumArticles);
  