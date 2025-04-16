export const medium = {
  async fetchArticles(username, limit = 5) {
    const feedURL = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/@${username}/feed`;
    const response = await fetch(feedURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.items.slice(0, limit);
  }
};
