/**
 * Creates an optimized picture element with WebP support and responsive images
 * @param {Object} options - Image configuration
 * @param {string} options.src - Base image path (without extension)
 * @param {string} options.alt - Alt text for accessibility
 * @param {string} options.fallbackExt - Fallback extension (jpg, png)
 * @param {number[]} [options.sizes] - Array of widths for responsive images
 * @param {string} [options.className] - CSS class name
 * @param {boolean} [options.lazy] - Enable lazy loading (default: true)
 * @param {string} [options.fetchPriority] - Fetch priority (high, low, auto)
 * @returns {HTMLPictureElement}
 */
export function createPicture({
  src,
  alt,
  fallbackExt = 'jpg',
  sizes = null,
  className = '',
  lazy = true,
  fetchPriority = 'auto',
}) {
  const picture = document.createElement('picture');

  // Add WebP source with responsive images
  if (sizes && sizes.length > 0) {
    const webpSource = document.createElement('source');
    webpSource.type = 'image/webp';
    
    const srcset = sizes
      .map((width) => `/dist/images/${src}-${width}w.webp ${width}w`)
      .concat(`/dist/images/${src}.webp`)
      .join(', ');
    
    webpSource.srcset = srcset;
    webpSource.sizes = '(max-width: 768px) 100vw, 50vw'; // Adjust as needed
    picture.appendChild(webpSource);

    // Fallback source with responsive images
    const fallbackSource = document.createElement('source');
    fallbackSource.type = `image/${fallbackExt}`;
    
    const fallbackSrcset = sizes
      .map((width) => `/dist/images/${src}-${width}w.${fallbackExt} ${width}w`)
      .concat(`/dist/images/${src}.${fallbackExt}`)
      .join(', ');
    
    fallbackSource.srcset = fallbackSrcset;
    fallbackSource.sizes = '(max-width: 768px) 100vw, 50vw';
    picture.appendChild(fallbackSource);
  } else {
    // Simple WebP source without responsive images
    const webpSource = document.createElement('source');
    webpSource.type = 'image/webp';
    webpSource.srcset = `/dist/images/${src}.webp`;
    picture.appendChild(webpSource);
  }

  // Fallback img element
  const img = document.createElement('img');
  img.src = `/dist/images/${src}.${fallbackExt}`;
  img.alt = alt;
  
  if (className) {
    img.className = className;
  }
  
  if (lazy) {
    img.loading = 'lazy';
  }
  
  if (fetchPriority !== 'auto') {
    img.fetchPriority = fetchPriority;
  }

  picture.appendChild(img);

  return picture;
}

/**
 * Converts image src to WebP path
 * @param {string} src - Original image path
 * @returns {string} WebP image path
 */
export function toWebP(src) {
  if (!src) return src;
  return src.replace(/\.(jpe?g|png)$/i, '.webp').replace('/assets/images/', '/dist/images/');
}

/**
 * Updates all images in a container to use optimized versions
 * @param {HTMLElement} container - Container element
 */
export function upgradeImages(container) {
  const images = container.querySelectorAll('img[src*="/assets/images/"]');
  
  images.forEach((img) => {
    const originalSrc = img.getAttribute('src');
    const alt = img.getAttribute('alt') || '';
    const className = img.className;
    const lazy = img.loading === 'lazy';
    const fetchPriority = img.getAttribute('fetchpriority') || 'auto';
    
    // Parse the src to get base path and extension
    const match = originalSrc.match(/(.+)\.(\w+)$/);
    if (!match) return;
    
    const [, basePath, ext] = match;
    const src = basePath.replace('/assets/images/', '');
    
    // Determine if responsive sizes are needed
    let sizes = null;
    if (basePath.includes('/brand/lifestyle/')) {
      sizes = [400, 800, 1200];
    } else if (basePath.includes('/medium/')) {
      sizes = [400, 800];
    } else if (basePath.includes('/hero')) {
      sizes = [800, 1200, 1600];
    }
    
    const picture = createPicture({
      src,
      alt,
      fallbackExt: ext,
      sizes,
      className,
      lazy,
      fetchPriority,
    });
    
    img.parentNode.replaceChild(picture, img);
  });
}
