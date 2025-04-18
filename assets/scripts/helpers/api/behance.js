export const behance = {
    async fetchArticles(username, limit = 5) {
      // Construct the API URL using the provided username
      const feedURL = `https://www.behance.net/feeds/user?username=${username}`;
  
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
