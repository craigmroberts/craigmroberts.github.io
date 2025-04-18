export const medium = {
  /**
   * Fetches recent Medium articles for a given username via an RSS-to-JSON service.
   * @param {string} username - The Medium username (e.g., 'your-username').
   * @param {number} [limit=5] - The maximum number of articles to return.
   * @returns {Promise<Array<object>>} A promise that resolves to an array of article items.
   * @throws {Error} Throws an error if the fetch request fails.
   */
  async fetchArticles(username, limit = 5) {
    // Construct the API URL using the provided username
    const feedURL = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/@${username}/feed`;

    // Fetch the data from the API
    const response = await fetch(feedURL);

    // Check if the fetch request was successful
    if (!response.ok) {
      // Throw an error with the HTTP status if the request failed
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the specified number of items (articles)
    // Ensure data.items exists before slicing
    return (data.items || []).slice(0, limit);
  },
};